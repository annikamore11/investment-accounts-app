import React, { useState } from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import GlossaryTerm from '@/components/ui/GlossaryTerm'
import useStepTransition from '@/hooks/useStepTransition'
import { Check } from 'lucide-react'

const IndexFundSelection = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()
  const [selectedFund, setSelectedFund] = useState(journeyData.selectedIndexFund || '')

  const handleNext = () => {
    updateJourneyData('selectedIndexFund', selectedFund)
    transitionTo(nextStep)
  }

  const handleBack = () => {
    transitionTo(prevStep)
  }

  const indexFunds = [
    {
      ticker: 'FXAIX',
      name: 'Fidelity S&P 500 Index Fund',
      description: 'Mimics the S&P 500',
      details: 'Includes the 500 biggest companies in the US',
      glossary: {
        term: 'S&P 500',
        content: (
          <div className="space-y-2">
            <p className="font-semibold text-gray-900">What is the S&P 500?</p>
            <p>
              The S&P 500 is a stock market index that tracks the 500 largest publicly traded companies in the United States.
            </p>
            <p className="text-xs text-gray-600">
              It's widely considered a benchmark for the overall U.S. stock market performance and includes companies like Apple, Microsoft, Amazon, and Google.
            </p>
          </div>
        )
      }
    },
    {
      ticker: 'FNCMX',
      name: 'Fidelity NASDAQ Composite Index Fund',
      description: 'Follows the NASDAQ Index',
      details: 'Includes the largest US Tech companies',
      glossary: {
        term: 'NASDAQ',
        content: (
          <div className="space-y-2">
            <p className="font-semibold text-gray-900">What is the NASDAQ?</p>
            <p>
              The NASDAQ Composite Index tracks all stocks listed on the NASDAQ stock exchange, with a heavy focus on technology companies.
            </p>
            <p className="text-xs text-gray-600">
              It includes companies like Apple, Microsoft, Amazon, Tesla, and Meta (Facebook). It tends to be more volatile but has historically shown strong growth.
            </p>
          </div>
        )
      }
    },
    {
      ticker: 'FSPSX',
      name: 'Fidelity International Index Fund',
      description: 'Follows the performance of Non-US stock markets',
      details: 'Includes international companies only',
      glossary: {
        term: 'International Investing',
        content: (
          <div className="space-y-2">
            <p className="font-semibold text-gray-900">Why invest internationally?</p>
            <p>
              International funds invest in companies outside the United States, providing geographic diversification.
            </p>
            <p className="text-xs text-gray-600">
              This includes companies in Europe, Asia, and emerging markets. It can help balance your portfolio if the U.S. market underperforms.
            </p>
          </div>
        )
      }
    }
  ]

  return (
    <StepContainer
      title="Popular Index Funds"
      subtitle="Choose a fund that fits your goals"
      isExiting={isExiting}
    >
      <div className="space-y-6">
        <p className="text-gray-700 leading-relaxed">
          Here are a few popular index funds at Fidelity. Each tracks a different market index.
        </p>

        {/* Fund cards */}
        <div className="space-y-4">
          {indexFunds.map((fund) => (
            <button
              key={fund.ticker}
              onClick={() => setSelectedFund(fund.ticker)}
              className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                selectedFund === fund.ticker
                  ? 'border-accent-green-600 bg-accent-green-50 shadow-md'
                  : 'border-gray-300 hover:border-gray-400 bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {fund.ticker}
                    </span>
                    {selectedFund === fund.ticker && (
                      <Check className="w-5 h-5 text-accent-green-600" />
                    )}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    {fund.name}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-2">
                <strong>{fund.description}</strong>
              </p>
              <p className="text-sm text-gray-600 mb-3">
                {fund.details}
              </p>

              <div className="text-sm">
                <GlossaryTerm term={`Learn about ${fund.glossary.term}`}>
                  {fund.glossary.content}
                </GlossaryTerm>
              </div>
            </button>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-50 border-l-4 border-gray-400 rounded-r-lg p-4">
          <p className="text-xs text-gray-700">
            <strong>Educational Information Only:</strong> This is not financial advice or a recommendation to invest in any specific fund.
            All investments carry risk. Research multiple options and consider consulting a financial advisor before making decisions.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation
        onBack={handleBack}
        onNext={handleNext}
        canGoNext={!!selectedFund}
        nextLabel="Finish Section →"
        isExiting={isExiting}
      />
    </StepContainer>
  )
}

export default IndexFundSelection
