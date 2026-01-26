import React from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'
import { Info, Building2, ExternalLink } from 'lucide-react'

const GeneralRecommendations = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, direction, transitionTo } = useStepTransition()

  const handleNext = () => {
    transitionTo(nextStep, 'forward')
  }

  const handleBack = () => {
    transitionTo(prevStep, 'backward')
  }

  return (
    <StepContainer
      title="Investment Recommendations"
      subtitle="Current platform focus"
      isExiting={isExiting}
      direction={direction}
    >
      <div className="space-y-6">
        {/* Info message about Fidelity focus */}
        <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-200">
          <div className="flex gap-3">
            <Info className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">Currently Showing Fidelity Services Only</h3>
              <p className="text-sm text-gray-700 mb-3">
                At this time, our guided recommendations and integrations are specifically built around Fidelity Investments services. This allows us to provide detailed, step-by-step guidance for opening accounts and managing your investments.
              </p>
              <p className="text-sm text-gray-700">
                If you prefer to use a different financial institution, you can still benefit from the educational content we've provided throughout this journey and apply those principles to your chosen platform.
              </p>
            </div>
          </div>
        </div>

        {/* Fidelity option */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
          <div className="flex gap-3 mb-4">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h3 className="font-bold text-gray-900 text-lg">Fidelity Go Option</h3>
          </div>

          <p className="text-gray-700 mb-4">
            Fidelity Go offers professional investment management with automated portfolio allocation, rebalancing, and tax strategies. It's free for accounts under $25,000 and charges a 0.35% advisory fee for larger accounts.
          </p>

          <a
            href="https://www.fidelity.com/managed-accounts/fidelity-go/overview"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Learn More About Fidelity Go
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* General guidance */}
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-3">General Investment Guidance</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="text-accent-green-600 font-bold">•</span>
              <span>Look for low-cost index funds or ETFs to minimize fees</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent-green-600 font-bold">•</span>
              <span>Diversify across different asset classes (stocks, bonds, etc.)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent-green-600 font-bold">•</span>
              <span>Match your investment timeline to your risk tolerance</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent-green-600 font-bold">•</span>
              <span>Consider robo-advisors for automated management if you prefer hands-off investing</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent-green-600 font-bold">•</span>
              <span>Regularly review and rebalance your portfolio</span>
            </li>
          </ul>
        </div>

        {/* Note about continuing */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-700">
            You can continue to the next section of your financial journey. The knowledge you've gained here will be valuable regardless of which investment platform you choose.
          </p>
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

export default GeneralRecommendations
