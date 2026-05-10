import React, { useRef, useMemo } from 'react'
import { useGLTF, Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

const DynamicMoon = () => {
  const { nightPhase, isDayTime } = useStore()
  const moonRef = useRef()
  const { scene } = useGLTF('/moon.glb')

  useMemo(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.emissive = new THREE.Color('#ffffff')
        child.material.emissiveIntensity = 2 // Strong glow
        child.material.color = new THREE.Color('#ffffff')
      }
    })
  }, [scene])

  const phaseConfig = {
    early: {
      position: [-50, 60, -100], // Brought closer to center
      color: '#cbd5e1',
      intensity: 5,
      scale: 60
    },
    mid: {
      position: [0, 100, -120], // High and center
      color: '#ffffff',
      intensity: 8,
      scale: 80
    },
    post: {
      position: [50, 70, -100], // Brought closer to center
      color: '#7dd3fc',
      intensity: 6,
      scale: 70
    }
  }

  const current = phaseConfig[nightPhase] || phaseConfig.mid

  useFrame((state) => {
    if (moonRef.current) {
      // Smoothly transition to the current phase position
      moonRef.current.position.lerp(new THREE.Vector3(...current.position), 0.05)
      moonRef.current.rotation.y += 0.005
    }
  })

  if (isDayTime) return null

  return (
    <group ref={moonRef}>
      <primitive 
        object={scene} 
        scale={current.scale} 
      />
      <pointLight 
        intensity={current.intensity * 5} // Very strong point light
        color={current.color} 
        distance={500}
        decay={2}
      />
    </group>
  )
}

export default DynamicMoon
