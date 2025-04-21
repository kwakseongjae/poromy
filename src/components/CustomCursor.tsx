'use client'

import { useEffect } from 'react'
import { useCursor } from '@/contexts/CursorContext'

const CustomCursor = () => {
  const { isCustomCursor } = useCursor()

  useEffect(() => {
    const body = document.body
    if (isCustomCursor) {
      body.classList.add('custom-cursor')
      // Force a repaint to ensure the cursor style is applied
      body.style.display = 'none'
      body.offsetHeight
      body.style.display = ''
    } else {
      body.classList.remove('custom-cursor')
    }

    return () => {
      body.classList.remove('custom-cursor')
    }
  }, [isCustomCursor])

  return null
}

export default CustomCursor
