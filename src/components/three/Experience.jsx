import React, { useRef, useEffect, useCallback, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { BakeShadows, Center, Environment, OrbitControls, Sky, Sparkles, Stars, PerspectiveCamera, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { useStore } from '../../store/useStore'
import DynamicCore from './DynamicCore'
import VillageLights from './VillageLights'
import FlyingLights from './FlyingLights'
import Hotspots from './Hotspots'
import FloatingClouds from './FloatingClouds'
import Rain from './Rain'
import DynamicSun from './DynamicSun'
import DynamicMoon from './DynamicMoon'
import Thunder from './Thunder'
import Eagle from './Eagle'
import Flock from './Flock'

// Detect mobile/tablet for performance scaling
const IS_MOBILE = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768

// View positions defined outside component — stable reference, no re-creation on render
const VIEW_POSITIONS = {
  home:     { pos: [-100, 225, 100], lookAt: [0, 50, 0], fov: 45 },
  about:    { pos: [-25, 18, 65],   lookAt: [-35, 20, 75], fov: 40 },
  projects: { pos: [70, 52.5, 60],  lookAt: [8, 15, 4],  fov: 35 },
  contact:  { pos: [-35, 37.5, -60], lookAt: [0, 50, 0],  fov: 45 },
}

// Shared material instances to avoid GPU re-uploads
const DAY_GROUND_MATERIAL   = new THREE.MeshStandardMaterial({ color: '#2d4a1d', roughness: 1, metalness: 0 })
const NIGHT_GROUND_MATERIAL = new THREE.MeshStandardMaterial({ color: '#0a1a05', roughness: 1, metalness: 0 })

const Experience = () => {
  const { currentView, setView, isDayTime, rainLevel, dayPhase, nightPhase, isDroneMode, isPlacementMode } = useStore()
  const cameraRef    = useRef()
  const controlsRef  = useRef()
  const groupRef     = useRef()

  // ── Model Loading ────────────────────────────────────────────────────────────
  const { scene }  = useGLTF('/jadeite_village_environment.glb')
  const { scene: forestScene } = useGLTF('/low_poly_forest.glb')

  // Clone forest instances once via useMemo
  const forestScenes = useMemo(() => [
    forestScene.clone(),
    forestScene.clone(),
    forestScene.clone(),
  ], [forestScene])

  // ── Shadow / Day-Night traversal ─────────────────────────────────────────────
  useEffect(() => {
    ;[scene, forestScene, ...forestScenes].forEach((s) => {
      s.traverse((child) => {
        if (!child.isMesh) return
        child.castShadow    = true
        child.receiveShadow = true
        
        // We removed the manual HSL color override that was washing out the scene
        // Lighting and Environment presets now handle the day/night transitions naturally
      })
    })
  }, [scene, forestScene, forestScenes])

  // ── Camera animation ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!cameraRef.current || isDroneMode || isPlacementMode) return
    const target = VIEW_POSITIONS[currentView] ?? VIEW_POSITIONS.home

    gsap.killTweensOf(cameraRef.current.position)
    gsap.killTweensOf(cameraRef.current)

    gsap.to(cameraRef.current.position, {
      x: target.pos[0], y: target.pos[1], z: target.pos[2],
      duration: 2.5, ease: 'power3.inOut',
    })
    gsap.to(cameraRef.current, {
      fov: target.fov, duration: 2.5, ease: 'power3.inOut',
      onUpdate: () => cameraRef.current?.updateProjectionMatrix(),
    })
    if (controlsRef.current) {
      gsap.killTweensOf(controlsRef.current.target)
      gsap.to(controlsRef.current.target, {
        x: target.lookAt[0], y: target.lookAt[1], z: target.lookAt[2],
        duration: 2.5, ease: 'power3.inOut',
      })
    }
  }, [currentView, isDroneMode])

  // ── Hotspot camera jump ───────────────────────────────────────────────────────
  const handleHotspotSelect = useCallback((position) => {
    if (!cameraRef.current || !controlsRef.current) return
    gsap.to(cameraRef.current.position, { x: position[0], y: position[1], z: position[2], duration: 2, ease: 'power2.inOut' })
    gsap.to(controlsRef.current.target, { x: 0, y: 0, z: 0, duration: 2, ease: 'power2.inOut' })
  }, [])

  // ── Per-frame update (only when needed) ──────────────────────────────────────
  useFrame(() => {
    controlsRef.current?.update()
  })

  // ── Derived sky / light values (computed once per render, not per frame) ─────
  const sunPos = dayPhase === 'sunrise' ? [-150, 40, -100] : dayPhase === 'noon' ? [0, 150, -80] : [150, 45, -100]
  const ambientIntensity = isDayTime ? (dayPhase === 'noon' ? 0.8 : 0.6) : (nightPhase === 'mid' ? 0.3 : 0.15)
  const groundMat = isDayTime ? DAY_GROUND_MATERIAL : NIGHT_GROUND_MATERIAL

  return (
    <>
      <PerspectiveCamera makeDefault ref={cameraRef} position={[35, 18, 45]} fov={50} far={3000} near={0.1} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enabled={true}
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        zoomSpeed={1.5}
        minDistance={10}
        maxDistance={800}
        autoRotate={currentView === 'home' && !isDroneMode}
        autoRotateSpeed={rainLevel === 'high' ? 0.05 : rainLevel === 'medium' ? 0.15 : 0.3} // Slower rotation during rain
        maxPolarAngle={isDroneMode ? Math.PI : Math.PI / 2.1}
        minPolarAngle={0}
        enableDamping
        dampingFactor={0.05}
      />

      {/* ── Lighting ─────────────────────────────────────────────────────────── */}
      {isDayTime ? (
        <>
          <Sky sunPosition={sunPos} turbidity={0.1} rayleigh={0.5} />
          <ambientLight
            intensity={ambientIntensity}
            color={dayPhase === 'sunrise' ? '#ff9d00' : dayPhase === 'evening' ? '#ff5e00' : '#ffffff'}
          />
          <directionalLight
            position={sunPos}
            intensity={dayPhase === 'noon' ? 1.5 : 1.2}
            color={dayPhase === 'sunrise' ? '#ffcc00' : dayPhase === 'evening' ? '#ff4400' : '#ffffff'}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-far={600}
            shadow-camera-near={1}
            shadow-camera-left={-300}
            shadow-camera-right={300}
            shadow-camera-top={300}
            shadow-camera-bottom={-300}
          />
          <DynamicSun />
        </>
      ) : (
        <>
          <Stars radius={300} depth={60} count={3000} factor={7} saturation={0} fade speed={1} />
          <Sparkles count={60} scale={50} size={2} speed={0.5} color="#ffffff" />
          <ambientLight intensity={ambientIntensity} color={nightPhase === 'early' ? '#94a3b8' : nightPhase === 'post' ? '#38bdf8' : '#ffffff'} />
          <directionalLight
            position={nightPhase === 'early' ? [-10, 5, -5] : nightPhase === 'mid' ? [0, 20, 0] : [10, 5, -5]}
            intensity={nightPhase === 'mid' ? 2 : 1}
            color={nightPhase === 'early' ? '#cbd5e1' : nightPhase === 'post' ? '#7dd3fc' : '#ffffff'}
            castShadow
            shadow-mapSize={[512, 512]}
            shadow-camera-far={200}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={100}
            shadow-camera-bottom={-100}
          />
          <spotLight position={[0, 15, 0]} intensity={5} distance={30} angle={Math.PI / 4} color="#ffffff" penumbra={1} />
          <DynamicMoon />
        </>
      )}

      {/* ── Scene Objects ─────────────────────────────────────────────────────── */}
      <group ref={groupRef}>
        {/* Village */}
        <Center top position={[0, -2, 0]}>
          <primitive
            object={scene}
            scale={1.3}
            onClick={(e) => {
              e.stopPropagation()
              const name = e.object.name.toLowerCase()
              if (name.includes('house') || name.includes('building')) setView('about')
            }}
            onPointerOver={(e) => {
              if (e.object.name.toLowerCase().includes('house')) document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => (document.body.style.cursor = 'auto')}
          />
        </Center>

        <DynamicCore />
        <VillageLights />

        {/* Fireflies — fewer on mobile, golden glow at night */}
        <FlyingLights count={IS_MOBILE ? 20 : 50}   range={100} intensity={isDayTime ? 0.3 : 2} color="#ffcc00" />
        <FlyingLights count={IS_MOBILE ? 100 : 300} range={500} intensity={isDayTime ? 0.1 : 4} color="#ffaa00" />

        <Hotspots onSelect={handleHotspotSelect} />
        <FloatingClouds count={8} />
        {rainLevel !== 'none' && (
          <>
            <Rain level={rainLevel} />
            <Thunder rainLevel={rainLevel} />
          </>
        )}
        
        {/* Atmospheric Life */}
        <Flock count={25} />
        <Eagle />

        {/* Forest — 4 cardinal positions */}
        <Center top position={[0,   -30,  80]}><primitive object={forestScene}     scale={[50,50,50]} /></Center>
        <Center top position={[0,   -30, -80]}><primitive object={forestScenes[0]} scale={[50,50,50]} rotation={[0, Math.PI, 0]} /></Center>
        <Center top position={[80,  -30,  0]} ><primitive object={forestScenes[1]} scale={[50,50,50]} rotation={[0, Math.PI / 2, 0]} /></Center>
        <Center top position={[-80, -30,  0]} ><primitive object={forestScenes[2]} scale={[50,50,50]} rotation={[0, -Math.PI / 2, 0]} /></Center>

        {/* Ground plane */}
        <mesh rotation-x={-Math.PI / 2} position={[0, -2.1, 0]} receiveShadow material={groundMat}>
          <circleGeometry args={[500, 48]} />
        </mesh>
      </group>

      <Environment preset={isDayTime ? 'sunset' : 'night'} resolution={512} />
      <color attach="background" args={[isDayTime ? '#87ceeb' : '#010101']} />
      {rainLevel === 'low' && <fog attach="fog" args={['#334155', 40, 250]} />}
      {rainLevel === 'medium' && <fog attach="fog" args={['#1e293b', 20, 150]} />}
      {rainLevel === 'high' && <fog attach="fog" args={['#0f172a', 10, 80]} />}
    </>
  )
}

useGLTF.preload('/jadeite_village_environment.glb')
useGLTF.preload('/low_poly_forest.glb')

export default Experience
