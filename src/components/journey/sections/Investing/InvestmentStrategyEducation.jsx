import React from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'
import { AlertCircle, TrendingUp, PiggyBank, Shield, BarChart3, Clock } from 'lucide-react'

const InvestmentStrategyEducation = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()
  const goals = journeyData.investingGoals || []
  const riskTolerance = journeyData.riskTolerance || 5

  const handleNext = () => {
    transitionTo(nextStep)
  }

  const handleBack = () => {
    transitionTo(prevStep)
  }

  const getTimeframeCategory = (timeframe) => {
    if (!timeframe) return 'medium'
    
    // Check if it's just a number (assume years)
    const justNumber = timeframe.match(/^\d+$/)
    if (justNumber) {
      const years = parseInt(timeframe)
      if (years <= 2) return 'short'
      if (years <= 5) return 'medium'
      return 'long'
    }
    
    // Try to extract years from the timeframe string
    const yearMatch = timeframe.match(/(\d+)\s*year/i)
    if (yearMatch) {
      const years = parseInt(yearMatch[1])
      if (years <= 2) return 'short'
      if (years <= 5) return 'medium'
      return 'long'
    }
    
    // Check for specific year (like "2030")
    const specificYear = timeframe.match(/20\d{2}/)
    if (specificYear) {
      const targetYear = parseInt(specificYear[0])
      const currentYear = new Date().getFullYear()
      const yearsUntil = targetYear - currentYear
      if (yearsUntil <= 2) return 'short'
      if (yearsUntil <= 5) return 'medium'
      return 'long'
    }

    // Check for phrases like "no rush", "long term", etc.
    const lowerTimeframe = timeframe.toLowerCase()
    if (lowerTimeframe.includes('no rush') || lowerTimeframe.includes('long')) return 'long'
    if (lowerTimeframe.includes('soon') || lowerTimeframe.includes('short')) return 'short'

    // Default to medium if unclear
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

  return (
    <StepContainer
      title="Investment Strategies for Your Goals"
      subtitle="Educational guidance based on your timeline and risk tolerance"
      isExiting={isExiting}
      maxWidth='md:max-w-6xl'
    >
      <div className="space-y-6">
        {/* Intro */}
        

        {/* Goals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {goals.map((goal, index) => {
            const keepInCash = shouldKeepInCash(goal)
            const timeframeCategory = getTimeframeCategory(goal.timeframe)

            return (
              <div key={goal.id} className="border-2 border-gray-200 rounded-xl bg-white flex flex-col">
                {/* Goal header - fixed */}
                <div className="p-5 pb-4 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{goal.name}</h3>
                    <div className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                      Goal {index + 1}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                    {goal.amount && (
                      <span className="flex items-center gap-1">
                        <PiggyBank className="w-3 h-3" />
                        {formatAmount(goal.amount)}
                      </span>
                    )}
                    {goal.timeframe && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {goal.timeframe}
                      </span>
                    )}
                  </div>
                </div>

                {/* Scrollable content */}
                <div className="overflow-y-auto max-h-[500px] p-5">
                  {keepInCash ? (
                    /* Cash recommendation */
                    <div className="space-y-4">
                      <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0">
                            <Shield className="w-5 h-5 text-primary-700" />
                          </div>
                          <div>
                            <h4 className="font-bold text-primary-900 mb-2">Keep in Cash</h4>
                            <p className="text-sm text-gray-700 leading-relaxed mb-2">
                              Based on your {riskTolerance === 1 ? 'risk tolerance of 1' : timeframeCategory === 'short' ? '0-2 year timeframe' : 'situation'}, 
                              conventional wisdom would urge you to keep this money in cash.
                            </p>
                            <p className="text-sm text-gray-700 font-medium">
                              {timeframeCategory === 'short' 
                                ? '0-2 years is too short a timeframe to gamble with the market.'
                                : 'A risk tolerance of 1 means you can\'t stomach the risk that investing in the stock market entails.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-900 mb-2 text-sm">Best Option: Money Market Account</h5>
                        <p className="text-xs text-gray-700 leading-relaxed mb-2">
                          If you set up an emergency fund through Fidelity with us, then you have already opened a money market account!
                        </p>
                        <ul className="space-y-1.5 text-xs text-gray-700">
                          <li className="flex gap-2">
                            <span className="text-accent-green-600 font-bold">•</span>
                            <span>FDIC insured (up to $250,000)</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-accent-green-600 font-bold">•</span>
                            <span>Currently earning 3-5% annually</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-accent-green-600 font-bold">•</span>
                            <span>Easily accessible</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-accent-green-600 font-bold">•</span>
                            <span>No risk of losing principal</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    /* Investment options */
                    <div className="space-y-4">
                      <div className="bg-accent-green-50 border border-accent-green-600 rounded-lg p-3">
                        <p className="text-xs text-gray-700 leading-relaxed">
                          Here are two common investment approaches. Which sounds better to you?
                        </p>
                      </div>

                      {/* Index Investing */}
                      <div className="border-2 border-gray-200 rounded-xl p-4 bg-white">
                        <div className="flex items-start gap-2 mb-3">
                          <div className="bg-accent-orange-100 p-2 rounded-lg flex-shrink-0">
                            <TrendingUp className="w-4 h-4 text-accent-orange-700" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm mb-0.5">Index Investing</h4>
                            <p className="text-xs text-gray-600">All stocks</p>
                          </div>
                        </div>

                        <ul className="space-y-1.5 text-xs text-gray-700 mb-6">
                          <li className="flex gap-2">
                            <span className="text-accent-green-600 font-bold">•</span>
                            <span>Follows an index like the S&P 500</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-accent-green-600 font-bold">•</span>
                            <span>Very low cost</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-accent-green-600 font-bold">•</span>
                            <span>Higher growth potential but volatile</span>
                          </li>
                        </ul>

                        <div>
                          <h5 className="font-semibold text-gray-900 text-xs">Popular index funds:</h5>
                          <p className="text-xs mb-2 text-gray-600">(Do your research on each fund before investing)</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="bg-primary-50 rounded-lg p-2 border border-gray-200">
                            <div className="font-semibold text-gray-900 text-xs mb-1">FXAIX</div>
                            <div className="text-xs text-gray-600 mb-2">S&P 500 - 500 biggest US companies</div>
                            <div className="flex gap-2">
                              <a
                                href="https://fundresearch.fidelity.com/mutual-funds/summary/315911750"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-xs px-2 py-1 bg-accent-green-600 text-white rounded hover:bg-accent-green-700 transition-colors text-center"
                              >
                                View on Fidelity
                              </a>
                              <a
                                href="/"
                                className="flex-1 text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-center"
                              >
                                Learn More
                              </a>
                            </div>
                          </div>
                          
                          <div className="bg-primary-50 rounded-lg p-2 border border-gray-200">
                            <div className="font-semibold text-gray-900 text-xs mb-1">FNCMX</div>
                            <div className="text-xs text-gray-600 mb-2">NASDAQ - Largest US tech companies</div>
                            <div className="flex gap-2">
                              <a
                                href="https://fundresearch.fidelity.com/mutual-funds/summary/316146356"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-xs px-2 py-1 bg-accent-green-600 text-white rounded hover:bg-accent-green-700 transition-colors text-center"
                              >
                                View on Fidelity
                              </a>
                              <a
                                href="/"
                                className="flex-1 text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-center"
                              >
                                Learn More
                              </a>
                            </div>
                          </div>
                          
                          <div className="bg-primary-50 rounded-lg p-2 border border-gray-200">
                            <div className="font-semibold text-gray-900 text-xs mb-1">FSPSX</div>
                            <div className="text-xs text-gray-600 mb-2">International - Non-US companies</div>
                            <div className="flex gap-2">
                              <a
                                href="https://fundresearch.fidelity.com/mutual-funds/summary/315911693"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-xs px-2 py-1 bg-accent-green-600 text-white rounded hover:bg-accent-green-700 transition-colors text-center"
                              >
                                View on Fidelity
                              </a>
                              <a
                                href="/"
                                className="flex-1 text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-center"
                              >
                                Learn More
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Blended Funds */}
                      <div className="border-2 border-gray-200 rounded-xl p-4 bg-white">
                        <div className="flex items-start gap-2 mb-3">
                          <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0">
                            <BarChart3 className="w-4 h-4 text-primary-700" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm mb-0.5">Blended Funds</h4>
                            <p className="text-xs text-gray-600">Mix of stocks and bonds</p>
                          </div>
                        </div>

                        <ul className="space-y-1.5 text-xs text-gray-700 mb-3">
                          <li className="flex gap-2">
                            <span className="text-accent-green-600 font-bold">•</span>
                            <span>Choose your risk level</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-accent-green-600 font-bold">•</span>
                            <span>More stocks = more risk, more growth</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-accent-green-600 font-bold">•</span>
                            <span>Higher cost than index funds</span>
                          </li>
                        </ul>

                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-2 text-xs">Blended examples:</h5>
                          <div className="space-y-2">
                            <div>
                              <div className="font-semibold text-gray-900 text-xs">Conservative (30/70)</div>
                              <div className="text-xs text-gray-600">Lower risk, steadier returns</div>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-xs">Moderate (60/40)</div>
                              <div className="text-xs text-gray-600">Balanced growth and stability</div>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-xs">Aggressive (80/20)</div>
                              <div className="text-xs text-gray-600">Higher growth, more volatility</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

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