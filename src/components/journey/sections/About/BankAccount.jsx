'use client'

import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import StepContainer from '@/components/ui/StepContainer'
import OptionGrid from '@/components/ui/OptionGrid'
import StepNavigation from '@/components/ui/StepNavigation'
import InfoBox from '@/components/ui/InfoBox'
import useStepTransition from '@/hooks/useStepTransition'

const BankAccount = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [hasBankAccount, setHasBankAccount] = useState(journeyData.hasBankAccount ?? null)
  const { isExiting, transitionTo } = useStepTransition()

  const handleNext = () => {
    updateJourneyData('hasBankAccount', hasBankAccount)
    transitionTo(nextStep)
  }

  const bankAccountOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ]

  return (
    <StepContainer
      title="Bank Account"
      isExiting={isExiting}
      exitDirection="horizontal"
    >
      <p className="text-lg sm:text-xl text-primary-700 max-w-4xl mx-auto mb-6 text-center">
        Do you currently have a bank account (checking or savings)?
      </p>

      <InfoBox
        type="why"
        message="You'll need a bank account to transfer money to your investment accounts."
      />

      <OptionGrid
        options={bankAccountOptions}
        selectedValue={hasBankAccount}
        onChange={setHasBankAccount}
      />

      {/* Warning if no bank account */}
      {hasBankAccount === false && (
        <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4 sm:p-5 mb-6 animate-fadeIn">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-900 mb-2">Action Required</h3>
              <p className="text-sm text-orange-800 mb-3">
                You'll need to open a bank account before you can start investing. We recommend:
              </p>
              <ul className="text-sm text-orange-800 space-y-1 ml-4 list-disc">
                <li>Large banks: Chase, Bank of America, Wells Fargo</li>
                <li>Online banks: Ally, Marcus, Capital One 360</li>
                <li>Credit unions in your area</li>
              </ul>
              <p className="text-sm text-orange-800 mt-3">
                You can continue this journey and come back once you have an account set up.
              </p>
            </div>
          </div>
        </div>
      )}

      <StepNavigation
        onBack={prevStep}
        onNext={handleNext}
        canGoNext={hasBankAccount !== null}
        isExiting={isExiting}
        nextLabel={hasBankAccount === false ? 'Continue Anyway →' : 'Next →'}
      />

      {hasBankAccount === null && (
        <p className="text-sm text-primary-500 text-center mt-4 animate-fadeIn">
          Please select an option to continue
        </p>
      )}
    </StepContainer>
  )
}

export default BankAccount
