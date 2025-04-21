'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface CursorContextType {
  isCustomCursor: boolean
  clickCount: number
  incrementClickCount: () => void
  resetClickCount: () => void
}

const CursorContext = createContext<CursorContextType | undefined>(undefined)

export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const [isCustomCursor, setIsCustomCursor] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  const incrementClickCount = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)
    if (newCount >= 10) {
      setIsCustomCursor(true)
    }
  }

  const resetClickCount = () => {
    setClickCount(0)
    setIsCustomCursor(false)
  }

  return (
    <CursorContext.Provider
      value={{
        isCustomCursor,
        clickCount,
        incrementClickCount,
        resetClickCount,
      }}
    >
      {children}
    </CursorContext.Provider>
  )
}

export const useCursor = () => {
  const context = useContext(CursorContext)
  if (context === undefined) {
    throw new Error('useCursor must be used within a CursorProvider')
  }
  return context
}
