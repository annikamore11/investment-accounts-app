import { AlertTriangle } from "lucide-react"
import React from "react"
const RothIRAInfo = ({ nextStep, prevStep }) => {
  return (
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
  )
}

export default RothIRAInfo


