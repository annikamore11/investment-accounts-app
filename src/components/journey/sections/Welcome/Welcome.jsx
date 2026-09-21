'use client'

import { useState, useEffect } from 'react'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'

const STEPS = [
  'Plan emergency fund',
  'Choose retirement account',
  'Select investments',
  'Set up automation',
]

const Welcome = ({ nextStep }) => {
  const [visibleSteps, setVisibleSteps] = useState(0)
  const { isExiting, transitionTo } = useStepTransition()

  // Reveal the list one item at a time
  useEffect(() => {
    const timers = STEPS.map((_, index) =>
      setTimeout(() => {
        setVisibleSteps(index + 1)
      }, 400 * (index + 1))
    )

    return () => timers.forEach(timer => clearTimeout(timer))
  }, [])

  return (
    <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center px-2 sm:px-4">
      <div className={`w-full md:max-w-4xl mx-auto transition-all duration-500 ${
        isExiting ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}>
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-100 mb-3 animate-fadeIn px-2">
            Let&apos;s build your plan
          </h1>

          <p className="text-base sm:text-lg text-primary-200 max-w-2xl mx-auto animate-fadeIn px-4" style={{ animationDelay: '0.2s' }}>
            Tell us your income and expenses — we&apos;ll show you exactly what to do with what&apos;s left over, in order.
          </p>
        </div>

        <div className="bg-primary-100 rounded-2xl shadow-xl p-6 mb-6 animate-fadeIn">

          <div className="space-y-3 mb-8">
            {STEPS.map((text, index) => (
              <div
                key={text}
                className={`flex items-center space-x-3 border-primary-400 hover:border-primary-600 bg-primary-50 hover:bg-white hover:shadow-md hover:scale-102 rounded-lg p-3.5 transition-all ${
                  visibleSteps > index
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                  visibleSteps > index
                    ? 'bg-accent-green-600 scale-100'
                    : 'bg-primary-300 scale-75'
                }`}>
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <span className="text-primary-700 font-medium text-sm sm:text-base">{text}</span>
              </div>
            ))}
          </div>

          <StepNavigation
            onNext={() => transitionTo(nextStep)}
            canGoNext={true}
            isExiting={isExiting}
            showBack={false}
            nextLabel="Get Started →"
          />
        </div>
      </div>
    </div>
  )
}

export default Welcome
