'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, Target, Wallet, PiggyBank, TrendingUp } from 'lucide-react'

const ModeSelection = () => {
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState(null)

  const handleQuickLearn = (accountType) => {
    // Navigate to quick learn flow with selected account type
    router.push(`/quick-learn/${accountType}`)
  }

  const handleStoryMode = () => {
    // Navigate to full journey
    router.push('/journey')
  }

  return (
    <div className="min-h-screen relative static-background">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden static-background"></div>

      {/* Content */}
      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-100 mb-4">
              Welcome to Your Investment Journey
            </h1>
            <p className="text-xl text-primary-200 max-w-2xl mx-auto">
              Choose how you'd like to learn about investing and managing your money
            </p>
          </div>

          {/* Mode Options */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Story Mode */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 border-2 border-transparent hover:border-accent-green-500">
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Story Mode
              </h2>
              
              <p className="text-gray-600 mb-6 text-center">
                Get personalized recommendations based on your unique situation. We'll guide you through understanding your finances and creating a tailored investment strategy.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-accent-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-accent-green-600"></div>
                  </div>
                  <span className="text-sm text-gray-700">Personalized account recommendations</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-accent-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-accent-green-600"></div>
                  </div>
                  <span className="text-sm text-gray-700">Account opening guidance</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-accent-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-accent-green-600"></div>
                  </div>
                  <span className="text-sm text-gray-700">Complete financial overview</span>
                </div>
              </div>

              <button
                onClick={handleStoryMode}
                className="w-full py-4 px-6 bg-accent-green-600 hover:bg-accent-green-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Story Mode
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Recommended for beginners • ~15-30 minutes
              </p>
            </div>

            {/* Quick Learn Mode */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 border-2 border-transparent hover:border-blue-500">
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Quick Learn
              </h2>
              
              <p className="text-gray-600 mb-6 text-center">
                Already know what you want? Jump straight to learning how to open and manage specific account types.
              </p>

              <div className="space-y-3 mb-8">
                <button
                  onClick={() => handleQuickLearn('savings')}
                  className="w-full p-4 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-xl transition-all text-left flex items-center space-x-3 group"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <PiggyBank className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Savings Account</div>
                    <div className="text-xs text-gray-600">High-yield savings & emergency funds</div>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickLearn('retirement')}
                  className="w-full p-4 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-xl transition-all text-left flex items-center space-x-3 group"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Retirement Account</div>
                    <div className="text-xs text-gray-600">401(k), IRA, Roth IRA</div>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickLearn('brokerage')}
                  className="w-full p-4 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-xl transition-all text-left flex items-center space-x-3 group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Brokerage Account</div>
                    <div className="text-xs text-gray-600">Taxable investment accounts</div>
                  </div>
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Perfect if you know what you need • ~5 minutes per account
              </p>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  )
}

export default ModeSelection