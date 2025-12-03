'use client'

/**
 * Standardized container for journey step components
 * Provides consistent layout, spacing, and mobile responsiveness
 */
export default function StepContainer({
  title,
  subtitle,
  children,
  isExiting = false,
  exitDirection = 'horizontal' // 'horizontal' | 'vertical'
}) {
  const exitClass = exitDirection === 'horizontal'
    ? '-translate-x-full opacity-0'
    : '-translate-y-full opacity-0'

  const enterClass = exitDirection === 'horizontal'
    ? 'translate-x-0 opacity-100'
    : 'translate-y-0 opacity-100'

  return (
    <div className={`w-full max-w-4xl mx-auto px-2 sm:px-6 md:px-8 transition-all duration-500 ${
      isExiting ? exitClass : enterClass
    }`}>
      {/* Header Section */}
      {(title || subtitle) && (
        <div className="text-center mt-4 sm:mt-8 md:mt-10 mb-4 sm:mb-6 lg:mb-10 animate-fadeIn">
          {title && (
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-100 mb-2 sm:mb-3 px-2">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-base sm:text-lg text-primary-200 px-2 sm:px-4">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Main Content Card */}
      <div className="bg-primary-100 rounded-2xl shadow-xl p-6 sm:p-6 md:p-8 lg:p-12 animate-fadeIn">
        {children}
      </div>
    </div>
  )
}
