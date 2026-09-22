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
    <div className={`flex items-center gap-3 sm:gap-4 mt-8 ${className}`}>
      {showBack && (
        <button
          onClick={onBack}
          disabled={isExiting}
          className="btn-journey-back px-4 sm:px-6 py-3 text-sm sm:text-base transition-all duration-300"
        >
          {backLabel}
        </button>
      )}
      {/* Full-width next to Back on mobile (easy thumb target); on larger
          screens it's sized to its content and pinned to the right instead
          of stretching to fill the container — on a wide page like the
          budget summary, flex-1 turned this into a near-full-width bar. */}
      <button
        onClick={onNext}
        disabled={!canGoNext || isExiting}
        className={`
          flex-1 sm:flex-none sm:ml-auto sm:min-w-[200px]
          px-4 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base
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
