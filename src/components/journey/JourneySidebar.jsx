'use client'

import { useState } from 'react'
import { X, Check, ChevronDown, ChevronRight } from 'lucide-react'
import { getSectionSteps } from './sections'

const JourneySidebar = ({
  sections,
  journeyData,
  currentSection,
  currentStepInSection,
  isOpen,
  onClose,
  onGoToSection,
  onStartOver,
}) => {
  // Only one section's step list is expanded at a time
  const [expandedSection, setExpandedSection] = useState(null)

  return (
    <aside
      className={`
        absolute top-18 left-0 bg-zinc-950 shadow-lg transition-transform duration-300 z-40
        md:border-r border-primary-500/40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        w-full md:w-64 flex flex-col
      `}
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      <div className="flex items-center justify-between p-6">
        <h2 className="text-xl font-bold text-primary-100">Your Journey</h2>
        <button onClick={onClose} aria-label="Close journey menu" className="p-1 hover:bg-gray-700 rounded-lg">
          <X className="w-5 h-5 text-primary-100" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-6 space-y-1">
        {sections.map((section) => {
          const steps = getSectionSteps(section, journeyData)
          const isActive = currentSection === section.id
          const isExpanded = expandedSection === section.id
          const hasMultipleSteps = steps.length > 1
          // Steps can disappear when earlier answers change (e.g. employment),
          // so ignore completed indices that no longer exist.
          const completedSteps = (journeyData.completedSteps?.[section.id] || [])
            .filter(i => i < steps.length)
          const isFullyCompleted = steps.length > 0 && completedSteps.length === steps.length

          return (
            <div key={section.id} className="mb-1">
              <button
                onClick={() => onGoToSection(section.id)}
                className={`
                  w-full text-left px-4 py-2.5 rounded-lg transition-all flex items-center justify-between
                  ${isFullyCompleted
                    ? 'bg-green-600 text-white shadow-md hover:bg-green-700'
                    : isActive
                      ? 'bg-green-50 text-green-700'
                      : 'bg-primary-50/50 text-gray-800 hover:bg-primary-300/50'
                  }
                `}
              >
                <div className="font-medium text-sm">{section.title}</div>
                {hasMultipleSteps && (
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${isFullyCompleted ? 'text-white' : 'text-gray-800'}`}>
                      {completedSteps.length}/{steps.length}
                    </span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedSection(isExpanded ? null : section.id)
                      }}
                      className="p-1 hover:bg-primary-300/30 rounded transition-colors cursor-pointer"
                      role="button"
                      aria-label={isExpanded ? 'Collapse steps' : 'Expand steps'}
                    >
                      {isExpanded
                        ? <ChevronDown className={`w-4 h-4 ${isFullyCompleted ? 'text-white' : 'text-gray-800'}`} />
                        : <ChevronRight className={`w-4 h-4 ${isFullyCompleted ? 'text-white' : 'text-gray-800'}`} />}
                    </span>
                  </div>
                )}
              </button>

              {hasMultipleSteps && isExpanded && (
                <div className="mt-1 space-y-0.5 animate-fadeIn">
                  {steps.map((step, stepIndex) => {
                    const isCurrentStep = isActive && currentStepInSection === stepIndex
                    const isStepCompleted = completedSteps.includes(stepIndex)
                    return (
                      <button
                        key={stepIndex}
                        onClick={() => onGoToSection(section.id, stepIndex)}
                        className={`
                          w-full text-left px-4 py-1.5 rounded text-xs transition-all flex items-center justify-between gap-2 cursor-pointer
                          ${isCurrentStep
                            ? 'bg-green-50 text-green-700 font-medium'
                            : isStepCompleted
                              ? 'text-primary-300 hover:text-primary-200 hover:bg-primary-700/30'
                              : 'text-primary-400 hover:text-primary-300 hover:bg-primary-700/30'
                          }
                        `}
                      >
                        <span>{step.name}</span>
                        {isStepCompleted && <Check className="w-3 h-3 text-green-500 shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="p-6 px-10">
        <button
          onClick={onStartOver}
          className="w-full px-4 py-2 text-xl font-bold text-primary-100 hover:text-red-400 rounded-lg transition-colors font-Gloock"
        >
          Start Over
        </button>
      </div>
    </aside>
  )
}

export default JourneySidebar
