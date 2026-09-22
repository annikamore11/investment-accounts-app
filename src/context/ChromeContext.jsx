'use client'

import { createContext, useContext, useState } from 'react'

// Lets a deeply-nested full-screen experience (the journey) tell the layout
// to drop the marketing footer while it's mounted. Without this, the footer
// is just another flow sibling below <main> — Navbar is `fixed` so it costs
// no layout height, but the footer is real height sitting right below the
// journey's own h-screen shell, making the whole page scrollable by exactly
// the footer's height and letting it bleed in underneath what's supposed to
// be a locked, self-contained screen.
const ChromeContext = createContext(null)

export const useChrome = () => {
  const context = useContext(ChromeContext)
  if (!context) {
    throw new Error('useChrome must be used within a ChromeProvider')
  }
  return context
}

export const ChromeProvider = ({ children }) => {
  const [hideFooter, setHideFooter] = useState(false)
  return (
    <ChromeContext.Provider value={{ hideFooter, setHideFooter }}>
      {children}
    </ChromeContext.Provider>
  )
}
