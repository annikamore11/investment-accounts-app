import React from 'react'
import Link from 'next/link'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import InfoBox from '@/components/ui/InfoBox'
import GlossaryTerm from '@/components/ui/GlossaryTerm'
import useStepTransition from '@/hooks/useStepTransition'
import { ExternalLink } from 'lucide-react'

const EmergencyFundOptions = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()

  const handleNext = () => {
    // Always set to money-market since we're guiding them to Fidelity
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
      {/* Main content */}
      <div className="mb-8">
        <p className="text-lg text-gray-800 mb-6 leading-relaxed">
          We can show you how to set up your emergency fund in a{' '}
          <GlossaryTerm term="high-yield account">
            <div className="space-y-2">
              <p className="font-semibold text-gray-900">What is a high-yield account?</p>
              <p>A high-yield account is a very safe place to keep your money while still earning a return, usually between <strong>2-5% annually</strong>.</p>
              <p className="text-gray-600 text-xs border-t border-gray-200 pt-2 mt-2">
                Compare this to typical bank accounts which usually give you less than 1% return—your money actually loses value to inflation over time.
              </p>
            </div>
          </GlossaryTerm>
          {' '}through Fidelity.
        </p>

        <p className="text-base text-gray-700">
          We'll walk you through the setup process step by step in the next section.
        </p>
      </div>

      {/* Why Fidelity info */}
      <InfoBox type="info" className="mb-6">
        <p className="text-sm mb-2">
          <strong>Why Fidelity?</strong>
        </p>
        <p className="text-sm">
          Fidelity allows you to keep your emergency fund, retirement accounts (IRA, Roth IRA), and other investments all in one place, making it easier to manage your finances.
        </p>
      </InfoBox>

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
