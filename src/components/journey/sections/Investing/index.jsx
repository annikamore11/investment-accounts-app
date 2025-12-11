// Investing section configuration
import InvestingIntro from './InvestingIntro'
import GoalSelection from './GoalSelection'
import TimeframeSelection from './TimeframeSelection'
import RiskTolerance from './RiskTolerance'
import InvestmentRecommendation from './InvestmentRecommendation'
import IndexFundSelection from './IndexFundSelection'

export const investingConfig = {
  id: 'investing',
  title: 'Non-Retirement Investing',
  multipleSteps: true,

  getSteps: (journeyData) => {
    const steps = [
      InvestingIntro,
      GoalSelection,
      TimeframeSelection,
      RiskTolerance,
      InvestmentRecommendation,
    ]

    // Add index fund selection step if they chose index investing
    if (journeyData.investingStrategy === 'index') {
      steps.push(IndexFundSelection)
    }

    return steps
  },

  getStepNames: (journeyData) => {
    const names = [
      'Introduction',
      'Select Goal',
      'Timeframe',
      'Risk Tolerance',
      'Recommendation',
    ]

    if (journeyData.investingStrategy === 'index') {
      names.push('Choose Index Fund')
    }

    return names
  }
}
