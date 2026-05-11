import React, { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations, TransformControls } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

const Eagle = () => {
  const eagleRef = useRef()
  const { scene, animations } = useGLTF('/animated_eagle.glb')
  const { actions } = useAnimations(animations, eagleRef)
  const { 
    eagleMovement, isDroneMode, isPlacementMode, 
    eagleSpawnPosition, setEagleSpawnPosition,
    eagleCameraOffset, setEagleScale, eagleScale,
    isFreeLook, setIsFreeLook, eagleMovementParams
  } = useStore()
  const { camera, controls } = useThree()
  
  const [transformMode, setTransformMode] = useState('translate')

  // Camera target vector for smooth tracking
  const cameraTarget = useRef(new THREE.Vector3())
  const velocity = useRef(new THREE.Vector3())
  const rotationVelocity = useRef(0)

  // Sync controls with eagle in free look
  useFrame(() => {
    if (isFreeLook && eagleRef.current && controls) {
      controls.target.lerp(eagleRef.current.position, 0.1)
    }
  })

  // Handle keyboard for free look toggle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'v') setIsFreeLook(prev => !prev)
      if (!isPlacementMode) return
      const key = e.key.toLowerCase()
      if (key === 't') setTransformMode('translate')
      if (key === 'r') setTransformMode('rotate')
      if (key === 's') setTransformMode('scale')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlacementMode, isFreeLook, setIsFreeLook])

  // Ensure Free Look is ON by default when entering Eagle Mode
  useEffect(() => {
    if (isDroneMode) {
      setIsFreeLook(true)
    } else {
      setIsFreeLook(false)
    }
  }, [isDroneMode, setIsFreeLook])

  // Initialize and update eagle scale/position based on mode
  useEffect(() => {
    if (scene) {
      // Base scale based on mode
      const baseScale = isDroneMode ? 2 : 10
      // We apply the base scale to the SCENE, but the user scale to the PRIMITIVE
      scene.scale.setScalar(baseScale)
      
      // Set initial position from store
      if (!isDroneMode && !isPlacementMode) {
        scene.position.set(...eagleSpawnPosition)
      }
      
      scene.traverse((child) => {
        if (child.isMesh) {
          child.frustumCulled = false
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
  }, [scene, isDroneMode, isPlacementMode, eagleSpawnPosition])

  // Play animations
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return
    const flyingActionName = Object.keys(actions)[0]
    const action = actions[flyingActionName]
    if (action) {
      action.play()
      const isMoving = Object.values(eagleMovement).some(v => v)
      action.setEffectiveTimeScale((isMoving || !isDroneMode) ? 1.0 : 0.5)
    }
    return () => { if (action) action.stop() }
  }, [actions, eagleMovement, isDroneMode])

  useFrame((state, delta) => {
    if (!eagleRef.current) return

    if (isPlacementMode) {
      if (state.keyboard && state.keyboard.shift) {
        const offset = new THREE.Vector3(...eagleCameraOffset)
        offset.applyQuaternion(eagleRef.current.quaternion)
        offset.add(eagleRef.current.position)
        camera.position.lerp(offset, 0.1)

        const idealLookAt = new THREE.Vector3(0, 0, 0)
        idealLookAt.applyQuaternion(eagleRef.current.quaternion)
        idealLookAt.add(eagleRef.current.position)
        cameraTarget.current.lerp(idealLookAt, 0.1)
        camera.lookAt(cameraTarget.current)
      }
      return
    }

    if (!isDroneMode) {
      // Autonomous circular flight around the SPAWN POSITION
      const time = state.clock.getElapsedTime()
      const radius = 60
      const speed = 0.3
      
      const spawnX = eagleSpawnPosition[0]
      const spawnY = eagleSpawnPosition[1]
      const spawnZ = eagleSpawnPosition[2]

      eagleRef.current.position.x = spawnX + Math.cos(time * speed) * radius
      eagleRef.current.position.z = spawnZ + Math.sin(time * speed) * radius
      eagleRef.current.position.y = spawnY + Math.sin(time * 0.5) * 10
      
      eagleRef.current.rotation.y = -(time * speed) + Math.PI
      eagleRef.current.rotation.x = 0
      eagleRef.current.rotation.z = 0.2
      return
    }

    // Manual controls logic
    const { forward, backward, left, right, up, down } = eagleMovement
    const speed = eagleMovementParams.speed
    const rotSpeed = eagleMovementParams.rotSpeed

    if (left) rotationVelocity.current += rotSpeed * delta
    if (right) rotationVelocity.current -= rotSpeed * delta
    rotationVelocity.current *= 0.98
    eagleRef.current.rotation.y += rotationVelocity.current

    const direction = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), eagleRef.current.rotation.y)
    if (forward) velocity.current.add(direction.clone().multiplyScalar(speed * delta))
    if (backward) velocity.current.sub(direction.clone().multiplyScalar(speed * delta))
    if (up) velocity.current.y += speed * delta
    if (down) velocity.current.y -= speed * delta

    velocity.current.multiplyScalar(0.98)
    eagleRef.current.position.add(velocity.current)

    if (eagleRef.current.position.y < 5) eagleRef.current.position.y = 5
    if (eagleRef.current.position.y > 250) eagleRef.current.position.y = 250

    const targetTiltX = forward ? 0.2 : (backward ? -0.2 : 0)
    const targetTiltZ = left ? 0.4 : (right ? -0.4 : 0)
    eagleRef.current.rotation.x = THREE.MathUtils.lerp(eagleRef.current.rotation.x, targetTiltX, 0.02)
    eagleRef.current.rotation.z = THREE.MathUtils.lerp(eagleRef.current.rotation.z, targetTiltZ, 0.02)

    // ONLY LERP CAMERA IF NOT IN FREE LOOK
    if (!isFreeLook) {
      const offset = new THREE.Vector3(...eagleCameraOffset)
      offset.applyQuaternion(eagleRef.current.quaternion)
      offset.add(eagleRef.current.position)
      camera.position.lerp(offset, 0.15)

      const idealLookAt = new THREE.Vector3(0, 0, 0)
      idealLookAt.applyQuaternion(eagleRef.current.quaternion)
      idealLookAt.add(eagleRef.current.position)
      cameraTarget.current.lerp(idealLookAt, 0.15)
      camera.lookAt(cameraTarget.current)
    }
  })

  return (
    <>
      <primitive 
        ref={eagleRef} 
        object={scene} 
        scale={eagleScale}
      >
        {isPlacementMode && <axesHelper args={[20]} />}
      </primitive>

      {isPlacementMode && (
        <TransformControls 
          object={eagleRef.current} 
          mode={transformMode} 
          onMouseUp={() => {
            const pos = eagleRef.current.position
            const scl = eagleRef.current.scale
            setEagleSpawnPosition([pos.x, pos.y, pos.z])
            setEagleScale(scl.x)
          }}
        />
      )}
    </>
  )
}

useGLTF.preload('/animated_eagle.glb')
export default Eagle
