// Investing section configuration
import InvestingIntro from './InvestingIntro'
import GoalSelection from './GoalSelection'
import RiskTolerance from './RiskTolerance'
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
      InvestmentStrategyEducation,
      BrokerageAccountCheck
    ]


    return steps
  },

  getStepNames: (journeyData) => {
    const names = [
      'Introduction',
      'Select Goal',
      'Risk Tolerance',
      'Investment Education',
      'Brokerage Account Check'
    ]


    return names
  }
}
