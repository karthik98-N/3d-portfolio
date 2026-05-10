import React from 'react'
import { Sphere } from '@react-three/drei'
import { useStore } from '../../store/useStore'

const VillageLights = () => {
  const { isDayTime } = useStore()
  
  // Approximate positions for houses and pool area
  const housePositions = [
    [5, 2, 5],
    [-5, 2, -5],
    [8, 2, -2],
    [-8, 2, 3],
    [0, 2, -8]
  ]

  const poolPositions = [
    [0, 0.5, 0],
    [2, 0.5, 2],
    [-2, 0.5, -2],
    [2, 0.5, -2],
    [-2, 0.5, 2]
  ]

  return (
    <group>
      {/* House Lights - Warm Gold */}
      {housePositions.map((pos, i) => (
        <group key={`house-light-${i}`} position={pos}>
          <Sphere args={[0.2, 16, 16]}>
            <meshBasicMaterial 
              color="#FFD700" 
              transparent 
              opacity={isDayTime ? 0.3 : 0.8} 
            />
          </Sphere>
        </group>
      ))}

      {/* Pool Area Lights - Brighter Gold Glow */}
      {poolPositions.map((pos, i) => (
        <group key={`pool-light-${i}`} position={pos}>
          <Sphere args={[0.1, 16, 16]}>
            <meshBasicMaterial 
              color="#FFD700" 
              transparent 
              opacity={isDayTime ? 0.2 : 0.6} 
            />
          </Sphere>
        </group>
      ))}
      
      {/* Central Large Pool Glow - Dimmer during day to prevent overexposure */}
      <pointLight 
        position={[0, 0.1, 0]} 
        intensity={isDayTime ? 5 : 20} 
        distance={20} 
        color="#FFD700" 
      />
    </group>
  )
}

export default VillageLights
