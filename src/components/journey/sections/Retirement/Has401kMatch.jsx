import React, { useState } from 'react'
import { Percent, Info } from 'lucide-react'
import Link from 'next/link'



const Has401kMatch = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [matchPercent, setMatchPercent] = useState(journeyData.matchPercent || '')
  const [companyMatch, setCompanyMatch] = useState(journeyData.companyMatch || '')
  const [userContribution, setUserContribution] = useState(journeyData.userContribution || '')

  

  const handleNext = () => {
    updateJourneyData('matchPercent', Number(matchPercent))
    updateJourneyData('companyMatch', Number(companyMatch))
    updateJourneyData('userContribution', Number(userContribution))
    nextStep()
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mt-10 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          Understanding Your 401(k) Match
        </h1>
        {/* <p className="text-lg text-primary-200 max-w-3xl mx-auto">
          Let’s break down your company’s matching policy — this helps you make sure you’re getting the full match!
        </p> */}
      </div>

      {/* Main Card */}
      <div className="bg-primary-100 rounded-2xl shadow-xl p-8 md:p-12 space-y-8">

        {/* Step 1 */}
        <div>
          <label className="text-center block text-xl font-medium text-gray-800 mb-2">
            What is your company match?
          </label>

          <div className="relative">
            <input
              type="text"
              placeholder="e.g. 5"
              value={companyMatch}
              onChange={(e) => setCompanyMatch(e.target.value)}
              className="w-full border border-accent-green-600 rounded-xl px-4 py-3 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-green-600"
            />
            <Percent className="absolute right-4 top-3.5 text-gray-500 w-5 h-5" />
          </div>
        </div>

        {/* Step 2 */}
        {/* <div>
          <label className="block text-lg font-medium text-gray-800 mb-2">
            What’s the highest percent of your salary they’ll match?          
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Example: If the match stops at 6%, they only match the first 6% you contribute.          </p>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. 6"
              value={salaryMatchLimit}
              onChange={(e) => setSalaryMatchLimit(e.target.value)}
              className="w-full border border-accent-green-600 rounded-xl px-4 py-3 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-green-600"
            />
            <Percent className="absolute right-4 top-3.5 text-gray-500 w-5 h-5" />
          </div>
        </div> */}

        {/* Step 3 */}
        <div>
          <label className="text-center block text-xl font-medium text-gray-800 mb-2">
            What percent of your salary are you contributing right now?
          </label>
          {/* <p className="text-sm text-gray-600 mb-3">
            Example: If you put in 6% of your salary, enter “6”.         
          </p> */}
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. 9"
              value={userContribution}
              onChange={(e) => setUserContribution(e.target.value)}
              className="w-full border border-accent-green-600 rounded-xl px-4 py-3 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-green-600"
            />
            <Percent className="absolute right-4 top-3.5 text-gray-500 w-5 h-5" />
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-purple-100 border border-purple-300 rounded-xl p-4 mb-6 flex items-start space-x-3">
          <Info className="w-6 h-6 text-purple-900 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-purple-900">
            Don't know what your match is? Go to your company's HR site and navigate to your benefits document. There should be info on your match stored there</p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button onClick={prevStep} className="btn-journey-back flex-none">
            ← Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={!companyMatch || !userContribution}
            className={`flex-1 ${
              companyMatch || userContribution
                ? 'btn-journey-next'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

export default Has401kMatch
