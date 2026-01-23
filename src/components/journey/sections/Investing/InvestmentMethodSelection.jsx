import React, { useState } from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'
import { UserCircle, Briefcase, Check } from 'lucide-react'

const InvestmentMethodSelection = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, direction, transitionTo } = useStepTransition()
  const [selectedMethod, setSelectedMethod] = useState(journeyData.investmentMethod || null)

  const handleNext = () => {
    updateJourneyData('investmentMethod', selectedMethod)
    transitionTo(nextStep, 'forward')
  }

  const handleBack = () => {
    transitionTo(prevStep, 'backward')
  }

  const methods = [
    {
      id: 'self-directed',
      title: 'I will do it myself, point me in the right direction',
      icon: UserCircle,
      description: 'You want to learn and make your own investment decisions',
      color: 'blue'
    },
    {
      id: 'managed',
      title: 'I want someone else to do it for me',
      icon: Briefcase,
      description: 'You prefer professional management of your investments',
      color: 'purple'
    }
  ]

  return (
    <StepContainer
      title="How do you want to pick your investments?"
      subtitle="Choose the approach that fits your preferences"
      isExiting={isExiting}
      direction={direction}
    >
      <div className="space-y-6">
        <p className="text-gray-700 leading-relaxed">
          There are different ways to manage your investments. Choose the option that best matches how involved you want to be.
        </p>

        {/* Method options */}
        <div className="space-y-4">
          {methods.map((method) => {
            const Icon = method.icon
            const isSelected = selectedMethod === method.id
            const colorClasses = {
              blue: {
                border: 'border-blue-500',
                bg: 'bg-blue-50',
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-700',
                checkBg: 'bg-blue-600'
              },
              purple: {
                border: 'border-purple-500',
                bg: 'bg-purple-50',
                iconBg: 'bg-purple-100',
                iconColor: 'text-purple-700',
                checkBg: 'bg-purple-600'
              }
            }
            const colors = colorClasses[method.color]

            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full p-6 rounded-xl border-2 transition-all text-left hover:shadow-md ${
                  isSelected
                    ? `${colors.border} ${colors.bg} shadow-md`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${colors.iconBg} flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${colors.iconColor}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg mb-2">
                          {method.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {method.description}
                        </p>
                      </div>

                      {isSelected && (
                        <div className={`${colors.checkBg} rounded-full p-1 flex-shrink-0`}>
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation
        onBack={handleBack}
        onNext={handleNext}
        canGoNext={selectedMethod !== null}
        nextLabel="Continue →"
        isExiting={isExiting}
      />
    </StepContainer>
  )
}

export default InvestmentMethodSelection
