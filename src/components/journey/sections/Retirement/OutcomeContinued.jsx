import React from 'react'
import { ArrowRight, AlertTriangle, Info } from 'lucide-react'


const RetirementOutcomesContinued = ({ nextStep, prevStep }) => {
    return (
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mt-10 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
              401(k) Continued
            </h1>
            <p className="text-lg text-primary-200 max-w-2xl mx-auto">
              Do these two things to fully maximize your 401(k)
            </p>
          </div>
    
          {/* Card */}
          <div className="bg-primary-100 rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
            
            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Box #1 */}
                <div className="bg-white rounded-xl p-5 shadow-sm text-gray-800 text-lg">
                <p className="font-bold text-accent-green-700 text-xl mb-2">Maximize Roth</p>
                <p>
                    If your 401(k) allows it, you should be contributing Roth money to it.
                </p>
                <br></br>
                <p>
                    Roth is money you pay taxes on now and don't have to pay taxes on in retirement.
                </p>
                <br></br>
                <p>
                Roth is best to save when you are in your 20s or 30s.
                </p>
                </div>

                {/* Box #2 */}
                <div className="bg-white rounded-xl p-5 shadow-sm text-gray-800 text-lg">
                <p className="font-bold text-accent-green-700 text-xl mb-2">Investments</p>
                <p>
                    Make sure that your 401(k) is invested properly.
                </p>
                <br></br>
                <p>
                    The right investments will grow your money significantly over time.
                </p>
                </div>

            </div>
            {/* <div className="bg-purple-100 border border-purple-300 rounded-xl p-4 mb-6 flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-purple-900 flex-shrink-0 mt-0.5" />
                <p className="text-medium text-purple-900">
                    Don't know what your match is? Go to your company's HR site and navigate to your benefits document. There should be info on your match stored there</p>
            </div> */}
            <div className="bg-white rounded-xl p-5 shadow-sm text-gray-800 text-lg text-center">
                <p className="font-bold text-red-800 inline-flex items-center justify-center gap-2">
                     <AlertTriangle className="w-6 h-6 red-800" />
                    Next Steps
                </p>
                <p className="mt-2">
                    Every 401(k) is different. To ensure proper set-up, we recommend calling your 401k provider or your company's benefits office.
                </p>
            </div>
            {/* BACK and front BUTTON */}
            <div className="flex gap-4">
                <button onClick={prevStep} className="btn-journey-back flex-none">
                ← Back
                </button>
                <button
                    onClick={nextStep}
                    className="flex-1 btn-journey-next">
                    Continue to Set Up Further Retirement Savings →
                </button>
            </div>
      </div>
    </div>
    )
}
export default RetirementOutcomesContinued

