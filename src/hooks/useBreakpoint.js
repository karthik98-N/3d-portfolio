import { useState, useEffect } from 'react'

/**
 * Returns current breakpoint info that re-renders when the window resizes.
 * Breakpoints:
 *   mobile  < 480px
 *   tablet  480–1023px
 *   desktop ≥ 1024px
 */
const useBreakpoint = () => {
  const getBreakpoint = () => {
    const w = window.innerWidth
    if (w < 480)  return 'mobile'
    if (w < 1024) return 'tablet'
    return 'desktop'
  }

  const [bp, setBp] = useState(getBreakpoint)

  useEffect(() => {
    const onResize = () => setBp(getBreakpoint())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return {
    bp,
    isMobile:  bp === 'mobile',
    isTablet:  bp === 'tablet',
    isDesktop: bp === 'desktop',
    isSmall:   bp === 'mobile' || bp === 'tablet',
  }
}

export default useBreakpoint
