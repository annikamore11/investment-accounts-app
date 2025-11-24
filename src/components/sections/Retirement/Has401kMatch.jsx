import React, { useState } from 'react'
import { Percent, Info } from 'lucide-react'

const Has401kMatch = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [matchPercent, setMatchPercent] = useState(journeyData.matchPercent || '')
  const [salaryMatchLimit, setSalaryMatchLimit] = useState(journeyData.salaryMatchLimit || '')
  const [userContribution, setUserContribution] = useState(journeyData.userContribution || '')

  const handleNext = () => {
    updateJourneyData('matchPercent', matchPercent)
    updateJourneyData('salaryMatchLimit', salaryMatchLimit)
    updateJourneyData('userContribution', userContribution)
    nextStep()
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mt-10 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          Understanding Your 401(k) Match
        </h1>
        <p className="text-lg text-primary-200 max-w-3xl mx-auto">
          Let’s break down your company’s matching policy — this helps you make sure you’re getting the full match!
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-primary-100 rounded-2xl shadow-xl p-8 md:p-12 space-y-8">

        {/* Step 1 */}
        <div>
          <label className="block text-lg font-medium text-gray-800 mb-2">
            How much does your company match your contributions?
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Example: If your company matches <strong>50%</strong>, they’ll contribute 50 cents for every dollar you put in.
          </p>
          <div className="relative">
            <input
              type="number"
              placeholder="e.g. 50"
              value={matchPercent}
              onChange={(e) => setMatchPercent(e.target.value)}
              className="w-full border border-accent-green-600 rounded-xl px-4 py-3 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-green-600"
            />
            <Percent className="absolute right-4 top-3.5 text-gray-500 w-5 h-5" />
          </div>
        </div>

        {/* Step 2 */}
        <div>
          <label className="block text-lg font-medium text-gray-800 mb-2">
            What’s the maximum percent of your salary they’ll match?
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Example: If your company matches up to <strong>6%</strong>, that means they’ll only match contributions on the first 6% of your salary.
          </p>
          <div className="relative">
            <input
              type="number"
              placeholder="e.g. 6"
              value={salaryMatchLimit}
              onChange={(e) => setSalaryMatchLimit(e.target.value)}
              className="w-full border border-accent-green-600 rounded-xl px-4 py-3 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-green-600"
            />
            <Percent className="absolute right-4 top-3.5 text-gray-500 w-5 h-5" />
          </div>
        </div>

        {/* Step 3 */}
        <div>
          <label className="block text-lg font-medium text-gray-800 mb-2">
            What percent of your salary do you currently contribute?
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Example: If you contribute 5% of your salary to your 401(k), enter “5” below.
          </p>
          <div className="relative">
            <input
              type="number"
              placeholder="e.g. 5"
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
          <button onClick={prevStep} className="btn-journey-back">
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={!matchPercent || !salaryMatchLimit || !userContribution}
            className={`flex-1 ${
              matchPercent && salaryMatchLimit && userContribution
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
