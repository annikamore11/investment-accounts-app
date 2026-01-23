import React, { useState } from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'

const RiskTolerance = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, direction, transitionTo } = useStepTransition()
  const [riskLevel, setRiskLevel] = useState(journeyData.riskTolerance || 5)

  const handleNext = () => {
    updateJourneyData('riskTolerance', riskLevel)
    transitionTo(nextStep, 'forward')
  }

  const handleBack = () => {
    transitionTo(prevStep, 'backward')
  }

  const getRiskLabel = () => {
    if (riskLevel === 1) return 'Very Conservative'
    if (riskLevel <= 3) return 'Conservative'
    if (riskLevel <= 6) return 'Moderate'
    if (riskLevel <= 8) return 'Aggressive'
    return 'Very Aggressive'
  }

  return (
    <StepContainer
      title="What's Your Risk Tolerance?"
      subtitle="Understanding your comfort with investment volatility"
      isExiting={isExiting}
      direction={direction}
    >
      <div className="space-y-6">
        {/* Description */}
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Investment risk tolerance measures how comfortable you are with the possibility of your investments losing value in the short term for the potential of higher returns over time.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 space-y-3">
            <div>
              <span className="font-semibold text-gray-900">Level 1:</span>
              <span className="text-gray-700 ml-2">You prioritize protecting your money above all else and cannot tolerate seeing it decrease, even temporarily.</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Levels 2-6:</span>
              <span className="text-gray-700 ml-2">You can handle some market fluctuations and are willing to accept moderate ups and downs for better long-term growth potential.</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Levels 7-10:</span>
              <span className="text-gray-700 ml-2">You're comfortable with significant market volatility and are willing to accept large swings in your account balance to maximize long-term growth.</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 italic">
            There's no right or wrong answer—everyone has different comfort levels with risk.
          </p>
        </div>

        {/* Risk Level Display */}
        <div className={`bg-accent-green-100 border-2 border-accent-green-700 rounded-xl p-8 text-center transition-all`}>
          <div className={`text-6xl font-bold mb-2 text-accent-green-700`}>
            {riskLevel}
          </div>
          <div className={`text-2xl font-semibold text-accent-green-700`}>
            {getRiskLabel()}
          </div>
        </div>

        {/* Slider */}
        <div>
          <input
            type="range"
            min="1"
            max="10"
            value={riskLevel}
            onChange={(e) => setRiskLevel(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent-green-600"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>10</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation
        onBack={handleBack}
        onNext={handleNext}
        canGoNext={true}
        nextLabel="Continue →"
        isExiting={isExiting}
      />
    </StepContainer>
  )
}

export default RiskTolerance