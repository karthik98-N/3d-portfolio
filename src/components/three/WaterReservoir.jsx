import React, { useMemo } from 'react'
import { Sparkles, MeshReflectorMaterial, Float } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

const WaterReservoir = ({ position = [-80, -2, -80], rotation = [0, Math.PI / 4, 0] }) => {
  const { isDayTime, setView } = useStore()
  
  // Grid parameters for the "Forest of Pillars"
  const gridCount = 16
  const spacing = 5
  const pillarRadius = 0.5
  const pillarHeight = 18

  const pillars = useMemo(() => {
    const data = []
    for (let x = 0; x < gridCount; x++) {
      for (let z = 0; z < gridCount; z++) {
        data.push({
          position: [
            (x - gridCount / 2) * spacing,
            pillarHeight / 2,
            (z - gridCount / 2) * spacing
          ],
          delay: Math.random() * 2
        })
      }
    }
    return data
  }, [])

  return (
    <group 
      position={position} 
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation()
        setView('reservoir')
      }}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      {/* Reservoir Floor (Water) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={256}
          mixBlur={1}
          mixStrength={50}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color={isDayTime ? "#1a3a4a" : "#05101a"}
          metalness={0.5}
        />
      </mesh>

      {/* Reservoir Concrete Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[85, 85]} />
        <meshStandardMaterial color={isDayTime ? "#2a2a2a" : "#111111"} roughness={0.9} />
      </mesh>

      {/* Forest of Pillars */}
      {pillars.map((p, i) => (
        <mesh key={i} position={p.position} castShadow receiveShadow>
          <cylinderGeometry args={[pillarRadius, pillarRadius * 1.2, pillarHeight, 32]} />
          <meshStandardMaterial 
            color={isDayTime ? "#4a4a4a" : "#1a1a1a"} 
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
      ))}

      {/* Ceiling (Partial/Broken for atmosphere) */}
      <mesh position={[0, pillarHeight, 0]} receiveShadow>
        <boxGeometry args={[50, 0.5, 50]} />
        <meshStandardMaterial color={isDayTime ? "#3a3a3a" : "#0a0a0a"} roughness={1} />
      </mesh>

      {/* Atmospheric Lights inside the Reservoir */}
      <pointLight position={[0, 5, 0]} intensity={isDayTime ? 50 : 20} distance={40} color="#38bdf8" />
      <pointLight position={[15, 8, 15]} intensity={isDayTime ? 30 : 15} distance={30} color="#2d6f8b" />
      <pointLight position={[-15, 8, -15]} intensity={isDayTime ? 30 : 15} distance={30} color="#2d6f8b" />

      {/* Floating Particles/Dust */}
      <Sparkles count={200} scale={[50, 10, 50]} size={2} speed={0.3} color="#38bdf8" />

      {/* Small Floating Details */}
      {[...Array(8)].map((_, i) => (
        <Float key={i} speed={1} rotationIntensity={2} floatIntensity={1} position={[(Math.random() - 0.5) * 40, 1 + Math.random() * 3, (Math.random() - 0.5) * 40]}>
          <mesh>
            <octahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

export default WaterReservoir
