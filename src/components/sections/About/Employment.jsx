import React, { useState } from 'react'
import { Briefcase, Check } from 'lucide-react'

const EmploymentStatus = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [employment, setEmployment] = useState(journeyData.employment || '')
  const [isExiting, setIsExiting] = useState(false)

  const handleNext = () => {
    updateJourneyData('employment', employment)

    // Only update for employed people
    if (['self-employed', 'student', 'unemployed'].includes(employment)) {
      updateJourneyData('hasEmployer401k', false)
    }
    
    // Start exit animation
    setIsExiting(true)
    // Navigate after animation completes
    setTimeout(() => {
      nextStep()
    }, 500)
  }

  const employmentOptions = [
    { value: 'employed-company', label: 'Employed at a company' },
    { value: 'self-employed', label: 'Self-employed / Freelance' },
    { value: 'student', label: 'Student' },
    { value: 'unemployed', label: 'Not currently working' },
  ]

  return (
    
    <div className={`w-full max-w-4xl mx-auto transition-all duration-500 ${
      isExiting ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
    }`}>
       
      {/* Header Section */}
      <div className="text-center mt-10 mb-6 lg:mb-10">
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ textShadow: '0 0 30px rgba(255, 255, 255, 0.5)' }}>
          Employment Status
        </h1>

      </div>
      <div className="bg-primary-100 rounded-2xl shadow-lg p-8 md:p-10 ">
        
        <p className=" text-center text-xl text-primary-700 max-w-2xl mx-auto mb-6">
          Choose the option that best describes your current situation.
        </p>

        {/* Options - use grid for better horizontal use */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {employmentOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setEmployment(option.value)}
              className={`flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all duration-200 text-left
                ${employment === option.value
                  ? 'border-accent-green-600 bg-accent-green-50 shadow-sm'
                  : 'border-primary-400 hover:border-primary-600 hover:bg-gray-100 bg-primary-50'
                }`}
            >
              <span className="font-medium text-gray-800">{option.label}</span>
              {employment === option.value && (
                <Check className="w-5 h-5 text-accent-green-600" />
              )}
            </button>
          ))}
        </div>

         {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={prevStep}
            className="btn-journey-back"
            disabled={isExiting}
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={!employment || isExiting}
            className={`flex-1 ${
              employment && !isExiting
                ? 'btn-journey-next'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next →
          </button>
        </div>

        {!employment && (
          <p className="text-sm text-gray-500 text-center mt-3">
            Please select an option to continue.
          </p>
        )}
      </div>
    </div>
  )
}

export default EmploymentStatus