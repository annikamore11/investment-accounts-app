import React from 'react'

const IncreaseContributionPrompt = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const user = Number(journeyData.userContribution) || 0
  const company = Number(journeyData.companyMatch) || 0
  const match = Number(journeyData.matchPercent) || 0

  const handleYes = () => {
    updateJourneyData('wantsToIncreaseContribution', true)
    setTimeout(nextStep, 0) // ensures the update happens first
  }
  
  const handleNo = () => {
    updateJourneyData('wantsToIncreaseContribution', false)
    setTimeout(nextStep, 0)
  }
  
  let companyReal;
  if (user >= company) {
    companyReal = company * (match / 100)
  } else {
    companyReal = user * (match / 100)
  }

  const totalContribution = user + company

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mt-10 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          Your 401(k) Contribution
        </h1>
        
      </div>

      {/* Card */}
      <div className="bg-primary-100 rounded-2xl shadow-xl p-8 md:p-12 space-y-8 text-center">
        <h2 className="text-lg text-gray-800 max-w-2xl mx-auto">
          You are currently contributing <strong>{user}%</strong> of your salary to your 401(k). Your employer contributes <strong>{company}%</strong>, for a total of <strong>{totalContribution}%</strong>.
        </h2>
        <p className="text-lg text-gray-800">
         Would you like to save more than the <strong>{totalContribution}%</strong> that you are already saving for retirement?
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
          <button onClick={prevStep} className="btn-journey-back flex-none">
                ← Back
          </button>
          <button onClick={handleYes} className="flex-1 btn-journey-next px-6 py-4">
            Yes, increase my contribution
          </button>

          <button onClick={handleYes} className="flex-1 btn-journey-back px-6 py-4">
            No, keep it the same
          </button>
        </div>

      </div>
    </div>
  )
}

export default IncreaseContributionPrompt
