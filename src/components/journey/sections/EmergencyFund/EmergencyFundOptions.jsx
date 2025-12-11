import React, { useState } from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import InfoBox from '@/components/ui/InfoBox'
import GlossaryTerm from '@/components/ui/GlossaryTerm'
import useStepTransition from '@/hooks/useStepTransition'
import { AlertCircle } from 'lucide-react'

const EmergencyFundOptions = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()
  const [showOtherOptions, setShowOtherOptions] = useState(false)

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
      {/* Main recommendation */}
      <div className="mb-8">
        <p className="text-lg text-gray-800 mb-6 leading-relaxed">
          We think you should always have your emergency fund in a{' '}
          <GlossaryTerm term="high-yield account">
            A high-yield account is a very safe place to keep your money while still getting a return,
            usually between 2-5%. Typical bank accounts usually give you less than 1% return.
          </GlossaryTerm>.
        </p>

        <p className="text-lg text-gray-800 leading-relaxed">
          We will show you how to open a high-yield account at <strong>Fidelity</strong>.
        </p>
      </div>

      {/* Info box about Fidelity */}
      <InfoBox type="info" className="mb-6">
        <p className="text-sm">
          <strong>Why Fidelity?</strong> Fidelity's money market fund (SPAXX) offers competitive rates
          and lets you keep your emergency fund alongside your retirement accounts (IRA, Roth IRA)
          and other investments—all in one place.
        </p>
      </InfoBox>

      {/* Small disclaimer */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-6">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-700 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-900">
            <strong>Educational Information Only:</strong> This information is for educational purposes and is not financial advice.
            We are not affiliated with Fidelity. Research multiple options and consider consulting a financial advisor before making decisions.
          </p>
        </div>
      </div>

      {/* Other options section - expandable */}
      {!showOtherOptions ? (
        <div className="text-center mb-8">
          <button
            onClick={() => setShowOtherOptions(true)}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Learn about my other options
          </button>
        </div>
      ) : (
        <div className="mb-8 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Other Options to Consider:</h3>

          {/* High-Yield Savings */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-2">High-Yield Savings Accounts</h4>
            <p className="text-sm text-gray-700 mb-2">
              Online banks (Ally, Marcus, Discover, etc.) offer savings accounts with rates similar to money market funds (typically 3-5%).
            </p>
            <p className="text-sm text-gray-700">
              <strong>Pros:</strong> FDIC insured, instant access<br />
              <strong>Cons:</strong> Separate from investment accounts
            </p>
          </div>

          {/* Traditional Bank */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-2">Traditional Bank Accounts</h4>
            <p className="text-sm text-gray-700 mb-2">
              Regular checking or savings accounts at your local bank.
            </p>
            <p className="text-sm text-gray-700">
              <strong>Pros:</strong> Maximum convenience, instant access<br />
              <strong>Cons:</strong> Very low rates (0-1%), money may lose value to inflation
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowOtherOptions(false)}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Hide other options
            </button>
          </div>
        </div>
      )}

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
