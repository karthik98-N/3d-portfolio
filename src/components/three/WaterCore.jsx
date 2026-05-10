import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles, Sphere, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

const WaterCore = () => {
  const glowRef = useRef()
  const columnsRef = useRef()
  const shardsRef = useRef()

  // Generate floating shards (rocks/crystals)
  const shards = useMemo(() => {
    const data = []
    for (let i = 0; i < 15; i++) {
      data.push({
        position: [
          (Math.random() - 0.5) * 10,
          8 + Math.random() * 5,
          (Math.random() - 0.5) * 10
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: 0.2 + Math.random() * 0.4,
        speed: 0.5 + Math.random()
      })
    }
    return data
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Rotate the central core
    if (glowRef.current) {
      glowRef.current.rotation.y = time * 0.5
    }
    
    // Animate columns (vibrating/pulsing)
    if (columnsRef.current) {
      columnsRef.current.children.forEach((child, i) => {
        child.scale.y = 1 + Math.sin(time * 2 + i) * 0.1
        child.position.y = Math.sin(time * 1.5 + i) * 0.2
      })
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Central Glowing Energy Cloud */}
      <group ref={glowRef} position={[0, 5, 0]}>
        <Sparkles 
          count={400} 
          scale={3} 
          size={4} 
          speed={0.8} 
          color="#ffffff" 
          opacity={1}
        />
        <Sparkles 
          count={600} 
          scale={5} 
          size={2} 
          speed={0.5} 
          color="#38bdf8" 
          opacity={0.8}
        />
        <Sphere args={[1.5, 32, 32]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
        </Sphere>
      </group>

      {/* Deep Blue Water Columns / Structures */}
      <group ref={columnsRef} position={[0, 0, 0]}>
        {[-1.5, 0, 1.5].map((x, i) => (
          <mesh key={i} position={[x, 2, (i % 2 === 0 ? 1 : -1)]}>
            <cylinderGeometry args={[0.8, 1.2, 5, 32]} />
            <MeshDistortMaterial
              color="#1e3a8a"
              speed={4}
              distort={0.5}
              radius={1}
              emissive="#1e40af"
              emissiveIntensity={2}
            />
          </mesh>
        ))}
      </group>

      {/* Floating Shards (shards of energy/rock) */}
      <group ref={shardsRef}>
        {shards.map((s, i) => (
          <Float key={i} speed={s.speed} rotationIntensity={2} floatIntensity={1} position={s.position}>
            <mesh rotation={s.rotation} scale={s.scale}>
              <octahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
            </mesh>
          </Float>
        ))}
      </group>
    </group>
  )
}

export default WaterCore
