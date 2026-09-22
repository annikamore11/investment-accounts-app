'use client'

import { Info, Sprout, Lightbulb, TriangleAlert, CircleAlert } from 'lucide-react'

/**
 * Standardized info box component for displaying contextual information
 * Supports different types with appropriate styling
 */
export default function InfoBox({
  type = 'info', // 'info' | 'why' | 'warning' | 'alert' | 'tip'
  title,
  message,
  children,
  className = ''
}) {
  // Consolidated to three tones (neutral / amber / rust) instead of a
  // different hue per variant — each variant still gets its own icon and
  // default label so the meaning stays distinct without the color soup.
  const typeStyles = {
    info: { icon: Info, className: 'border-primary-300 bg-primary-100 text-primary-800' },
    why: { icon: Sprout, className: 'border-accent-green-200 bg-accent-green-50 text-accent-green-900' },
    tip: { icon: Lightbulb, className: 'border-amber-200 bg-amber-50 text-amber-900' },
    warning: { icon: TriangleAlert, className: 'border-amber-400 bg-amber-100 text-amber-900' },
    alert: { icon: CircleAlert, className: 'border-rust-300 bg-rust-50 text-rust-900' },
  }

  const defaultTitles = {
    why: 'Why this matters:',
    info: 'Good to know:',
    warning: 'Important:',
    alert: 'Alert:',
    tip: 'Tip:'
  }

  const currentStyle = typeStyles[type] || typeStyles.info
  const Icon = currentStyle.icon
  const displayTitle = title || defaultTitles[type]

  return (
    <div
      className={`${currentStyle.className} border rounded-xl p-4 mb-6 flex gap-3 animate-fadeIn ${className}`}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1">
        {children || (
          <p className="text-sm sm:text-base leading-relaxed">
            {displayTitle && <strong>{displayTitle} </strong>}
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
