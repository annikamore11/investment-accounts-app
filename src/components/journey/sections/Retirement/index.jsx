import RetirementIntro from './OpeningPage'
import Employer401kFollowup from './401k'
import Has401kMatch from './Has401kMatch'
import RetirementOutcomes from './Outcome'
import RetirementOutcomesContinued from './OutcomeContinued'
import IncreaseContributionPrompt from './IncreaseContributionPrompt'
import RetirementOptionsPage from './FurtherContributionOptions'
import RothIRAInfo from './RothIRAInfo'

export const retirementConfig = {
  id: 'retirement',
  title: 'Retirement Accounts',
  multipleSteps: true,

  getSteps: (journeyData) => [
    { name: 'Introduction', Component: RetirementIntro },
    { name: '401(k) Status', Component: Employer401kFollowup },
    ...(journeyData.hasEmployer401k === true
      ? [
          { name: '401(k) Match Details', Component: Has401kMatch },
          { name: 'Contribution Summary', Component: RetirementOutcomes },
          { name: '401(k) Best Practices', Component: RetirementOutcomesContinued },
          { name: 'Increase Contributions?', Component: IncreaseContributionPrompt },
          ...(journeyData.wantsToIncreaseContribution === true
            ? [{ name: 'Savings Options', Component: RetirementOptionsPage }]
            : []),
        ]
      : []),
    // Roth IRA for people without a 401(k), or who opted in from the options page
    ...(journeyData.openIRA === true || journeyData.wantstoopenIRA === true
      ? [{ name: 'Roth IRA Info', Component: RothIRAInfo }]
      : []),
  ],
}
