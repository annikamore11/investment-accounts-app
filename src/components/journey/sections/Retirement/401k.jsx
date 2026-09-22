'use client'

import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import OptionGrid from '@/components/ui/OptionGrid'
import InfoBox from '@/components/ui/InfoBox'
import GlossaryTerm from '@/components/ui/GlossaryTerm'
import useStepTransition from '@/hooks/useStepTransition'
import Employer401k from '../About/Employer401k'

const EMPLOYMENT_LABELS = {
  'self-employed': 'self employed',
  'employed-company': 'employed at a company',
  'unemployed': 'not employed',
}

const MATCH_OPTIONS = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
]

/**
 * Branches on whether the user has an employer 401(k):
 *  - yes: ask whether their employer matches contributions
 *  - no:  offer to jump to the Roth IRA step, or go back and change the answer
 */
const Employer401kFollowup = ({
  journeyData,
  updateJourneyData,
  nextStep,
  prevStep,
  goToSection,
  getStepIndexInSection,
}) => {
  const has401k = journeyData.hasEmployer401k
  const [hasMatch, setHasMatch] = useState(journeyData.hasEmployerMatch ?? null)
  const { isExiting, transitionTo } = useStepTransition()

  const continueToIRA = () => {
    updateJourneyData('openIRA', true)
    transitionTo(nextStep)
  }

  const goBackTo401kQuestion = () => {
    updateJourneyData('hasEmployer401k', null)
    updateJourneyData('hasEmployerMatch', null)
    goToSection('aboutYou', getStepIndexInSection('aboutYou', Employer401k))
  }

  const handleNext = () => {
    updateJourneyData('hasEmployerMatch', hasMatch)
    transitionTo(nextStep)
  }

  if (!has401k) {
    return (
      <StepContainer title="Next Steps" isExiting={isExiting}>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <p className="text-lg text-primary-800 mb-6">
            You indicated that you&apos;re {EMPLOYMENT_LABELS[journeyData.employment] || journeyData.employment} and{' '}
            <strong>do not have a 401(k)</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={continueToIRA} disabled={isExiting} className="flex-1 btn-journey-next px-6 py-3">
              Continue to Set Up an IRA Account →
            </button>
            <button onClick={goBackTo401kQuestion} disabled={isExiting} className="flex-1 btn-journey-back px-6 py-3">
              I would like to change my answer
            </button>
          </div>
        </div>
      </StepContainer>
    )
  }

  return (
    <StepContainer title="401(k) Match" isExiting={isExiting}>
      <p className="text-center text-lg sm:text-xl text-primary-700 mb-6">
        You indicated that you have a 401(k). Does your employer offer a{' '}
        <GlossaryTerm term="401(k) match">
          A 401(k) match is when your employer contributes extra money to your 401(k) based on how much
          you contribute. It&apos;s free money to help you save for retirement.
        </GlossaryTerm>
        ?
      </p>

      <InfoBox
        type="why"
        message="Many employers match part of your contributions. Knowing this helps us recommend how much to contribute and where else to invest."
      />

      <OptionGrid options={MATCH_OPTIONS} selectedValue={hasMatch} onChange={setHasMatch} />

      <StepNavigation
        onBack={prevStep}
        onNext={handleNext}
        canGoNext={hasMatch !== null}
        isExiting={isExiting}
      />

      {hasMatch === null && (
        <p className="text-sm text-primary-500 text-center mt-4 animate-fadeIn">
          Please select an option to continue
        </p>
      )}
    </StepContainer>
  )
}

export default Employer401kFollowup
