'use client'

import { AlertTriangle } from 'lucide-react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'

const TIPS = [
  {
    title: 'Maximize Roth',
    paragraphs: [
      'If your 401(k) allows it, you should be contributing Roth money to it.',
      "Roth is money you pay taxes on now and don't have to pay taxes on in retirement.",
      'Roth is best to save when you are in your 20s or 30s.',
    ],
  },
  {
    title: 'Investments',
    paragraphs: [
      'Make sure that your 401(k) is invested properly.',
      'The right investments will grow your money significantly over time.',
    ],
  },
]

const RetirementOutcomesContinued = ({ nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()

  return (
    <StepContainer
      title="401(k) Continued"
      subtitle="Do these two things to fully maximize your 401(k)"
      isExiting={isExiting}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {TIPS.map((tip) => (
          <div key={tip.title} className="bg-white rounded-xl p-5 shadow-sm text-gray-800 text-lg space-y-4">
            <p className="font-bold text-accent-green-700 text-xl">{tip.title}</p>
            {tip.paragraphs.map((text) => <p key={text}>{text}</p>)}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm text-gray-800 text-lg text-center">
        <p className="font-bold text-red-800 inline-flex items-center justify-center gap-2">
          <AlertTriangle className="w-6 h-6" />
          Next Steps
        </p>
        <p className="mt-2">
          Every 401(k) is different. To ensure proper set-up, we recommend calling your 401(k) provider
          or your company&apos;s benefits office.
        </p>
      </div>

      <StepNavigation
        onBack={prevStep}
        onNext={() => transitionTo(nextStep)}
        isExiting={isExiting}
        nextLabel="Continue →"
      />
    </StepContainer>
  )
}

export default RetirementOutcomesContinued
