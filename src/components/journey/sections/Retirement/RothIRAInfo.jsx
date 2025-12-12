import { AlertTriangle } from "lucide-react"
import React from "react"
const RothIRAInfo = ({ nextStep, prevStep }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-16 p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-primary-100 text-center mb-6">
        What is a Roth IRA?
      </h1>
    <div className="bg-primary-100 rounded-2xl shadow-xl p-8 md:p-12 space-y-8 text-center">

    <div className="w-full max-w-4xl mx-auto p-6">
      <p className="text-lg text-gray-800 mb-6">
        Roth IRA Info
      </p>

      <div className="flex gap-4">
        <button onClick={prevStep} className="btn-journey-back flex-none">
          ← Back
        </button>
        <button
          onClick={nextStep}
          className="flex-1 btn-journey-next"
        >
          Continue to Set Up Further Retirement Savings →
        </button>
      </div>
    </div>
    </div>
    </div>
  )
}

export default RothIRAInfo


