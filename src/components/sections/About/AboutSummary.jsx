import React from 'react'
import { CheckCircle, Briefcase, Calendar, Landmark, Building } from 'lucide-react'

const AboutSummary = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  
  // Format employment status for display
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

  // Format bank type for display
  const getBankTypeLabel = (bankType) => {
    const labels = {
      'large': 'Large National Bank',
      'regional': 'Regional or Credit Union',
      'online': 'Online Bank'
    }
    return labels[bankType] || bankType
  }

  const handleNext = () => {
    nextStep()
  }

  return (
    <div className="w-full max-w-4xl mx-auto">

      <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 border-2 border-gray-200">
        
        {/* Report Header */}
        <div className="border-b-2 border-gray-300 pb-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Personal Information Summary</h2>
          <p className="text-sm text-gray-600 mt-1">Review your responses below</p>
        </div>

        {/* Report Content - Table Style */}
        <div className="space-y-1 mb-8">
          
          {/* Employment Status Row */}
          <div className="grid grid-cols-3 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3 col-span-1">
              <Briefcase className="w-5 h-5 text-gray-500" />
              <span className="font-semibold text-gray-700">Employment Status</span>
            </div>
            <div className="col-span-2 text-gray-900">
              {getEmploymentLabel(journeyData.employment)}
            </div>
          </div>

          {/* 401k Status Row (only if employed at company) */}
          {journeyData.employment === 'employed-company' && (
            <div className="grid grid-cols-3 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3 col-span-1">
                <Building className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-gray-700">Employer 401(k)</span>
              </div>
              <div className="col-span-2">
                <div className="text-gray-900">
                  {journeyData.hasEmployer401k === true ? (
                    <span className="inline-flex items-center">
                      <CheckCircle className="w-4 h-4 text-primary-600 mr-2" />
                      Yes, available
                    </span>
                  ) : (
                    'Not available or unsure'
                  )}
                </div>
                {journeyData.hasEmployer401k === true && (
                  <div className="text-sm text-accent-purple-700 mt-1 italic">
                    ✓ Great! We'll prioritize your 401(k) in recommendations.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Age Range Row */}
          <div className="grid grid-cols-3 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3 col-span-1">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="font-semibold text-gray-700">Age Range</span>
            </div>
            <div className="col-span-2">
              <div className="text-gray-900">{journeyData.age}</div>
              {['18-25', '26-35'].includes(journeyData.age) && (
                <div className="text-sm text-accent-purple-700 mt-1 italic">
                  ✓ Time is on your side for long-term growth investments
                </div>
              )}
            </div>
          </div>

          {/* Bank Account Row */}
          <div className="grid grid-cols-3 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3 col-span-1">
              <Landmark className="w-5 h-5 text-gray-500" />
              <span className="font-semibold text-gray-700">Bank Account</span>
            </div>
            <div className="col-span-2">
              <div className="text-gray-900">
                {journeyData.hasBankAccount ? (
                  <span className="inline-flex items-center">
                    <CheckCircle className="w-4 h-4 text-primary-600 mr-2" />
                    Yes
                  </span>
                ) : (
                  'Not yet'
                )}
              </div>
              {journeyData.hasBankAccount && journeyData.bankType && (
                <div className="text-sm text-gray-600 mt-1">
                  Type: {getBankTypeLabel(journeyData.bankType)}
                </div>
              )}
              {!journeyData.hasBankAccount && (
                <div className="text-sm text-orange-700 mt-1 italic">
                  ⚠ Remember to open a bank account before starting to invest
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Notes Section */}
        <div className="bg-accent-purple-50 border-l-4 border-accent-purple-500 p-4 mb-8">
          <p className="text-sm text-gray-800">
            <strong className="text-accent-purple-900">Note:</strong> Need to change something? Use the <strong>← Back</strong> button to edit your answers.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={prevStep}
            className="btn-journey-back"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            className="flex-1 btn-journey-next"
          >
            Continue to Next Section →
          </button>
        </div>

      </div>
    </div>
  )
}

export default AboutSummary