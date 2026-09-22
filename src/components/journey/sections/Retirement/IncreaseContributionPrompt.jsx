'use client'

import StepContainer from '@/components/ui/StepContainer'
import useStepTransition from '@/hooks/useStepTransition'

const IncreaseContributionPrompt = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()
  const user = Number(journeyData.userContribution) || 0
  const company = Number(journeyData.companyMatch) || 0
  const total = user + company

  // The answer changes which steps follow, so record it before advancing
  const answer = (wantsToIncrease) => {
    updateJourneyData('wantsToIncreaseContribution', wantsToIncrease)
    transitionTo(nextStep)
  }

  return (
    <StepContainer title="Your 401(k) Contribution" isExiting={isExiting}>
      <div className="text-center space-y-6">
        <p className="text-lg text-primary-800 max-w-2xl mx-auto">
          You are currently contributing <strong>{user}%</strong> of your salary to your 401(k). Your
          employer contributes <strong>{company}%</strong>, for a total of <strong>{total}%</strong>.
        </p>
        <p className="text-lg text-primary-800">
          Would you like to save more than the <strong>{total}%</strong> that you are already saving for
          retirement?
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button onClick={prevStep} disabled={isExiting} className="btn-journey-back flex-none px-6 py-4">
            ← Back
          </button>
          <button onClick={() => answer(true)} disabled={isExiting} className="flex-1 btn-journey-next px-6 py-4">
            Yes, increase my contribution
          </button>
          <button onClick={() => answer(false)} disabled={isExiting} className="flex-1 btn-journey-back px-6 py-4">
            No, keep it the same
          </button>
        </div>
      </div>
    </StepContainer>
  )
}

export default IncreaseContributionPrompt
