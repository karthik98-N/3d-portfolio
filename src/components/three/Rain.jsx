import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MAX_COUNT = 3000

const Rain = ({ level = 'medium' }) => {
  const lines = useRef()
  const geometryRef = useRef()
  
  // Dynamic properties based on level
  const count = level === 'high' ? 3000 : level === 'medium' ? 1500 : 500
  const lineLength = level === 'high' ? 4.5 : level === 'medium' ? 3.5 : 2.5
  const windX = level === 'high' ? 1.2 : level === 'medium' ? 0.6 : 0.2
  
  const wind = useMemo(() => new THREE.Vector3(windX, -1, 0.2).normalize(), [windX]) // Dynamic wind direction
  
  // Allocate buffer once for MAX_COUNT to avoid recreation and array size mismatches
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(MAX_COUNT * 6)
    const vel = new Float32Array(MAX_COUNT)
    
    // Initialize all possible raindrops
    for (let i = 0; i < MAX_COUNT; i++) {
      const x = (Math.random() - 0.5) * 250
      const y = Math.random() * 80
      const z = (Math.random() - 0.5) * 250
      
      pos[i * 6] = x
      pos[i * 6 + 1] = y
      pos[i * 6 + 2] = z
      
      // We'll update the second point in useFrame or here initially
      pos[i * 6 + 3] = x
      pos[i * 6 + 4] = y
      pos[i * 6 + 5] = z
      
      vel[i] = 1.0 + Math.random() * 1.5 // base velocity, scaled later
    }
    return { positions: pos, velocities: vel }
  }, [])

  // Update draw range when count changes
  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.setDrawRange(0, count * 2)
    }
  }, [count])

  useFrame(() => {
    if (!lines.current || !geometryRef.current) return
    const pos = geometryRef.current.attributes.position.array
    
    const wx = wind.x
    const wy = wind.y
    const wz = wind.z
    const speedMultiplier = level === 'high' ? 2.5 : level === 'medium' ? 1.5 : 0.8
    
    // Only loop through active count
    for (let i = 0; i < count; i++) {
      const v = velocities[i] * speedMultiplier
      
      // Move both points along the wind vector
      pos[i * 6]     += wx * v
      pos[i * 6 + 1] += wy * v
      pos[i * 6 + 2] += wz * v
      
      pos[i * 6 + 3] = pos[i * 6] - wx * lineLength
      pos[i * 6 + 4] = pos[i * 6 + 1] - wy * lineLength
      pos[i * 6 + 5] = pos[i * 6 + 2] - wz * lineLength
      
      // Reset if it goes below the ground
      if (pos[i * 6 + 1] < -20) {
        const x = (Math.random() - 0.5) * 250
        const z = (Math.random() - 0.5) * 250
        const y = 80
        
        pos[i * 6] = x
        pos[i * 6 + 1] = y
        pos[i * 6 + 2] = z
        
        pos[i * 6 + 3] = x - wx * lineLength
        pos[i * 6 + 4] = y - wy * lineLength
        pos[i * 6 + 5] = z - wz * lineLength
      }
    }
    geometryRef.current.attributes.position.needsUpdate = true
  })

  return (
    <lineSegments ref={lines}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={MAX_COUNT * 2}
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
