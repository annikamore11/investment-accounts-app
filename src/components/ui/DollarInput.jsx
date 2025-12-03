'use client'

import { useState, useEffect } from 'react'

/**
 * Standardized dollar input component with formatting
 * Handles currency input with commas and validation
 */
export default function DollarInput({
  value = '',
  onChange,
  placeholder = '0',
  min = 0,
  max,
  className = '',
  showCommas = true,
  autoFocus = false
}) {
  const [displayValue, setDisplayValue] = useState('')

  // Format number with commas
  const formatWithCommas = (num) => {
    if (!showCommas) return num
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  // Update display value when prop value changes
  useEffect(() => {
    const numValue = value.toString().replace(/,/g, '')
    setDisplayValue(numValue ? formatWithCommas(numValue) : '')
  }, [value])

  const handleChange = (e) => {
    // Remove all non-digit characters
    const rawValue = e.target.value.replace(/[^\d]/g, '')

    // Apply min/max constraints
    let numValue = rawValue === '' ? '' : parseInt(rawValue, 10)

    if (numValue !== '') {
      if (min !== undefined && numValue < min) numValue = min
      if (max !== undefined && numValue > max) numValue = max
    }

    // Update display with commas
    setDisplayValue(numValue === '' ? '' : formatWithCommas(numValue))

    // Pass raw number to parent
    onChange(numValue === '' ? '' : numValue)
  }

  return (
    <div className={`flex items-center gap-2 bg-white rounded-xl p-4 border-2 border-primary-300 focus-within:border-accent-green-500 transition-all duration-300 ${className}`}>
      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-800">
        $
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="flex-1 text-xl sm:text-2xl md:text-3xl font-bold text-primary-900 bg-transparent outline-none"
      />
    </div>
  )
}
