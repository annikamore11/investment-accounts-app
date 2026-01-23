// Investing section configuration
import InvestingIntro from './InvestingIntro'
import GoalSelection from './GoalSelection'
import RiskTolerance from './RiskTolerance'
import InvestmentMethodSelection from './InvestmentMethodSelection'
import FidelityGoExplanation from './FidelityGoExplanation'
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

    // If they chose managed (Fidelity Go), show the explanation
    if (journeyData.investmentMethod === 'managed') {
      steps.push(FidelityGoExplanation)
    }

    // If they chose self-directed, show the investment education
    if (journeyData.investmentMethod === 'self-directed') {
      steps.push(InvestmentStrategyEducation)
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

    // If they chose managed (Fidelity Go), show the explanation step
    if (journeyData.investmentMethod === 'managed') {
      names.push('Fidelity Go')
    }

    // If they chose self-directed, show the investment education step
    if (journeyData.investmentMethod === 'self-directed') {
      names.push('Investment Education')
    }

    // Always end with brokerage account check
    names.push('Brokerage Account')

    return names
  }
}
