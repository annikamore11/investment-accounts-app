import RetirementIntro from './OpeningPage'
import OtherRetirementAccountCheck from './OtherRetirementAccountCheck'
import Has401kMatch from './Has401kMatch'
import RothIn401kSetupGuide from './RothIn401kSetupGuide'
import RetirementPlan from './RetirementPlan'
import RetirementInstitutionsCheck from './RetirementInstitutionsCheck'
import RothIraTransferGuide from './RothIraTransferGuide'

export const retirementConfig = {
  id: 'retirement',
  title: 'Retirement Accounts',
  multipleSteps: true,

  getSteps: (journeyData) => [
    { name: 'Introduction', Component: RetirementIntro },
    // Asked for everyone, 401(k) or not — the 15% savings goal is
    // computed across all retirement accounts combined, so whether
    // they're already saving in a Roth IRA elsewhere shapes the whole
    // recommendation, not just a 401(k)-specific tiebreaker.
    { name: 'Other Retirement Savings', Component: OtherRetirementAccountCheck },
    // hasEmployer401k is already known from the About section. This one
    // page now covers current match, contribution, an eventual/vesting
    // match (only asked when there's no current one), and whether the
    // plan supports Roth — everything the recommendation needs, instead
    // of a chain of separate yes/no pages.
    ...(journeyData.hasEmployer401k === true
      ? [{ name: '401(k) Details', Component: Has401kMatch }]
      : []),
    // The very next step is the recommendation — see RetirementPlan.jsx.
    { name: 'Your Retirement Plan', Component: RetirementPlan },
    // Only meaningful once there's at least one account to ask about —
    // nothing to ask if there's neither a 401(k) nor an outside Roth IRA.
    ...(journeyData.hasEmployer401k === true || journeyData.contributesToOtherRetirementAccount === true
      ? [{ name: 'Your Accounts', Component: RetirementInstitutionsCheck }]
      : []),
    // Only reachable once they've said yes to moving their Roth IRA — see
    // RetirementInstitutionsCheck.jsx for the eligibility check (Roth IRA
    // not already at Fidelity, emergency fund already there).
    ...(journeyData.moveRothIraToFidelity === true
      ? [{ name: 'Transfer Your Roth IRA', Component: RothIraTransferGuide }]
      : []),
    // Only reachable from the plan onward, once it's actually recommended
    // — not a prerequisite to seeing the recommendation itself. Skipped
    // once contributingRothIn401k confirms they're already contributing
    // Roth money — the plan supporting Roth isn't reason enough to show a
    // "turn this on" guide for something already on.
    ...(journeyData.hasEmployer401k === true
      && journeyData.canContributeRothIn401k === true
      && journeyData.contributingRothIn401k !== true
      ? [{ name: 'Set Up Roth 401(k)', Component: RothIn401kSetupGuide }]
      : []),
  ],
}
