import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, MeshRefractionMaterial } from '@react-three/drei'
import * as THREE from 'three'

const WaterMolecules = () => {
  const groupRef = useRef()

  // Generate random molecule positions
  const molecules = useMemo(() => {
    const data = []
    for (let i = 0; i < 8; i++) {
      data.push({
        position: [
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6
        ],
        size: 0.3 + Math.random() * 0.5,
        speed: 0.5 + Math.random()
      })
    }
    return data
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.2
      groupRef.current.rotation.x = time * 0.1
    }
  })

  return (
    <group ref={groupRef} position={[0, 10, 0]}> {/* Positioned above the village or as a separate entity */}
      {molecules.map((m, i) => (
        <Float key={i} speed={m.speed} rotationIntensity={1} floatIntensity={2} position={m.position}>
          <Sphere args={[m.size, 32, 32]}>
            <MeshDistortMaterial
              color="#38bdf8"
              speed={2}
              distort={0.4}
              radius={1}
              transparent
              opacity={0.7}
              metalness={0.1}
              roughness={0.1}
              emissive="#0c4a6e"
            />
          </Sphere>
        </Float>
      ))}
      
      {/* Connecting lines between molecules to make it look like a structure */}
      {molecules.map((m, i) => {
        if (i === 0) return null
        return (
          <Line 
            key={`line-${i}`} 
            start={molecules[i-1].position} 
            end={m.position} 
          />
        )
      })}
    </group>
  )
}

const Line = ({ start, end }) => {
  const ref = useRef()
  useFrame((state) => {
    // This is a bit complex for a simple line, let's use a simpler approach
  })

  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end])
  
  return (
    <mesh>
      <tubeGeometry args={[new THREE.CatmullRomCurve3(points), 20, 0.05, 8, false]} />
      <meshStandardMaterial color="#38bdf8" transparent opacity={0.3} />
    </mesh>
  )
}

export default WaterMolecules
