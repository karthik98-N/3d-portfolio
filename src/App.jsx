import React, { Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import Overlay from './components/Overlay'
import Content from './components/Content'
import StartScreen from './components/StartScreen'
import { useStore } from './store/useStore'

// Lazy-load the heavy 3D scene for faster initial page render
const Experience = lazy(() => import('./components/three/Experience'))

const CustomLoader = () => {
  const { active, progress } = useProgress()

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: '#020617',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8',
          }}
        >
          <div className="mono" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px' }}>
            {progress.toFixed(0)}%
          </div>
          <div style={{ width: '200px', height: '2px', background: 'rgba(56, 189, 248, 0.2)', borderRadius: '2px', overflow: 'hidden', marginBottom: '24px' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: '#38bdf8', transition: 'width 0.3s ease-out' }} />
          </div>
          <p className="mono" style={{ color: '#94a3b8', fontSize: '0.75rem', textAlign: 'center', maxWidth: '300px', lineHeight: 1.6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Please be patient, it gets a little bit of time to get loaded
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

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
        dpr={[1, Math.min(window.devicePixelRatio, 1.2)]}
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
      <CustomLoader />
    </div>
  )
}

export default App
