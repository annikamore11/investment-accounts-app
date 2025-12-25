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
    info: {
      className: 'border-purple-300 text-purple-900',
      style: {
        background: 'radial-gradient(circle, rgba(233, 213, 255, 0.5) 0%, rgba(233, 213, 255, 0.9) 100%)',
        backdropFilter: 'blur(8px)'
      }
    },
    why: {
      className: 'border-accent-purple-300 text-accent-purple-900',
      style: {
        background: 'radial-gradient(circle, rgba(243, 232, 255, 0.5) 0%, rgba(243, 232, 255, 0.9) 100%)',
        backdropFilter: 'blur(8px)'
      }
    },
    warning: {
      className: 'border-yellow-400 text-yellow-900',
      style: {
        background: 'radial-gradient(circle, rgba(254, 249, 195, 0.5) 0%, rgba(254, 249, 195, 0.9) 100%)',
        backdropFilter: 'blur(8px)'
      }
    },
    alert: {
      className: 'border-orange-300 text-orange-900',
      style: {
        background: 'radial-gradient(circle, rgba(255, 247, 237, 0.5) 0%, rgba(255, 247, 237, 0.9) 100%)',
        backdropFilter: 'blur(8px)'
      }
    },
    tip: {
      className: 'border-blue-300 text-blue-900',
      style: {
        background: 'radial-gradient(circle, rgba(239, 246, 255, 0.5) 0%, rgba(239, 246, 255, 0.9) 100%)',
        backdropFilter: 'blur(8px)'
      }
    }
  }

  const defaultTitles = {
    why: 'Why this matters:',
    info: 'Good to know:',
    warning: 'Important:',
    alert: 'Alert:',
    tip: 'Tip:'
  }

  const currentStyle = typeStyles[type] || typeStyles.info
  const displayTitle = title || defaultTitles[type]

  return (
    <div 
      className={`${currentStyle.className} border-2 rounded-xl p-4 mb-6 animate-fadeIn ${className}`}
      style={currentStyle.style}
    >
      {children || (
        <p className="text-sm sm:text-base leading-relaxed">
          {displayTitle && <strong>{displayTitle} </strong>}
          {message}
        </p>
      )}
    </div>
  )
}