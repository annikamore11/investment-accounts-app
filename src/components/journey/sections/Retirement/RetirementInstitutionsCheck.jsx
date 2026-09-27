'use client'

import { useState } from 'react'
import StepContainer from '@/components/ui/StepContainer'
import OptionGrid from '@/components/ui/OptionGrid'
import StepNavigation from '@/components/ui/StepNavigation'
import InfoBox from '@/components/ui/InfoBox'
import useStepTransition from '@/hooks/useStepTransition'

const MOVE_OPTIONS = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
]

// Same substring match EmergencyFundSummary.jsx uses for its own
// isFidelity/isVanguard checks — institutions are free text everywhere in
// this app, not a fixed list, so there's no exact-match id to compare.
const isFidelity = (institution) =>
  typeof institution === 'string' && institution.toLowerCase().includes('fidelity')

// Emergency Fund stores "where it is" differently depending on which
// branch the user took: emergencyFundInstitution defaults to Fidelity when
// they set one up fresh (hasEmergencyFund === false), while
// existingEmergencyFundInstitution is what they typed in for an account
// they already had. moveToFidelity covers the case where they already had
// one elsewhere and chose to move it.
const isEmergencyFundAtFidelity = (journeyData) => {
  if (journeyData.hasEmergencyFund === false) return true
  if (journeyData.hasEmergencyFund === true) {
    return isFidelity(journeyData.existingEmergencyFundInstitution) || journeyData.moveToFidelity === true
  }
  return false
}

const RetirementInstitutionsCheck = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const has401k = journeyData.hasEmployer401k === true
  const hasRothIra = journeyData.contributesToOtherRetirementAccount === true

  const [plan401kInstitution, setPlan401kInstitution] = useState(journeyData.retirement401kInstitution || '')
  const [rothIraInstitution, setRothIraInstitution] = useState(journeyData.rothIraInstitution || '')
  const [moveRothIraToFidelity, setMoveRothIraToFidelity] = useState(journeyData.moveRothIraToFidelity ?? null)
  const { isExiting, transitionTo } = useStepTransition()

  // Only worth offering when there's an actual account to move and a real
  // reason to consolidate — a Roth IRA that's already at Fidelity, or
  // typed in but not at Fidelity while the emergency fund isn't either,
  // has nothing to gain from this question.
  const canOfferMove = hasRothIra
    && rothIraInstitution.trim() !== ''
    && !isFidelity(rothIraInstitution)
    && isEmergencyFundAtFidelity(journeyData)

  const handleRothIraInstitutionChange = (raw) => {
    setRothIraInstitution(raw)
    // Switching back to a Fidelity-matching name mid-edit makes the offer
    // moot — don't leave a stale yes/no hanging around for it.
    if (isFidelity(raw)) setMoveRothIraToFidelity(null)
  }

  const handleNext = () => {
    updateJourneyData('retirement401kInstitution', has401k ? plan401kInstitution : '')
    updateJourneyData('rothIraInstitution', hasRothIra ? rothIraInstitution : '')
    updateJourneyData('moveRothIraToFidelity', canOfferMove ? moveRothIraToFidelity : null)
    transitionTo(nextStep)
  }

  const canGoNext = (!has401k || plan401kInstitution.trim() !== '')
    && (!hasRothIra || rothIraInstitution.trim() !== '')
    && (!canOfferMove || moveRothIraToFidelity !== null)

  return (
    <StepContainer
      title="Your Retirement Accounts"
      subtitle="A couple more questions so we have the full picture."
      isExiting={isExiting}
    >
      {has401k && (
        <div className="mb-6">
          <label className="block text-lg sm:text-xl font-semibold text-primary-700 mb-3 text-center">
            Where is your 401(k) plan through?
          </label>
          <input
            type="text"
            placeholder="e.g., Fidelity, Vanguard, Empower"
            value={plan401kInstitution}
            onChange={(e) => setPlan401kInstitution(e.target.value)}
            className="w-full max-w-xs mx-auto block border-2 border-primary-300 rounded-xl px-4 py-3 text-lg font-bold text-primary-900 bg-white focus:outline-none focus:border-accent-green-500"
          />
        </div>
      )}

      {hasRothIra && (
        <div className="mb-6 animate-fadeIn">
          <label className="block text-lg sm:text-xl font-semibold text-primary-700 mb-3 text-center">
            Where is your Roth IRA through?
          </label>
          <input
            type="text"
            placeholder="e.g., Fidelity, Vanguard, Schwab"
            value={rothIraInstitution}
            onChange={(e) => handleRothIraInstitutionChange(e.target.value)}
            className="w-full max-w-xs mx-auto block border-2 border-primary-300 rounded-xl px-4 py-3 text-lg font-bold text-primary-900 bg-white focus:outline-none focus:border-accent-green-500"
          />
        </div>
      )}

      {canOfferMove && (
        <div className="mb-6 animate-fadeIn">
          <InfoBox
            type="tip"
            message="Your emergency fund is already at Fidelity — keeping your Roth IRA there too means one login and one place to see your whole picture."
          />
          <label className="block text-lg sm:text-xl font-semibold text-primary-700 mb-3 text-center mt-4">
            Want to move your Roth IRA to Fidelity too?
          </label>
          <OptionGrid options={MOVE_OPTIONS} selectedValue={moveRothIraToFidelity} onChange={setMoveRothIraToFidelity} />
        </div>
      )}

      <StepNavigation onBack={prevStep} onNext={handleNext} canGoNext={canGoNext} isExiting={isExiting} />
    </StepContainer>
  )
}

export default RetirementInstitutionsCheck
