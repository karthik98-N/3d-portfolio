import { useRef, useEffect, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations, TransformControls } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

const FLOOR_Y      = -2.1
const WALK_SPEED   = 6
const SPRINT_SPEED = 35
const TURN_SPEED   = 2.2
const FRICTION     = 0.85
const CAM_BEHIND   = 9.5
const CAM_UP       = 6.5
const CAM_LERP     = 0.06

const Horse = () => {
  const horseRef = useRef()
  const [horseGroup, setHorseGroup] = useState(null)
  const gltf = useGLTF('/horse.glb')
  const { scene, animations } = gltf || {}
  const { actions } = useAnimations(animations || [], horseRef)
  const { camera, controls } = useThree()

  const state = useStore()
  const {
    horsePosition, setHorsePosition,
    horseRotation, setHorseRotation,
    horseScale, setHorseScale,
    horseGroundAdjustment,
    horseTransformMode,
    isHorsePlacementMode,
    isHorseMode,
    horseMovement, setHorseMovement,
    horseRGBIntensity, horseRGBSpeed
  } = state

  // ── Internal refs ──────────────────────────────────────────────────────────
  const velocity     = useRef(new THREE.Vector3())
  const yaw          = useRef(horseRotation ? horseRotation[1] : 0)
  const cameraTarget = useRef(new THREE.Vector3())
  const cameraPos    = useRef(new THREE.Vector3())
  const feetOffset   = useRef(0)
  const anims        = useRef({ idle: null, walk: null, run: null })

  // ── RGB Wireframe Material ────────────────────────────────────────────────
  const wireframeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    wireframe: true,
    transparent: true,
    opacity: 0.3,
    emissiveIntensity: 5,
    metalness: 1,
    roughness: 0,
  }), [])

  const wireframeScene = useMemo(() => {
    if (!scene) return null
    const clone = scene.clone()
    clone.traverse((child) => {
      if (child.isMesh) child.material = wireframeMaterial
    })
    return clone
  }, [scene, wireframeMaterial])

  // ── Setup: Shadows & Measure ───────────────────────────────────────────────
  useEffect(() => {
    if (!scene) return
    const box = new THREE.Box3().setFromObject(scene)
    feetOffset.current = -box.min.y
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow    = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  // ── Animation Setup ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return
    Object.keys(actions).forEach(name => {
      const lower = name.toLowerCase()
      if (lower.includes('run') || lower.includes('gallop')) anims.current.run = actions[name]
      else if (lower.includes('walk') || lower.includes('trot')) anims.current.walk = actions[name]
      else if (lower.includes('idle')) anims.current.idle = actions[name]
    })
    const firstAction = actions[Object.keys(actions)[0]]
    if (!anims.current.walk) anims.current.walk = firstAction
    if (!anims.current.idle) anims.current.idle = firstAction
    if (!anims.current.run)  anims.current.run  = firstAction
    Object.values(actions).forEach(action => {
      if (action) {
        action.setEffectiveWeight(0)
        action.play()
      }
    })
    if (anims.current.idle) anims.current.idle.setEffectiveWeight(1)
    return () => Object.values(actions).forEach(action => action?.stop())
  }, [actions])

  // ── Keyboard Roam ───────────────────────────────────────────────────────────
  useEffect(() => {
    const down = (e) => { if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','shift'].includes(e.key.toLowerCase())) setHorseMovement({ [e.key.toLowerCase().replace('arrowup','forward').replace('arrowdown','backward').replace('arrowleft','left').replace('arrowright','right')]: true }) }
    const up   = (e) => { if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','shift'].includes(e.key.toLowerCase())) setHorseMovement({ [e.key.toLowerCase().replace('arrowup','forward').replace('arrowdown','backward').replace('arrowleft','left').replace('arrowright','right')]: false }) }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [setHorseMovement])

  useEffect(() => {
    if (!isHorseMode) setHorseMovement({ forward: false, backward: false, left: false, right: false, sprint: false })
  }, [isHorseMode, setHorseMovement])

  // ── Per-frame loop ─────────────────────────────────────────────────────────
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const downVector = useMemo(() => new THREE.Vector3(0, -1, 0), [])

  useFrame((state, delta) => {
    if (!horseGroup || !scene || isHorsePlacementMode) return

    const horse = horseGroup
    const { forward, backward, left, right } = horseMovement
    const isMoving = isHorseMode && (forward || backward)
    const speed = horseMovement.sprint ? SPRINT_SPEED : WALK_SPEED
    const dir = new THREE.Vector3(Math.sin(yaw.current), 0, Math.cos(yaw.current))

    // ── Movement ───────────────────────────────────────────────────────────
    if (isHorseMode) {
      if (left) yaw.current += TURN_SPEED * delta
      if (right) yaw.current -= TURN_SPEED * delta
      horse.rotation.y = yaw.current
      if (forward) velocity.current.addScaledVector(dir, speed * delta)
      if (backward) velocity.current.addScaledVector(dir, -speed * 0.4 * delta)
      velocity.current.multiplyScalar(FRICTION)
      horse.position.x += velocity.current.x
      horse.position.z += velocity.current.z
    }

    // ── RGB Animation ─────────────────────────────────────────────────────
    const hue = (state.clock.getElapsedTime() * horseRGBSpeed) % 1
    const color = new THREE.Color().setHSL(hue, 0.8, 0.5)
    wireframeMaterial.color.copy(color)
    wireframeMaterial.emissive.copy(color)
    wireframeMaterial.emissiveIntensity = horseRGBIntensity

    // ── Ground Snapping ───────────────────────────────────────────────────
    const rayOrigin = horse.position.clone().add(new THREE.Vector3(0, 10, 0))
    raycaster.set(rayOrigin, downVector)
    const intersects = raycaster.intersectObjects(state.scene.children, true)
    let targetY = FLOOR_Y
    if (intersects.length > 0) {
      const ground = intersects.find(hit => {
        let isHorsePart = false
        let isFoliage = false
        let obj = hit.object
        while(obj) { 
          if (obj === horseGroup) isHorsePart = true
          const n = (obj.name || "").toLowerCase()
          if (n && (n.includes('tree') || n.includes('leaf') || n.includes('foliage') || n.includes('plant') || n.includes('bush') || n.includes('flower'))) isFoliage = true
          obj = obj.parent 
        }
        return !isHorsePart && !isFoliage
      })
      if (ground) targetY = ground.point.y
    }

    // ── Animation Blending ────────────────────────────────────────────────
    const curVel = velocity.current.length()
    const maxWalkVel = (WALK_SPEED * 0.016) / (1 - FRICTION)
    const maxRunVel  = (SPRINT_SPEED * 0.016) / (1 - FRICTION)
    const a = anims.current
    if (a.idle && a.walk && a.run) {
      let weights = { idle: 0, walk: 0, run: 0 }
      if (curVel < 0.001) weights.idle = 1
      else if (curVel < maxWalkVel) {
        const t = curVel / maxWalkVel
        weights.idle = 1 - t
        weights.walk = t
      } else {
        const t = Math.min(1, (curVel - maxWalkVel) / (maxRunVel - maxWalkVel))
        weights.walk = 1 - t
        weights.run = t
      }
      a.idle.setEffectiveWeight(THREE.MathUtils.lerp(a.idle.getEffectiveWeight(), weights.idle, 0.15))
      a.walk.setEffectiveWeight(THREE.MathUtils.lerp(a.walk.getEffectiveWeight(), weights.walk, 0.15))
      a.run.setEffectiveWeight(THREE.MathUtils.lerp(a.run.getEffectiveWeight(), weights.run, 0.15))
      const walkFactor = THREE.MathUtils.clamp(curVel / maxWalkVel, 0, 1)
      const runFactor  = THREE.MathUtils.clamp((curVel - maxWalkVel) / (maxRunVel - maxWalkVel), 0, 1)
      a.idle.setEffectiveTimeScale(0.4)
      a.walk.setEffectiveTimeScale(1.0 + walkFactor * 1.5)
      a.run.setEffectiveTimeScale(1.2 + runFactor * 2.0)
    }

    // ── Bobbing ───────────────────────────────────────────────────────────
    const speedFactor = THREE.MathUtils.clamp(curVel / maxRunVel, 0, 1)
    const bobAmplitude = isMoving ? (0.02 + speedFactor * 0.04) : 0
    const bobFreq      = isMoving ? (5 + speedFactor * 7) : 0
    const bob = Math.sin(state.clock.getElapsedTime() * bobFreq) * bobAmplitude
    const finalY = targetY + (feetOffset.current * horseScale[0]) + horseGroundAdjustment + Math.max(0, bob)
    horse.position.y = THREE.MathUtils.lerp(horse.position.y, finalY, 0.1)

    // ── Camera ────────────────────────────────────────────────────────────
    const behindDir = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current))
    const camBob = horseMovement.sprint ? Math.sin(state.clock.getElapsedTime() * 12) * 0.06 : 0
    const idealCamPos = horse.position.clone().addScaledVector(behindDir, CAM_BEHIND).add(new THREE.Vector3(0, CAM_UP + camBob, 0))
    const idealLookAt = horse.position.clone().addScaledVector(dir, 1.8).add(new THREE.Vector3(0, CAM_UP * 0.45, 0))
    cameraPos.current.lerp(idealCamPos, CAM_LERP)
    cameraTarget.current.lerp(idealLookAt, CAM_LERP)
    camera.position.copy(cameraPos.current)
    camera.lookAt(cameraTarget.current)
    if (controls) controls.target.copy(cameraTarget.current)
  })

  if (!scene || (!isHorseMode && !isHorsePlacementMode)) return null

  return (
    <>
      <group 
        ref={(node) => {
          horseRef.current = node
          setHorseGroup(node)
        }} 
        position={horsePosition} 
        rotation={horseRotation} 
        scale={horseScale}
      >
        <primitive object={scene} />
        {wireframeScene && <primitive object={wireframeScene} />}
      </group>

      {isHorsePlacementMode && horseGroup && (
        <TransformControls
          object={horseGroup}
          mode={horseTransformMode}
          onMouseUp={() => {
            const p = horseGroup.position
            const r = horseGroup.rotation
            const s = horseGroup.scale
            setHorsePosition([p.x, p.y, p.z])
            setHorseRotation([r.x, r.y, r.z])
            setHorseScale([s.x, s.y, s.z])
            yaw.current = r.y
          }}
        />
      )}
    </>
  )
}

export default Horse
