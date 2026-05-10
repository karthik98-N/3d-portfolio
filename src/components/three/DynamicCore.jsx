import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles, Sphere, MeshDistortMaterial, MeshWobbleMaterial, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import { Mail, Link, Play } from 'lucide-react'

const DynamicCore = () => {
  const { coreState, nextCoreState } = useStore()
  const coreRef = useRef()

  const tendrils = useMemo(() => {
    const data = []
    for (let i = 0; i < 20; i++) {
      data.push({
        position: [
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: 0.1 + Math.random() * 0.4,
        speed: 1 + Math.random() * 2
      })
    }
    return data
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.5
      coreRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.1)
    }
  })

  const renderIcon = () => {
    switch (coreState) {
      case 'linkedin': return <Link size={64} style={{ color: '#0077b5' }} />
      case 'mail': return <Mail size={64} style={{ color: '#ffffff' }} />
      case 'youtube': return <Play size={64} style={{ color: '#ff0000' }} />
      default: return null
    }
  }

  return (
    <group position={[0, 6, 0]}>
      {/* Central Core */}
      <group 
        ref={coreRef} 
        onClick={(e) => {
          e.stopPropagation()
          nextCoreState()
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <Sphere args={[2, 64, 64]}>
          <MeshDistortMaterial
            color={coreState === 'venom' ? '#050505' : '#0a0a0a'}
            speed={5}
            distort={0.6}
            radius={1}
            roughness={0}
            metalness={1}
            emissive={coreState === 'venom' ? '#ffffff' : '#111111'}
            emissiveIntensity={0.2}
            transparent={coreState !== 'venom'}
            opacity={coreState === 'venom' ? 1 : 0.8}
          />
        </Sphere>
        
        {coreState !== 'venom' && (
          <Html center transform scale={0.8}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '20px',
              background: 'rgba(0,0,0,0.8)',
              borderRadius: '20px',
              backdropFilter: 'blur(15px)',
              border: '2px solid rgba(255,255,255,0.1)',
              boxShadow: '0 0 50px rgba(0,0,0,0.8)',
              userSelect: 'none'
            }}>
              {renderIcon()}
              <div className="mono" style={{ color: 'white', marginTop: '10px', fontSize: '12px', letterSpacing: '2px' }}>
                {coreState.toUpperCase()}
              </div>
            </div>
          </Html>
        )}

        <Sparkles 
          count={100} 
          scale={3} 
          size={coreState === 'venom' ? 6 : 2} 
          speed={2} 
          color="#ffffff" 
          opacity={0.8}
        />
      </group>

      {/* Tendrils / Shards */}
      {tendrils.map((t, i) => (
        <Float key={i} speed={t.speed} rotationIntensity={3} floatIntensity={2} position={t.position}>
          <mesh rotation={t.rotation} scale={t.scale}>
            <octahedronGeometry args={[1, 2]} />
            <MeshWobbleMaterial
              color={coreState === 'venom' ? "#000000" : "#111111"}
              speed={5}
              factor={2}
              roughness={0}
              metalness={0.8}
              transparent={coreState !== 'venom'}
              opacity={0.5}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

export default DynamicCore
