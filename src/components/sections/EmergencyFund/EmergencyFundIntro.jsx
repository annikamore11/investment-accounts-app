import React from 'react'
import { Shield, TrendingUp, AlertTriangle } from 'lucide-react'
import CompoundInterestChart from '@/components/charts/CompoundInterestChart'


const EmergencyFundIntro = ({ journeyData, nextStep, prevStep }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          Why You Need an Emergency Fund
        </h1>
        <p className="text-lg text-primary-200 max-w-4xl mx-auto">
          Protect yourself before you invest
        </p>
      </div>

      <div className="bg-primary-100 rounded-xl shadow-xl p-8 md:p-12">
        <div className="bg-purple-100 border border-purple-300 rounded-xl p-4 mb-6">
          <p className="text-sm text-purple-900">
            <strong>Why this matters:</strong> The first step to financial security is to learn about and set up an emergency fund. This is crucial before planning for retirement or extra investments.
          </p>
        </div>
        {/* Why Emergency Fund */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-8">
        {/* What is Emergency Fund */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="w-6 h-6 text-gray-600 mr-2" />
              What Is an Emergency Fund?
            </h3>
            <p className="text-gray-700 mb-4">
              3-6 months of expenses sitting in a safe, accessible account that earns interest.
            </p>
            <div className="bg-gray-50 border border-gray-400 rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-2">The Rules:</p>
              <div className="space-y-1 text-sm text-gray-700">
                <p>✓ Keep separate from spending money</p>
                <p>✓ Easy to access in true emergencies</p>
                <p>✓ Earns interest while it sits there</p>
                <p>✓ NOT for vacations or shopping</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 text-gray-600 mr-2" />
              Life Happens
            </h3>
            <div className="space-y-2 text-gray-700 mb-4 text-left">
              <p>• Car breaks down: $2,000 in repairs</p>
              <p>• Lose your job: 3 months to find a new one</p>
              <p>• Medical emergency: $5,000 deductible</p>
              <p>• Need to move: First/last month rent + deposit</p>
            </div>
            <p className="text-gray-800 font-semibold">
              Without savings, you'll rack up credit card debt or worse.
            </p>
          </div>
        </div>

        {/* Where to Keep It */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 text-gray-600 mr-2" />
            Where Should You Keep It?
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-primary-50 border border-gray-400 rounded-lg p-4">
              <p className="font-bold text-gray-900 mb-2">Regular Bank Checkings/Savings Account</p>
              <p className="text-sm text-gray-700 mb-2">Interest: <strong>Typically 0% - %1</strong></p>
              <p className="text-sm text-gray-600">
                Money can lose value to inflation
              </p>
            </div>
            
            <div className="bg-green-50 border border-gray-400 rounded-lg p-4">
              <p className="font-bold text-gray-900 mb-2">Money Market Fund (SPAXX)</p>
              <p className="text-sm text-gray-700 mb-2">Interest: <strong>~ 3.5% - 5%</strong></p>
              <p className="text-sm text-gray-600">
                Just as safe, grows your money
              </p>
            </div>
          </div>

          <CompoundInterestChart principal={10000} rate={0.05} years={5} />
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button onClick={prevStep} className="btn-journey-back">
            ← Back
          </button>
          <button onClick={nextStep} className="flex-1 btn-journey-next">
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmergencyFundIntro