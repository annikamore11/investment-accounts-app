import React from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'
import { TrendingUp, PiggyBank, Shield, BarChart3, Clock, AlertTriangle } from 'lucide-react'

// Fund data with Fidelity research links
const FUNDS = {
  SPAXX: {
    name: 'SPAXX',
    fullName: 'Fidelity Government Money Market Fund',
    description: 'Money market fund - keeps your money safe while earning interest',
    riskLevel: 'safe',
    stockPercent: 0,
    url: 'https://fundresearch.fidelity.com/mutual-funds/summary/31617H102'
  },
  FASIX: {
    name: 'FASIX',
    fullName: 'Fidelity Asset Manager 20%',
    description: '20% stocks, 80% bonds/short-term investments',
    riskLevel: 'blended',
    stockPercent: 20,
    url: 'https://fundresearch.fidelity.com/mutual-funds/summary/315912105'
  },
  FTANX: {
    name: 'FTANX',
    fullName: 'Fidelity Asset Manager 30%',
    description: '30% stocks, 70% bonds/short-term investments',
    riskLevel: 'blended',
    stockPercent: 30,
    url: 'https://fundresearch.fidelity.com/mutual-funds/summary/315912402'
  },
  FFANX: {
    name: 'FFANX',
    fullName: 'Fidelity Asset Manager 40%',
    description: '40% stocks, 60% bonds/short-term investments',
    riskLevel: 'blended',
    stockPercent: 40,
    url: 'https://fundresearch.fidelity.com/mutual-funds/summary/315912501'
  },
  FASMX: {
    name: 'FASMX',
    fullName: 'Fidelity Asset Manager 50%',
    description: '50% stocks, 50% bonds/short-term investments',
    riskLevel: 'blended',
    stockPercent: 50,
    url: 'https://fundresearch.fidelity.com/mutual-funds/summary/315912204'
  },
  FSANX: {
    name: 'FSANX',
    fullName: 'Fidelity Asset Manager 60%',
    description: '60% stocks, 40% bonds/short-term investments',
    riskLevel: 'blended',
    stockPercent: 60,
    url: 'https://fundresearch.fidelity.com/mutual-funds/summary/315912600'
  },
  FASGX: {
    name: 'FASGX',
    fullName: 'Fidelity Asset Manager 70%',
    description: '70% stocks, 30% bonds/short-term investments',
    riskLevel: 'blended',
    stockPercent: 70,
    url: 'https://fundresearch.fidelity.com/mutual-funds/summary/315912303'
  },
  FAMRX: {
    name: 'FAMRX',
    fullName: 'Fidelity Asset Manager 85%',
    description: '85% stocks, 15% bonds/short-term investments',
    riskLevel: 'blended',
    stockPercent: 85,
    url: 'https://fundresearch.fidelity.com/mutual-funds/summary/315912709'
  },
  FSKAX: {
    name: 'FSKAX',
    fullName: 'Fidelity Total Market Index Fund',
    description: 'Tracks the entire US stock market',
    riskLevel: 'stocks',
    stockPercent: 100,
    url: 'https://fundresearch.fidelity.com/mutual-funds/summary/315911693'
  },
  FXAIX: {
    name: 'FXAIX',
    fullName: 'Fidelity 500 Index Fund',
    description: 'Tracks the S&P 500 (500 largest US companies)',
    riskLevel: 'stocks',
    stockPercent: 100,
    url: 'https://fundresearch.fidelity.com/mutual-funds/summary/315911750'
  }
}

// Get recommended funds based on risk tolerance and timeline
const getRecommendedFunds = (riskTolerance, timelineCategory) => {
  // Short timeline (1-2 years) - always SPAXX regardless of risk tolerance
  if (timelineCategory === 'short') {
    return {
      primary: [FUNDS.SPAXX],
      explanation: 'With a short timeline of 1-2 years, we recommend keeping your money safe in a money market fund. The stock market can be volatile in the short term, and you need this money soon.'
    }
  }

  // Long timeline (3+ years) - depends on risk tolerance
  if (riskTolerance === 1) {
    return {
      primary: [FUNDS.SPAXX],
      explanation: 'Based on your risk tolerance of 1, we recommend keeping your money in a safe money market fund, even with a longer timeline.'
    }
  }

  if (riskTolerance >= 2 && riskTolerance <= 3) {
    return {
      primary: [FUNDS.FASIX, FUNDS.FTANX, FUNDS.FFANX, FUNDS.FASMX],
      explanation: 'With a moderate-low risk tolerance (2-3) and a longer timeline, you can consider these blended funds that mix stocks with bonds for stability.'
    }
  }

  if (riskTolerance >= 4 && riskTolerance <= 6) {
    return {
      primary: [FUNDS.FFANX, FUNDS.FASMX, FUNDS.FSANX, FUNDS.FASGX],
      explanation: 'With a moderate risk tolerance (4-6) and a longer timeline, these blended funds offer a good balance of growth potential and stability.'
    }
  }

  // Risk tolerance 7-10
  return {
    primary: [FUNDS.FASGX, FUNDS.FAMRX],
    indexFunds: [FUNDS.FSKAX, FUNDS.FXAIX],
    explanation: 'With a high risk tolerance (7-10) and a longer timeline, you can consider more aggressive options including high-stock blended funds or pure index funds.'
  }
}

const InvestmentStrategyEducation = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, direction, transitionTo } = useStepTransition()
  const goal = journeyData.investingGoals?.[0] || {}
  const riskTolerance = journeyData.riskTolerance || 5

  const handleNext = () => {
    transitionTo(nextStep, 'forward')
  }

  const handleBack = () => {
    transitionTo(prevStep, 'backward')
  }

  const getTimelineCategory = (timeframe) => {
    if (!timeframe) return 'long'

    const normalized = timeframe.toLowerCase().trim()

    // Handle special values
    if (normalized === '<1') return 'short'
    if (normalized === 'none') return 'long'

    // Handle numeric values
    const num = parseInt(timeframe, 10)
    if (!isNaN(num)) {
      if (num <= 2) return 'short'
      return 'long'
    }

    return 'long'
  }

  const formatAmount = (amount) => {
    if (!amount) return ''
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const timelineCategory = getTimelineCategory(goal.timeframe)
  const recommendations = getRecommendedFunds(riskTolerance, timelineCategory)

  const renderFundCard = (fund, isIndexFund = false) => {
    const getRiskBadge = () => {
      if (fund.riskLevel === 'safe') {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            <Shield className="w-3 h-3" />
            Safe
          </span>
        )
      }
      if (fund.riskLevel === 'stocks') {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            <AlertTriangle className="w-3 h-3" />
            100% Stocks
          </span>
        )
      }
      // Blended
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          <BarChart3 className="w-3 h-3" />
          {fund.stockPercent}% Stocks
        </span>
      )
    }

    const getRiskExplanation = () => {
      if (fund.riskLevel === 'safe') {
        return 'This is a safe option. Your money earns interest without risk of losing principal.'
      }
      if (fund.riskLevel === 'stocks') {
        return 'This fund is 100% in stocks. It will give you a high chance for growth, but it is risky.'
      }
      // Blended
      return `${fund.stockPercent}% stock means ${fund.stockPercent}% risky, ${100 - fund.stockPercent}% safe. The stock portion has growth potential but can lose value, while the bond portion provides stability.`
    }

    return (
      <div key={fund.name} className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-primary-300 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="text-lg font-bold text-gray-900">{fund.name}</h4>
            <p className="text-sm text-gray-600">{fund.fullName}</p>
          </div>
          {getRiskBadge()}
        </div>

        <p className="text-gray-700 mb-3">{fund.description}</p>

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-700">{getRiskExplanation()}</p>
        </div>

        {fund.stockPercent > 0 && fund.stockPercent < 100 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Stocks ({fund.stockPercent}%)</span>
              <span>Bonds/Safe ({100 - fund.stockPercent}%)</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-orange-500 to-accent-orange-400"
                style={{ width: `${fund.stockPercent}%` }}
              />
            </div>
          </div>
        )}

        <a
          href={fund.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center text-sm px-4 py-2.5 bg-accent-green-600 text-white rounded-lg hover:bg-accent-green-700 transition-colors font-medium"
        >
          View on Fidelity
        </a>
      </div>
    )
  }

  return (
    <StepContainer
      title="Here are a few options we think you should explore"
      subtitle="Based on your risk tolerance and timeline"
      isExiting={isExiting}
      direction={direction}
    >
      <div className="space-y-6">
        {/* Goal Summary */}
        <div className="bg-gradient-to-br from-accent-green-50 to-white border-2 border-accent-green-200 rounded-xl p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{goal.name || 'Your Goal'}</h3>
          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            {goal.amount && (
              <div className="flex items-center gap-2">
                <PiggyBank className="w-4 h-4 text-accent-green-700" />
                <span><strong>Target:</strong> {formatAmount(goal.amount)}</span>
              </div>
            )}
            {goal.timeframe && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent-green-700" />
                <span>
                  <strong>Timeline:</strong>{' '}
                  {goal.timeframe === 'none'
                    ? 'No specific timeline'
                    : goal.timeframe === '<1'
                      ? 'Less than 1 year'
                      : `${goal.timeframe} years`}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent-green-700" />
              <span><strong>Risk Tolerance:</strong> {riskTolerance}/10</span>
            </div>
          </div>
        </div>

        {/* Recommendation Context */}
        <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-5">
          <div className="flex gap-3">
            <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0 h-fit">
              {timelineCategory === 'short' || riskTolerance === 1 ? (
                <Shield className="w-5 h-5 text-primary-700" />
              ) : (
                <BarChart3 className="w-5 h-5 text-primary-700" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-primary-900 mb-1">Our Recommendation</h4>
              <p className="text-gray-700 text-sm">{recommendations.explanation}</p>
            </div>
          </div>
        </div>

        {/* Primary Fund Recommendations */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">
            {recommendations.indexFunds ? 'Blended Funds' : 'Recommended Funds'}
          </h3>

          {recommendations.primary.length === 1 && recommendations.primary[0].name === 'SPAXX' ? (
            // Special layout for SPAXX-only recommendation
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                  <Shield className="w-8 h-8 text-green-700" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-1">SPAXX</h4>
                  <p className="text-gray-600 mb-3">Fidelity Government Money Market Fund</p>
                  <p className="text-gray-700 mb-4">
                    This keeps your money safe while earning competitive interest rates (currently around 4-5% APY).
                    Your principal is protected - you won't lose money due to market fluctuations.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Benefits:</h5>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li className="flex gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>No risk of losing principal</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Easy access to your money when you need it</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Earns better interest than most savings accounts</span>
                      </li>
                    </ul>
                  </div>
                  <a
                    href={FUNDS.SPAXX.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm px-6 py-2.5 bg-accent-green-600 text-white rounded-lg hover:bg-accent-green-700 transition-colors font-medium"
                  >
                    View on Fidelity
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {recommendations.primary.map(fund => renderFundCard(fund))}
            </div>
          )}
        </div>

        {/* Index Funds for high risk tolerance */}
        {recommendations.indexFunds && (
          <div className="space-y-4">
            <div className="border-t-2 border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">100% Stock Index Funds</h3>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <div className="flex gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    <strong>Higher Risk, Higher Potential:</strong> These funds are 100% invested in stocks.
                    They offer the highest chance for growth, but your investment can lose significant value during market downturns.
                    Only invest money you won't need for many years.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {recommendations.indexFunds.map(fund => renderFundCard(fund, true))}
              </div>
            </div>
          </div>
        )}

        {/* Educational Note */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h4 className="font-bold text-gray-900 mb-2">Before You Invest</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>Click "View on Fidelity" to research each fund's performance, fees, and details</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>Past performance doesn't guarantee future results</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>Consider consulting a financial advisor for personalized advice</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation
        onBack={handleBack}
        onNext={handleNext}
        canGoNext={true}
        nextLabel="Continue to Account Setup"
        isExiting={isExiting}
      />
    </StepContainer>
  )
}

export default InvestmentStrategyEducation
