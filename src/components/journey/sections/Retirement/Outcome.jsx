import React from 'react'
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

const RetirementOutcomes = ({ journeyData, prevStep }) => {
  const user = Number(journeyData.userContribution) || 0
  const company = Number(journeyData.salaryMatchLimit) || 0
  const match = Number(journeyData.matchPercent) || 0

  let companyReal
  if (user >= company) {
    companyReal = company * (match / 100)
  } else {
    companyReal = user * (match / 100)
  }

  const totalContribution = user + companyReal
  const targetRate = 15

  // Determine status
  const isMissingMatch = user < company
  const isGettingFullMatch = user >= company
  const isHittingTarget = totalContribution >= targetRate

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          Your Retirement Contribution Breakdown
        </h1>
        <p className="text-lg text-primary-200">
          Here's how your current contributions stack up
        </p>
      </div>

      <div className="bg-primary-100 rounded-2xl shadow-xl p-8 md:p-12">
        
        {/* Info box about the 15% guideline */}
        <div className="bg-purple-100 border border-purple-300 rounded-xl p-4 mb-6">
          <p className="text-sm text-purple-900">
            <strong>Common guideline:</strong> Many financial experts suggest saving around 15% of your income for retirement. This is a general benchmark, not personalized advice.
          </p>
        </div>

        {/* Visual Breakdown */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Current Contributions</h3>
          
          {/* Bar visualization */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">You contribute</span>
              <span className="text-lg font-bold text-blue-600">{user}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8 mb-4 relative overflow-hidden">
              <div
                className="bg-blue-500 h-8 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                style={{ width: `${(user / 20) * 100}%` }}
              >
                {user > 2 && <span className="text-white text-sm font-bold">{user}%</span>}
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Company adds</span>
              <span className={`text-lg font-bold ${isMissingMatch ? 'text-red-600' : 'text-accent-green-600'}`}>
                {companyReal.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8 mb-2 relative overflow-hidden">
              <div
                className={`h-8 rounded-full transition-all duration-500 flex items-center justify-end pr-3 ${
                  isMissingMatch ? 'bg-red-500' : 'bg-accent-green-600'
                }`}
                style={{ width: `${(companyReal / 20) * 100}%` }}
              >
                {companyReal > 2 && (
                  <span className="text-white text-sm font-bold">{companyReal.toFixed(1)}%</span>
                )}
              </div>
            </div>
            
            {/* Maximum company match benchmark */}
            <div className="relative h-6 mb-3">
              <div 
                className="absolute h-6 border-l-2 border-dashed border-accent-green-700"
                style={{ left: `${((company * match / 100) / 20) * 100}%` }}
              >
                <span className="absolute -top-1 left-2 text-xs text-accent-green-800 whitespace-nowrap font-semibold">
                  Max match: {(company * match / 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-4">
              ({match}% of what you contribute, up to {company}% of your salary)
            </p>

            <div className="border-t-2 border-gray-300 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-gray-900">Total to retirement</span>
                <span className="text-2xl font-bold text-gray-900">{totalContribution.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-10 mb-2 relative overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-accent-green-600 h-10 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                  style={{ width: `${(totalContribution / 20) * 100}%` }}
                >
                  <span className="text-white text-base font-bold">{totalContribution.toFixed(1)}%</span>
                </div>
              </div>

              {/* 15% benchmark marker */}
              <div className="relative h-6">
                <div 
                  className="absolute h-6 border-l-2 border-dashed border-gray-400"
                  style={{ left: `${(targetRate / 20) * 100}%` }}
                >
                  <span className="absolute -top-1 left-2 text-xs text-gray-600 whitespace-nowrap">
                    15% benchmark
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dollar example */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">On a $50,000 salary, this means:</p>
            <div className="space-y-1 text-sm text-gray-700">
              <p>• You contribute: ${((user / 100) * 50000).toLocaleString()}/year</p>
              <p>• Company adds: ${((companyReal / 100) * 50000).toLocaleString()}/year</p>
              <p className="font-bold text-gray-900">
                • Total saved: ${((totalContribution / 100) * 50000).toLocaleString()}/year
              </p>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        <div className="space-y-4">
          {/* Missing company match warning */}
          {isMissingMatch && (
            <div className="bg-red-50 border-2 border-red-400 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-900 text-lg mb-2">
                    You're leaving free money on the table!
                  </p>
                  <p className="text-red-800 mb-2">
                    Your company will match up to {company}%, but you're only contributing {user}%.
                  </p>
                  <p className="text-red-800 font-semibold">
                    Consider increasing your contribution by {(company - user).toFixed(1)}% to get the full match.
                  </p>
                  <p className="text-sm text-red-700 mt-2">
                    That's an extra ${(((company - user) * match / 100 / 100) * 50000).toLocaleString()}/year 
                    on a $50k salary — completely free from your employer.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Getting full match */}
          {isGettingFullMatch && !isHittingTarget && (
            <div className="bg-green-50 border-2 border-green-400 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-green-900 text-lg mb-2">
                    Great! You're getting the full company match
                  </p>
                  <p className="text-green-800">
                    You're contributing {user}%, which captures the full {company}% match from your employer.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Not hitting 15% benchmark */}
          {isGettingFullMatch && !isHittingTarget && (
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-yellow-900 text-lg mb-2">
                    You're below the 15% guideline
                  </p>
                  <p className="text-yellow-800 mb-2">
                    Your total retirement savings is {totalContribution.toFixed(1)}%, 
                    which is {(targetRate - totalContribution).toFixed(1)}% below the common 15% benchmark.
                  </p>
                  <p className="text-yellow-800">
                    To reach 15%, you could increase your 401(k) contribution 
                    to {(user + (targetRate - totalContribution)).toFixed(1)}%, or consider opening 
                    an IRA to supplement your retirement savings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Hitting or exceeding target */}
          {isHittingTarget && (
            <div className="bg-green-50 border-2 border-green-400 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-green-900 text-lg mb-2">
                    Excellent! You're meeting the 15% guideline
                  </p>
                  <p className="text-green-800">
                    You're saving {totalContribution.toFixed(1)}% of your income for retirement, 
                    which aligns with common financial planning guidelines. You're getting your 
                    full company match and building a strong retirement foundation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* What to do section */}
        <div className="mt-6 bg-accent-purple-50 border border-accent-purple-300 rounded-xl p-5">
          <h4 className="font-bold text-gray-900 mb-3">Next Steps:</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            {isMissingMatch && (
              <li>• Contact your HR department or 401(k) provider to increase your contribution percentage</li>
            )}
            {!isHittingTarget && (
              <>
                <li>• Consider opening an IRA (Individual Retirement Account) to save additional money</li>
                <li>• Review your budget to see if you can allocate more toward retirement</li>
              </>
            )}
            <li>• Check your 401(k) investment options to ensure your money is properly invested</li>
            <li>• Review your contributions annually, especially after raises</li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mt-6">
          <button onClick={prevStep} className="btn-journey-back">
            ← Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default RetirementOutcomes