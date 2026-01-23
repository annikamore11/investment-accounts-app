import React from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'
import { Sparkles, DollarSign, TrendingUp, Shield, Users, ExternalLink } from 'lucide-react'

const FidelityGoExplanation = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, direction, transitionTo } = useStepTransition()

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
      title="Fidelity Go®: Professional Management Made Simple"
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

        {/* Features */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4">What You Get</h4>
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
                <div key={index} className="flex gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
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

        {/* Pricing */}
        <div className="bg-accent-green-50 rounded-xl p-5 border border-accent-green-200">
          <div className="flex gap-3">
            <div className="bg-accent-green-100 p-2 rounded-lg h-fit">
              <DollarSign className="w-5 h-5 text-accent-green-700" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Simple, Transparent Pricing</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <strong>Accounts under $25,000:</strong> Free (no advisory fee)
                </p>
                <p>
                  <strong>Accounts $25,000+:</strong> 0.35% annual advisory fee
                </p>
                <p className="text-xs text-gray-600 pt-2 border-t border-accent-green-200">
                  The fee covers all portfolio management, rebalancing, and access to financial coaches. There are no trading commissions or transfer fees.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex gap-2 items-start">
            <ExternalLink className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-medium text-gray-900 mb-1">Ready to get started?</p>
              <p>
                You can open a Fidelity Go account directly through Fidelity's website. The setup process will walk you through linking your bank account and setting your investment preferences.
              </p>
            </div>
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
