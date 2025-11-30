import React, { useState } from 'react'
import { Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'

const Employer401kFollowup = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const has401k = journeyData.hasEmployer401k
  const [hasMatch, setHasMatch] = useState(journeyData.hasEmployerMatch ?? null)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleNext = () => {
    if (has401k) {
      updateJourneyData('hasEmployerMatch', hasMatch)
    }
    nextStep({ has401k })
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          {has401k ? '401(k) Match' : 'Next Steps'}
        </h1>
        <p className="text-lg text-primary-200 max-w-3xl mx-auto">
          {has401k
            ? 'Does your employer match your 401(k) contributions?'
            : "Let's move forward by setting up your first investment accounts."}
        </p>
      </div>

      <div className="bg-primary-100 rounded-2xl shadow-xl p-8 md:p-12">
        {/* CASE 1: No 401k */}
        {!has401k && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <p className="text-lg text-gray-800 mb-6">
              You indicated that you <strong>do not have a 401(k)</strong>.
            </p>
            <button
              onClick={handleNext}
              className="bg-accent-green-600 hover:bg-accent-green-700 text-white text-lg font-semibold px-8 py-3 rounded-xl shadow-md transition-all duration-300"
            >
              Continue to Set Up an IRA Account →
            </button>
          </div>
        )}

        {/* CASE 2: Has 401k — Ask About Match */}
        {has401k && (
          <>

            {/* Not sure? Learn more section */}
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="w-full mb-4 flex items-center justify-between px-4 py-3 bg-accent-green-50 border border-accent-green-300 rounded-lg hover:bg-accent-green-100 transition-colors"
            >
              <span className="font-semibold text-accent-green-900 flex items-center gap-2">
                What is a 401k match?
              </span>
              {showExplanation ? (
                <ChevronUp className="w-5 h-5 text-accent-green-700" />
              ) : (
                <ChevronDown className="w-5 h-5 text-accent-green-700" />
              )}
            </button>

            {/* Expandable explanation */}
            {showExplanation && (
              <div className="mb-6 bg-white border border-gray-300 rounded-xl p-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-900 mb-4">What is a 401(k) Match?</h3>
                <p className="text-gray-700 mb-5">
                  A 401(k) match is <strong>free money from your employer</strong>. When you put money into your 401(k), your company adds extra money on top of it.
                </p>

                <h4 className="font-bold text-gray-900 mb-2">Why do companies do this?</h4>
                <ul className="list-disc list-inside text-gray-700 mb-5 space-y-1 ml-2">
                  <li>To help you save for retirement</li>
                  <li>To compete for good employees (it's a valuable benefit)</li>
                </ul>

                <h4 className="font-bold text-gray-900 mb-2">Simple example:</h4>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-5">
                  <p className="text-gray-700 mb-2">
                    Your company offers a <strong>5% match</strong>.
                  </p>
                  <p className="text-gray-700 mb-2">
                    You earn $100 per paycheck and contribute 5% ($5).
                  </p>
                  <p className="text-gray-700">
                    Your company adds another $5. <strong>That's $10 total going into your retirement!</strong>
                  </p>
                </div>

                <div className="bg-accent-green-50 border border-accent-green-300 p-4 rounded-lg mb-5">
                  <p className="font-semibold text-accent-green-900 mb-2">⚠️ Important Rule:</p>
                  <p className="text-sm text-gray-700">
                    You must contribute at least the match percentage to get the free money. If your company matches 5% and you only contribute 3%, you're leaving money on the table.
                  </p>
                </div>

                <h4 className="font-bold text-gray-900 mb-2">
                  What does "50% up to 6%" mean?
                </h4>
                <p className="text-gray-700 mb-3">
                  This is a common setup. It means your company will contribute <strong>50% of what you contribute, up to 6% of your salary</strong>.
                </p>

                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                  <p className="font-semibold text-gray-900 mb-3">Example breakdown:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-gray-400">
                          <th className="text-left py-2 px-3 font-semibold text-gray-900">You Contribute</th>
                          <th className="text-left py-2 px-3 font-semibold text-gray-900">Company Adds</th>
                          <th className="text-left py-2 px-3 font-semibold text-gray-900">Total</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700">
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-3">3%</td>
                          <td className="py-2 px-3">1.5%</td>
                          <td className="py-2 px-3 font-semibold">4.5%</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-3 bg-accent-green-50">6%</td>
                          <td className="py-2 px-3 bg-accent-green-50">3%</td>
                          <td className="py-2 px-3 font-semibold bg-accent-green-50">9% ✓</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3">10%</td>
                          <td className="py-2 px-3">3% (maxed out)</td>
                          <td className="py-2 px-3 font-semibold">13%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    💡 To get the full match (3%), you need to contribute at least 6%. Anything above 6% doesn't get matched, but still grows your retirement savings.
                  </p>
                </div>

                <p className="text-sm text-gray-600 mt-4">
                  Check your employee handbook, HR portal, or ask your HR department if you're not sure whether your company offers a match.
                </p>
              </div>
            )}

            {/* Yes/No buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                { value: true, label: 'Yes, my employer matches' },
                { value: false, label: 'No match / Not sure' }
              ].map(option => (
                <button
                  key={option.value.toString()}
                  onClick={() => setHasMatch(option.value)}
                  className={`flex items-center justify-between px-6 py-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${hasMatch === option.value
                      ? 'border-accent-green-600 bg-accent-green-50 shadow-md'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                >
                  <span className="font-medium text-gray-800">{option.label}</span>
                  {hasMatch === option.value && (
                    <Check className="w-5 h-5 text-accent-green-600" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button onClick={prevStep} className="btn-journey-back">
                ← Back
              </button>
              <button
                onClick={handleNext}
                disabled={hasMatch === null}
                className={`flex-1 ${
                  hasMatch !== null
                    ? 'btn-journey-next'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next →
              </button>
            </div>

            {hasMatch === null && (
              <p className="text-sm text-gray-500 text-center mt-4">
                Please select an option to continue
              </p>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 2000px;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default Employer401kFollowup