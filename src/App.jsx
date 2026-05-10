import React, { Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import * as THREE from 'three'
import Overlay from './components/Overlay'
import Content from './components/Content'
import StartScreen from './components/StartScreen'
import { useStore } from './store/useStore'

// Lazy-load the heavy 3D scene for faster initial page render
const Experience = lazy(() => import('./components/three/Experience'))

function App() {
  const isStarted = useStore((state) => state.isStarted)

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {!isStarted && <StartScreen />}
      
      <Canvas
        shadows={{ type: THREE.PCFSoftShadowMap }}
        camera={{ position: [0, 2, 5], fov: 45 }}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        dpr={[1, Math.min(window.devicePixelRatio, 1.5)]}
        performance={{ min: 0.5 }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, touchAction: 'none' }}
      >
        <color attach="background" args={['#020617']} />
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>

      <Overlay />
      <Content />
      <Loader />
    </div>
  )
}

export default App
