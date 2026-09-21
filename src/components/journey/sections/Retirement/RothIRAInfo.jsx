'use client'

import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import InfoBox from '@/components/ui/InfoBox'
import useStepTransition from '@/hooks/useStepTransition'

// TODO: this step is a placeholder — the Roth IRA education and setup guide
// still need to be written.
const RothIRAInfo = ({ nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()

  return (
    <StepContainer title="What is a Roth IRA?" isExiting={isExiting}>
      <InfoBox type="info" title="Coming soon:" message="We're still writing this section." />

      <StepNavigation
        onBack={prevStep}
        onNext={() => transitionTo(nextStep)}
        isExiting={isExiting}
        nextLabel="Continue →"
      />
    </StepContainer>
  )
}

export default RothIRAInfo
