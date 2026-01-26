// Investing section configuration
import InvestingIntro from './InvestingIntro'
import GoalSelection from './GoalSelection'
import RiskTolerance from './RiskTolerance'
import InvestmentMethodSelection from './InvestmentMethodSelection'
import FidelityGoExplanation from './FidelityGoExplanation'
import FidelityAccountPrompt from './FidelityAccountPrompt'
import InvestmentSummary from './InvestmentSummary'
import GeneralRecommendations from './GeneralRecommendations'
import FidelitySetupGuide from '../EmergencyFund/FidelitySetupGuide'
import InvestmentStrategyEducation from './InvestmentStrategyEducation'
import BrokerageAccountCheck from './BrokerageAccountCheck'

export const investingConfig = {
  id: 'investing',
  title: 'Non-Retirement Investing',
  multipleSteps: true,

  getSteps: (journeyData) => {
    const steps = [
      InvestingIntro,
      GoalSelection,
      RiskTolerance,
      InvestmentMethodSelection
    ]

    // If they chose self-directed, show the investment education
    if (journeyData.investmentMethod === 'self-directed') {
      steps.push(InvestmentStrategyEducation)
    }

    // If they chose managed (Fidelity Go), handle the Fidelity account flow
    if (journeyData.investmentMethod === 'managed') {
      steps.push(FidelityGoExplanation)

      // Check if they use Fidelity for emergency fund
      const usesFidelity =
        (journeyData.emergencyFundInstitution && journeyData.emergencyFundInstitution.toLowerCase().includes('fidelity')) ||
        (journeyData.existingEmergencyFundInstitution && journeyData.existingEmergencyFundInstitution.toLowerCase().includes('fidelity'))

      if (usesFidelity) {
        // Already uses Fidelity - show summary page
        steps.push(InvestmentSummary)
      } else {
        // Doesn't use Fidelity - ask if they want to open account
        steps.push(FidelityAccountPrompt)

        // Based on their choice, show appropriate next step
        if (journeyData.wantsFidelityAccount === 'yes') {
          steps.push(FidelitySetupGuide)
          steps.push(InvestmentSummary) // Then show summary after setup
        } else if (journeyData.wantsFidelityAccount === 'no') {
          steps.push(GeneralRecommendations)
        }
      }
    }

    // Always end with brokerage account check
    steps.push(BrokerageAccountCheck)

    return steps
  },

  getStepNames: (journeyData) => {
    const names = [
      'Introduction',
      'Select Goal',
      'Risk Tolerance',
      'Investment Method'
    ]

    // If they chose self-directed, show the investment education step
    if (journeyData.investmentMethod === 'self-directed') {
      names.push('Investment Education')
    }

    // If they chose managed (Fidelity Go), handle the Fidelity account flow
    if (journeyData.investmentMethod === 'managed') {
      names.push('Fidelity Go')

      // Check if they use Fidelity for emergency fund
      const usesFidelity =
        (journeyData.emergencyFundInstitution && journeyData.emergencyFundInstitution.toLowerCase().includes('fidelity')) ||
        (journeyData.existingEmergencyFundInstitution && journeyData.existingEmergencyFundInstitution.toLowerCase().includes('fidelity'))

      if (usesFidelity) {
        names.push('Investment Summary')
      } else {
        names.push('Fidelity Account')

        if (journeyData.wantsFidelityAccount === 'yes') {
          names.push('Fidelity Setup')
          names.push('Investment Summary')
        } else if (journeyData.wantsFidelityAccount === 'no') {
          names.push('Recommendations')
        }
      }
    }

    // Always end with brokerage account check
    names.push('Brokerage Account')

    return names
  }
}
