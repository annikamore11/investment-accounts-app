'use client'
import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { ArrowRight } from 'lucide-react'
import MapProof from '@/components/MapProof'

const ScrollReveal = ({ children, delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (user) {
      router.replace('/dashboard')
      return
    }
    const timer = setTimeout(() => setShowContent(true), 3500)
    return () => clearTimeout(timer)
  }, [user, router])

  // Render nothing while redirecting
  if (user) return null

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      {/* ── Hero ── */}
      <section className="relative h-screen static-background overflow-hidden pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-30 max-w-7xl mx-auto px-8 pt-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-6xl md:text-7xl font-bold text-primary-100 mb-6 pb-2 text-left"
          >
            FundJoi.
            <span className="block mt-2 pb-4 text-4xl md:text-6xl bg-clip-text bg-gradient-to-r from-green-400 to-green-600 text-transparent">
              A Path From Learning to{' '}
              <span className="relative inline-block text-primary-100">
                <span className="relative z-10 font-extralight italic">Earning</span>
                <img
                  src="/assets/images/underline.svg"
                  alt=""
                  aria-hidden="true"
                  className="absolute left-0 -bottom-5 w-full h-5 z-0 pointer-events-none"
                />
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-2xl text-primary-300 text-lg md:text-xl mb-8"
          >
            Skip the confusion. Click your way into your first brokerage and retirement accounts
            with a clear, guided, and interactive experience designed to help you navigate your
            options and get set up with confidence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 text-sm md:text-lg">
              <Link
                href="/journey"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 btn-secondary"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() =>
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="inline-flex items-center justify-center gap-2 px-8 py-4 btn-border"
              >
                See How It Works
              </button>
            </div>
            <p className="text-md text-primary-300 py-2">
              No credit card • No commitment • Just action
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Bridging the Gap ── */}
      <ScrollReveal>
        <section id="how-it-works" className="money-image-background flex items-center min-h-[60vh]">
          <div className="w-full px-4 md:px-0 p-8 md:p-18">
            <div className="w-full md:max-w-3xl text-left md:px-8">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-5xl md:text-4xl font-bold mb-4"
              >
                Bridging The Gap Between Learning And Doing.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base md:text-lg mb-6 text-primary-100 leading-relaxed"
              >
                Our platform was built to make investing accessible, not intimidating. We've seen
                how difficult it was for friends and family to actually open and fund accounts, which
                is why we focus on guidance, simplicity, and action.
              </motion.p>

              {/* Phone mockup — desktop */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 2.0 }}
                className="absolute top-1/2 right-[-2%] -translate-y-1/2 w-[120%] h-[120%] rounded-xl overflow-hidden z-0 hidden lg:block"
              >
                <img
                  src="/assets/images/iphone.png"
                  alt="Investment app on phone"
                  className="w-full h-full object-contain object-right pr-20"
                />
              </motion.div>

              {/* Phone mockup — mobile */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:hidden w-[80%] h-[80%] max-w-xs mx-auto my-8 pl-10"
              >
                <img
                  src="/assets/images/iphone.png"
                  alt="Investment app on phone"
                  className="w-full h-auto object-contain"
                />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-10">
                {[
                  {
                    title: 'Guided Onboarding',
                    desc: 'We walk you through each step of starting your investing journey, from account setup to first deposit.',
                  },
                  {
                    title: 'Simplified Decisions',
                    desc: 'Clear, tailored advice replaces the confusion of endless articles and generic financial tips.',
                  },
                  {
                    title: 'Action-Focused',
                    desc: "You don't just learn — you take the real steps toward building long-term wealth.",
                  },
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="bg-white/20 backdrop-blur-sm rounded-xl p-6 min-h-[180px] flex flex-col"
                  >
                    <h3 className="text-lg mb-2 text-white">{card.title}</h3>
                    <p className="text-primary-200 text-sm flex-1">{card.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── Map Social Proof ── */}
      <ScrollReveal delay={0.1}>
        <section className="bg-zinc-950 py-20 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <MapProof />
          </div>
        </section>
      </ScrollReveal>

      {/* ── Final CTA ── */}
      <ScrollReveal delay={0.2}>
        <section className="py-20 static-background-bottom">
          <div className="max-w-3xl mx-auto text-center px-6">
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Ready To Stop Thinking About It And Actually Do It?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-800 mb-8"
            >
              Join thousands taking control of their financial future
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link
                href="/journey"
                className="group inline-flex items-center justify-center btn-secondary px-8 py-4 gap-2 text-sm md:text-lg"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}
