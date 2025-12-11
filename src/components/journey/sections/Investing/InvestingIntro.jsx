import React from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import InfoBox from '@/components/ui/InfoBox'
import useStepTransition from '@/hooks/useStepTransition'
import { TrendingUp } from 'lucide-react'

const InvestingIntro = ({ nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()

  const handleNext = () => {
    transitionTo(nextStep)
  }

  const handleBack = () => {
    transitionTo(prevStep)
  }

  return (
    <StepContainer
      title="Non-Retirement Investing"
      subtitle="Invest for your other goals"
      isExiting={isExiting}
    >
      <div className="space-y-6">
        {/* Icon and intro */}
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready for More?</h3>
            <p className="text-gray-700 leading-relaxed">
              You've already set up accounts for your retirement goal. Now you can invest for your other goals.
            </p>
          </div>
        </div>

        {/* Common goals */}
        <InfoBox type="info">
          <p className="text-sm mb-2">
            <strong>Common investing goals include:</strong>
          </p>
          <ul className="text-sm space-y-1 ml-4 list-disc">
            <li>Home purchase</li>
            <li>Car</li>
            <li>Higher education</li>
            <li>Travel</li>
            <li>Or simply growing your wealth over time</li>
          </ul>
        </InfoBox>

        {/* Key considerations */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
          <h4 className="font-bold text-gray-900 mb-4">Two Main Considerations</h4>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-900 mb-1">
                🕐 How long will it be before I use this money?
              </p>
              <p className="text-sm text-gray-700">
                Your timeframe helps determine how aggressively you can invest.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">
                ⚖️ How much risk am I willing to take on?
              </p>
              <p className="text-sm text-gray-700">
                Your comfort with market ups and downs shapes your investment strategy.
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed">
          In the next few steps, we'll help you think through these questions to find the right approach for you.
        </p>
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

export default InvestingIntro
