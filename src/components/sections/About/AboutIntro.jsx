import React from 'react'
import { User, Target, TrendingUp, Shield } from 'lucide-react'

const AboutIntro = ({ nextStep }) => {
  
  const infoPoints = [
    {
      icon: Target,
      title: 'Personalized Recommendations',
      description: 'We tailor investment strategies based on your employment, age, and current financial setup.'
    },
    {
      icon: TrendingUp,
      title: 'Optimized Investment Path',
      description: 'Your age and employment status help us recommend the right timeline and account types for maximum growth.'
    },
    {
      icon: Shield,
      title: 'Set Realistic Expectations',
      description: 'Understanding your banking setup helps us guide you through account verification and setup times.'
    }
  ]

  return (
    <div className="w-full max-w-4xl mx-auto">
      
      {/* Header Section */}
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-purple-100 rounded-full mb-4">
          <User className="w-8 h-8 text-accent-purple-600" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          About You
        </h1>
        
        <p className="text-lg text-primary-200 max-w-3xl mx-auto">
          Before we begin your investment education journey, we need to collect some basic information to personalize your experience.
        </p>
      </div>

      <div className="bg-primary-100 rounded-2xl shadow-xl p-8 md:p-12">
        
        {/* Why We're Asking */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why We Need This Information
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Investing isn't one-size-fits-all. Your employment situation, age, and banking setup all influence which investment accounts you should open first and how to prioritize your contributions. This quick questionnaire helps us create a roadmap that's specific to your situation.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="space-y-4 mb-8">
          {infoPoints.map((point, index) => {
            const Icon = point.icon
            return (
              <div 
                key={index}
                className="flex items-start space-x-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-accent-purple-300 transition-colors"
              >
                <div className="w-12 h-12 bg-accent-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-accent-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {point.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {point.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Privacy Note */}
        <div className="bg-accent-green-50 border border-accent-green-200 rounded-xl p-4 mb-8">
          <p className="text-sm text-gray-800">
            <strong className="text-accent-green-900">Your Privacy:</strong> We only collect information necessary to provide personalized investment guidance. We never ask for sensitive data like Social Security numbers, account numbers, or passwords.
          </p>
        </div>

        {/* What's Next */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">What to Expect:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-accent-purple-600 mr-2">•</span>
              <span>5-6 quick questions about your employment, age, and banking</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent-purple-600 mr-2">•</span>
              <span>Takes about 2-3 minutes to complete</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent-purple-600 mr-2">•</span>
              <span>You can go back and change any answer at any time</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent-purple-600 mr-2">•</span>
              <span>A summary of your information before moving to the next section</span>
            </li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex justify-center">
          <button
            onClick={nextStep}
            className="btn-journey-next px-8"
          >
            Get Started →
          </button>
        </div>
      </div>
    </div>
  )
}

export default AboutIntro