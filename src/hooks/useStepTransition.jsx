'use client'

import { useState } from 'react'

/**
 * Custom hook for consistent step exit animations
 * Provides standardized transition timing and state management with directional support
 */
export default function useStepTransition(duration = 500) {
  const [isExiting, setIsExiting] = useState(false)
  const [direction, setDirection] = useState('forward') // 'forward' or 'backward'

  /**
   * Trigger exit animation and call callback after duration
   * @param {Function} callback - Function to call after exit animation completes
   * @param {string} dir - Direction of transition ('forward' or 'backward')
   */
  const transitionTo = (callback, dir = 'forward') => {
    setDirection(dir)
    setIsExiting(true)
    setTimeout(() => {
      callback()
      setIsExiting(false)
    }, duration)
  }

  return {
    isExiting,
    direction,
    transitionTo
  }
}