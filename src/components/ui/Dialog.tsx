import { createPortal } from 'react-dom'
import { useEffect, useState, useRef } from 'react'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  position?: {
    top?: string
    right?: string
    left?: string
    bottom?: string
  }
}

export const Dialog = ({
  isOpen,
  onClose,
  children,
  position,
}: DialogProps) => {
  const [mounted, setMounted] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div
      className="fixed z-50"
      style={{
        top: position?.top,
        right: position?.right,
        left: position?.left,
        bottom: position?.bottom,
      }}
    >
      <div
        ref={dialogRef}
        className="relative z-50 w-[300px] rounded-lg bg-white/95 px-6 py-4 shadow-[0_0_15px_rgba(0,0,0,0.1)]"
      >
        {children}
      </div>
    </div>,
    document.body
  )
}
