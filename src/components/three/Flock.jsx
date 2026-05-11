import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

const Bird = ({ position, speed, radius, offset, scale }) => {
  const birdRef = useRef()
  const { scene, animations } = useGLTF('/animated_eagle.glb')
  
  // Clone the scene so each bird has its own instance
  const clonedScene = useMemo(() => scene.clone(), [scene])
  const { actions } = useAnimations(animations, birdRef)

  useFrame((state) => {
    const time = state.clock.getElapsedTime() + offset
    
    // Circular path with some vertical noise
    birdRef.current.position.x = position[0] + Math.cos(time * speed) * radius
    birdRef.current.position.z = position[2] + Math.sin(time * speed) * radius
    birdRef.current.position.y = position[1] + Math.sin(time * 0.5) * 5
    
    // Face the direction of travel
    birdRef.current.rotation.y = -(time * speed) + Math.PI
    birdRef.current.rotation.z = 0.2 // Slight bank
  })

  // Start animation
  React.useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      actions[Object.keys(actions)[0]].play().setEffectiveTimeScale(1.5)
    }
  }, [actions])

  return (
    <primitive 
      ref={birdRef} 
      object={clonedScene} 
      scale={scale} 
      position={position}
    />
  )
}

const Flock = ({ count = 15 }) => {
  const birds = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 400, // Random X
        30 + Math.random() * 60,     // Random Height (forest canopy level)
        (Math.random() - 0.5) * 400  // Random Z
      ],
      speed: 0.2 + Math.random() * 0.3,
      radius: 20 + Math.random() * 40,
      offset: Math.random() * 100,
      scale: 0.05 + Math.random() * 0.1 // "Very tiny" as requested
    }))
  }, [count])

  return (
    <group>
      {birds.map((props, i) => (
        <Bird key={i} {...props} />
      ))}
    </group>
  )
}

export default Flock
