import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Thunder = ({ rainLevel }) => {
  const lightRef = useRef()
  const [flashIntensity, setFlashIntensity] = useState(0)

  useEffect(() => {
    if (rainLevel === 'none') return

    let timeoutId
    
    const scheduleNextFlash = () => {
      // Determine flash frequency based on rain level
      let minDelay = 10000
      let maxDelay = 20000
      let baseIntensity = 5
      
      if (rainLevel === 'medium') {
        minDelay = 4000
        maxDelay = 12000
        baseIntensity = 10
      } else if (rainLevel === 'high') {
        minDelay = 1000
        maxDelay = 5000
        baseIntensity = 20
      }

      const delay = minDelay + Math.random() * (maxDelay - minDelay)
      
      timeoutId = setTimeout(() => {
        // Trigger flash
        setFlashIntensity(baseIntensity + Math.random() * baseIntensity)
        
        // Rapid secondary flashes
        setTimeout(() => setFlashIntensity(baseIntensity * 0.5), 100)
        setTimeout(() => setFlashIntensity(0), 150)
        setTimeout(() => setFlashIntensity(baseIntensity * 0.8), 250)
        setTimeout(() => setFlashIntensity(0), 300)
        
        scheduleNextFlash()
      }, delay)
    }

    scheduleNextFlash()

    return () => clearTimeout(timeoutId)
  }, [rainLevel])

  useFrame(() => {
    if (lightRef.current) {
      // Smoothly decay the flash intensity if it's not zero
      if (lightRef.current.intensity > 0) {
        lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, flashIntensity, 0.5)
      } else {
        lightRef.current.intensity = flashIntensity
      }
    }
  })

  if (rainLevel === 'none') return null

  return (
    <directionalLight
      ref={lightRef}
      position={[0, 100, 0]}
      intensity={0}
      color="#e0f2fe"
    />
  )
}

export default Thunder
