import React from 'react'

const RetirementOutcomes = ({ journeyData, prevStep }) => {
  const user = Number(journeyData.userContribution) || 0
  const company = Number(journeyData.salaryMatchLimit) || 0
  const match = Number(journeyData.matchPercent) || 0

  let companyReal;

  if (user >= company) {
    companyReal = company * (match / 100);
  } else {
    companyReal = user * (match / 100);
  }

  const totalContribution = user + companyReal;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          Your Recommended Retirement Savings
        </h1>
      </div>

      <div className="w-full max-w-3xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg space-y-6">
        <p className="text-lg text-gray-800">
          We recommend that you save <strong>15%</strong> of your salary toward retirement.
        </p>

        <div className="space-y-4 text-gray-700 text-lg">
        <p>
          <strong>You are contributing: </strong> 
          {user}%
          
          
        </p>
        <p>
            <strong>Your company is contributing: </strong> 
            <span
              className={
                user < company
                  ? "text-red-700" 
                  : "text-black" // otherwise
              }
            >
              {companyReal}%{" "}
            </span>
            
            <span className="text-sm text-gray-600">
              ({match}% of what you're contributing up to {company}%)
            </span>
          </p>
          <p>
            <strong>Total amount contributed:</strong>{' '}
            <span
              className={
                totalContribution < 15
                  ? "text-black" 
                  : "text-green-700" // otherwise
              }
            >
              <strong>{totalContribution}%</strong>
            </span>
          </p>
          {/* Message based on total contribution */}
          <div className={`mt-4 p-4 rounded-lg border text-center ${
            user < company
              ? "border-red-700 bg-red-100"
              : "border-green-500 bg-green-100"
          }`}>
            {user < company ? (
              <span className="text-lg text-red-700">
                <strong>You are contributing less than {company}%, you are losing free money!</strong>
                <br />
                <span className="text-sm">
                  We recommend you increase your contributions by {company-user}% to get your full match
                </span>
              </span>
            ) : user >= company && totalContribution < 15 ? (
              <span className="text-lg text-green-700">
                Good news: You are contributing {company}%, which means your maximizing your company match!
              </span>
            ) : (
              <span className="text-lg text-green-700">
                You are maximizing your company match AND hitting the 15% benchmark
              </span>
            )}
          </div>
          {user >= company && totalContribution < 15 && (
            <div className="mt-2 p-4 rounded-lg border border-red-700 bg-red-100 text-center">
              <span className="text-lg text-red-700">
                Bad news: You are not hitting the 15% benchmark!
                <br />
                <span className="text-sm">
                To get to 15%, we would recommend you increase your contributions to retirement by {15-totalContribution}%
                </span>
                {/* <br />
                <span className='text-sm'>
                  If you feel like you can do that, get in touch with your 401k provider, or your company’s benefits office to increase contributions
                </span> */}
              </span>
            </div>
          )}
          
        </div>
        

        {/* Back button */}
        <div className="flex mt-6">
          <button onClick={prevStep} className="btn-journey-back">
            ← Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default RetirementOutcomes
