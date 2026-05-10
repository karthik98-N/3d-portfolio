import React from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import useBreakpoint from '../hooks/useBreakpoint'

const StartScreen = () => {
  const setStarted = useStore((state) => state.setStarted)
  const { isMobile, isTablet } = useBreakpoint()

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position:        'fixed',
        inset:           0,
        zIndex:          100,
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'center',
        justifyContent:  'center',
        backgroundColor: 'transparent',
        color:           'white',
        textAlign:       'center',
        padding:         isMobile ? '16px' : '20px',
      }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: isMobile ? '100%' : isTablet ? '600px' : '800px' }}
      >
        <h1 style={{
          fontSize:      isMobile ? 'clamp(1.8rem, 9vw, 2.8rem)' : isTablet ? 'clamp(2.5rem, 6vw, 3.8rem)' : 'clamp(3rem, 5vw, 4.5rem)',
          fontWeight:    800,
          marginBottom:  isMobile ? '0.6rem' : '1rem',
          letterSpacing: '-0.04em',
          lineHeight:    1.1,
        }}>
          NEELI KARTHIK <span style={{ color: '#38bdf8' }}>SHIVAMANI</span>
        </h1>

        <p className="mono" style={{
          color:         '#94a3b8',
          marginBottom:  isMobile ? '2rem' : '3rem',
          fontSize:      isMobile ? '0.75rem' : isTablet ? '0.9rem' : '1.05rem',
          letterSpacing: isMobile ? '0.2em' : '0.3em',
          textTransform: 'uppercase',
        }}>
          PORTFOLIO
        </p>

        <button
          onClick={() => setStarted(true)}
          className="glow-btn"
          style={{
            display: 'block',
            margin: '0 auto',
            fontSize: isMobile ? '0.95rem' : '1.2rem',
            padding:  isMobile ? '0.8rem 2rem' : '1rem 3rem',
          }}
        >
          ENTER EXPERIENCE
        </button>

        {/* Hint for touch users */}
        {isMobile && (
          <p className="mono" style={{ marginTop: '2rem', fontSize: '0.6rem', color: '#475569', letterSpacing: '0.15em' }}>
            DRAG TO ROTATE  •  PINCH TO ZOOM
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}

export default StartScreen
