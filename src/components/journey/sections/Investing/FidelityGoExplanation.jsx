import React, { useState } from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'
import { Sparkles, DollarSign, TrendingUp, Shield, Users, ExternalLink, ChevronDown } from 'lucide-react'

const FidelityGoExplanation = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, direction, transitionTo } = useStepTransition()
  const [showFeatures, setShowFeatures] = useState(false)
  const [showPricing, setShowPricing] = useState(false)

  const handleNext = () => {
    transitionTo(nextStep, 'forward')
  }

  const handleBack = () => {
    transitionTo(prevStep, 'backward')
  }

  const features = [
    {
      icon: Sparkles,
      title: 'Automated Investment Management',
      description: 'Fidelity Go uses advanced algorithms to build and manage a diversified portfolio tailored to your goals and risk tolerance.',
      color: 'blue'
    },
    {
      icon: TrendingUp,
      title: 'Professional Rebalancing',
      description: 'Your portfolio is automatically rebalanced to maintain your target asset allocation as markets move.',
      color: 'green'
    },
    {
      icon: Shield,
      title: 'Tax-Smart Strategies',
      description: 'Benefit from tax-loss harvesting and other tax-efficient strategies to help keep more of your returns.',
      color: 'purple'
    },
    {
      icon: Users,
      title: 'Access to Financial Coaches',
      description: 'Get unlimited phone access to Fidelity representatives for questions about your account.',
      color: 'orange'
    }
  ]

  return (
    <StepContainer
      title="Fidelity Go®"
      subtitle="A robo-advisor solution for hands-off investing"
      isExiting={isExiting}
      direction={direction}
    >
      <div className="space-y-6">
        {/* Main intro */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            What is Fidelity Go?
          </h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            Fidelity Go is a robo-advisor that provides professionally managed investment portfolios. After you set up your account and goals, Fidelity Go handles all the investment decisions for you—from choosing the right mix of stocks and bonds to rebalancing your portfolio over time.
          </p>
          <p className="text-gray-700 leading-relaxed">
            It's designed for investors who want expert management without the complexity of picking individual investments themselves.
          </p>
        </div>

        {/* What You Get - Dropdown */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => setShowFeatures(!showFeatures)}
            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left rounded-t-lg"
          >
            <h4 className="font-bold text-gray-900">What You Get</h4>
            <ChevronDown 
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                showFeatures ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {showFeatures && (
            <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  const colorClasses = {
                    blue: 'bg-blue-100 text-blue-700',
                    green: 'bg-green-100 text-green-700',
                    purple: 'bg-purple-100 text-purple-700',
                    orange: 'bg-orange-100 text-orange-700'
                  }

                  return (
                    <div key={index} className="flex gap-3 bg-white rounded-lg p-4 border border-gray-200">
                      <div className={`p-2 rounded-lg h-fit ${colorClasses[feature.color]}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">{feature.title}</p>
                        <p className="text-sm text-gray-700">{feature.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Pricing - Dropdown */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => setShowPricing(!showPricing)}
            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left rounded-t-lg"
          >
            <h4 className="font-bold text-gray-900">Pricing</h4>
            <ChevronDown 
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                showPricing ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {showPricing && (
            <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="flex gap-3">
                  <div className="bg-accent-green-100 p-2 rounded-lg h-fit">
                    <DollarSign className="w-5 h-5 text-accent-green-700" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 mb-3">Simple, Transparent Pricing</h5>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        <strong>Accounts under $25,000:</strong> Free (no advisory fee)
                      </p>
                      <p>
                        <strong>Accounts $25,000+:</strong> 0.35% annual advisory fee
                      </p>
                      <p className="text-xs text-gray-600 pt-2 border-t border-gray-200">
                        The fee covers all portfolio management, rebalancing, and access to financial coaches. There are no trading commissions or transfer fees.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ready to Get Started */}
        <div>
          <h4 className="font-bold text-gray-900 mb-3">Ready to Get Started?</h4>
          <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
            <p className="text-gray-700 mb-3">
              The Fidelity Go setup process is intuitive and straightforward. It walks you through everything step-by-step.
            </p>
            <a
              href="https://www.fidelity.com/managed-accounts/fidelity-go/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent-green-600 text-white px-4 py-2 rounded-lg hover:bg-accent-green-700 transition-colors font-medium"
            >
              Open a Fidelity Go Account
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 italic">
            <strong>Note:</strong> While Fidelity Go handles the investment decisions, you can still monitor your account, adjust your goals, and make deposits or withdrawals anytime through the Fidelity app or website.
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

export default FidelityGoExplanation
