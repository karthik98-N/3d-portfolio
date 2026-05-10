import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Rain = ({ count = 1500 }) => {
  const lines = useRef()
  const lineLength = 1.5 // 1.5 units in Three.js roughly corresponds to a visible streak
  
  const positions = useMemo(() => {
    // Each line has 2 points (6 floats)
    const pos = new Float32Array(count * 6)
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 80
      const y = Math.random() * 60
      const z = (Math.random() - 0.5) * 80
      
      // Point 1
      pos[i * 6] = x
      pos[i * 6 + 1] = y
      pos[i * 6 + 2] = z
      
      // Point 2 (slightly above Point 1 to create a vertical streak)
      pos[i * 6 + 3] = x
      pos[i * 6 + 4] = y + lineLength
      pos[i * 6 + 5] = z
    }
    return pos
  }, [count])

  const velocities = useMemo(() => {
    const vel = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      vel[i] = 0.8 + Math.random() * 1.2
    }
    return vel
  }, [count])

  useFrame(() => {
    if (!lines.current) return
    const pos = lines.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      // Move both points of the line segment down
      pos[i * 6 + 1] -= velocities[i]
      pos[i * 6 + 4] -= velocities[i]
      
      // Reset if it goes below the ground
      if (pos[i * 6 + 1] < -5) {
        const x = (Math.random() - 0.5) * 80
        const z = (Math.random() - 0.5) * 80
        const y = 60
        
        pos[i * 6] = x
        pos[i * 6 + 1] = y
        pos[i * 6 + 2] = z
        
        pos[i * 6 + 3] = x
        pos[i * 6 + 4] = y + lineLength
        pos[i * 6 + 5] = z
      }
    }
    lines.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <lineSegments ref={lines}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count * 2}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#38bdf8"
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}

export default Rain
