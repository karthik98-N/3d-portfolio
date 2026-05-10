import React, { useMemo, useRef } from 'react'
import { Cloud, Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../../store/useStore'

const FloatingClouds = ({ baseCount = 8 }) => {
  const rainLevel = useStore(state => state.rainLevel)
  const groupRef = useRef()
  
  // Create max clouds once to avoid re-mounting which causes lag
  const maxClouds = baseCount * 4 // Much denser cloud cover during rain
  const cloudsData = useMemo(() => (
    Array.from({ length: maxClouds }, () => ({
      initialX: (Math.random() - 0.5) * 300,
      y: 25 + Math.random() * 30,
      z: (Math.random() - 0.5) * 300,
      speed:   0.05 + Math.random() * 0.15,
      opacity: 0.3 + Math.random() * 0.3,
      scale:   1.5 + Math.random() * 2.5,
      windSpeed: 0.8 + Math.random() * 0.5 // individual horizontal wind multiplier
    }))
  ), [baseCount])

  // Calculate dynamic properties based on rain level
  const isRaining = rainLevel !== 'none'
  const windMultiplier = rainLevel === 'high' ? 15 : rainLevel === 'medium' ? 8 : rainLevel === 'low' ? 3 : 1.5
  const densityMultiplier = rainLevel === 'high' ? 4 : rainLevel === 'medium' ? 3 : rainLevel === 'low' ? 2 : 1
  const cloudColor = rainLevel === 'high' ? "#334155" : rainLevel === 'medium' ? "#475569" : rainLevel === 'low' ? "#94a3b8" : "#ffffff"
  const fogDrop = rainLevel === 'high' ? 25 : rainLevel === 'medium' ? 15 : rainLevel === 'low' ? 5 : 0

  // Apply horizontal wind drift continuously
  useFrame((state, delta) => {
    if (!groupRef.current) return
    groupRef.current.children.forEach((child, i) => {
      // Move clouds along the X axis
      child.position.x += cloudsData[i].windSpeed * windMultiplier * delta
      // Wrap around when they blow too far right
      if (child.position.x > 200) {
        child.position.x = -200
      }
    })
  })

  // Show more clouds depending on the level
  const visibleCount = baseCount * densityMultiplier
  const visibleClouds = cloudsData.slice(0, visibleCount)

  return (
    <group ref={groupRef}>
      {visibleClouds.map((cloud, i) => (
        <group key={i} position={[cloud.initialX, cloud.y - fogDrop, cloud.z]}>
          <Float 
            speed={isRaining ? cloud.speed * 3 : cloud.speed} 
            rotationIntensity={isRaining ? 0.4 : 0.2} 
            floatIntensity={isRaining ? 1.5 : 0.8}
          >
            <Cloud
              opacity={isRaining ? cloud.opacity * 2 : cloud.opacity}
              speed={isRaining ? 0.3 : 0.1} // internal cloud turbulence speed
              width={isRaining ? 25 : 15} // Much wider to act like fog
              depth={isRaining ? 5 : 2}
              segments={isRaining ? 10 : 8}
              color={cloudColor}
            />
          </Float>
        </group>
      ))}
    </group>
  )
}

export default FloatingClouds
