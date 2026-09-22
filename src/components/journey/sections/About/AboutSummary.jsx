'use client'

import { Briefcase, Calendar, Building } from 'lucide-react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'

const EMPLOYMENT_LABELS = {
  'employed-company': 'Employed at a company',
  'self-employed': 'Self-employed',
  'unemployed': 'Not currently working',
}

const BANK_TYPE_LABELS = {
  large: 'Large National Bank',
  regional: 'Regional or Credit Union',
}

const SummaryRow = ({ icon: Icon, label, children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 py-4 border-b border-primary-200 hover:bg-primary-50 transition-colors">
    <div className="flex items-center space-x-3 col-span-1 mb-2 sm:mb-0">
      <Icon className="w-5 h-5 text-primary-500" />
      <span className="font-semibold text-primary-700">{label}</span>
    </div>
    <div className="col-span-2 text-primary-900">{children}</div>
  </div>
)

const AboutSummary = ({ journeyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()

  return (
    <StepContainer
      isExiting={isExiting}
    >
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-12 border-2 border-primary-200">
        <div className="border-b-2 border-primary-300 pb-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-900">Personal Information Summary</h2>
          <p className="text-sm text-primary-600 mt-1">Review your responses below</p>
        </div>

        <div className="space-y-1 mb-8">
          <SummaryRow icon={Briefcase} label="Employment Status">
            {EMPLOYMENT_LABELS[journeyData.employment] || journeyData.employment}
          </SummaryRow>
          <SummaryRow icon={Calendar} label="Age Range">{journeyData.age}</SummaryRow>
          {journeyData.bankType && (
            <SummaryRow icon={Building} label="Bank Type">
              {BANK_TYPE_LABELS[journeyData.bankType] || journeyData.bankType}
            </SummaryRow>
          )}
          {journeyData.employment === 'employed-company' && (
            <SummaryRow icon={Building} label="Employer 401(k)">
              {journeyData.hasEmployer401k ? 'Yes' : 'No or Not Sure'}
            </SummaryRow>
          )}
        </div>

        <StepNavigation
          onBack={prevStep}
          onNext={() => transitionTo(nextStep)}
          isExiting={isExiting}
          nextLabel="Continue →"
        />
      </div>
    </StepContainer>
  )
}

export default AboutSummary
