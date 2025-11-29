import React from 'react'
import { Check } from 'lucide-react'

const RetirementIntro = ({ nextStep }) => {
  const bullets = [
    'Ensure that you are receiving your full company match in your 401(k)',
    'Save 15% of your salary towards retirement',
    'Utilize Roth and invest properly',
    'Open an IRA'
  ]

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mt-10 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-4">
          Retirement Accounts
        </h1>
        
      </div>

      {/* Bullets */}
      <div className="bg-primary-100 rounded-2xl shadow-xl p-8 md:p-12 space-y-4">
        <h1 className="text-center text-2xl text-primary-800 max-w-3xl mx-auto">
            Now that you have set up your emergency fund, let's set up and manage your retirement accounts
        </h1>
        <h2 className="text-xl text-primary-800 max-w-3xl mx-auto">
            Objective:
        </h2>
        {bullets.map((bullet, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Check className="w-6 h-6 text-accent-green-600 flex-shrink-0 mt-1" />
            <p className="text-primary-800 text-lg">{bullet}</p>
          </div>
        ))}

        {/* Next button */}
        <div className="mt-8 text-center">
          <button
            onClick={nextStep}
            className="inline-block bg-linear-to-r from-accent-green-500 to-accent-green-600 hover:from-accent-green-600 hover:to-accent-green-700 
            text-white text-xl font-bold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  )
}

export default RetirementIntro
