// sections/Retirement/index.jsx
import Employer401kFollowup from './401k'
import RetirementIntro from './OpeningPage'
import Has401KMatch from './Has401kMatch'

export const retirementConfig = {
  id: 'retirement',
  title: 'Retirement Accounts',
  multipleSteps: true,

  // Define which steps show based on previous journey data
  getSteps: (journeyData) => {
    const steps = []

    //Opening Page 
    steps.push(RetirementIntro)

    // Only show this section if the user answered the 401k question earlier
    if (journeyData.hasEmployer401k !== null) {
      steps.push(Employer401kFollowup)
      if (journeyData.hasEmployerMatch === true) {
        steps.push(Has401KMatch)
      }
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
    Has401KMatch
]
