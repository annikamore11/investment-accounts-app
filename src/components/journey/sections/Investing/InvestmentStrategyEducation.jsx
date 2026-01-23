import React from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'
import { AlertCircle, TrendingUp, PiggyBank, Shield, BarChart3, Clock } from 'lucide-react'

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

  const getTimeframeCategory = (timeframe) => {
    if (!timeframe) return 'medium'
    
    const normalized = timeframe.toLowerCase().trim()
    
    // Handle special values
    if (normalized === '<1') return 'short'
    if (normalized === 'none') return 'long'
    
    // Handle numeric values
    const num = parseInt(timeframe, 10)
    if (!isNaN(num)) {
      if (num < 1) return 'short'
      if (num <= 2) return 'short'
      if (num <= 5) return 'medium'
      return 'long'
    }

    return 'medium'
  }

  const shouldKeepInCash = (goal) => {
    const timeframeCategory = getTimeframeCategory(goal.timeframe)
    return timeframeCategory === 'short' || riskTolerance === 1
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

  const keepInCash = shouldKeepInCash(goal)
  const timeframeCategory = getTimeframeCategory(goal.timeframe)

  return (
    <StepContainer
      title="Investment Strategy for Your Goal"
      subtitle="Educational guidance based on your timeline and risk tolerance"
      isExiting={isExiting}
      direction={direction}
    >
      <div className="space-y-6">
        {/* Goal Summary */}
        <div className="bg-gradient-to-br from-accent-green-50 to-white border-2 border-accent-green-200 rounded-xl p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{goal.name}</h3>
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
                <span><strong>Timeline:</strong> {goal.timeframe === 'none' ? 'No specific timeline' : goal.timeframe === '<1' ? 'Less than 1 year' : `${goal.timeframe} years`}</span>
              </div>
            )}
          </div>
        </div>

        {keepInCash ? (
          /* Cash recommendation */
          <div className="space-y-5">
            <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="bg-primary-100 p-2.5 rounded-lg flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary-700" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary-900 mb-2">Recommended: Keep in Cash</h4>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Based on your {riskTolerance === 1 ? 'risk tolerance of 1' : timeframeCategory === 'short' ? 'short timeframe' : 'situation'}, 
                    conventional wisdom would urge you to keep this money in cash.
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {timeframeCategory === 'short' 
                      ? 'Your timeframe is too short to gamble with the market. You need this money too soon to risk potential losses.'
                      : 'A risk tolerance of 1 means you can\'t stomach the volatility that investing in the stock market entails.'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
              <h5 className="font-bold text-gray-900 mb-3">Best Option: Money Market Account</h5>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you set up an emergency fund through Fidelity with us, then you have already opened a money market account! You can use the same account for this goal.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h6 className="font-semibold text-gray-900 mb-2 text-sm">Benefits:</h6>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-accent-green-600 font-bold">✓</span>
                    <span>FDIC insured (up to $250,000)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-green-600 font-bold">✓</span>
                    <span>Currently earning 3-5% annually</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-green-600 font-bold">✓</span>
                    <span>Easily accessible when you need it</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-green-600 font-bold">✓</span>
                    <span>No risk of losing principal</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          /* Investment options */
          <div className="space-y-5">
            <div className="bg-accent-green-50 border-2 border-accent-green-200 rounded-xl p-4">
              <p className="text-gray-700 leading-relaxed">
                Here are two common investment approaches. Choose the one that sounds better for your goal and risk tolerance.
              </p>
            </div>

            {/* Index Investing */}
            <div className="border-2 border-gray-200 rounded-xl p-6 bg-white">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-accent-orange-100 p-2.5 rounded-lg flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-accent-orange-700" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Index Investing</h4>
                  <p className="text-sm text-gray-600">All stocks - maximum growth potential</p>
                </div>
              </div>

              <ul className="space-y-2 text-sm text-gray-700 mb-5">
                <li className="flex gap-2">
                  <span className="text-accent-green-600 font-bold">•</span>
                  <span>Follows an index like the S&P 500</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent-green-600 font-bold">•</span>
                  <span>Very low cost (minimal fees)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent-green-600 font-bold">•</span>
                  <span>Higher growth potential but more volatile</span>
                </li>
              </ul>

              <div className="mb-4">
                <h5 className="font-semibold text-gray-900 mb-1">Popular index funds:</h5>
                <p className="text-xs text-gray-600 mb-3">(Do your research on each fund before investing)</p>
              </div>
              
              <div className="space-y-3">
                <div className="bg-primary-50 rounded-lg p-4 border border-gray-200">
                  <div className="font-semibold text-gray-900 mb-1">FXAIX</div>
                  <div className="text-sm text-gray-600 mb-3">S&P 500 - 500 biggest US companies</div>
                  <div className="flex gap-2">
                    <a
                      href="https://fundresearch.fidelity.com/mutual-funds/summary/315911750"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-sm px-3 py-2 bg-accent-green-600 text-white rounded-lg hover:bg-accent-green-700 transition-colors text-center font-medium"
                    >
                      View on Fidelity
                    </a>
                    <a
                      href="/"
                      className="flex-1 text-sm px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-center font-medium"
                    >
                      Learn More
                    </a>
                  </div>
                </div>
                
                <div className="bg-primary-50 rounded-lg p-4 border border-gray-200">
                  <div className="font-semibold text-gray-900 mb-1">FNCMX</div>
                  <div className="text-sm text-gray-600 mb-3">NASDAQ - Largest US tech companies</div>
                  <div className="flex gap-2">
                    <a
                      href="https://fundresearch.fidelity.com/mutual-funds/summary/316146356"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-sm px-3 py-2 bg-accent-green-600 text-white rounded-lg hover:bg-accent-green-700 transition-colors text-center font-medium"
                    >
                      View on Fidelity
                    </a>
                    <a
                      href="/"
                      className="flex-1 text-sm px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-center font-medium"
                    >
                      Learn More
                    </a>
                  </div>
                </div>
                
                <div className="bg-primary-50 rounded-lg p-4 border border-gray-200">
                  <div className="font-semibold text-gray-900 mb-1">FSPSX</div>
                  <div className="text-sm text-gray-600 mb-3">International - Non-US companies</div>
                  <div className="flex gap-2">
                    <a
                      href="https://fundresearch.fidelity.com/mutual-funds/summary/315911693"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-sm px-3 py-2 bg-accent-green-600 text-white rounded-lg hover:bg-accent-green-700 transition-colors text-center font-medium"
                    >
                      View on Fidelity
                    </a>
                    <a
                      href="/"
                      className="flex-1 text-sm px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-center font-medium"
                    >
                      Learn More
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Blended Funds */}
            <div className="border-2 border-gray-200 rounded-xl p-6 bg-white">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-primary-100 p-2.5 rounded-lg flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-primary-700" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Blended Funds</h4>
                  <p className="text-sm text-gray-600">Mix of stocks and bonds for balanced growth</p>
                </div>
              </div>

              <ul className="space-y-2 text-sm text-gray-700 mb-5">
                <li className="flex gap-2">
                  <span className="text-accent-green-600 font-bold">•</span>
                  <span>Choose your risk level based on stocks/bonds ratio</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent-green-600 font-bold">•</span>
                  <span>More stocks = more risk and growth potential</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent-green-600 font-bold">•</span>
                  <span>Higher cost than index funds (actively managed)</span>
                </li>
              </ul>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-3">Common allocation strategies:</h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-900">Conservative (30/70)</div>
                      <div className="text-sm text-gray-600">30% stocks, 70% bonds</div>
                    </div>
                    <div className="text-xs text-gray-500">Lower risk</div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-900">Moderate (60/40)</div>
                      <div className="text-sm text-gray-600">60% stocks, 40% bonds</div>
                    </div>
                    <div className="text-xs text-gray-500">Balanced</div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-900">Aggressive (80/20)</div>
                      <div className="text-sm text-gray-600">80% stocks, 20% bonds</div>
                    </div>
                    <div className="text-xs text-gray-500">Higher risk</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <StepNavigation
        onBack={handleBack}
        onNext={handleNext}
        canGoNext={true}
        nextLabel="Continue to Account Setup →"
        isExiting={isExiting}
      />
    </StepContainer>
  )
}

export default InvestmentStrategyEducation