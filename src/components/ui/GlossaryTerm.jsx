'use client'

import { useState, useEffect, useRef } from 'react'

const GlossaryTerm = ({ term, children }) => {
  const [showDefinition, setShowDefinition] = useState(false)
  const popupRef = useRef(null)
  
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowDefinition(false)
      }
    }
    
    if (showDefinition) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDefinition])
  
  // Auto-adjust position if clipped by viewport
  useEffect(() => {
    if (showDefinition && popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      
      // If popup goes below viewport, flip it above the term
      if (rect.bottom > viewportHeight) {
        popupRef.current.style.bottom = '100%'
        popupRef.current.style.top = 'auto'
        popupRef.current.style.marginBottom = '0.5rem'
        popupRef.current.style.marginTop = '0'
      }
    }
  }, [showDefinition])
  
  return (
    <span className="relative inline-block">
      <button
        onClick={() => setShowDefinition(!showDefinition)}
        className="inline-flex items-center gap-1 text-accent-green-600 hover:text-accent-green-700 underline decoration-dotted cursor-pointer"
      >
        {term}
        <span className="text-xs font-bold">ⓘ</span>
      </button>
      
      {showDefinition && (
        <span 
          ref={popupRef}
          className="absolute z-50 bg-white border-2 border-accent-green-500 rounded-xl shadow-2xl p-5 w-80 mt-2 left-0 md:left-auto md:right-0 block max-h-[80vh] overflow-y-auto"
        >
          <span className="text-sm text-gray-700 text-left block">
            {children}
          </span>
        </span>
      )}
    </span>
  )
}

export default GlossaryTerm