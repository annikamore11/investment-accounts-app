import React, { useState, useEffect } from 'react'
import { LogIn } from 'lucide-react'

const Welcome = ({ nextStep }) => {
  const [visibleSteps, setVisibleSteps] = useState(0)
  
  const steps = [
    { number: 1, text: "Plan emergency fund" },
    { number: 2, text: "Choose retirement account" },
    { number: 3, text: "Select investments" },
    { number: 4, text: "Set up automation" }
  ]

  useEffect(() => {
    // Animate steps appearing one by one
    const timers = steps.map((_, index) => 
      setTimeout(() => {
        setVisibleSteps(index + 1)
      }, 400 * (index + 1)) // 400ms delay between each step
    )

    return () => timers.forEach(timer => clearTimeout(timer))
  }, [])

  return (
    <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3 animate-fadeIn">
            Welcome to Your Financial Journey
          </h1>
          
          <p className="text-lg text-primary-200 max-w-2xl mx-auto animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            We're here to help you take control of your financial future
          </p>
        </div>

        {/* Journey Steps */}
        <div className="bg-primary-100 rounded-xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Journey
          </h2>
          
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`flex items-center space-x-3 bg-primary-200 rounded-lg p-3.5 transition-all duration-500 ${
                  visibleSteps > index 
                    ? 'translate-x-0 opacity-100' 
                    : 'translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                  visibleSteps > index
                    ? 'bg-accent-green-600 scale-100'
                    : 'bg-gray-300 scale-75'
                }`}>
                  <span className="text-white text-sm font-bold">{step.number}</span>
                </div>
                <span className="text-gray-700 text-sm font-medium">{step.text}</span>
                
                {/* Checkmark appears after step is visible */}
                {visibleSteps > index && (
                  <div className="ml-auto animate-fadeIn">
                    <svg className="w-5 h-5 text-accent-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section - CTA */}
        <div className="bg-primary-100 rounded-xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Login reminder */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <LogIn className="w-6 h-6 text-accent-green-600" />
              </div>
              <div className="text-left">
                <p className="text-base font-bold text-gray-900">
                  Login or sign up to save progress
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => window.history.back()}
                className="btn-journey-back"
              >
                ← Back
              </button>
              <button
                onClick={nextStep}
                className="flex-1 md:flex-none btn-journey-next"
              >
                Get Started →
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}

export default Welcome