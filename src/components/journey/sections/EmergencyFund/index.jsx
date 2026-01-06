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

  getStepNames: (journeyData) => {
    const names = ['Introduction', 'Common Guideline']

    // If they don't have an emergency fund, show goal and account selection
    if (journeyData.hasEmergencyFund === false) {
      names.push('Goal')
      names.push('Account Options')
      
      // Only show setup guide if they chose Fidelity cash management
      if (journeyData.emergencyFundAccountType === 'fidelity-cash-management') {
        names.push('Setup Guide')
      }
    }

    // Always show summary at the end
    names.push('Summary')

    return names
  },

  getSteps: (journeyData) => {
    const steps = [
      EmergencyFundIntro,
      EmergencyFundAmount
    ]
    
    // Only show amount selection and account options if they don't have emergency fund
    if (journeyData.hasEmergencyFund === false) {
      steps.push(SelectEmergencyAmount)
      steps.push(EmergencyFundOptions)
      
      
      steps.push(FidelitySetupGuide)
      
    }
    
    // Always show summary at the end
    steps.push(EmergencyFundSummary)
    
    return steps
  },
  
  canComplete: (journeyData) => {
    // Must answer if they have emergency fund
    if (journeyData.hasEmergencyFund === null) return false
    
    // If they don't have one, must set a goal and account type
    if (journeyData.hasEmergencyFund === false) {
      if (!journeyData.emergencyFundGoal) return false
      if (!journeyData.emergencyFundAccountType) return false
    }
    
    return true
  },
  
  onComplete: null
}