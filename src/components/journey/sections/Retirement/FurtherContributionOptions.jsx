import { ChevronDown } from "lucide-react"
import { useState } from "react"

const RetirementOptionsPage = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [open, setOpen] = useState(false)
  const user = Number(journeyData.userContribution) || 0
  const handleYes = () => {
    updateJourneyData('wantstoopenIRA', true)
    setTimeout(nextStep, 0)
  }
  
  const handleNo = () => {
    updateJourneyData('wantstoopenIRA', false)
    setTimeout(nextStep, 0)
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-primary-100 text-center mb-6">
        We Recommend Two Options
      </h1>

      <div className="bg-primary-100 rounded-2xl shadow-xl p-8 md:p-12 space-y-8 text-center">
        
        {/* Grid of options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-accent-green-700 mb-3">Increase Your 401(k) Contribution</h2>
            <p className="text-medium text-gray-900">
              You currently contribute {user}% to your 401(k).
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-accent-green-700 mb-3">Open a Roth IRA</h2>
            <p className="text-medium text-gray-900">
              Start building tax-free retirement savings.
            </p>
          </div>
        </div>

        <div 
            className="relative w-full bg-white rounded-xl border border-gray-300 p-4 cursor-pointer flex justify-center items-center"
            onClick={() => setOpen(!open)}
            >
            <p className="text-xl font-bold text-accent-green-700 mb-3 text-center">
                Which option is better for me?
            </p>

            {/* Arrow on right, absolutely positioned */}
            <ChevronDown 
                className={`h-5 w-5 text-gray-700 transition-transform absolute right-4 top-1/2 -translate-y-1/2 ${open ? "rotate-180" : ""}`} 
            />
        </div>


        {/* Hidden content */}
        {open && (
          <div className="mt-3 text-left bg-white border border-gray-200 p-4 rounded-xl">
            <p className="text-sm text-gray-800 mb-3">
              The best option depends on a few factors:
            </p>

            <ul className="list-disc pl-5 text-sm text-gray-800 space-y-2">
              <li><strong>Increase your 401(k)</strong> if you aren’t getting the full employer match yet.</li>
              <li><strong>Open a Roth IRA</strong> if you want tax-free withdrawals later.</li>
              <li>You can do both — many people contribute to a 401(k) <em>and</em> a Roth IRA.</li>
            </ul>
          </div>
        )}
        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
          <button onClick={prevStep} className="btn-journey-back flex-none">
                ← Back
          </button>
          <button onClick={handleNo} className="flex-1 btn-journey-next px-6 py-3">
            Skip Roth IRA section, I will up my 401(k) contribution
          </button>

          <button onClick={handleYes} className="flex-1 btn-journey-next px-6 py-3">
            Continue to Roth IRA section →
          </button>
        </div>
      </div>
    </div>
  )
}

export default RetirementOptionsPage
