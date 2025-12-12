'use client'

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
  const typeStyles = {
    info: 'bg-purple-100 border-purple-300 text-purple-900',
    why: 'bg-accent-purple-100 border-accent-purple-300 text-accent-purple-900',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-900',
    alert: 'bg-orange-50 border-orange-300 text-orange-900',
    tip: 'bg-blue-50 border-blue-300 text-blue-900'
  }

  const defaultTitles = {
    why: 'Why this matters:',
    info: 'Good to know:',
    warning: 'Important:',
    alert: 'Alert:',
    tip: 'Tip:'
  }

  const style = typeStyles[type] || typeStyles.info
  const displayTitle = title || defaultTitles[type]

  return (
    <div className={`${style} border rounded-xl p-4 mb-6 animate-fadeIn ${className}`}>
      {children || (
        <p className="text-sm sm:text-base leading-relaxed">
          {displayTitle && <strong>{displayTitle} </strong>}
          {message}
        </p>
      )}
    </div>
  )
}
