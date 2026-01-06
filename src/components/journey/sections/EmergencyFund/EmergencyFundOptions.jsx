import React from 'react'
import Link from 'next/link'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import GlossaryTerm from '@/components/ui/GlossaryTerm'
import useStepTransition from '@/hooks/useStepTransition'
import { ExternalLink, Shield, TrendingUp, DollarSign, Wallet } from 'lucide-react'

const EmergencyFundOptions = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()

  const handleNext = () => {
    updateJourneyData('emergencyFundAccountType', 'money-market')
    transitionTo(nextStep)
  }

  const handleBack = () => {
    transitionTo(prevStep)
  }

  return (
    <StepContainer
      title="Where to Keep Your Emergency Fund"
      subtitle="We'll help you set it up"
      isExiting={isExiting}
    >
      {/* Hero section */}
      <div className="bg-gradient-to-br from-accent-green-50 via-white to-primary-50 rounded-2xl p-6 mb-6 border border-accent-green-100">
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-accent-green-100 p-2.5 rounded-xl flex-shrink-0">
            <Wallet className="w-5 h-5 text-accent-green-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1.5">
              Set Up a High-Yield Account with Fidelity
            </h3>
            <div className="text-sm text-gray-700 leading-relaxed">
              We'll guide you through opening a{' '}
              <GlossaryTerm term="high-yield account">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">What is a high-yield account?</p>
                  <p>A high-yield account is a very safe place to keep your money while still earning a return, usually between <strong>2-5% annually</strong>.</p>
                  <p className="text-gray-600 text-xs border-t border-gray-200 pt-2 mt-2">
                    Compare this to typical bank accounts which usually give you less than 1% return—your money actually loses value to inflation over time.
                  </p>
                </div>
              </GlossaryTerm>
              {' '}where your emergency fund can grow safely while staying accessible.
            </div>
          </div>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-accent-green-100/50">
            <Shield className="w-4 h-4 text-accent-green-600 mb-1.5" />
            <p className="font-semibold text-xs text-gray-900 mb-0.5">FDIC Insured</p>
            <p className="text-xs text-gray-600">Up to $250k</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-accent-green-100/50">
            <TrendingUp className="w-4 h-4 text-accent-green-600 mb-1.5" />
            <p className="font-semibold text-xs text-gray-900 mb-0.5">Competitive Rate</p>
            <p className="text-xs text-gray-600">3-4% annually</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-accent-green-100/50">
            <DollarSign className="w-4 h-4 text-accent-green-600 mb-1.5" />
            <p className="font-semibold text-xs text-gray-900 mb-0.5">No Minimum</p>
            <p className="text-xs text-gray-600">Start anytime</p>
          </div>
        </div>
      </div>

      {/* Why Fidelity */}
      <div className="bg-primary-50 rounded-xl p-4 mb-6 border border-primary-100">
        <p className="font-semibold text-primary-900 text-sm mb-1.5">
          Why Fidelity?
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          Keep your emergency fund, retirement accounts, and investments all in one dashboard for simpler financial management.
        </p>
      </div>

      {/* Other options link */}
      <div className="text-center mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-accent-green-700 transition-colors group"
        >
          <span className="underline decoration-dotted">Explore other account options</span>
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Navigation */}
      <StepNavigation
        onBack={handleBack}
        onNext={handleNext}
        canGoNext={true}
        nextLabel="Continue to Setup →"
        isExiting={isExiting}
      />
    </StepContainer>
  )
}

export default EmergencyFundOptions