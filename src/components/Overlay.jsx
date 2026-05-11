import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { Home, User, Briefcase, Mail, Activity, Sun, Moon, ChevronLeft, ChevronRight, Cloud, CloudRain, CloudDrizzle, CloudLightning, Cpu, Bird, Move, Settings2 } from 'lucide-react'
import EagleControlsUI from './EagleControlsUI'
import useBreakpoint from '../hooks/useBreakpoint'

const Overlay = () => {
  const {
    currentView, setView, isStarted,
    isDayTime, toggleDayTime,
    rainLevel, nextRainLevel,
    dayPhase, nextDayPhase,
    nightPhase, nextNightPhase,
    isDroneMode, toggleDroneMode,
    isPlacementMode, togglePlacementMode,
    eagleScale, setEagleScale,
    eagleMovementParams, setEagleMovementParams
  } = useStore()
  const [isEagleSettingsOpen, setIsEagleSettingsOpen] = React.useState(false)
  const { isMobile } = useBreakpoint()

  if (!isStarted) return null

  const mobile = isMobile

  const navItems = [
    { id: 'home',     icon: <Home     size={mobile ? 16 : 20} />, label: 'HOME'     },
    { id: 'about',    icon: <User     size={mobile ? 16 : 20} />, label: 'ABOUT'    },
    { id: 'projects', icon: <Briefcase size={mobile ? 16 : 20} />, label: 'PROJECTS' },
    { id: 'contact',  icon: <Mail     size={mobile ? 16 : 20} />, label: 'CONTACT'  },
  ]

  const views        = ['home', 'about', 'projects', 'contact']
  const currentIndex = views.indexOf(currentView)
  const handlePrev   = () => setView(views[(currentIndex - 1 + views.length) % views.length])
  const handleNext   = () => setView(views[(currentIndex + 1) % views.length])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10 }}>

      {/* ── Top Navbar ─────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass-panel"
        style={{
          position:        'absolute',
          top:             mobile ? '12px' : '24px',
          left:            '50%',
          transform:       'translateX(-50%)',
          display:         'flex',
          gap:             mobile ? '4px' : '12px',
          padding:         mobile ? '8px 12px' : '12px 24px',
          pointerEvents:   'auto',
          maxWidth:        'calc(100vw - 24px)',
        }}
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        '6px',
              padding:    mobile ? '6px 10px' : '8px 16px',
              borderRadius: '8px',
              border:     'none',
              background: currentView === item.id ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
              color:      currentView === item.id ? '#38bdf8' : '#94a3b8',
              cursor:     'pointer',
              fontWeight: 600,
              fontFamily: 'JetBrains Mono',
              transition: 'all 0.3s ease',
              minWidth:   'unset',
              minHeight:  '36px',
            }}
          >
            {item.icon}
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </motion.nav>

      {/* ── Right Sidebar – Controls ────────────────────────────────────────── */}
      <motion.div
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        className="glass-panel"
        style={{
          position:      'absolute',
          right:         mobile ? '10px' : '24px',
          top:           '50%',
          transform:     'translateY(-50%)',
          display:       'flex',
          flexDirection: 'column',
          gap:           mobile ? '16px' : '28px',
          padding:       mobile ? '10px 8px' : '16px',
          pointerEvents: 'auto',
          alignItems:    'center',
        }}
      >
        {/* Day/Night */}
        <button onClick={toggleDayTime} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}>
          {isDayTime
            ? <Sun  size={mobile ? 16 : 20} style={{ color: '#fbbf24' }} />
            : <Moon size={mobile ? 16 : 20} style={{ color: '#94a3b8' }} />}
        </button>

        {/* Phase cycler */}
        <button
          onClick={isDayTime ? nextDayPhase : nextNightPhase}
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
        >
          <Cpu
            size={mobile ? 14 : 18}
            style={{
              color: isDayTime
                ? (dayPhase === 'sunrise' ? '#f59e0b' : dayPhase === 'noon' ? '#ffffff' : '#f43f5e')
                : (nightPhase === 'early'  ? '#94a3b8' : nightPhase === 'mid' ? '#ffffff' : '#38bdf8'),
            }}
          />
        </button>

        {/* Weather Multi-Level */}
        <button onClick={nextRainLevel} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}>
          {rainLevel === 'none' && <Cloud size={mobile ? 16 : 20} style={{ color: '#94a3b8' }} />}
          {rainLevel === 'low' && <CloudDrizzle size={mobile ? 16 : 20} style={{ color: '#7dd3fc', filter: 'drop-shadow(0 0 2px #7dd3fc)' }} />}
          {rainLevel === 'medium' && <CloudRain size={mobile ? 16 : 20} style={{ color: '#38bdf8', filter: 'drop-shadow(0 0 5px #38bdf8)' }} />}
          {rainLevel === 'high' && <CloudLightning size={mobile ? 16 : 20} style={{ color: '#0ea5e9', filter: 'drop-shadow(0 0 8px #0ea5e9)' }} />}
        </button>

        <button
          onClick={() => setIsEagleSettingsOpen(!isEagleSettingsOpen)}
          title="Eagle Settings"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
        >
          <Settings2
            size={mobile ? 16 : 20}
            style={{ color: isEagleSettingsOpen ? '#38bdf8' : '#94a3b8' }}
          />
        </button>

        <button
          onClick={toggleDroneMode}
          title={isDroneMode ? 'Exit Eagle Mode' : 'Enter Eagle Mode'}
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
        >
          <Bird
            size={mobile ? 16 : 20}
            style={{ color: isDroneMode ? '#38bdf8' : '#94a3b8', filter: isDroneMode ? 'drop-shadow(0 0 5px #38bdf8)' : 'none' }}
          />
        </button>

        {!mobile && (
          <>
            <div style={{ height: '60px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <div className="mono" style={{ fontSize: '10px', color: '#64748b', writingMode: 'vertical-rl' }}>CTRL_V1.0.4</div>
          </>
        )}
      </motion.div>

      {/* ── Eagle Settings Panel ────────────────────────────────────────────── */}
      <AnimatePresence>
        {isEagleSettingsOpen && (
          <motion.div
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
            className="glass-panel"
            style={{
              position: 'absolute',
              right: mobile ? '60px' : '90px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '240px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              pointerEvents: 'auto',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              zIndex: 30,
            }}
          >
            <div className="mono" style={{ color: '#38bdf8', fontSize: '12px', letterSpacing: '2px', marginBottom: '4px' }}>EAGLE_CALIBRATION</div>
            
            {/* Scale Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="mono" style={{ color: '#94a3b8', fontSize: '10px' }}>UNIT_SCALE</span>
                <span className="mono" style={{ color: 'white', fontSize: '10px' }}>{eagleScale.toFixed(4)}</span>
              </div>
              <input 
                type="range" min="0.0001" max="1.0" step="0.0001" 
                value={eagleScale} 
                onChange={(e) => setEagleScale(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8' }}
              />
            </div>

            {/* Speed Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="mono" style={{ color: '#94a3b8', fontSize: '10px' }}>THRUST_VELOCITY</span>
                <span className="mono" style={{ color: 'white', fontSize: '10px' }}>{eagleMovementParams?.speed || 0.5}</span>
              </div>
              <input 
                type="range" min="0.1" max="50.0" step="0.1" 
                value={eagleMovementParams?.speed || 0.5} 
                onChange={(e) => setEagleMovementParams({ speed: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: '#38bdf8' }}
              />
            </div>

            {/* Turning Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="mono" style={{ color: '#94a3b8', fontSize: '10px' }}>GYRO_SENSITIVITY</span>
                <span className="mono" style={{ color: 'white', fontSize: '10px' }}>{eagleMovementParams?.rotSpeed || 0.01}</span>
              </div>
              <input 
                type="range" min="0.01" max="5.0" step="0.01" 
                value={eagleMovementParams?.rotSpeed || 0.01} 
                onChange={(e) => setEagleMovementParams({ rotSpeed: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: '#38bdf8' }}
              />
            </div>

            <button 
              onClick={() => setIsEagleSettingsOpen(false)}
              className="mono"
              style={{ padding: '8px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', color: '#38bdf8', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', marginTop: '8px' }}
            >
              CLOSE_PANEL
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Arrow Navigation ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        style={{
          position:      'absolute',
          bottom:        mobile ? '24px' : '80px',
          left:          '50%',
          transform:     'translateX(-50%)',
          display:       'flex',
          gap:           mobile ? '12px' : '16px',
          alignItems:    'center',
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={handlePrev}
          className="glass-panel"
          style={{ border: 'none', padding: mobile ? '8px' : '12px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronLeft size={mobile ? 18 : 24} />
        </button>

        <div
          className="mono"
          style={{
            color:           'white',
            fontSize:        mobile ? '10px' : '12px',
            letterSpacing:   '4px',
            background:      'rgba(0,0,0,0.4)',
            padding:         mobile ? '6px 16px' : '8px 24px',
            borderRadius:    '20px',
            border:          '1px solid rgba(255,255,255,0.1)',
            backdropFilter:  'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          {currentView.toUpperCase()}
        </div>

        <button
          onClick={handleNext}
          className="glass-panel"
          style={{ border: 'none', padding: mobile ? '8px' : '12px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronRight size={mobile ? 18 : 24} />
        </button>
      </motion.div>

      {/* ── Bottom Label (desktop only) ─────────────────────────────────────── */}
      {!mobile && (
        <div className="mono" style={{ position: 'absolute', bottom: '24px', left: '24px', color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          Sector: <span style={{ color: 'white' }}>{currentView.toUpperCase()}</span> / <span style={{ color: '#38bdf8' }}>NKS_CORE</span>
        </div>
      )}

      {/* ── Eagle Controls (Overlay) ────────────────────────────────────────── */}
      <EagleControlsUI />
    </div>
  )
}

export default Overlay
