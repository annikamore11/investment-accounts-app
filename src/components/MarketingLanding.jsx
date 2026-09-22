'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Compass, Target, Timer } from 'lucide-react'

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

// Niche: people just getting started, especially those who find investing
// overwhelming or confusing — not "beginners" in the abstract.
const FEATURES = [
  {
    icon: Compass,
    title: 'Built for total beginners',
    desc: "No prior knowledge assumed, no jargon left unexplained. We start exactly where you are, even if you've never opened a brokerage account.",
  },
  {
    icon: Target,
    title: 'Exact steps, not just advice',
    desc: "We don't just say \"open a Roth IRA.\" We walk you through exactly how, with the real account and provider steps in order.",
  },
  {
    icon: Timer,
    title: 'About 10 minutes to a real plan',
    desc: 'Answer a few questions about your income and expenses and walk away with an actual plan, not just more to read.',
  },
]

/**
 * The marketing pitch for a true cold visitor (no account, no guest
 * progress) — Home.jsx renders this instead of the returning-visitor
 * dashboard. Trail Waypoint world: forest/paper/amber, ClashGrotesk +
 * Gloock, blunt radius, no gradients.
 */
export default function MarketingLanding() {
  return (
    <div className="journey-theme">
      {/* ── Hero ── */}
      <section className="journey-background min-h-screen flex items-center pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6 md:px-8 w-full">
          <img
            src="/assets/logo/Sprout.svg"
            alt=""
            aria-hidden="true"
            className="w-10 h-10 mb-6 opacity-90"
          />
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-primary-50 mb-6 leading-[1.05]">
            From learning to{' '}
            <span className="relative inline-block text-amber-400">
              <span className="italic">earning</span>
              <img
                src="/assets/images/underline.svg"
                alt=""
                aria-hidden="true"
                className="animate-underline absolute left-0 -bottom-2 w-full h-auto pointer-events-none"
              />
            </span>
            . In about 10 minutes.
          </h1>
          <p className="max-w-xl text-primary-300 text-lg md:text-xl mb-8">
            Most advice stops at "you should open a Roth IRA." We don't just tell you what to
            do. We show you the exact steps to actually open the accounts, in order, using
            your own numbers. No bank account linking, no jargon, just action.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/journey"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold bg-accent-green-600 text-primary-50 hover:bg-accent-green-700 transition-colors"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

          </div>
          
        </div>
      </section>

      {/* ── Bridging the Gap ── */}
      <section id="how-it-works" className="bg-primary-50 py-20 px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Investing doesn't have to feel overwhelming.
            </h2>
            <p className="text-base md:text-lg text-primary-700 leading-relaxed mb-12 max-w-2xl">
              Most advice stops at telling you that you should open an account. FundJoi is
              built for the moment after that: no more articles telling you what to do, just
              the exact steps for how to actually do it, in order.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <section className="journey-background py-24 px-6">
        <Reveal className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-50 mb-4">
            Ready to stop feeling overwhelmed and just get started?
          </h2>
          <p className="text-lg text-primary-300 mb-8">
            Takes about 10 minutes. No account needed to start. Sign up later to save your plan.
          </p>
          <Link
            href="/journey"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold bg-accent-green-600 text-primary-50 hover:bg-accent-green-700 transition-colors"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>
      </section>
    </div>
  )
}
