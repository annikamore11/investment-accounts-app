import React from 'react'
import { TrendingUp, Shield, CheckCircle } from 'lucide-react'

const EmergencyFundSummary = ({ journeyData, nextStep, prevStep }) => {
  const hasEmergencyFund = journeyData.hasEmergencyFund
  const emergencyFundGoal = journeyData.emergencyFundGoal || 0
  
  // Calculate interest comparison
  const years = 5
  const bankValue = emergencyFundGoal
  const spaxxValue = emergencyFundGoal * Math.pow(1.05, years)
  const difference = spaxxValue - bankValue

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          {hasEmergencyFund ? "You're All Set!" : "Your Emergency Fund Plan"}
        </h1>
        <p className="text-lg text-primary-200 max-w-4xl mx-auto">
          {hasEmergencyFund ? "Great job being prepared" : "Here's what we'll help you set up"}
        </p>
      </div>

      <div className="bg-primary-100 rounded-xl shadow-xl p-8 md:p-12">
  
        <div>
          <div className="bg-green-50 border-2 border-green-600 rounded-xl p-8 mb-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-900 mb-2">
              Excellent Work!
            </h2>
            <p className="text-green-800">
              You already have an emergency fund set up. That's a huge accomplishment and puts you ahead of most people.
            </p>
          </div>

          <div className="bg-accent-purple-50 border border-accent-purple-300 rounded-xl p-6 mb-6">
            <p className="text-sm text-accent-purple-900">
              <strong>Quick Check:</strong> Make sure your emergency fund is earning interest! If it's sitting in a regular checking/savings account earning 0%, consider moving it to a money market fund like SPAXX to earn ~5% annually.
            </p>
          </div>

          <div className="flex gap-4">
            <button onClick={prevStep} className="btn-journey-back">
              ← Back
            </button>
            <button onClick={nextStep} className="flex-1 btn-journey-next">
              Continue to Retirement Planning →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmergencyFundSummary