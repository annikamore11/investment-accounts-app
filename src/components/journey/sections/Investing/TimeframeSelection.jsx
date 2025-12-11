import React, { useState } from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'

const TimeframeSelection = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()
  const [years, setYears] = useState(journeyData.investingTimeframe || 5)

  const handleNext = () => {
    updateJourneyData('investingTimeframe', years)
    transitionTo(nextStep)
  }

  const handleBack = () => {
    transitionTo(prevStep)
  }

  const getTimeframeLabel = () => {
    if (years <= 2) return 'Short Term'
    if (years <= 5) return 'Medium Term'
    return 'Long Term'
  }

  const getTimeframeColor = () => {
    if (years <= 2) return 'text-orange-600'
    if (years <= 5) return 'text-blue-600'
    return 'text-green-600'
  }

  return (
    <StepContainer
      title="Investment Timeframe"
      subtitle="When will you need this money?"
      isExiting={isExiting}
    >
      <div className="space-y-8">
        <p className="text-gray-700 leading-relaxed">
          How many years will it be before you need to use this money for your goal?
        </p>

        {/* Timeframe display */}
        <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
          <div className={`text-6xl font-bold mb-2 ${getTimeframeColor()}`}>
            {years}
          </div>
          <div className="text-xl text-gray-700 font-medium">
            {years === 1 ? 'year' : 'years'}
          </div>
          <div className={`text-sm font-semibold mt-2 ${getTimeframeColor()}`}>
            {getTimeframeLabel()}
          </div>
        </div>

        {/* Slider */}
        <div className="px-4">
          <input
            type="range"
            min="0"
            max="20"
            value={years}
            onChange={(e) => setYears(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent-green-600"
            style={{
              background: `linear-gradient(to right, #059669 0%, #059669 ${(years / 20) * 100}%, #e5e7eb ${(years / 20) * 100}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>0 years</span>
            <span>20+ years</span>
          </div>
        </div>

        {/* Timeframe guidance */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Why this matters:</strong> Your timeframe helps determine how much investment risk is appropriate.
            Longer timeframes generally allow for more aggressive strategies since there's more time to recover from market downturns.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation
        onBack={handleBack}
        onNext={handleNext}
        canGoNext={true}
        nextLabel="Next →"
        isExiting={isExiting}
      />
    </StepContainer>
  )
}

export default TimeframeSelection
