'use client'

import { useState } from 'react'
import { Building, Smartphone, Briefcase, Landmark } from 'lucide-react'
import StepContainer from '@/components/ui/StepContainer'
import OptionGrid from '@/components/ui/OptionGrid'
import StepNavigation from '@/components/ui/StepNavigation'
import InfoBox from '@/components/ui/InfoBox'
import useStepTransition from '@/hooks/useStepTransition'

const BankType = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [bankType, setBankType] = useState(journeyData.bankType || '')
  const { isExiting, transitionTo } = useStepTransition()

  const handleNext = () => {
    updateJourneyData('bankType', bankType)
    transitionTo(nextStep)
  }

  const bankOptions = [
    {
      value: 'large',
      icon: <Building className="w-6 h-6" />,
      label: 'Major National Bank',
      description: 'Examples: Chase, Bank of America, Wells Fargo, Citi • Usually instant verification'
    },
    {
      value: 'regional',
      icon: <Landmark className="w-6 h-6" />,
      label: 'Regional Bank or Credit Union',
      description: 'Examples: First Interstate, Glacier, local credit unions • Takes 2-5 business days'
    },
    {
      value: 'online',
      icon: <Smartphone className="w-6 h-6" />,
      label: 'Online-Only Bank',
      description: 'Examples: Ally, SoFi, Capital One 360, Chime • Can be instant or take several days'
    },
    {
      value: 'business',
      icon: <Briefcase className="w-6 h-6" />,
      label: 'Business or Joint Account',
      description: 'Used for LLCs, shared, or company-linked accounts • Typically 3-7 days'
    }
  ]

  return (
    <StepContainer
      title="Bank Type"
      isExiting={isExiting}
      exitDirection="horizontal"
    >
      <p className="text-lg sm:text-xl text-primary-700 max-w-4xl mx-auto mb-6 text-center">
        What type of bank do you use?
      </p>

      <InfoBox
        type="why"
        message="Different bank types have different verification processes when connecting to investment accounts. This helps us set expectations."
      />

      <OptionGrid
        options={bankOptions}
        selectedValue={bankType}
        onChange={setBankType}
      />

      {/* Helpful note based on selection */}
      {(bankType === 'regional' || bankType === 'online' || bankType === 'business') && (
        <InfoBox
          type="warning"
          message="Small, online, or business accounts may require manual verification, which can result in verification delays. Don't worry - we'll guide you through it!"
        />
      )}

      <StepNavigation
        onBack={prevStep}
        onNext={handleNext}
        canGoNext={!!bankType}
        isExiting={isExiting}
      />

      {!bankType && (
        <p className="text-sm text-primary-500 text-center mt-4 animate-fadeIn">
          Please select your bank type to continue
        </p>
      )}
    </StepContainer>
  )
}

export default BankType
