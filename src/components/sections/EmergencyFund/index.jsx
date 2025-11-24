// sections/AboutYou/index.js
// sections/EmergencyFund/index.jsx

import EmergencyFundIntro from './EmergencyFundIntro'
import EmergencyFundAmount from './EmergencyFundAmount'
import SelectEmergencyAmount from './SelectEmergencyAmount'
import EmergencyFundSummary from './EmergencyFundSummary'
import EmergencyFundOptions from './EmergencyFundOptions'
import FidelitySetupGuide from './FidelitySetupGuide'

export const emergencyFundConfig = {
  id: 'emergencyFund',
  title: 'Emergency Fund',
  multipleSteps: true,
  
  getSteps: (journeyData) => {
    const steps = [
        EmergencyFundIntro,
        EmergencyFundAmount
    ]
    
    // Only show amount selection if they don't have emergency fund
    if (journeyData.hasEmergencyFund === false) {
      steps.push(SelectEmergencyAmount)
      steps.push(EmergencyFundOptions)
    

      if (journeyData.emergencyFundAccountType === 'bank' || journeyData.emergencyFundAccountType === 'other-broker') {
          steps.push(EmergencyFundSummary)
      } else {
          steps.push(FidelitySetupGuide)
      }
    }

    steps.push(EmergencyFundSummary)
    
    
    return steps
  },
  
  canComplete: (journeyData) => {
    // Must answer if they have emergency fund
    if (journeyData.hasEmergencyFund === null) return false
    
    // If they don't have one, must set a goal
    if (journeyData.hasEmergencyFund === false && !journeyData.emergencyFundGoal) {
      return false
    }
    
    return true
  },
  
  onComplete: null
}