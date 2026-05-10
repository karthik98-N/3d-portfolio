import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Rain = ({ level = 'medium' }) => {
  const lines = useRef()
  
  // Dynamic properties based on level
  const count = level === 'high' ? 3000 : level === 'medium' ? 1500 : 500
  const lineLength = level === 'high' ? 4.5 : level === 'medium' ? 3.5 : 2.5
  const windX = level === 'high' ? 1.2 : level === 'medium' ? 0.6 : 0.2
  
  const wind = useMemo(() => new THREE.Vector3(windX, -1, 0.2).normalize(), [windX]) // Dynamic wind direction
  
  const positions = useMemo(() => {
    // Each line has 2 points (6 floats)
    const pos = new Float32Array(count * 6)
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 250
      const y = Math.random() * 80
      const z = (Math.random() - 0.5) * 250
      
      // Point 1
      pos[i * 6] = x
      pos[i * 6 + 1] = y
      pos[i * 6 + 2] = z
      
      // Point 2 (offset by wind to create an angled streak)
      pos[i * 6 + 3] = x - wind.x * lineLength
      pos[i * 6 + 4] = y - wind.y * lineLength
      pos[i * 6 + 5] = z - wind.z * lineLength
    }
    return pos
  }, [count])

  const velocities = useMemo(() => {
    const vel = new Float32Array(count)
    const baseSpeed = level === 'high' ? 2.5 : level === 'medium' ? 1.5 : 0.8
    for (let i = 0; i < count; i++) {
      vel[i] = baseSpeed + Math.random() * (baseSpeed * 0.5)
    }
    return vel
  }, [count, level])

  useFrame(() => {
    if (!lines.current) return
    const pos = lines.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      // Move both points along the wind vector
      pos[i * 6]     += wind.x * velocities[i]
      pos[i * 6 + 1] += wind.y * velocities[i]
      pos[i * 6 + 2] += wind.z * velocities[i]
      pos[i * 6 + 3] += wind.x * velocities[i]
      pos[i * 6 + 4] += wind.y * velocities[i]
      pos[i * 6 + 5] += wind.z * velocities[i]
      
      // Reset if it goes below the ground
      if (pos[i * 6 + 1] < -20) {
        const x = (Math.random() - 0.5) * 250
        const z = (Math.random() - 0.5) * 250
        const y = 80
        
        pos[i * 6] = x
        pos[i * 6 + 1] = y
        pos[i * 6 + 2] = z
        
        pos[i * 6 + 3] = x - wind.x * lineLength
        pos[i * 6 + 4] = y - wind.y * lineLength
        pos[i * 6 + 5] = z - wind.z * lineLength
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
        opacity={level === 'high' ? 0.8 : level === 'medium' ? 0.6 : 0.3}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}

export default Rain
