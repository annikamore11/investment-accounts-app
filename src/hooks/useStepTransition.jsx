'use client'

import { useState } from 'react'

/**
 * Custom hook for consistent step exit animations
 * Provides standardized transition timing and state management
 */
export default function useStepTransition(duration = 500) {
  const [isExiting, setIsExiting] = useState(false)

  /**
   * Trigger exit animation and call callback after duration
   * @param {Function} callback - Function to call after exit animation completes
   */
  const transitionTo = (callback) => {
    setIsExiting(true)
    setTimeout(() => {
      callback()
      setIsExiting(false)
    }, duration)
  }

  return {
    isExiting,
    transitionTo
  }
}
