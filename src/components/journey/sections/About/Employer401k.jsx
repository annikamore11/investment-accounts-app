'use client'

import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import StepContainer from '@/components/ui/StepContainer'
import OptionGrid from '@/components/ui/OptionGrid'
import StepNavigation from '@/components/ui/StepNavigation'
import InfoBox from '@/components/ui/InfoBox'
import useStepTransition from '@/hooks/useStepTransition'

const Employer401k = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [has401k, setHas401k] = useState(journeyData.hasEmployer401k ?? null)
  const { isExiting, transitionTo } = useStepTransition()

  const handleNext = () => {
    updateJourneyData('hasEmployer401k', has401k)
    transitionTo(nextStep)
  }

  const options401k = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No, or Not Sure' }
  ]

  return (
    <StepContainer
      title="Employer 401(k) or 403(b)"
      subtitle="Does your employer offer a 401(k) or 403(b) retirement plan?"
      isExiting={isExiting}
      exitDirection="horizontal"
    >
      <div className="bg-primary-100 rounded-2xl shadow-xl p-8 md:p-12">

        {/* Info Box */}
        <div className="bg-purple-100 border border-purple-300 rounded-xl p-4 mb-6">
          <p className="text-sm text-purple-900">
            <strong>Why this matters:</strong> If your employer offers a 401(k) or 403(b), especially with matching contributions, 
            it's often the best place to start investing.
          </p>
        </div>

        <OptionGrid
          options={options401k}
          selectedValue={has401k}
          onChange={setHas401k}
        />

        {/* Warning if no 401k */}
        {has401k === false && (
          <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4 sm:p-5 mb-6 animate-fadeIn">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-2">Worth Checking!</h3>
                <p className="text-sm text-orange-800 mb-3">
                  Not sure if your employer offers a 401(k)? Check your HR portal or benefits documents.
                </p>
                <p className="text-sm text-orange-800 mb-3">
                  Employer match = free money — don’t leave it on the table.
                </p>
                <p className="text-sm text-orange-800 mt-3">
                  You can continue and return to update this later.
                </p>
              </div>
            </div>
          </div>
        )}

        <StepNavigation
          onBack={prevStep}
          onNext={handleNext}
          canGoNext={has401k !== null}
          isExiting={isExiting}
        />

        {has401k === null && (
          <p className="text-sm text-primary-500 text-center mt-4 animate-fadeIn">
            Please select an option to continue
          </p>
        )}
      </div>
    </StepContainer>
  )
}

export default Employer401k
