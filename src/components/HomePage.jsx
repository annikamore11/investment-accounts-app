'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { ArrowRight, CheckCircle2 } from 'lucide-react'


// Reusable scroll animation component
const ScrollReveal = ({ children, delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

const GOALS = [
  {
    emoji: "🏢",
    title: "Set up my 401(k)",
    desc: "Make the most of your employer match",
    href: "/journey",
  },
  {
    emoji: "💰",
    title: "Open an IRA",
    desc: "Start a Roth or Traditional IRA",
    href: "/journey",
  },
  {
    emoji: "📈",
    title: "Start investing",
    desc: "Open a brokerage account and invest",
    href: "/journey",
  },
  {
    emoji: "🤔",
    title: "I'm not sure yet",
    desc: "Answer a few questions and we'll guide you",
    href: "/journey",
  },
]

export default function HomePage() {
  const { user } = useAuth()
  const [hovered, setHovered] = useState(null)

  if (user) {
    return <LoggedInHome user={user} />
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      {/* Hero */}
      <section className="relative static-background overflow-hidden pt-24 pb-16 px-6 md:px-12">
        <div className="relative z-10 max-w-4xl mx-auto">

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-4"
          >
            Free • No credit card required
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-white mb-5 leading-tight"
          >
            Open your first investment account—{" "}
            <span className="relative inline-block">
              <span className="bg-clip-text bg-gradient-to-r from-green-400 to-green-600 text-transparent italic font-extralight">
                we walk you through every step.
              </span>
              <img
                src="/assets/images/underline.svg"
                alt=""
                aria-hidden="true"
                className="absolute left-0 -bottom-3 w-full h-4 z-0 pointer-events-none"
              />
            </span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-zinc-300 mb-10 max-w-2xl"
          >
            Answer a few quick questions about your situation and get a personalized,
            step-by-step guide to opening a 401(k), IRA, or brokerage account — no
            financial background needed.
          </motion.p>

          {/* Goal picker — the "first step" */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-zinc-400 text-sm mb-3 font-medium">What do you want to do?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
              {GOALS.map((goal, i) => (
                <Link
                  key={i}
                  href={goal.href}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="group flex items-start gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/50 rounded-xl px-5 py-4 transition-all duration-200"
                >
                  <span className="text-2xl mt-0.5">{goal.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm group-hover:text-green-400 transition-colors">
                      {goal.title}
                    </p>
                    <p className="text-zinc-400 text-xs mt-0.5">{goal.desc}</p>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 mt-1 shrink-0 transition-all duration-200 ${
                      hovered === i ? 'text-green-400 translate-x-1' : 'text-zinc-600'
                    }`}
                  />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works — 3 steps */}
      <ScrollReveal>
        <section id="how-it-works" className="money-image-background py-16 px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-white mb-2"
            >
              How it works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-zinc-300 mb-10 text-base"
            >
              Three steps from "I don't know where to start" to your account being open.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Tell us about yourself",
                  desc: "Your age, income, and whether you have an employer plan. Takes about 2 minutes.",
                },
                {
                  step: "02",
                  title: "Get your personalized plan",
                  desc: "We recommend the right account type, contribution amount, and where to open it.",
                },
                {
                  step: "03",
                  title: "Follow the guided steps",
                  desc: "We link you directly to the right screens and explain exactly what to fill in.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex flex-col"
                >
                  <span className="text-green-400 font-bold text-sm mb-3">{item.step}</span>
                  <h3 className="text-white font-semibold text-base mb-2">{item.title}</h3>
                  <p className="text-zinc-300 text-sm flex-1">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Trust / proof */}
      <ScrollReveal delay={0.1}>
        <section className="py-14 px-6 md:px-12 bg-zinc-950">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                "No finance degree needed — plain English throughout",
                "Your data stays private — we never sell or share it",
                "Completely free — no upsells, no premium tier",
              ].map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="text-green-400 w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-zinc-300 text-sm">{point}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Final CTA */}
      <ScrollReveal delay={0.2}>
        <section className="py-20 static-background-bottom px-6">
          <div className="max-w-2xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Ready to actually open that account?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-700 text-lg mb-8"
            >
              It takes about 10 minutes. We'll be with you the whole way.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <Link
                href="/journey"
                className="group inline-flex items-center justify-center btn-secondary px-8 py-4 gap-2 text-base md:text-lg"
              >
                Get started — it's free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}

// Logged-in user view
const LoggedInHome = ({ user }) => {
  return (
    <div className="min-h-screen">
      <section className="static-background py-20 pb-40 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-3 text-white"
          >
            Welcome back
            {user?.email ? (
              <span className="block text-2xl text-zinc-400 font-normal mt-1">
                {user.email}
              </span>
            ) : null}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-300 text-lg mb-8"
          >
            Pick up where you left off or check your progress.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/journey" className="btn-secondary inline-flex items-center justify-center gap-2 px-8 py-4">
              Continue my journey
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard" className="btn-border inline-flex items-center justify-center px-8 py-4">
              View dashboard
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
