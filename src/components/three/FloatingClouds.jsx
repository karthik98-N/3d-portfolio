import React, { useMemo } from 'react'
import { Cloud, Float } from '@react-three/drei'

const FloatingClouds = ({ count = 8 }) => {
  const cloudsData = useMemo(() => (
    Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 200,
        18 + Math.random() * 20,
        (Math.random() - 0.5) * 200,
      ],
      speed:   0.05 + Math.random() * 0.15,
      opacity: 0.25 + Math.random() * 0.35,
      scale:   1.5 + Math.random() * 2.5,
    }))
  ), [count])

  return (
    <group>
      {cloudsData.map((cloud, i) => (
        <Float key={i} speed={cloud.speed} rotationIntensity={0.2} floatIntensity={0.8} position={cloud.position}>
          <Cloud
            opacity={cloud.opacity}
            speed={0.1}
            width={10}
            depth={1}
            segments={12}   // down from 20 — still looks great, ~40% fewer vertices
            color="#ffffff"
          />
        </Float>
      ))}
    </group>
  )
}

export default FloatingClouds
