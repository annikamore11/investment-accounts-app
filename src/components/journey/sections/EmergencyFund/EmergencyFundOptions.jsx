import React from 'react'
import Link from 'next/link'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import GlossaryTerm from '@/components/ui/GlossaryTerm'
import useStepTransition from '@/hooks/useStepTransition'
import { Sparkles, ExternalLink } from 'lucide-react'

const EmergencyFundOptions = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()

  const handleNext = () => {
    // Always set to money-market since we're recommending Fidelity
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
      {/* Main recommendation card */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-8 mb-8 shadow-sm">
        <div className="flex items-start gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Recommendation</h3>
            <p className="text-lg text-gray-800 mb-4 leading-relaxed">
              Keep your emergency fund in a{' '}
              <GlossaryTerm term="high-yield account">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">What is a high-yield account?</p>
                  <p>A high-yield account is a very safe place to keep your money while still earning a return, usually between <strong>2-5% annually</strong>.</p>
                  <p className="text-gray-600 text-xs border-t border-gray-200 pt-2 mt-2">
                    Compare this to typical bank accounts which usually give you less than 1% return—your money actually loses value to inflation over time.
                  </p>
                </div>
              </GlossaryTerm>
              {' '}at Fidelity.
            </p>
            <p className="text-base text-gray-700">
              We'll show you exactly how to open one in the next step.
            </p>
          </div>
        </div>

        {/* Why Fidelity */}
        <div className="bg-white bg-opacity-60 rounded-xl p-5 border border-blue-100">
          <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Why Fidelity?</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">✓</span>
              <span>Competitive rates through their SPAXX money market fund</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">✓</span>
              <span>Keep your emergency fund, retirement accounts (IRA, Roth IRA), and other investments all in one place</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">✓</span>
              <span>Easy transfers between accounts with no fees</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Disclaimer - integrated design */}
      <div className="bg-gray-50 border-l-4 border-gray-400 rounded-r-lg p-4 mb-6">
        <p className="text-xs text-gray-600 leading-relaxed">
          <strong className="text-gray-700">Educational Information Only:</strong> This information is for educational purposes and is not financial advice.
          We are not affiliated with Fidelity. Consider researching multiple options and consulting a financial advisor before making decisions.
        </p>
      </div>

      {/* Other options link */}
      <div className="text-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-accent-green-700 transition-colors group"
        >
          <span className="underline decoration-dotted">Learn about my other options</span>
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Navigation */}
      <StepNavigation
        onBack={handleBack}
        onNext={handleNext}
        canGoNext={true}
        nextLabel="See Setup Guide →"
        isExiting={isExiting}
      />
    </StepContainer>
  )
}

export default EmergencyFundOptions
