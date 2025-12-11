'use-client'

import React from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic' 
import { PiggyBank, Target, TrendingUp, ArrowRight } from 'lucide-react'

const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { 
    ssr: false,
    loading: () => <div style={{ height: '300px', width: '100%' }} /> // Placeholder while loading
  }
)

const ModeSelection = () => {
  const router = useRouter()

  const handleQuickLearn = (accountType) => {
    router.push(`/quick-learn/${accountType}`)
  }

  const handleStoryMode = () => {
    router.push('/journey')
  }

  return (
    <div className="min-h-screen relative static-background">
      <div className="fixed inset-0 overflow-hidden static-background"></div>

      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section with Animation */}
          <div className="text-center mb-12">
            <div className="max-w-md mx-auto mb-8">
              <Player
                autoplay
                loop
                src="/assets/animations/investing.json"
                style={{ height: '300px', width: '100%' }}
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-100 mb-4">
              Let's Get Your Money Working for You
            </h1>
            <p className="text-xl text-primary-200 max-w-3xl mx-auto">
              Like TurboTax for investing — we'll do the heavy lifting. Just answer a few questions.
            </p>
          </div>

          {/* Before/After Comparison */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2 divide-x divide-gray-200">
                
                {/* Before */}
                <div className="p-8">
                  <h3 className="font-bold text-gray-900 mb-4 text-center text-lg">
                    Without InvestEd
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 flex-shrink-0">✗</span>
                      <span>Google 50 different articles</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 flex-shrink-0">✗</span>
                      <span>Confusing financial jargon</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 flex-shrink-0">✗</span>
                      <span>Not sure what applies to YOU</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 flex-shrink-0">✗</span>
                      <span>Never actually open an account</span>
                    </li>
                  </ul>
                </div>

                {/* After */}
                <div className="p-8 bg-gradient-to-br from-green-50 to-white">
                  <h3 className="font-bold text-gray-900 mb-4 text-center text-lg">
                    With InvestEd
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 flex-shrink-0 font-bold">✓</span>
                      <span>Everything in one place</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 flex-shrink-0 font-bold">✓</span>
                      <span>Plain English explanations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 flex-shrink-0 font-bold">✓</span>
                      <span>Based on YOUR situation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 flex-shrink-0 font-bold">✓</span>
                      <span>Step-by-step account setup</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Mode Selection */}
          <h2 className="text-2xl font-bold text-primary-100 text-center mb-8">
            Choose Your Path
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Full Journey Card */}
            <div 
              className="group bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-transparent hover:border-accent-green-500 transition-all hover:scale-105 cursor-pointer"
              onClick={handleStoryMode}
            >

              {/* Content */}
              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Full Financial Journey
                  </h3>
                  <p className="text-sm text-accent-green-700 font-semibold">
                    * Recommended for most people
                  </p>
                </div>
                
                <p className="text-gray-700 mb-6 text-center">
                  Tell us about your job, income, and goals. We'll organize everything and show you exactly which accounts to open.
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-3">What you'll get:</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-accent-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-accent-green-600"></div>
                      </div>
                      <span>Emergency fund plan</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-accent-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-accent-green-600"></div>
                      </div>
                      <span>Retirement account guidance</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-accent-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-accent-green-600"></div>
                      </div>
                      <span>Investment account setup</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-accent-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-accent-green-600"></div>
                      </div>
                      <span>Complete roadmap</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleStoryMode}
                  className="w-full py-4 px-6 bg-accent-green-600 hover:bg-accent-green-700 text-white font-bold rounded-xl transition-all shadow-lg group-hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  15-30 minutes • Save progress anytime
                </p>
              </div>
            </div>

            {/* Quick Learn Card */}
            <div className="group bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all hover:scale-105">
              

              {/* Content */}
              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Jump to One Topic
                  </h3>
                  <p className="text-sm text-blue-700 font-semibold">
                    Already know what you need?
                  </p>
                </div>
                
                <p className="text-gray-700 mb-6 text-center">
                  Skip straight to opening a specific account. Quick guides, no fluff.
                </p>

                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => handleQuickLearn('savings')}
                    className="w-full p-4 bg-white hover:bg-green-50 border-2 border-gray-200 hover:border-green-400 rounded-xl transition-all text-left flex items-center space-x-3 group"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PiggyBank className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Emergency Fund</div>
                      <div className="text-xs text-gray-600">High-yield savings</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                  </button>

                  <button
                    onClick={() => handleQuickLearn('retirement')}
                    className="w-full p-4 bg-white hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-400 rounded-xl transition-all text-left flex items-center space-x-3 group"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Retirement</div>
                      <div className="text-xs text-gray-600">401(k), IRA, Roth IRA</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </button>

                  <button
                    onClick={() => handleQuickLearn('brokerage')}
                    className="w-full p-4 bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 rounded-xl transition-all text-left flex items-center space-x-3 group"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Investing</div>
                      <div className="text-xs text-gray-600">Brokerage accounts</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-6">
                  ~5 minutes per topic
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="max-w-3xl mx-auto mt-16 text-center px-4">
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 border border-gray-200">
              <p className="text-sm text-gray-700 mb-2">
                We provide educational information to help you understand your options.
              </p>
              <p className="text-xs text-gray-600">
                This is not personalized financial advice. You make your own investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModeSelection