import React, { useMemo } from 'react'
import { Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'

const Hotspots = ({ onSelect }) => {
  const points = useMemo(() => {
    return [
      { id: 0, position: [0, 15, 80] },    // South Forest
      { id: 1, position: [0, 15, -80] },   // North Forest
      { id: 2, position: [80, 15, 0] },    // East Forest
      { id: 3, position: [-80, 15, 0] }    // West Forest
    ]
  }, [])

  return (
    <group>
      {points.map((pt) => (
        <group key={pt.id} position={pt.position}>
          <mesh 
            onClick={() => onSelect(pt.position)}
            onPointerOver={() => (document.body.style.cursor = 'pointer')}
            onPointerOut={() => (document.body.style.cursor = 'auto')}
          >
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default Hotspots
