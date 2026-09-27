// Shared by the Retirement section's plan step so "what should this person do
// next" is computed once from their numbers, not re-derived per component.

import { getMonthlyIncome, getLeftover, getPaychecksPerMonth } from '@/utils/budgetMath'

export const RETIREMENT_GOAL_PERCENT = 15

// Every field that only makes sense once there's a 401(k) — cleared
// together whenever hasEmployer401k flips to false, so an answer from a
// previous "employed at a company" pass (match %, contribution %, Roth
// capability) can't keep feeding the recommendation after someone says
// they don't have a 401(k) anymore. Called from About/Employer401k.jsx and
// About/Employment.jsx, the two places that can set hasEmployer401k false.
export const clearEmployer401kFields = (updateJourneyData) => {
  updateJourneyData('companyMatch', '')
  updateJourneyData('userContribution', '')
  updateJourneyData('matchAfterTenure', null)
  updateJourneyData('canContributeRothIn401k', null)
  updateJourneyData('contributingRothIn401k', null)
}

// Dollar amounts throughout this file are approximated against take-home
// pay (getMonthlyIncome), not gross salary — the app never collects gross
// income (see budgetMath.js), and a real 401(k) contribution % is set
// against gross. Treat these as directional, not exact paycheck math.
//
// One correction is worth making, though: if the 401(k) contribution is
// already subtracted out before the paycheck amount we asked for (see
// retirementDeductedFromPaycheck, asked in Income.jsx), that take-home
// figure is net of the very contribution we're about to compute a % or $
// against — applying the % again would be measuring against an
// already-shrunk base. Gross it back up using the contribution % already
// on file so the conversion is self-consistent.
export const getSalaryBaseForConversion = (journeyData) => {
  const takeHome = getMonthlyIncome(journeyData)
  if (journeyData.retirementDeductedFromPaycheck !== true) return takeHome

  const currentPercent = Number(journeyData.userContribution) || 0
  if (currentPercent <= 0 || currentPercent >= 100) return takeHome
  return takeHome / (1 - currentPercent / 100)
}

export const getMonthlyDollarsForPercent = (journeyData, percent) =>
  Math.round(getSalaryBaseForConversion(journeyData) * (percent / 100))

// Inverse of the above — lets an input accept a raw dollar amount and
// store it back as the canonical percent the rest of this file works in.
export const getPercentForMonthlyDollars = (journeyData, dollars) => {
  const base = getSalaryBaseForConversion(journeyData)
  return base > 0 ? (dollars / base) * 100 : 0
}

// 401(k)/Roth IRA elections are set per paycheck, not monthly — with
// biweekly or semimonthly pay, "monthly" is an average nobody actually
// sees on a pay stub. These convert to/from the same per-paycheck figure
// someone would type into their plan's contribution election.
export const getPerPaycheckDollarsForPercent = (journeyData, percent) =>
  Math.round(getMonthlyDollarsForPercent(journeyData, percent) / getPaychecksPerMonth(journeyData))

export const getPercentForPerPaycheckDollars = (journeyData, dollarsPerPaycheck) =>
  getPercentForMonthlyDollars(journeyData, dollarsPerPaycheck * getPaychecksPerMonth(journeyData))

// Whether bridging a percent gap (e.g. increasing a 401(k) contribution)
// costs more per month than the person currently has left over after
// expenses — the one place a recommendation needs checking against
// affordability, not just correctness.
export const getAffordabilityNote = (journeyData, deltaPercent) => {
  const deltaDollars = getMonthlyDollarsForPercent(journeyData, deltaPercent)
  return { deltaDollars, exceedsLeftover: deltaDollars > getLeftover(journeyData) }
}

// 2026 IRS limit for someone under 50 (https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500).
// The 50+ catch-up limit is $8,600, but age is only collected as a bucket
// ('46+' etc, see About/AgeRange.jsx) — not precise enough to tell 46 from
// 55, so this flat limit is used for everyone rather than guessing.
export const ROTH_IRA_ANNUAL_LIMIT = 7500

export const getContributionSummary = (journeyData) => {
  // Authoritative guard, not just a courtesy at write time — these fields
  // only mean anything when there's a 401(k), and treating a stale
  // leftover value (e.g. from a previous "employed at a company" answer
  // before switching to self-employed) as real would silently corrupt
  // every downstream total. clearEmployer401kFields resets them going
  // forward; this makes existing saved data self-correct too.
  const hasEmployer401k = journeyData.hasEmployer401k === true
  const user = hasEmployer401k ? (Number(journeyData.userContribution) || 0) : 0
  const company = hasEmployer401k ? (Number(journeyData.companyMatch) || 0) : 0
  // A match has to be triggered by your own contribution — contributing
  // 0% means capturing 0% of it, not the full offered rate. `company`
  // stays the max on offer (used for "increase to X%" messaging and the
  // Employer Match stat), while `capturedMatch` is what's actually being
  // received right now, which is what totals/goals should be built on.
  const capturedMatch = Math.min(user, company)
  const total = user + capturedMatch

  return {
    user,
    company,
    capturedMatch,
    total,
    missingMatch: user < company,
  }
}

export const getOtherAccountPercent = (journeyData) => (
  journeyData.contributesToOtherRetirementAccount === true
    ? Number(journeyData.otherRetirementAccountPercent) || 0
    : 0
)

// The 15% goal is across every retirement account, not the 401(k) alone —
// someone maxing a Roth IRA outside of work shouldn't be told they're
// behind just because their 401(k) contribution alone is low.
export const getCombinedSavingsRate = (journeyData) => {
  const { total: total401k } = getContributionSummary(journeyData)
  const otherPercent = getOtherAccountPercent(journeyData)
  const combinedTotal = total401k + otherPercent

  return {
    total401k,
    otherPercent,
    combinedTotal,
    belowGoal: combinedTotal < RETIREMENT_GOAL_PERCENT,
  }
}

// Self-reported (see OtherRetirementAccountCheck.jsx) rather than computed
// from income — more reliable than approximating gross salary from
// take-home pay, and sidesteps not knowing whether someone qualifies for
// the 50+ catch-up limit ($8,600 instead of $7,500).
export const isRothIRAMaxed = (journeyData) => (
  journeyData.contributesToOtherRetirementAccount === true && journeyData.willMaxRothIRA === true
)

// The single "where should additional retirement savings go" recommendation
// — covers both what used to be a separate Roth-account item and a
// separate 15%-goal item, since they're really the same decision once the
// goal is computed across accounts. Used by RetirementPlan.jsx as the
// final item.
export const getAdditionalSavingsItem = (journeyData) => {
  const { user } = getContributionSummary(journeyData)
  const { combinedTotal, belowGoal } = getCombinedSavingsRate(journeyData)
  const hasOther = journeyData.contributesToOtherRetirementAccount === true
  // Same guard as getContributionSummary — canContributeRothIn401k is only
  // meaningful with an actual 401(k) behind it.
  const canRoth = journeyData.hasEmployer401k === true ? journeyData.canContributeRothIn401k : null
  const alreadyContributing401k = user > 0
  // Only call it "extra" or "beyond the match" when there's actually a
  // match (current or eventual) to be beyond — otherwise this is just
  // where their retirement savings should go, full stop, and saying
  // "beyond the match" would reference something that doesn't exist.
  const hasMatchContext = journeyData.hasEmployer401k === true
    && (Number(journeyData.companyMatch) > 0 || journeyData.matchAfterTenure === true)
  const savingsPhrase = hasMatchContext ? 'savings beyond the match' : 'your retirement savings'

  if (!belowGoal) {
    return {
      severity: 'done',
      title: `You're hitting the ${RETIREMENT_GOAL_PERCENT}% savings benchmark`,
      detail: canRoth === true
        ? `Between your accounts, you're at ${combinedTotal}% — right on track. Your 401(k) also supports Roth contributions, so you're welcome to consolidate future savings there, but no change needed.`
        : `Between your accounts, you're at ${combinedTotal}% — right on track.`,
    }
  }

  // Every branch below is still short of the goal, so every one of them
  // ends with the same real dollar figure for what closing that gap
  // actually costs per month — turns "aim for 15% combined" into a number
  // someone can check against their own budget.
  const gapDollars = getMonthlyDollarsForPercent(journeyData, RETIREMENT_GOAL_PERCENT - combinedTotal)
  const gapNote = ` That's about $${gapDollars.toLocaleString()}/month to fully close the gap to ${RETIREMENT_GOAL_PERCENT}%.`

  let item

  if (canRoth === true) {
    // Already contributing to a Roth IRA — affirm that instead of
    // redirecting away from it just because the 401(k) also offers Roth.
    // The 401(k) becomes an addition to reach 15%, not a replacement.
    if (hasOther && alreadyContributing401k) {
      // Already doing both — whether there's anything left to *tell* them
      // about the 401(k) portion depends on whether we actually know it's
      // Roth (contributingRothIn401k) or are just assuming, since canRoth
      // only confirms the plan supports it, not that their contribution
      // is designated that way.
      const alreadyRothIn401k = journeyData.contributingRothIn401k === true
      item = {
        severity: 'action',
        title: "You're Contributing to Both Accounts",
        detail: alreadyRothIn401k
          ? (hasMatchContext
              ? `You're already contributing to your Roth IRA and Roth money in your 401(k) — keep working toward ${RETIREMENT_GOAL_PERCENT}% combined, beyond the match.`
              : `You're already contributing to your Roth IRA and Roth money in your 401(k) — keep working toward ${RETIREMENT_GOAL_PERCENT}% combined.`)
          : (hasMatchContext
              ? `You're already contributing to your Roth IRA and your 401(k) — just make sure that 401(k) money is going in as Roth, since your plan supports it. Keep working toward ${RETIREMENT_GOAL_PERCENT}% combined, beyond the match.`
              : `You're already contributing to your Roth IRA and your 401(k) — just make sure that 401(k) money is going in as Roth, since your plan supports it. Keep working toward ${RETIREMENT_GOAL_PERCENT}% combined.`),
      }
    } else if (hasOther) {
      // Roth is available in both places, so this isn't "stick with the
      // IRA" — it's genuinely either/or (or a mix). Leading with "keep
      // contributing to your Roth IRA" would wrongly read as the primary
      // recommendation with the 401(k) as an afterthought.
      item = {
        severity: 'action',
        title: 'Either Account Works From Here',
        detail: hasMatchContext
          ? `Once your match is covered, your 401(k) also lets you contribute Roth money — keep building your Roth IRA, start adding Roth savings to your 401(k), or split it between both. Whichever's easiest, aim for ${RETIREMENT_GOAL_PERCENT}% combined.`
          : `Your 401(k) also lets you contribute Roth money — keep building your Roth IRA, start adding Roth savings to your 401(k), or split it between both. Whichever's easiest, aim for ${RETIREMENT_GOAL_PERCENT}% combined.`,
      }
    } else {
      item = {
        severity: 'action',
        title: 'Put Extra Savings Into Your 401(k)',
        detail: `Your plan lets you contribute Roth money, so that's the simplest place for ${savingsPhrase} — same tax-free growth as a Roth IRA, one account, higher contribution limits. A separate Roth IRA is still worth considering if you'd like the flexibility. Aim for ${RETIREMENT_GOAL_PERCENT}% combined.`,
      }
    }
  } else if (isRothIRAMaxed(journeyData)) {
    item = {
      severity: 'action',
      title: 'Add the Rest to Your 401(k)',
      detail: hasMatchContext
        ? `You're maxing out your Roth IRA this year, so any additional retirement savings beyond the match needs to go into your 401(k) to keep working toward ${RETIREMENT_GOAL_PERCENT}%.`
        : `You're maxing out your Roth IRA this year, so any additional retirement savings needs to go into your 401(k) to keep working toward ${RETIREMENT_GOAL_PERCENT}%.`,
    }
  } else if (hasOther && alreadyContributing401k) {
    // Reaching here means the Roth IRA isn't maxed yet (that's handled
    // above) — since the 401(k) doesn't offer Roth, the IRA is still the
    // better tax deal, so it's worth prioritizing over the 401(k) rather
    // than just affirming both are already happening.
    item = {
      severity: 'action',
      title: 'Max Out Your Roth IRA First',
      detail: hasMatchContext
        ? `You're already contributing to both, but since your 401(k) doesn't offer Roth, prioritize maxing out your Roth IRA first for the better tax treatment. Once that's maxed, any extra beyond the match can go into your 401(k) to keep working toward ${RETIREMENT_GOAL_PERCENT}%.`
        : `You're already contributing to both, but since your 401(k) doesn't offer Roth, prioritize maxing out your Roth IRA first for the better tax treatment. Once that's maxed, any extra can go into your 401(k) to keep working toward ${RETIREMENT_GOAL_PERCENT}%.`,
    }
  } else {
    item = {
      severity: 'action',
      title: hasOther ? 'Keep Growing Your Roth IRA' : 'Open a Roth IRA',
      detail: `Your 401(k) doesn't offer Roth contributions, so a Roth IRA is the better tax deal for ${savingsPhrase} — work toward ${RETIREMENT_GOAL_PERCENT}% combined. Adding more straight to your 401(k) instead is a simpler fallback if you'd rather not manage a second account.`,
    }
  }

  return { ...item, detail: item.detail + gapNote }
}

// Which "Set Up Your Accounts" option cards are actually still useful — not
// just which accounts exist in the abstract, but whether there's still
// something to do. Showing a setup guide for an account someone's already
// contributing to isn't personalization, it's noise.
export const getSetupOptions = (journeyData) => ({
  // No dedicated non-Roth setup guide exists yet — only show this once
  // there's actually a 401(k) and the plan is confirmed to support Roth
  // contributions, and skip it once contributingRothIn401k confirms
  // they're already contributing Roth money — canContributeRothIn401k
  // alone only says the plan *can* accept Roth money, not that their
  // contribution actually is Roth.
  showRoth401kSetup: journeyData.hasEmployer401k === true
    && journeyData.canContributeRothIn401k === true
    && journeyData.contributingRothIn401k !== true,
})
