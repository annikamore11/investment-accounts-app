'use client'

import { useState, useEffect } from 'react'
import { X, Check, RotateCcw, ChevronDown, Compass, User, Wallet, Shield, PiggyBank, TrendingUp, Send } from 'lucide-react'
import { getSectionCompletion } from './sections'

// Same icon language as the Home dashboard's section cards, so a section
// reads as the same thing in both places.
const SECTION_ICONS = {
  welcome: Compass,
  aboutYou: User,
  budget: Wallet,
  emergencyFund: Shield,
  retirement: PiggyBank,
  investing: TrendingUp,
}

// Flight Path Waypoint System: every section is a leg of one flight plan,
// always visible at once, so a user never loses their place. Marker shape carries
// the state (complete/current/ahead) independently of its color, so the
// distinction survives grayscale or color-blind viewing too. A section's
// steps are named, never a blind guess — click a header to drop its step
// list down, click again to close it.
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
  const [expandedSection, setExpandedSection] = useState(currentSection)
  // Which section's connector line should play the flight animation.
  // Separate from `expandedSection` on purpose: that also gets set by the
  // effect below (external nav following along), and the flight should only
  // play for an actual click here, not every time a section happens to be
  // expanded (including on first mount, where the current section starts
  // pre-expanded with nothing "clicked" yet).
  const [clickExpandedSection, setClickExpandedSection] = useState(null)

  // Follow along automatically when navigation happens outside the sidebar
  // (the in-page Back/Next buttons) — only a deliberate click here should
  // ever collapse the section you're actually on.
  useEffect(() => {
    setExpandedSection(currentSection)
  }, [currentSection])

  const legs = sections.map((section) => {
    const { steps, completedSteps, isFullyCompleted } = getSectionCompletion(section, journeyData)
    return {
      section,
      steps,
      completedSteps,
      isFullyCompleted,
      isCurrent: currentSection === section.id,
    }
  })

  return (
    <aside
      className={`
        journey-theme absolute top-18 left-0 journey-background shadow-lg transition-transform duration-300 z-40
        md:border-r border-primary-700/60
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        w-full md:w-72 flex flex-col
      `}
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      <div className="flex items-center justify-between p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-primary-300">Your flight plan</span>
        <button onClick={onClose} aria-label="Close journey menu" className="p-2 -m-1 hover:bg-primary-800/60 rounded-md">
          <X className="w-5 h-5 text-primary-100" />
        </button>
      </div>

      {/* The waypoint rail: every leg's marker stays visible; the rail
          segment between markers is a flex-filled line, not a manually
          measured absolute one, so it always reaches the next marker
          exactly, expanded or not. */}
      <nav aria-label="Journey sections" className="flex-1 overflow-y-auto px-4 pt-2 pb-4">
        <ol>
          {legs.map((leg, index) => {
            const { section, steps, completedSteps, isFullyCompleted, isCurrent } = leg
            const isLast = index === legs.length - 1
            const stepCount = steps.length
            const isExpanded = expandedSection === section.id && stepCount > 1

            let markerState = 'ahead'
            if (isFullyCompleted) markerState = 'complete'
            else if (isCurrent) markerState = 'current'
            else if (completedSteps.length > 0) markerState = 'in-progress'

            const handleHeaderClick = () => {
              onGoToSection(section.id)
              if (stepCount > 1) {
                const willExpand = expandedSection !== section.id
                setExpandedSection(willExpand ? section.id : null)
                if (willExpand) setClickExpandedSection(section.id)
              }
            }

            // Only a direct click plays the flight — a section that's
            // expanded because it's just the current one on mount, or
            // because external nav followed along, gets no animation.
            const playFlight = isExpanded && clickExpandedSection === section.id

            return (
              <li key={section.id} className="flex gap-3">
                {/* Rail column: marker + a line that stretches to fill
                    whatever height this row ends up being — including the
                    step list once expanded, with no height measurement
                    needed since flex just stretches this column to match. */}
                <div className="flex flex-col items-center">
                  <WaypointMarker state={markerState} Icon={SECTION_ICONS[section.id]} />
                  {/* Every leg gets this column, the last one included — but
                      the last one has nothing below it to connect to, so
                      unlike the others its line should stay fully absent
                      while collapsed, only appearing once its own steps are
                      actually open (clicked or otherwise). */}
                  <div className="relative w-0.5 flex-1 my-1">
                    {/* Click-only: the line itself grows into place (same
                        technique as the footer's line — a real `height`
                        animation with one plain ease-out curve, not a
                        transform trick or a static duplicate sitting
                        underneath a separate overlay) with a paper
                        airplane riding its leading edge, timed to this
                        section's own step list unfurling. Once grown it
                        just stays, exactly like the footer's line, so
                        there's nothing for it to "reveal" underneath.
                        Green, not amber — amber stays reserved for the
                        current-position marker. */}
                    <span
                      aria-hidden="true"
                      className={`absolute top-0 w-0.5 ${isFullyCompleted ? 'bg-accent-green-500' : 'bg-primary-600'} ${
                        playFlight ? 'rail-line-grow h-0' : isLast && !isExpanded ? 'h-0' : 'h-full'
                      }`}
                    />
                    {playFlight && (
                      <Send
                        aria-hidden="true"
                        className="rail-plane-fall absolute left-1/2 top-0 z-20 w-4 h-4 text-accent-green-300 pointer-events-none"
                        strokeWidth={2.25}
                      />
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0 pb-4">
                  <button
                    onClick={handleHeaderClick}
                    aria-current={isCurrent ? 'step' : undefined}
                    aria-expanded={stepCount > 1 ? isExpanded : undefined}
                    className="flex w-full items-center gap-2 text-left rounded-md -m-1 p-1 pt-0.5 transition-colors hover:bg-primary-50/10"
                  >
                    <span className="flex-1 min-w-0">
                      <span className={`block text-base md:text-sm ${isCurrent ? 'font-bold text-primary-50' : 'font-medium text-primary-200'}`}>
                        {section.title}
                      </span>
                      {stepCount > 1 && (
                        <span className="block text-sm md:text-xs text-primary-400 mt-0.5">
                          {completedSteps.length}/{stepCount} steps
                        </span>
                      )}
                    </span>
                    {stepCount > 1 && (
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 text-primary-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    )}
                  </button>

                  {isExpanded && (
                    <ul className="mt-1.5 space-y-0.5">
                      {steps.map((step, stepIndex) => {
                        const isStepCurrent = isCurrent && currentStepInSection === stepIndex
                        const isStepDone = completedSteps.includes(stepIndex)
                        return (
                          <li key={stepIndex}>
                            <button
                              onClick={() => onGoToSection(section.id, stepIndex)}
                              aria-current={isStepCurrent ? 'step' : undefined}
                              className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm md:text-xs transition-colors ${
                                isStepCurrent
                                  ? 'bg-amber-400/20 text-primary-50 font-semibold'
                                  : isStepDone
                                    ? 'text-primary-200 hover:bg-primary-50/10'
                                    : 'text-primary-400 hover:bg-primary-50/10'
                              }`}
                            >
                              {isStepDone ? (
                                <Check className="w-3 h-3 text-accent-green-400 shrink-0" aria-hidden="true" />
                              ) : (
                                <span
                                  className={`h-1.5 w-1.5 rounded-full shrink-0 ${isStepCurrent ? 'bg-amber-400' : 'bg-primary-600'}`}
                                  aria-hidden="true"
                                />
                              )}
                              <span className="truncate">{step.name}</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </nav>

      <div className="p-4 border-t border-primary-700/40">
        <button
          onClick={onStartOver}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary-300 hover:text-rust-400 hover:bg-rust-900/30 rounded-md transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Start Over
        </button>
      </div>
    </aside>
  )
}

// Each section's own topic icon (same set as the Home dashboard cards) sits
// in the marker at all times — state shows as the ring/fill around it, plus
// a stamped check badge once a leg is done, so the section stays
// recognizable and the state is never carried by color alone.
const WaypointMarker = ({ state, Icon }) => {
  const base = 'relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full'

  if (state === 'complete') {
    return (
      <span className={`${base} bg-accent-green-500 text-white shadow-sm`}>
        {Icon && <Icon className="w-4 h-4" strokeWidth={2.25} />}
        <span className="absolute -bottom-0.5 -right-0.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-primary-50 ring-2 ring-accent-green-500">
          <Check className="w-2.5 h-2.5 text-accent-green-600" strokeWidth={3.5} />
        </span>
      </span>
    )
  }
  if (state === 'current') {
    return (
      <span className={`${base} bg-amber-400 text-primary-900 ring-2 ring-amber-200/60 shadow-sm`}>
        {Icon && <Icon className="w-4 h-4" strokeWidth={2.25} />}
      </span>
    )
  }
  if (state === 'in-progress') {
    return (
      <span className={`${base} border-2 border-accent-green-500 bg-primary-50 text-accent-green-600`}>
        {Icon && <Icon className="w-4 h-4" strokeWidth={2} />}
      </span>
    )
  }
  return (
    <span className={`${base} border-2 border-dashed border-primary-500 bg-transparent text-primary-400`}>
      {Icon && <Icon className="w-4 h-4" strokeWidth={2} />}
    </span>
  )
}

export default JourneySidebar
