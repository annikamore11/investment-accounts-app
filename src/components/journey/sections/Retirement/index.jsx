// sections/Retirement/index.jsx
import Employer401kFollowup from './401k'
import RetirementIntro from './OpeningPage'
import Has401KMatch from './Has401kMatch'
import RetirementOutcomes from './Outcome'
import RothIRAInfo from './RothIRAInfo'
import RetirementOutcomesContinued from './OutcomeContinued'
import IncreaseContributionPrompt from './IncreaseContributionPrompt'
import RetirementOptionsPage from './FurtherContributionOptions'

export const retirementConfig = {
  id: 'retirement',
  title: 'Retirement Accounts',
  multipleSteps: true,

  subSections: [
    { id: '401k', title: '401(k)', component: Has401KMatch },
    { id: 'roth', title: 'Roth IRA', component: RothIRAInfo }
  ],

  // Custom step names for the sidebar dropdown
  getStepNames: (journeyData) => {
    const names = ['Introduction']

    // 401k followup always shows
    names.push('401(k) Status')

    // Only show match step if they have a 401k
    if (journeyData.hasEmployer401k === true) {
      names.push('401(k) Match Details')
      names.push('Contribution Summary')
      names.push('401(k) Best Practices')
      names.push('Increase Contributions?')

      // If they want to increase, show options
      if (journeyData.wantsToIncreaseContribution === true) {
        names.push('Savings Options')
      }
    }

    // Show IRA if they don't have 401k or if they chose to open IRA
    if (journeyData.openIRA === true || journeyData.wantstoopenIRA === true) {
      names.push('Roth IRA Info')
    }

    return names
  },

  // Define which steps show based on previous journey data
  getSteps: (journeyData) => {
    const steps = []

    //  Opening page always shows
    steps.push(RetirementIntro)

    //  401k followup MUST ALWAYS EXIST or navigation breaks
    steps.push(Employer401kFollowup)

    //  Only show match step if they actually HAVE a 401k
    if (journeyData.hasEmployer401k === true) {
      steps.push(Has401KMatch)
      steps.push(RetirementOutcomes)
      steps.push(RetirementOutcomesContinued)
      steps.push(IncreaseContributionPrompt)

      // Only show the options page if they clicked YES
      if (journeyData.wantsToIncreaseContribution === true) {
        steps.push(RetirementOptionsPage)
      }
    }

    // Show IRA if they don't have 401k or if they chose to open IRA
    if (journeyData.openIRA === true || journeyData.wantstoopenIRA === true) {
      steps.push(RothIRAInfo)
    }

    return steps
  },

  // Optional validation logic
  canComplete: (journeyData) => {
    // Section complete if they've either confirmed match status
    // or acknowledged proceeding to open an account
    if (journeyData.hasEmployer401k === true) {
      return journeyData.hasEmployerMatch !== undefined
    }

    if (journeyData.hasEmployer401k === false) {
      return journeyData.readyForBrokerageSetup === true
    }

    return false
  },
}

// Keep array export for backward compatibility if needed
export const retirementSteps = [
    RetirementIntro,
    Employer401kFollowup,
    Has401KMatch,
    RetirementOutcomes,
    RetirementOutcomesContinued,
    IncreaseContributionPrompt
]
