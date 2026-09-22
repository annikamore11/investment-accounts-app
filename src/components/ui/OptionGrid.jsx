'use client'

import { Check } from 'lucide-react'

/**
 * Standardized option grid for selection patterns
 * Supports single and multi-column layouts with icons
 */
export default function OptionGrid({
  options = [],
  selectedValue,
  onChange,
  columns = 2, // Number of columns on larger screens
  className = '',
  groupLabel,
}) {
const gridClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
}

const gridClass = gridClasses[columns] || 'grid-cols-1 sm:grid-cols-2'

  return (
    <div
      className={`grid ${gridClass} gap-4 mb-8 ${className}`}
      role="radiogroup"
      aria-label={groupLabel}
    >
      {options.map((option) => {
        const isSelected = selectedValue === option.value

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            role="radio"
            aria-checked={isSelected}
            className={`
              relative px-4 sm:px-5 py-4 rounded-lg border-2 transition-all duration-300 text-left
              ${isSelected
                ? 'border-accent-green-600 bg-accent-green-50 shadow-lg scale-105'
                : 'border-primary-400 hover:border-primary-600 bg-primary-50 hover:bg-white hover:shadow-md hover:scale-102'
              }
            `}
          >
            {/* Selection state is never color alone: a checkmark badge marks
                the selected option too. */}
            {isSelected && (
              <span className="absolute top-2.5 right-2.5 grid h-5 w-5 place-items-center rounded-full bg-accent-green-600 text-white">
                <Check className="w-3 h-3" strokeWidth={3} />
              </span>
            )}

            {/* Option Icon (if provided) */}
            {option.icon && (
              <div className={`mb-3 flex justify-center ${isSelected ? 'text-accent-green-700' : 'text-primary-700'}`}>
                {option.icon}
              </div>
            )}

            {/* Option Label */}
            <div className={`font-semibold text-base sm:text-lg pr-6 ${isSelected ? 'text-accent-green-900' : 'text-primary-900'}`}>
              {option.label}
            </div>

            {/* Option Description (if provided) */}
            {option.description && (
              <p className={`mt-2 text-xs sm:text-sm ${isSelected ? 'text-accent-green-700' : 'text-primary-700'}`}>
                {option.description}
              </p>
            )}
          </button>
        )
      })}
    </div>
  )
}
