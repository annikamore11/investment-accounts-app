import React from 'react'
import {  Shield, User, LogIn, Split, NotebookPen } from 'lucide-react'

const Welcome = ({ nextStep }) => {
  return (
     <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          
          <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
            Welcome to Your Financial Journey
          </h1>
          
          <p className="text-lg text-primary-200 max-w-2xl mx-auto">
            We're here to help you take control of your financial future
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="gap-6 mb-6">
          

          {/* Column 2 - Journey Steps */}
          <div className="bg-primary-100 rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              Your Journey
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 bg-primary-200 rounded-lg p-3.5 hover:bg-primary-300 transition-colors">
                <div className="w-8 h-8 bg-accent-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <span className="text-gray-700 text-sm font-medium">Plan emergency fund</span>
              </div>
              
              <div className="flex items-center space-x-3 bg-primary-200 rounded-lg p-3.5 hover:bg-primary-300 transition-colors">
                <div className="w-8 h-8 bg-accent-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <span className="text-gray-700 text-sm font-medium">Choose retirement account</span>
              </div>

              <div className="flex items-center space-x-3 bg-primary-200 rounded-lg p-3.5 hover:bg-primary-300 transition-colors">
                <div className="w-8 h-8 bg-accent-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <span className="text-gray-700 text-sm font-medium">Select investments</span>
              </div>

              <div className="flex items-center space-x-3 bg-primary-200 rounded-lg p-3.5 hover:bg-primary-300 transition-colors">
                <div className="w-8 h-8 bg-accent-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
                <span className="text-gray-700 text-sm font-medium">Set up automation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Time & CTA */}
        <div className="bg-primary-100 rounded-xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Time Estimate with Icon */}
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
    </div>
  )
}

export default Welcome