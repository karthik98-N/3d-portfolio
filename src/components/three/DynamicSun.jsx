import React, { useRef, useMemo } from 'react'
import { useGLTF, Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

const DynamicSun = () => {
  const { dayPhase, isDayTime } = useStore()
  const sunRef = useRef()
  const { scene } = useGLTF('/simple_sun.glb')

  const phaseConfig = {
    sunrise: {
      position: [-150, 40, -100],
      color: '#f59e0b',
      intensity: 2,
      scale: 25
    },
    noon: {
      position: [0, 150, -80],
      color: '#ffffff',
      intensity: 3,
      scale: 35
    },
    evening: {
      position: [150, 45, -100],
      color: '#f43f5e',
      intensity: 2.5,
      scale: 30
    }
  }

  const current = phaseConfig[dayPhase] || phaseConfig.noon

  useFrame((state) => {
    if (sunRef.current) {
      // Smoothly transition to the current phase position
      sunRef.current.position.lerp(new THREE.Vector3(...current.position), 0.05)
      sunRef.current.rotation.y += 0.01
    }
  })

  if (!isDayTime) return null

  return (
    <group ref={sunRef}>
      <primitive 
        object={scene} 
        scale={current.scale} 
      />
      <pointLight 
        intensity={current.intensity * 1.5} 
        color={current.color} 
        distance={200}
        decay={2}
      />
    </group>
  )
}

export default DynamicSun
