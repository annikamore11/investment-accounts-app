import React from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import GlossaryTerm from '@/components/ui/GlossaryTerm'
import useStepTransition from '@/hooks/useStepTransition'
import { TrendingUp, Target, Clock, Shield } from 'lucide-react'

const InvestingIntro = ({ nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()

  const handleNext = () => {
    transitionTo(nextStep)
  }

  const handleBack = () => {
    transitionTo(prevStep)
  }

  return (
    <StepContainer
      title="Non-Retirement Investing"
      subtitle="Grow your wealth for life's other goals"
      isExiting={isExiting}
    >
      <div className="space-y-6">
        {/* Main intro */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-start gap-3 mb-4">
            <div className="bg-blue-100 p-2.5 rounded-xl flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                What is Non-Retirement Investing?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                While retirement accounts are designed specifically for your later years, non-retirement investing lets you grow money for any goal you have before then. This could be buying a home, funding education, starting a business, or simply building wealth over time.
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div>
          <h4 className="font-bold text-gray-900 mb-3">How It Works</h4>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <div>
              When you invest outside of retirement accounts, you're buying{' '}
              <GlossaryTerm term="stocks and bonds">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">Stocks and Bonds</p>
                  <p><strong>Stocks</strong> represent ownership in companies. When companies grow and become more valuable, your stocks typically increase in value too.</p>
                  <p><strong>Bonds</strong> are loans you make to governments or companies. They pay you interest over time and return your principal at maturity.</p>
                  <p className="text-xs text-gray-600 border-t border-gray-200 pt-2 mt-2">
                    Most investors hold a mix of both to balance growth potential with stability.
                  </p>
                </div>
              </GlossaryTerm>
              {' '}that have the potential to grow in value over time. Unlike a savings account where your money earns a fixed interest rate, investments can go up or down based on market conditions.
            </div>
            
            <p>
              The key difference from retirement accounts is <strong>flexibility</strong>. You can withdraw your money whenever you need it without penalties, though you'll pay taxes on any gains. This makes non-retirement investing ideal for goals you'll reach before retirement age.
            </p>
          </div>
        </div>

        {/* Key factors */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-4">What Determines Your Strategy</h4>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="bg-purple-100 p-2 rounded-lg h-fit">
                <Clock className="w-4 h-4 text-purple-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Your Timeline</p>
                <div className="text-sm text-gray-700">
                  Need the money in 2 years? You'll want safer, more stable investments. Have 10+ years? You can afford to take on more{' '}
                  <GlossaryTerm term="risk">
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-900">Investment Risk</p>
                      <p>Risk refers to the possibility that your investments could lose value in the short term. Generally, investments with higher potential returns come with higher risk of temporary losses.</p>
                      <p className="text-xs text-gray-600 border-t border-gray-200 pt-2 mt-2">
                        Historically, holding investments longer reduces risk because markets tend to recover from downturns over time.
                      </p>
                    </div>
                  </GlossaryTerm>
                  {' '}for potentially higher returns, since you have time to ride out market fluctuations.
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-orange-100 p-2 rounded-lg h-fit">
                <Shield className="w-4 h-4 text-orange-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Your Risk Tolerance</p>
                <p className="text-sm text-gray-700">
                  How comfortable are you watching your investment balance fluctuate? Some people can handle the ups and downs of aggressive growth strategies, while others prefer steadier, more conservative approaches even if it means lower potential returns.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-green-100 p-2 rounded-lg h-fit">
                <Target className="w-4 h-4 text-green-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Your Specific Goal</p>
                <p className="text-sm text-gray-700">
                  A home down payment you'll need in 3 years requires a different strategy than building generational wealth over decades. Your goal's importance and flexibility also matter.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <p className="text-sm text-gray-700">
            <strong>Next up:</strong> We'll walk through your specific goals and guide you to decide the right investment approach for each one.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation
        onBack={handleBack}
        onNext={handleNext}
        canGoNext={true}
        nextLabel="Continue →"
        isExiting={isExiting}
      />
    </StepContainer>
  )
}

export default InvestingIntro