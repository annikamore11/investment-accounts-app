'use client'

import { Check } from 'lucide-react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'

const OBJECTIVES = [
  'Ensure that you are receiving your full company match in your 401(k)',
  'Save 15% of your salary towards retirement',
  'Utilize Roth and invest properly',
  'Open an IRA',
]

const RetirementIntro = ({ nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()

  return (
    <StepContainer
      title="Retirement Accounts"
      subtitle="Now that you have set up your emergency fund, let's set up and manage your retirement accounts"
      isExiting={isExiting}
    >
      <h2 className="text-xl font-semibold text-primary-800 mb-4">Objectives</h2>
      <ul className="space-y-4 mb-8">
        {OBJECTIVES.map((text) => (
          <li key={text} className="flex items-start space-x-3">
            <Check className="w-6 h-6 text-accent-green-600 shrink-0 mt-1" />
            <p className="text-primary-800 text-lg">{text}</p>
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
