'use client'

import { useState } from 'react'
import StepContainer from '@/components/ui/StepContainer'
import OptionGrid from '@/components/ui/OptionGrid'
import StepNavigation from '@/components/ui/StepNavigation'
import InfoBox from '@/components/ui/InfoBox'
import useStepTransition from '@/hooks/useStepTransition'
import { ROTH_IRA_ANNUAL_LIMIT, getMonthlyDollarsForPercent } from '@/utils/retirementMath'
import PercentOrDollarInput from './PercentOrDollarInput'

const OPTIONS = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
]

const MAX_OUT_OPTIONS = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
]

const OtherRetirementAccountCheck = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [hasOther, setHasOther] = useState(journeyData.contributesToOtherRetirementAccount ?? null)
  const [percent, setPercent] = useState(String(journeyData.otherRetirementAccountPercent ?? ''))
  const [willMax, setWillMax] = useState(journeyData.willMaxRothIRA ?? null)
  const { isExiting, transitionTo } = useStepTransition()

  const handleNext = () => {
    updateJourneyData('contributesToOtherRetirementAccount', hasOther)
    updateJourneyData('otherRetirementAccountPercent', hasOther === true ? Number(percent) : '')
    updateJourneyData('willMaxRothIRA', hasOther === true ? willMax : null)
    transitionTo(nextStep)
  }

  return (
    <StepContainer
      title="Other Retirement Savings"
      subtitle="Let's get the full picture before figuring out your plan."
      isExiting={isExiting}
    >
      <InfoBox
        type="why"
        message="Your 15% savings goal counts everything going toward retirement, not just a 401(k) — so whether you're already saving in a Roth IRA shapes the rest of the recommendation."
      />

      <label className="block text-lg sm:text-xl font-semibold text-primary-700 mb-4 text-center">
        Are you contributing to a Roth IRA outside of your 401(k)?
      </label>

      <OptionGrid options={OPTIONS} selectedValue={hasOther} onChange={setHasOther} />

      {hasOther === true && (
        <div className="mb-6 animate-fadeIn">
          <PercentOrDollarInput
            label="How much goes to that account?"
            value={percent}
            onChange={setPercent}
            journeyData={journeyData}
            placeholderPercent="e.g. 5"
            placeholderDollar="e.g. 140"
          />
        </div>
      )}

      {hasOther === true && percent !== '' && (
        <div className="mb-6 animate-fadeIn">
          <label className="block text-lg sm:text-xl font-semibold text-primary-700 mb-3 text-center">
            Will you max out your Roth IRA this year?
          </label>
          <p className="text-sm text-primary-500 text-center mb-4">
            At {percent}%, that&apos;s about ${(getMonthlyDollarsForPercent(journeyData, Number(percent) || 0) * 12).toLocaleString()}/year
            toward the 2026 IRS limit of ${ROTH_IRA_ANNUAL_LIMIT.toLocaleString()} ($8,600 if you&apos;re 50 or older).
          </p>
          <OptionGrid options={MAX_OUT_OPTIONS} selectedValue={willMax} onChange={setWillMax} />
        </div>
      )}

      <StepNavigation
        onBack={prevStep}
        onNext={handleNext}
        canGoNext={hasOther !== null && (hasOther === false || (percent !== '' && willMax !== null))}
        isExiting={isExiting}
      />

      {hasOther === null && (
        <p className="text-sm text-primary-500 text-center mt-4 animate-fadeIn">
          Please select an option to continue
        </p>
      )}
    </StepContainer>
  )
}

export default OtherRetirementAccountCheck
