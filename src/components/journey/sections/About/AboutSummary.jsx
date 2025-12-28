'use client'

import { useState } from 'react'
import { Briefcase, Calendar, Landmark, Building, Building2 } from 'lucide-react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'

const AboutSummary = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()

  const getEmploymentLabel = (employment) => {
    const labels = {
      'employed-company': 'Employed at a company',
      'self-employed': 'Self-employed / Freelance',
      'student': 'Student',
      'unemployed': 'Not currently working',
      'other': 'Other'
    }
    return labels[employment] || employment
  }

  const getBankTypeLabel = (bankType) => {
    const labels = {
      'large': 'Large National Bank',
      'regional': 'Regional or Credit Union',
      'online': 'Online Bank',
      'business': 'Business Account'
    }
    return labels[bankType] || bankType
  }

  const handleNext = () => {
    transitionTo(nextStep)
  }

  return (
    <StepContainer
      isExiting={isExiting}
      exitDirection="vertical"
    >
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-12 border-2 border-primary-200">
        <div className="border-b-2 border-primary-300 pb-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-900">Personal Information Summary</h2>
          <p className="text-sm text-primary-600 mt-1">Review your responses below</p>
        </div>

        <div className="space-y-1 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 py-4 border-b border-primary-200 hover:bg-primary-50 transition-colors">
            <div className="flex items-center space-x-3 col-span-1 mb-2 sm:mb-0">
              <Briefcase className="w-5 h-5 text-primary-500" />
              <span className="font-semibold text-primary-700">Employment Status</span>
            </div>
            <div className="col-span-2 text-primary-900">
              {getEmploymentLabel(journeyData.employment)}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 py-4 border-b border-primary-200 hover:bg-primary-50 transition-colors">
            <div className="flex items-center space-x-3 col-span-1 mb-2 sm:mb-0">
              <Calendar className="w-5 h-5 text-primary-500" />
              <span className="font-semibold text-primary-700">Age Range</span>
            </div>
            <div className="col-span-2 text-primary-900">
              {journeyData.age}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 py-4 border-b border-primary-200 hover:bg-primary-50 transition-colors">
            <div className="flex items-center space-x-3 col-span-1 mb-2 sm:mb-0">
              <Landmark className="w-5 h-5 text-primary-500" />
              <span className="font-semibold text-primary-700">Bank Account</span>
            </div>
            <div className="col-span-2 text-primary-900">
              {journeyData.hasBankAccount ? 'Yes' : 'No'}
            </div>
          </div>

          {journeyData.hasBankAccount && journeyData.bankType && (
            <div className="grid grid-cols-1 sm:grid-cols-3 py-4 border-b border-primary-200 hover:bg-primary-50 transition-colors">
              <div className="flex items-center space-x-3 col-span-1 mb-2 sm:mb-0">
                <Building className="w-5 h-5 text-primary-500" />
                <span className="font-semibold text-primary-700">Bank Type</span>
              </div>
              <div className="col-span-2 text-primary-900">
                {getBankTypeLabel(journeyData.bankType)}
              </div>
            </div>
          )}

          {journeyData.hasBankAccount && journeyData.bankInstitution && (
            <div className="grid grid-cols-1 sm:grid-cols-3 py-4 border-b border-primary-200 hover:bg-primary-50 transition-colors">
              <div className="flex items-center space-x-3 col-span-1 mb-2 sm:mb-0">
                <Building2 className="w-5 h-5 text-primary-500" />
                <span className="font-semibold text-primary-700">Bank Institution</span>
              </div>
              <div className="col-span-2 text-primary-900">
                {journeyData.bankInstitution.name}
              </div>
            </div>
          )}

          {journeyData.employment === 'employed-company' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 py-4 border-b border-primary-200 hover:bg-primary-50 transition-colors">
              <div className="flex items-center space-x-3 col-span-1 mb-2 sm:mb-0">
                <Building className="w-5 h-5 text-primary-500" />
                <span className="font-semibold text-primary-700">Employer 401(k)</span>
              </div>
              <div className="col-span-2 text-primary-900">
                {journeyData.hasEmployer401k ? 'Yes' : 'No or Not Sure'}
              </div>
            </div>
          )}
        </div>

        <StepNavigation
          onBack={prevStep}
          onNext={handleNext}
          canGoNext={true}
          isExiting={isExiting}
          nextLabel="Continue →"
        />
      </div>
    </StepContainer>
  )
}

export default AboutSummary
