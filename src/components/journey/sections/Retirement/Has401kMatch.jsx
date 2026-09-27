'use client'

import { useState } from 'react'
import { Percent, Plus, Trash2 } from 'lucide-react'
import StepContainer from '@/components/ui/StepContainer'
import OptionGrid from '@/components/ui/OptionGrid'
import StepNavigation from '@/components/ui/StepNavigation'
import InfoBox from '@/components/ui/InfoBox'
import GlossaryTerm from '@/components/ui/GlossaryTerm'
import useStepTransition from '@/hooks/useStepTransition'
import { getPerPaycheckDollarsForPercent } from '@/utils/retirementMath'
import PercentOrDollarInput, { sanitizePercentText } from './PercentOrDollarInput'

const HAS_MATCH_OPTIONS = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
]

const CONTRIBUTES_OPTIONS = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
]

const FUTURE_MATCH_OPTIONS = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
]

const ROTH_401K_OPTIONS = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No, or not sure' },
]

const CONTRIBUTING_ROTH_OPTIONS = [
  { value: true, label: 'Roth' },
  { value: false, label: 'Traditional, or not sure' },
]

// Smaller labeled percent field for a single tier row — same input
// treatment as PercentInput, lighter label since it's a sub-field rather
// than the page's main question.
const TierPercentField = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-xs font-semibold text-primary-600 mb-1">{label}</label>
    <div className="relative">
      <input
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(sanitizePercentText(e.target.value))}
        className="w-full p-3 pr-8 border-2 border-primary-300 rounded-lg focus:border-accent-green-600 focus:outline-none text-base font-bold text-primary-900 bg-white"
      />
      <Percent className="absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-500 w-4 h-4" />
    </div>
  </div>
)

// Dollar-for-dollar (100%) is by far the most common match rate, so new
// tiers default there — someone with a simple flat match then only has to
// fill in the cap.
const emptyTier = () => ({ rate: '100', width: '' })

const effectiveMatchFor = (tiers) =>
  tiers.reduce((sum, t) => sum + ((Number(t.rate) || 0) / 100) * (Number(t.width) || 0), 0)

const Has401kMatch = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [hasMatch, setHasMatch] = useState(() => (
    journeyData.companyMatch === '' ? null : Number(journeyData.companyMatch) > 0
  ))
  // We only ever persist the final computed %, not the tier breakdown that
  // produced it, so returning users get reconstructed as a single
  // dollar-for-dollar tier — right for the common case, and still editable.
  const [tiers, setTiers] = useState(() => {
    const saved = Number(journeyData.companyMatch) || 0
    return [{ rate: '100', width: saved > 0 ? String(saved) : '' }]
  })
  const [contributes, setContributes] = useState(() => (
    journeyData.userContribution === '' ? null : Number(journeyData.userContribution) > 0
  ))
  const [userContribution, setUserContribution] = useState(String(journeyData.userContribution ?? ''))
  const [futureMatch, setFutureMatch] = useState(journeyData.matchAfterTenure ?? null)
  const [canRoth, setCanRoth] = useState(journeyData.canContributeRothIn401k ?? null)
  const [contributingRoth, setContributingRoth] = useState(journeyData.contributingRothIn401k ?? null)
  const { isExiting, transitionTo } = useStepTransition()

  const updateTier = (index, field, value) => {
    setTiers((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)))
  }
  const addTier = () => setTiers((prev) => [...prev, emptyTier()])
  const removeTier = (index) => setTiers((prev) => prev.filter((_, i) => i !== index))

  const effectiveMatch = effectiveMatchFor(tiers)
  const roundedMatch = hasMatch === false ? 0 : Math.round(effectiveMatch * 10) / 10
  const hasEnteredMatch = tiers[0]?.width !== ''

  const handleNext = () => {
    updateJourneyData('companyMatch', roundedMatch)
    updateJourneyData('userContribution', contributes === false ? 0 : Number(userContribution))
    // A future match is only meaningful without a current one — cleared so
    // a stale answer can't linger if they go back and change hasMatch.
    updateJourneyData('matchAfterTenure', hasMatch === false ? futureMatch : null)
    updateJourneyData('canContributeRothIn401k', canRoth)
    // Only meaningful once both the plan supports Roth and there's an
    // actual contribution to classify — cleared otherwise so a stale
    // answer can't linger if they go back and change either.
    updateJourneyData('contributingRothIn401k', canRoth === true && contributes === true ? contributingRoth : null)
    transitionTo(nextStep)
  }

  return (
    <StepContainer
      title="Your 401(k) Details"
      subtitle="A few quick questions about your plan — this shapes your whole recommendation."
      isExiting={isExiting}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-lg sm:text-xl font-semibold text-primary-700 mb-2 text-center">
            Does your company currently offer a 401(k) match — one you can claim right now?
          </label>
          <p className="text-sm text-primary-500 text-center mb-3">
            Not one that only kicks in later, after you&apos;ve been there a while — we&apos;ll ask about
            that separately if it applies.
          </p>

          <OptionGrid options={HAS_MATCH_OPTIONS} selectedValue={hasMatch} onChange={setHasMatch} />

          {hasMatch === true && (
            <div className="mt-6 animate-fadeIn space-y-3">
              <InfoBox type="info" title="Plan documents love confusing language:">
                <div className="text-sm sm:text-base leading-relaxed space-y-2">
                  <p>
                    &quot;We match 50 cents per dollar you contribute, up to 6% of your salary&quot; doesn&apos;t
                    mean a 6% match — it means your employer adds 50% of what you put in, capped at 6% of your
                    salary contributed. That works out to an effective match of <strong>3%</strong> (50% × 6%).
                  </p>
                  <p>
                    Some plans also change the rate at different levels — e.g. 100% of the first 3%, then 50%
                    of the next 2%. Enter each tier separately below if that&apos;s yours.
                  </p>
                </div>
              </InfoBox>

              <label className="block text-sm font-semibold text-primary-700">
                Enter your match below:
              </label>

              {tiers.map((tier, index) => (
                <div key={index} className="bg-primary-50 border-2 border-primary-300 rounded-xl p-4 space-y-3">
                  {tiers.length > 1 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-primary-500">
                        {index === 0 ? 'First tier' : `Tier ${index + 1}`}
                      </span>
                      <button
                        onClick={() => removeTier(index)}
                        aria-label="Remove this tier"
                        className="p-1.5 text-rust-500 hover:bg-rust-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <TierPercentField
                      label="Employer adds this % per dollar"
                      value={tier.rate}
                      onChange={(v) => updateTier(index, 'rate', v)}
                      placeholder="100 = dollar-for-dollar"
                    />
                    <TierPercentField
                      label={index === 0 ? 'Up to this % of your salary' : 'For the next % of your salary'}
                      value={tier.width}
                      onChange={(v) => updateTier(index, 'width', v)}
                      placeholder="e.g. 6"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={addTier}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-primary-300 rounded-lg text-primary-600 hover:border-accent-green-500 hover:text-accent-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add another match tier
              </button>

              {hasEnteredMatch && (
                <div className="bg-gradient-to-r from-accent-green-50 to-accent-green-100 rounded-xl p-4 sm:p-6 text-center border-2 border-accent-green-700 animate-fadeIn">
                  <p className="text-xs sm:text-sm text-primary-700 mb-1">Your Employer&apos;s Effective Match</p>
                  <p className="text-3xl sm:text-4xl font-bold text-accent-green-700">{roundedMatch}%</p>
                  <p className="text-xs sm:text-sm text-primary-600 mt-2">
                    of your salary (about ${getPerPaycheckDollarsForPercent(journeyData, roundedMatch).toLocaleString()} per paycheck) — this is what we&apos;ll use for your plan
                  </p>
                </div>
              )}

              <InfoBox
                type="info"
                message="Don't know your match formula? Go to your company's HR site and navigate to your benefits document — there should be info on your match stored there."
                className="mb-0"
              />
            </div>
          )}
        </div>

        {hasMatch === false && (
          <div className="animate-fadeIn">
            <label className="block text-lg sm:text-xl font-semibold text-primary-700 mb-4 text-center">
              Does your plan offer a match after a certain amount of time working there — e.g. a match
              that only kicks in once you hit a vesting milestone?
            </label>
            <OptionGrid options={FUTURE_MATCH_OPTIONS} selectedValue={futureMatch} onChange={setFutureMatch} />
            <InfoBox
              type="info"
              message="Not sure about this one? Check your plan's Summary Plan Description, or ask HR — some employers add a match once you hit a tenure milestone, like your one-year anniversary."
            />
          </div>
        )}

        <div>
          <label className="block text-lg sm:text-xl font-semibold text-primary-700 mb-4 text-center">
            Can you contribute{' '}
            <GlossaryTerm term="Roth money">
              <p className="font-semibold text-primary-900 mb-2">What is Roth money?</p>
              <p>
                Roth means you pay taxes on the money now, before it goes into your 401(k) — so when
                you take it out in retirement, it&apos;s completely tax-free, growth and all.
              </p>
            </GlossaryTerm>{' '}
            into your 401(k) through your employer&apos;s plan?
          </label>
          <p className="text-sm text-primary-500 text-center mb-4">
            Not every plan offers this. Check your plan&apos;s contribution or deferral-election page, or
            ask HR/your benefits team if you&apos;re not sure.
          </p>
          <OptionGrid options={ROTH_401K_OPTIONS} selectedValue={canRoth} onChange={setCanRoth} />
        </div>

        <div>
          <label className="block text-lg sm:text-xl font-semibold text-primary-700 mb-3 text-center">
            Do you contribute to your 401(k) plan through your employer?
          </label>

          <OptionGrid options={CONTRIBUTES_OPTIONS} selectedValue={contributes} onChange={setContributes} />

          {contributes === true && (
            <div className="mt-6 animate-fadeIn">
              <PercentOrDollarInput
                label="How much are you contributing?"
                value={userContribution}
                onChange={setUserContribution}
                journeyData={journeyData}
                placeholderPercent="e.g. 9"
                placeholderDollar="e.g. 200"
              />
            </div>
          )}

          {contributes === true && canRoth === true && (
            <div className="mt-6 animate-fadeIn">
              <label className="block text-lg sm:text-xl font-semibold text-primary-700 mb-3 text-center">
                Is that contribution going in as Roth or traditional?
              </label>
              <OptionGrid options={CONTRIBUTING_ROTH_OPTIONS} selectedValue={contributingRoth} onChange={setContributingRoth} />
            </div>
          )}
        </div>

        <StepNavigation
          onBack={prevStep}
          onNext={handleNext}
          canGoNext={
            hasMatch !== null && (hasMatch === false || hasEnteredMatch)
            && contributes !== null && (contributes === false || userContribution !== '')
            && (hasMatch === true || futureMatch !== null)
            && canRoth !== null
            && (!(contributes === true && canRoth === true) || contributingRoth !== null)
          }
          isExiting={isExiting}
          className="mt-0"
        />
      </div>
    </StepContainer>
  )
}

export default Has401kMatch
