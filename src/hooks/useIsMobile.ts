/**
 * React hook that returns true if the window width is 768px or less (mobile device).
 *
 * @returns {boolean} True if the screen is mobile size, false otherwise.
 *
 * @example
 * const isMobile = useIsMobile();
 * if (isMobile) { // render mobile UI }
 */
import { useState, useEffect } from 'react'

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768
    }
    return false
  })

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth <= 768)
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return isMobile
}
