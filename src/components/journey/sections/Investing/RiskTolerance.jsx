import React, { useState } from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'

const RiskTolerance = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()
  const [riskLevel, setRiskLevel] = useState(journeyData.riskTolerance || 5)

  const handleNext = () => {
    updateJourneyData('riskTolerance', riskLevel)
    transitionTo(nextStep)
  }

  const handleBack = () => {
    transitionTo(prevStep)
  }

  const getRiskLabel = () => {
    if (riskLevel === 1) return 'Very Safe'
    if (riskLevel <= 3) return 'Safe'
    if (riskLevel <= 6) return 'Moderate'
    if (riskLevel <= 8) return 'Aggressive'
    return 'Very Aggressive'
  }

  const getRiskColor = () => {
    if (riskLevel <= 3) return 'text-blue-600'
    if (riskLevel <= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRiskDescription = () => {
    if (riskLevel === 1) {
      return 'You do not want to see your money go down at all, even if it means minimal growth.'
    }
    if (riskLevel <= 3) {
      return 'You prefer safety and stability, even if it means lower returns.'
    }
    if (riskLevel <= 6) {
      return 'You\'re willing to accept some ups and downs for moderate growth potential.'
    }
    if (riskLevel <= 8) {
      return 'You\'re comfortable with significant market swings for higher growth potential.'
    }
    return 'You\'re willing to see big swings up or down if it means maximizing growth over time.'
  }

  return (
    <StepContainer
      title="Risk Tolerance"
      subtitle="How comfortable are you with risk?"
      isExiting={isExiting}
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            On a scale of 1 to 10, how much investment risk are you willing to take?
          </p>
          <div className="bg-gray-50 border-l-4 border-gray-400 rounded-r-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Remember:</strong> There is no wrong answer, there is no right answer. Everyone is different.
            </p>
          </div>
        </div>

        {/* Risk level display */}
        <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
          <div className={`text-6xl font-bold mb-2 ${getRiskColor()}`}>
            {riskLevel}
          </div>
          <div className={`text-xl font-semibold mb-2 ${getRiskColor()}`}>
            {getRiskLabel()}
          </div>
          <div className="text-sm text-gray-600 max-w-md mx-auto px-4">
            {getRiskDescription()}
          </div>
        </div>

        {/* Slider */}
        <div className="px-4">
          <input
            type="range"
            min="1"
            max="10"
            value={riskLevel}
            onChange={(e) => setRiskLevel(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #eab308 50%, #dc2626 100%)`
            }}
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>1 - Very Safe</span>
            <span>10 - Very Aggressive</span>
          </div>
        </div>

        {/* Explanations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-1 text-sm">Low Risk (1-3)</p>
            <p className="text-xs text-blue-800">
              Minimal market volatility. Lower growth potential but greater peace of mind.
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="font-semibold text-red-900 mb-1 text-sm">High Risk (8-10)</p>
            <p className="text-xs text-red-800">
              Significant market swings. Higher growth potential but requires strong stomach for volatility.
            </p>
          </div>
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

export default RiskTolerance
