'use client'

import { Check, ArrowRight } from 'lucide-react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import InfoBox from '@/components/ui/InfoBox'
import useStepTransition from '@/hooks/useStepTransition'
import RothIn401kSetupGuide from './RothIn401kSetupGuide'
import {
  RETIREMENT_GOAL_PERCENT,
  getContributionSummary,
  getCombinedSavingsRate,
  getAdditionalSavingsItem,
  getSetupOptions,
  getMonthlyDollarsForPercent,
  getAffordabilityNote,
} from '@/utils/retirementMath'

const EMPLOYMENT_LABELS = {
  'self-employed': 'self employed',
  'employed-company': 'employed at a company',
  'unemployed': 'not employed',
}

// Computed, not asked — the whole point of this screen is that the order and
// content of "what to do next" follows directly from numbers already on
// file, instead of presenting a generic comparison and asking the user to
// self-diagnose which option applies to them.
const buildPlanItems = (journeyData) => {
  const hasEmployer401k = journeyData.hasEmployer401k === true

  // getAdditionalSavingsItem already accounts for an outside retirement
  // account (asked regardless of whether there's a 401(k)) and for
  // canContributeRothIn401k being null when there's no 401(k) to ask
  // about, so it's the whole plan in this case.
  if (!hasEmployer401k) {
    return [getAdditionalSavingsItem(journeyData)]
  }

  const { user, company, missingMatch } = getContributionSummary(journeyData)
  const items = []
  // A 0% match isn't "you got your full match" — there's simply no match to
  // chase, so skip straight to the savings item instead of manufacturing a
  // checklist entry for something that doesn't apply.
  const hasMatchToChase = company > 0

  if (hasMatchToChase) {
    const deltaPercent = company - user
    const { deltaDollars, exceedsLeftover } = getAffordabilityNote(journeyData, deltaPercent)
    const affordabilityAddOn = exceedsLeftover
      ? " That's more than your current monthly leftover — even working up to it gradually still beats leaving free money on the table."
      : ''

    items.push(
      missingMatch
        ? {
            severity: 'urgent',
            title: `Increase your 401(k) to ${company}%`,
            detail: `You're contributing ${user}%, but your employer matches up to ${company}%. Getting to ${company}% captures the full match — that's ${deltaPercent.toFixed(0)}% of your salary (about $${deltaDollars.toLocaleString()}/month) in free money you're currently leaving on the table.${affordabilityAddOn}`,
          }
        : {
            severity: 'done',
            title: `You're getting your full ${company}% employer match`,
            detail: `You're contributing ${user}%, which covers the entire match — nice work.`,
          }
    )
  } else if (journeyData.matchAfterTenure === true) {
    items.push({
      severity: 'action',
      title: 'A Match Is Coming',
      detail: "Your plan doesn't match right now, but it will once you hit the vesting mark — once that kicks in, prioritize contributing at least up to that match to capture the free money.",
    })
  }

  items.push(getAdditionalSavingsItem(journeyData))

  return items
}

const SEVERITY_STYLES = {
  done: 'bg-accent-green-100 text-accent-green-700',
  action: 'bg-amber-100 text-amber-800',
  urgent: 'bg-rust-100 text-rust-800',
}

const PlanItem = ({ item, index }) => (
  <li className="flex items-start gap-4">
    <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${SEVERITY_STYLES[item.severity]}`}>
      {item.severity === 'done' ? <Check className="w-4 h-4" strokeWidth={3} /> : index + 1}
    </span>
    <div>
      <p className="font-semibold text-primary-900">{item.title}</p>
      <p className="text-sm text-primary-700 mt-1 leading-relaxed">{item.detail}</p>
    </div>
  </li>
)

const StatCard = ({ label, value, highlight, subCaption, dollarCaption }) => (
  <div className={`p-4 rounded-xl border-2 ${highlight ? 'bg-rust-50 border-rust-300' : 'bg-primary-50 border-primary-300'}`}>
    <p className="text-sm text-primary-600">{label}</p>
    <p className={`text-2xl font-bold ${highlight ? 'text-rust-900' : 'text-primary-900'}`}>{value}%</p>
    {dollarCaption && <p className="text-xs text-primary-500 mt-0.5">{dollarCaption}</p>}
    {subCaption && <p className="text-xs text-rust-700 font-semibold mt-0.5">{subCaption}</p>}
  </div>
)

// Tailwind needs the full class name literally in source to generate it —
// can't interpolate `md:grid-cols-${n}`.
const STAT_GRID_COLS = { 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' }

const RetirementPlan = ({ journeyData, nextStep, prevStep, goToSection, getStepIndexInSection }) => {
  const { isExiting, transitionTo } = useStepTransition()
  const hasEmployer401k = journeyData.hasEmployer401k === true
  const { user, company, capturedMatch, missingMatch } = getContributionSummary(journeyData)
  const { total401k, otherPercent, combinedTotal } = getCombinedSavingsRate(journeyData)
  const planItems = buildPlanItems(journeyData)
  const pct = (n) => `${(Math.min(n, RETIREMENT_GOAL_PERCENT) / RETIREMENT_GOAL_PERCENT) * 100}%`

  // Only surface a setup option when there's actually something left to set
  // up — not just because the account type exists on paper.
  const { showRoth401kSetup } = getSetupOptions(journeyData)
  const goToRoth401kSetup = () => goToSection('retirement', getStepIndexInSection('retirement', RothIn401kSetupGuide))

  // Dollar figures alongside each percent — see getMonthlyDollarsForPercent
  // for why these are approximated against take-home pay, not gross salary.
  const dollarsFor = (percent) => `$${getMonthlyDollarsForPercent(journeyData, percent).toLocaleString()}/mo`

  const statCards = [
    { label: 'Your Contribution', value: user, highlight: missingMatch, dollarCaption: dollarsFor(user) },
    // A match has to be triggered by your own contribution — showing the
    // full offered rate without flagging what isn't captured yet would
    // make "Combined Total" look like it includes free money that isn't
    // actually landing in the account.
    {
      label: 'Employer Match',
      value: company,
      highlight: missingMatch,
      dollarCaption: dollarsFor(company),
      subCaption: missingMatch ? `${company - capturedMatch}% left on the table` : undefined,
    },
    ...(otherPercent > 0 ? [{ label: 'Outside Accounts', value: otherPercent, dollarCaption: dollarsFor(otherPercent) }] : []),
    { label: 'Combined Total', value: combinedTotal, dollarCaption: dollarsFor(combinedTotal) },
  ]

  return (
    <StepContainer
      title="Your Retirement Plan"
      subtitle={hasEmployer401k
        ? "Here's exactly what to do next, based on your numbers"
        : "Here's where to start, based on your situation"}
      isExiting={isExiting}
    >
      {!hasEmployer401k && (
        <InfoBox
          type="info"
          message={`You indicated that you're ${EMPLOYMENT_LABELS[journeyData.employment] || journeyData.employment} and don't have a 401(k) — that's okay, here's where to start instead.`}
        />
      )}

      {hasEmployer401k && (
        <>
          <div className={`grid grid-cols-1 ${STAT_GRID_COLS[statCards.length]} gap-4 text-center mb-2`}>
            {statCards.map((card) => <StatCard key={card.label} {...card} />)}
          </div>
          <p className="text-xs text-primary-500 text-center mb-6">
            Dollar amounts are estimated from your take-home pay, not gross salary.
          </p>

          <div className="space-y-1 mb-8">
            <div className="flex justify-between text-sm font-semibold text-primary-600">
              <span>Progress Toward {RETIREMENT_GOAL_PERCENT}% Goal</span>
              <span>{combinedTotal}% / {RETIREMENT_GOAL_PERCENT}%</span>
            </div>
            <div className="relative h-3 w-full bg-primary-300 rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-accent-green-300 opacity-70" style={{ width: pct(combinedTotal) }} />
              <div className="absolute top-0 left-0 h-full bg-accent-green-500" style={{ width: pct(total401k) }} />
              <div className="absolute top-0 left-0 h-full bg-accent-green-800" style={{ width: pct(user) }} />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-primary-600 leading-tight">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent-green-800 rounded-sm" />
                <span>Your 401(k)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent-green-500 rounded-sm" />
                <span>Employer Match</span>
              </div>
              {otherPercent > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent-green-300 rounded-sm opacity-70" />
                  <span>Outside Accounts</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <ul className="space-y-5 mb-8">
        {planItems.map((item, index) => (
          <PlanItem key={item.title} item={item} index={index} />
        ))}
      </ul>

      {showRoth401kSetup && (
        <>
          <h2 className="text-lg sm:text-xl font-bold text-primary-700 mb-4">Set Up Your Accounts</h2>
          <div className="grid grid-cols-1 gap-4 mb-6">
            <button
              onClick={goToRoth401kSetup}
              className="text-left bg-white rounded-xl p-4 shadow-sm border-2 border-primary-200 hover:border-accent-green-500 transition-colors"
            >
              <p className="font-bold text-accent-green-700 text-base flex items-center gap-1.5">
                Set Up Roth in Your 401(k) <ArrowRight className="w-3.5 h-3.5" />
              </p>
              <p className="text-sm text-primary-700 mt-2">
                Turn on Roth contributions and choose how to invest them.
              </p>
            </button>
          </div>
        </>
      )}

      <StepNavigation
        onBack={prevStep}
        onNext={() => transitionTo(nextStep)}
        isExiting={isExiting}
        nextLabel="Continue →"
      />
    </StepContainer>
  )
}

export default RetirementPlan
