'use client'

import { Check, AlertCircle } from 'lucide-react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'
import Income from '../BudgetIncome/Income'

const OBJECTIVES = [
  'Ensure that you are receiving your full company match in your 401(k)',
  'Save 15% of your salary towards retirement',
  'Utilize Roth and invest properly',
  'Open an IRA',
]

const RetirementIntro = ({ journeyData, nextStep, prevStep, goToSection, getStepIndexInSection }) => {
  const { isExiting, transitionTo } = useStepTransition()

  // Income was last confirmed for a different employment answer than the
  // one on file now (see incomeConfirmedEmployment in Income.jsx) — likely
  // means they went back to About and changed it without revisiting
  // Income, so whether taxes are withheld/what they take home may be stale.
  const incomeMayBeStale =
    journeyData.incomeConfirmedEmployment != null &&
    journeyData.incomeConfirmedEmployment !== journeyData.employment

  const reviewIncome = () => {
    goToSection('budget', getStepIndexInSection('budget', Income))
  }

  return (
    <StepContainer
      title="Retirement Accounts"
      subtitle="Now that you have set up your emergency fund, let's set up and manage your retirement accounts"
      isExiting={isExiting}
    >
      {incomeMayBeStale && (
        <button
          onClick={reviewIncome}
          disabled={isExiting}
          className="w-full text-left bg-amber-50 border-2 border-amber-300 rounded-xl p-4 sm:p-5 mb-6 flex items-start gap-3 hover:bg-amber-100 transition-colors animate-fadeIn"
        >
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900">
              Looks like you changed your employment and 401(k) answers
            </p>
            <p className="text-sm text-amber-800 mt-1">
              Check your income to make sure it&apos;s still correct — including whether taxes
              are taken out of your paycheck. →
            </p>
          </div>
        </button>
      )}

      <h2 className="text-lg sm:text-xl font-bold text-primary-700 mb-4">Objectives</h2>
      <ul className="space-y-4 mb-8">
        {OBJECTIVES.map((text) => (
          <li key={text} className="flex items-start space-x-3">
            <Check className="w-6 h-6 text-accent-green-600 shrink-0 mt-1" />
            <p className="text-primary-700 text-lg">{text}</p>
          </li>
        ))}
      </ul>

      <StepNavigation
        onBack={prevStep}
        onNext={() => transitionTo(nextStep)}
        isExiting={isExiting}
        nextLabel="Continue →"
      />
    </StepContainer>
  )
}

export default RetirementIntro
