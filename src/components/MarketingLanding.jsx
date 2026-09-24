'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Compass, Target, Coins, TrendingUp, User, Wallet, Shield, PiggyBank } from 'lucide-react'
import HeroPlaneFlight from './HeroPlaneFlight'

// Lightweight scroll-reveal (IntersectionObserver), no animation library —
// reuses the same fadeIn/slideUp vocabulary already used across the journey
// instead of introducing framer-motion for one page.
const Reveal = ({ children, className = '', delayMs = 0 }) => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '-80px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  )
}

// Replays the hero flight animation — both the full desktop version and the
// compact mobile one — every time the hero scrolls back into view, not just
// once on first load. Keying <HeroPlaneFlight> on this counter forces a
// full remount on each re-entry, which is the clean way to restart a
// `both`-fill-mode CSS animation (toggling a class fights the "hold at end
// state" fill mode; unmounting and remounting the element does not).
const useReplayOnView = () => {
  const ref = useRef(null)
  const [playKey, setPlayKey] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPlayKey((key) => key + 1)
      },
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, playKey]
}

// The actual five legs of the flight plan, same icon language as the Home
// dashboard and JourneySidebar so a section reads as the same thing
// everywhere it appears. Shown in the hero, before the first CTA, so the
// guided journey is demonstrated rather than only described — a cold
// visitor sees the real shape of what they're about to do. Labels are
// shortened for a compact rail (matching Home's own SECTION_BLURBS spirit);
// full section titles ("Expenses & Income", "Retirement Accounts", etc.)
// still appear once inside the journey itself.
const FLIGHT_PLAN_STEPS = [
  { icon: User, label: 'About You' },
  { icon: Wallet, label: 'Budget' },
  { icon: Shield, label: 'Emergency Fund' },
  { icon: PiggyBank, label: 'Retirement' },
  { icon: TrendingUp, label: 'Investing' },
]

// Niche: people just getting started, especially those who find investing
// overwhelming or confusing — not "beginners" in the abstract. Four pillars
// of the core value prop: simple, personalized, actionable, and a path
// forward — not just "beginner-friendly."
const FEATURES = [
  {
    icon: Compass,
    title: 'Radically simple',
    desc: "No jargon left unexplained, no 47-tab research rabbit hole. A few plain questions about your life, and we handle the rest.",
  },
  {
    icon: Target,
    title: 'Built around you',
    desc: 'Every recommendation is based on your real income, expenses, and goals, not generic advice written for someone else.',
  },
  {
    icon: Coins,
    title: 'Free money, fast',
    desc: "Finish the journey with real accounts open and money that's already yours claimed, like your 401(k) match, not just a to-do list.",
  },
  {
    icon: TrendingUp,
    title: 'A clear next step',
    desc: "Once the basics are handled, we point you toward what's next: passive income, growing your retirement, and beyond.",
  },
]

/**
 * The marketing pitch for a true cold visitor (no account, no guest
 * progress) — Home.jsx renders this instead of the returning-visitor
 * dashboard. Flight Path Waypoint world: forest/paper/amber, ClashGrotesk +
 * Gloock (reserved for stat numbers/divider titles only, never this page's
 * prose headlines), blunt radius, no gradients except the hero/CTA's own
 * dawn-background.
 */
export default function MarketingLanding() {
  const [heroRef, flightPlayKey] = useReplayOnView()
  return (
    <div className="journey-theme">
      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative dawn-background min-h-screen flex items-center pt-40 pb-16 overflow-hidden"
      >
        <HeroPlaneFlight key={`desktop-flight-${flightPlayKey}`} />
        <div className="max-w-4xl mx-auto px-10 md:px-12 w-full">
          <div className="relative isolate">
            {/* Compact rendition of the same hero flight animation, sized for
                a short wide strip instead of the full-bleed hero — the
                desktop version above is `hidden` below xl, so without this,
                mobile/tablet visitors saw no animation at all. Same
                component, same trail-draw technique, just a smaller box
                (preserveAspectRatio="none" reflows the artwork to fit it).
                Absolutely positioned with a negative z-index so it plays
                BEHIND the headline/copy (like the desktop version behind
                the whole hero) instead of displacing it as its own block.
                `isolate` on this wrapper is load-bearing, not decoration:
                without it establishing its own stacking context, the -z-10
                child has no local "behind" to sink to and instead escapes
                all the way to the document root, rendering behind the
                entire page — including this section's own opaque
                background — which makes it fully invisible rather than
                just mis-stacked. */}
            <div className="absolute inset-x-0 -top-8 h-60 sm:h-72 xl:hidden pointer-events-none overflow-hidden -z-10">
              <HeroPlaneFlight
                key={`mobile-flight-${flightPlayKey}`}
                className="absolute inset-0 pointer-events-none overflow-hidden"
                planeScale={0.11}
              />
            </div>

            <Reveal>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary-50 mb-7 sm:mb-6 leading-[1.15] sm:leading-[1.05]">
                From learning to{' '}
                <span
                  className="inline-block leading-[1.3] pb-1 font-display italic bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent"
                  style={{ animation: 'fadeIn 0.6s ease-out 0.5s backwards' }}
                >
                  earning
                </span>
                .
              </h1>
              <p className="max-w-xl text-primary-300 text-lg md:text-xl mb-10 sm:mb-8">
                Simple, personalized to your numbers, and actually actionable. From retirement to
                savings, we'll help you feel confident and get set up. Watch money start working for you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/journey"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold bg-amber-500 text-primary-900 hover:bg-amber-600 transition-colors"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* The flight plan itself, shown before the first CTA does any
              work of its own: every leg named and iconed exactly as it
              appears once inside the journey, visible at every breakpoint
              (unlike the decorative HeroPlaneFlight animation above, which
              is xl-only) so this is the one guaranteed place a cold visitor
              sees the actual shape of what "guided" means here. */}
          <div className="mt-14 sm:mt-12 pt-8 border-t border-primary-700/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-400 mb-4">
              Your flight plan
            </p>
            <ol className="flex flex-wrap items-center gap-x-3 gap-y-4">
              {FLIGHT_PLAN_STEPS.map((step, i) => (
                <li key={step.label} className="flex items-center gap-3">
                  <span className="grid place-items-center w-9 h-9 rounded-lg border border-primary-400/50 text-primary-100 shrink-0">
                    <step.icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-primary-200">{step.label}</span>
                  {i < FLIGHT_PLAN_STEPS.length - 1 && (
                    <span aria-hidden="true" className="hidden sm:block w-8 h-px bg-primary-400/30 ml-5" />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Bridging the Gap ── */}
      <section id="how-it-works" className="bg-primary-50 py-20 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Investing doesn't have to feel overwhelming.
            </h2>
            <p className="text-base md:text-lg text-primary-700 leading-relaxed mb-12 max-w-2xl">
              Most advice stops at telling you that you should open an account. FundJoi is
              built for the moment after that: a simple, personalized plan with the exact
              steps to actually do it, so you finish having claimed free money, not just
              read about it.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <Reveal key={feature.title} delayMs={i * 100}>
                <div className="bg-white rounded-lg border border-primary-200 p-6 h-full">
                  <div className="grid place-items-center w-10 h-10 rounded-lg bg-accent-green-100 text-accent-green-700 mb-4">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-primary-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-primary-600 leading-relaxed">{feature.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="dawn-background py-24 px-6">
        <Reveal className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-50 mb-4">
            Ready to stop feeling overwhelmed and just get started?
          </h2>
          <p className="text-lg text-primary-300 mb-8">
            Takes about 10 minutes. No account needed to start — just your own
            numbers, always private to you. Sign up later to save your plan.
          </p>
          <Link
            href="/journey"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold bg-amber-500 text-primary-900 hover:bg-amber-600 transition-colors"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>
      </section>
    </div>
  )
}
