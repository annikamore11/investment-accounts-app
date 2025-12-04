'use client'

import { Shield, TrendingUp, AlertTriangle } from 'lucide-react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import InfoBox from '@/components/ui/InfoBox'
import GlossaryTerm from '@/components/ui/GlossaryTerm'
import useStepTransition from '@/hooks/useStepTransition'

const EmergencyFundIntro = ({ journeyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()

  return (
    <StepContainer
      title="Why You Need an Emergency Fund"
      subtitle="Protect yourself before you invest"
      isExiting={isExiting}
      exitDirection="horizontal"
    >
      <InfoBox
        type="why"
        message="The first step to financial security is to learn about and set up an emergency fund. This is crucial before planning for retirement or extra investments."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 mb-8">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-primary-700 mb-4 flex items-center">
            <Shield className="w-6 h-6 text-primary-600 mr-2" />
            What Is an Emergency Fund?
          </h3>
          <p className="text-primary-700 mb-4 text-sm sm:text-base">
            3-6 months of expenses sitting in a safe, accessible account that earns{' '}
            <GlossaryTerm term="interest">
              <h4 className="font-bold mb-2 text-primary-900">What is Interest?</h4>
              <p className="mb-2">
                Interest is the return you can get on your money. When you put money into a bank or brokerage account, it isn't really just sitting there. The bank is using that money for their own investments in the background.
              </p>
              <p className="mb-3">
                Essentially, you're loaning the bank that money until you decide to take it out. Interest is what the bank is willing to pay to encourage you to store your money with them.
              </p>
              <div className="bg-primary-50 p-3 rounded-lg">
                <p className="font-semibold mb-1">Example:</p>
                <p className="mb-1">If you have $100 in an account with 5% interest, after one year you'd have $105.</p>
                <p className="text-xs text-primary-600">Math: $100 × 1.05 = $105 (5% of $100 is $5)</p>
              </div>
            </GlossaryTerm>.
          </p>
          <p className="text-primary-700 text-sm sm:text-base">
            For unexpected costs like car repairs, medical bills, or job loss.
          </p>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-bold text-primary-700 mb-4 flex items-center">
            <AlertTriangle className="w-6 h-6 text-orange-600 mr-2" />
            Why It's Important
          </h3>
          <ul className="space-y-3 text-primary-700 text-sm sm:text-base">
            <li className="flex items-start">
              <span className="text-accent-green-600 mr-2 font-bold">✓</span>
              <span>Prevents debt when emergencies happen</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent-green-600 mr-2 font-bold">✓</span>
              <span>Keeps retirement accounts untouched</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent-green-600 mr-2 font-bold">✓</span>
              <span>Gives peace of mind and financial stability</span>
            </li>
          </ul>
        </div>
      </div>

      <StepNavigation
        onBack={prevStep}
        onNext={() => transitionTo(nextStep)}
        canGoNext={true}
        isExiting={isExiting}
      />
    </StepContainer>
  )
}

export default EmergencyFundIntro
