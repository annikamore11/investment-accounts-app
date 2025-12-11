import React, { useState } from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import InfoBox from '@/components/ui/InfoBox'
import OptionGrid from '@/components/ui/OptionGrid'
import useStepTransition from '@/hooks/useStepTransition'
import { AlertTriangle } from 'lucide-react'

const InvestmentRecommendation = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()
  const [selectedStrategy, setSelectedStrategy] = useState(journeyData.investingStrategy || '')

  const timeframe = journeyData.investingTimeframe || 0
  const riskTolerance = journeyData.riskTolerance || 5

  // Determine if they should invest at all
  const isShortTerm = timeframe <= 2
  const isVeryRiskAverse = riskTolerance === 1
  const shouldNotInvest = isShortTerm || isVeryRiskAverse

  const handleNext = () => {
    if (shouldNotInvest) {
      updateJourneyData('investingStrategy', 'cash')
      transitionTo(nextStep)
    } else {
      updateJourneyData('investingStrategy', selectedStrategy)
      transitionTo(nextStep)
    }
  }

  const handleBack = () => {
    transitionTo(prevStep)
  }

  const strategyOptions = [
    {
      value: 'index',
      label: 'Index Investing',
      description: 'All stocks, follows market indexes'
    },
    {
      value: 'blended',
      label: 'Blended Funds',
      description: 'Mix of stocks and bonds'
    }
  ]

  if (shouldNotInvest) {
    return (
      <StepContainer
        title="Our Guidance"
        subtitle="Keep your money safe"
        isExiting={isExiting}
      >
        <div className="space-y-6">
          {/* Warning message */}
          <div className="bg-orange-50 border-2 border-orange-400 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-orange-900 mb-2">Recommendation: Keep Your Money in Cash</h3>
                <p className="text-orange-800 mb-3">
                  Based on your responses, conventional wisdom would urge you to keep your money in cash and refrain from investing it in the stock market.
                </p>
                {isShortTerm && (
                  <p className="text-sm text-orange-800 mb-2">
                    <strong>Why?</strong> Your timeframe of {timeframe} {timeframe === 1 ? 'year' : 'years'} is too short to gamble with market volatility.
                    The stock market can have significant downturns in short periods, and you may need your money before it recovers.
                  </p>
                )}
                {isVeryRiskAverse && (
                  <p className="text-sm text-orange-800">
                    <strong>Why?</strong> Your risk tolerance indicates you can't stomach the risk that investing in the stock market entails.
                    Even diversified investments can lose value in the short term, which doesn't align with your preferences.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Cash options */}
          <InfoBox type="info">
            <p className="text-sm mb-2">
              <strong>Better options for your situation:</strong>
            </p>
            <ul className="text-sm space-y-1 ml-4 list-disc">
              <li>High-yield savings account (2-5% annually)</li>
              <li>Money market fund like SPAXX at Fidelity</li>
              <li>Certificates of Deposit (CDs) if you can lock up the money</li>
            </ul>
          </InfoBox>

          <p className="text-gray-700 text-sm">
            These options keep your money safe while still earning some return, which is more appropriate for your timeframe and risk tolerance.
          </p>
        </div>

        {/* Navigation */}
        <StepNavigation
          onBack={handleBack}
          onNext={handleNext}
          canGoNext={true}
          nextLabel="Finish Section →"
          isExiting={isExiting}
        />
      </StepContainer>
    )
  }

  return (
    <StepContainer
      title="Investment Strategy"
      subtitle="Choose your approach"
      isExiting={isExiting}
    >
      <div className="space-y-6">
        <p className="text-gray-700 leading-relaxed">
          Based on your timeframe of <strong>{timeframe} years</strong> and risk tolerance of <strong>{riskTolerance}/10</strong>,
          you have some good investment options. Which approach sounds better to you?
        </p>

        {/* Strategy cards */}
        <div className="space-y-4">
          {/* Index Investing */}
          <button
            onClick={() => setSelectedStrategy('index')}
            className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
              selectedStrategy === 'index'
                ? 'border-accent-green-600 bg-accent-green-50 shadow-md'
                : 'border-gray-300 hover:border-gray-400 bg-white'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">Index Investing</h3>
              {selectedStrategy === 'index' && (
                <div className="bg-accent-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Selected
                </div>
              )}
            </div>
            <p className="text-sm text-gray-700 mb-3">
              Aggressive/risky strategy using <strong>all stocks</strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-1.5 ml-4 list-disc">
              <li>Follows the performance of an index like the S&P 500</li>
              <li>Very low cost (minimal fees)</li>
              <li>Higher volatility but greater long-term growth potential</li>
              <li>Best for longer timeframes (5+ years)</li>
            </ul>
          </button>

          {/* Blended Funds */}
          <button
            onClick={() => setSelectedStrategy('blended')}
            className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
              selectedStrategy === 'blended'
                ? 'border-accent-green-600 bg-accent-green-50 shadow-md'
                : 'border-gray-300 hover:border-gray-400 bg-white'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">Blended Funds</h3>
              {selectedStrategy === 'blended' && (
                <div className="bg-accent-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Selected
                </div>
              )}
            </div>
            <p className="text-sm text-gray-700 mb-3">
              A mix of <strong>stocks and bonds</strong> for balanced risk
            </p>
            <ul className="text-sm text-gray-600 space-y-1.5 ml-4 list-disc">
              <li>Choose how risky you want to be (more stocks = more risky, more growth potential)</li>
              <li>Bonds provide stability during market downturns</li>
              <li>Higher cost than index funds (more fees)</li>
              <li>Good for those wanting some stability with growth</li>
            </ul>
          </button>
        </div>

        {/* Reminder */}
        <div className="bg-gray-50 border-l-4 border-gray-400 rounded-r-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Remember:</strong> The more stocks in your portfolio, the more risky it is, but also the more chance for growth over time.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation
        onBack={handleBack}
        onNext={handleNext}
        canGoNext={!!selectedStrategy}
        nextLabel={selectedStrategy === 'index' ? 'Choose Index Fund →' : 'Continue →'}
        isExiting={isExiting}
      />
    </StepContainer>
  )
}

export default InvestmentRecommendation
