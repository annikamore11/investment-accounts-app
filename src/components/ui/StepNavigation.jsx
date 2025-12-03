'use client'

/**
 * Standardized navigation buttons for journey steps
 * Provides consistent back/next button styling and behavior
 */
export default function StepNavigation({
  onBack,
  onNext,
  canGoNext = true,
  backLabel = '← Back',
  nextLabel = 'Next →',
  showBack = true,
  isExiting = false,
  className = ''
}) {
  return (
    <div className={`flex gap-3 sm:gap-4 mt-8 ${className}`}>
      {showBack && (
        <button
          onClick={onBack}
          disabled={isExiting}
          className="btn-journey-back px-4 sm:px-6 py-3 text-sm sm:text-base transition-all duration-300"
        >
          {backLabel}
        </button>
      )}
      <button
        onClick={onNext}
        disabled={!canGoNext || isExiting}
        className={`
          flex-1 px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm sm:text-base
          transition-all duration-300
          ${canGoNext && !isExiting
            ? 'btn-journey-next'
            : 'bg-primary-300 text-primary-500 cursor-not-allowed'
          }
        `}
      >
        {nextLabel}
      </button>
    </div>
  )
}
