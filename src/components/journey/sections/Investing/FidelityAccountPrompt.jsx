import React, { useState } from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'
import { Building2, Check, Info } from 'lucide-react'

const FidelityAccountPrompt = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, direction, transitionTo } = useStepTransition()
  const [choice, setChoice] = useState(journeyData.wantsFidelityAccount || null)

  const handleNext = () => {
    updateJourneyData('wantsFidelityAccount', choice)
    transitionTo(nextStep, 'forward')
  }

  const handleBack = () => {
    transitionTo(prevStep, 'backward')
  }

  const options = [
    {
      id: 'yes',
      title: 'Yes, I want to open a Fidelity account first',
      description: 'You'll be guided through setting up Fidelity, then you can open Fidelity Go',
      recommended: true
    },
    {
      id: 'no',
      title: 'No, I'll continue with what I have',
      description: 'We'll show you general recommendations (note: currently only Fidelity services are available)',
      recommended: false
    }
  ]

  return (
    <StepContainer
      title="Opening a Fidelity Account"
      subtitle="Fidelity Go requires a Fidelity account"
      isExiting={isExiting}
      direction={direction}
    >
      <div className="space-y-6">
        {/* Info box explaining the situation */}
        <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-medium text-gray-900 mb-2">Before using Fidelity Go</p>
              <p>
                To use Fidelity Go for managed investing, you'll need to have a Fidelity account. Since you don't currently use Fidelity for your emergency fund, would you like to set up a Fidelity account now?
              </p>
            </div>
          </div>
        </div>

        {/* Choice options */}
        <div className="space-y-4">
          {options.map((option) => {
            const isSelected = choice === option.id

            return (
              <button
                key={option.id}
                onClick={() => setChoice(option.id)}
                className={`w-full p-5 rounded-xl border-2 transition-all text-left hover:shadow-md relative ${
                  isSelected
                    ? 'border-accent-green-500 bg-accent-green-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 p-3 rounded-lg flex-shrink-0">
                    <Building2 className="w-5 h-5 text-gray-700" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {option.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {option.description}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="bg-accent-green-600 rounded-full p-1 flex-shrink-0">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {option.recommended && (
                      <div className="mt-3 inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                        Recommended for Fidelity Go
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Additional note if they select "no" */}
        {choice === 'no' && (
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> Our current recommendations focus on Fidelity services. If you'd like to use Fidelity Go specifically, you'll need to open a Fidelity account. Otherwise, you can review general investment guidance in the next section.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <StepNavigation
        onBack={handleBack}
        onNext={handleNext}
        canGoNext={choice !== null}
        nextLabel="Continue →"
        isExiting={isExiting}
      />
    </StepContainer>
  )
}

export default FidelityAccountPrompt
