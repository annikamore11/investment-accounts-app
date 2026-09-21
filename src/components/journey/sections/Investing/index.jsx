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

  getSteps: (journeyData) => [
    { name: 'Introduction', Component: InvestingIntro },
    { name: 'Select Goal', Component: GoalSelection },
    { name: 'Risk Tolerance', Component: RiskTolerance },
    { name: 'Investment Method', Component: InvestmentMethodSelection },
    ...(journeyData.investmentMethod === 'managed'
      ? [{ name: 'Fidelity Go', Component: FidelityGoExplanation }]
      : []),
    ...(journeyData.investmentMethod === 'self-directed'
      ? [{ name: 'Investment Education', Component: InvestmentStrategyEducation }]
      : []),
    { name: 'Brokerage Account', Component: BrokerageAccountCheck },
  ],
}
