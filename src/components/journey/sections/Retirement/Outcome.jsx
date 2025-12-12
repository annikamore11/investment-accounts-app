import React from 'react'
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

const RetirementOutcomes = ({ journeyData, nextStep, prevStep }) => {
  const user = Number(journeyData.userContribution) || 0
  const company = Number(journeyData.companyMatch) || 0
  const match = Number(journeyData.matchPercent) || 0

  let companyReal
  if (user >= company) {
    companyReal = company * (match / 100)
  } else {
    companyReal = user * (match / 100)
  }

  const totalContribution = user + company;


return (
  <div className="w-full max-w-4xl mx-auto">
    {/* Header */}
    <div className="text-center mt-10 mb-6 lg:mb-10">
      <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
        401(k) Contribution Summary
      </h1>
    </div>

    <div className="w-full max-w-3xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg space-y-8">



      {/* ✅ DATA CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">

        <div
          className={`p-4 rounded-xl border ${
          user < company ? "bg-red-100" : "bg-gray-100"
        }`}
        >
          <p className="text-sm text-gray-600">Your Contribution</p>
          {/* <p className="text-2xl font-bold text-gray-800">{user}%</p> */}
          <p className={`text-2xl font-bold ${
            user < company ? "text-red-700" : "text-gray-800"
          }`}>
            {user}%
          </p>
        </div>

        <div className="p-4 rounded-xl bg-gray-100 border">
          <p className="text-sm text-gray-600">Employer Match</p>
          <p className="text-2xl font-bold text-gray-800">{company}%</p>
          {/* <p className={`text-2xl font-bold ${
            user < company ? "text-red-700" : "text-gray-800"
          }`}>
            {companyReal}%
          </p> */}
        </div>

        <div className="p-4 rounded-xl bg-gray-100 border">
          <p className="text-sm text-gray-600"> Total Contribution</p>
          <p className="text-2xl font-bold text-gray-800">
            {totalContribution}%
          </p>
        </div>

      </div>

   
      {/* ✅ STATUS MESSAGE */}
      <div
        className={`mt-4 p-4 rounded-lg border text-center ${
          user < company
            ? "border-red-700 bg-red-100"
            : "border-green-500 bg-green-100"
        }`}
      >
        {user < company ? (
          <span className="text-lg text-red-700">
            <strong>
              You are contributing less than {company}%, you are losing free money!
            </strong>
            <br />
            <span className="text-sm">
              Increase contributions by {company - user}% to get your full match.
            </span>
          </span>
        ) : totalContribution < 15 ? (
          <span className="text-lg text-green-700">
            Great, you are maximizing your company match!
          </span>
        ) : (
          <span className="text-lg text-green-700">
            You are maximizing your match AND hitting the 15% benchmark!
          </span>
        )}
      </div>

      {/* ✅ 15% WARNING */}
      {totalContribution < 15 && (
        <div className="mt-2 p-4 rounded-lg border border-red-700 bg-red-100 text-center">
          <span className="text-lg text-red-700">
            You are {15 - totalContribution}% away from the 15% goal.
          </span>
        </div>
      )}
      {/* ✅ GOAL METER */}
      <div className="space-y-1">   {/* ⬅ smaller spacing */}

        <div className="flex justify-between text-m font-semibold text-gray-600">
          <span>Progress Toward 15% Goal</span>
          <span>{totalContribution}% / 15%</span>
        </div>

        <div className="relative h-4 w-full bg-gray-100 rounded-full overflow-hidden">
          {/* User Contribution */}
          <div
            className="absolute top-0 left-0 h-full bg-green-800"
            style={{ width: `${Math.min(user, 15) / 15 * 100}%` }}
          />

          {/* Company Match */}
          <div
            className="absolute top-0 left-0 h-full bg-green-500 opacity-60"
            style={{
              width: `${Math.min(totalContribution, 15) / 15 * 100}%`,
            }}
          />

          {/* 15% Goal Marker */}
          <div className="absolute right-0 top-0 h-full w-1" />
        </div>

        {/* ✅ LEGEND — snug under bar */}
        <div className="flex gap-6 text-s text-gray-600 leading-tight">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-800 rounded-sm" />
            <span>Your Contribution</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-sm opacity-60" />
            <span>Company Match</span>
          </div>
        </div>

      </div>

      {/* BACK and front BUTTON */}
      <div className="flex gap-4">
        <button onClick={prevStep} className="btn-journey-back flex-none">
          ← Back
        </button>
        <button
            onClick={nextStep}
            className="flex-1 btn-journey-next">
            Continue to Next Step →
          </button>
      </div>
    </div>
  </div>
)
}


export default RetirementOutcomes
