import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

const FlyingLights = ({ count = 20, range = 40, color = '#FFD700', intensity = 2 }) => {
  const lightsRef = useRef([])

  // All random data computed once
  const lightsData = useMemo(() => {
    const c = new THREE.Color(color)
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * range,
        2 + Math.random() * 20,
        (Math.random() - 0.5) * range
      ),
      speed:  0.2 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
      size:   0.12 + Math.random() * 0.22,
      color:  c,
    }))
  }, [count, range, color])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    lightsRef.current.forEach((ref, i) => {
      if (!ref) return
      const d = lightsData[i]
      ref.position.x = d.position.x + Math.sin(t * d.speed + d.offset) * 8
      ref.position.y = d.position.y + Math.cos(t * d.speed * 0.8 + d.offset) * 5
      ref.position.z = d.position.z + Math.sin(t * d.speed * 1.2 + d.offset) * 8
      // Scale up based on intensity to simulate brightness without expensive point lights
      const pulse = (1 + Math.sin(t * 2 + d.offset) * 0.3) * (intensity > 1 ? intensity * 0.6 : 1)
      ref.scale.setScalar(pulse)
    })
  })

  return (
    <group>
      {lightsData.map((d, i) => (
        <group key={i} ref={(el) => (lightsRef.current[i] = el)}>
          <Sphere args={[d.size, 8, 8]}>
            <meshBasicMaterial 
              color={color} 
              transparent 
              opacity={Math.min(1, 0.4 + (intensity * 0.15))} 
              toneMapped={false} 
            />
          </Sphere>
        </group>
      ))}
    </group>
  )
}

export default FlyingLights
