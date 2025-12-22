'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'

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

export default function HomePage() {
  const { user } = useAuth()

  const steps = [
    { title: "Open the right accounts" },
    { title: "Choose the right investments" },
    { title: "Save the right amount" },
    { title: "Automate it all" }
  ]

  if (user) {
    return <LoggedInHome user={user} />
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      {/* Hero Section */}
      <section className="flex items-center justify-center px-6 pt-32 pb-24 min-h-screen static-background">
        <div className="max-w-5xl w-full">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-primary-100 mb-4 leading-tight">
              Finally.
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-600 leading-tight">
              A Path From Learning to Earning
            </h2>
          </motion.div>

          {/* Steps - Centered Grid Layout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-3xl mx-auto mb-20"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                className="flex items-start space-x-4 group"
              >
                <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-zinc-950 font-bold text-base bg-gradient-to-br from-green-400 to-green-600 shadow-lg group-hover:shadow-green-500/50 transition-all duration-300">
                  {index + 1}
                </div>
                <div className="pt-1">
                  <h3 className="font-semibold text-lg md:text-xl text-primary-100 leading-snug">
                    {step.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-center"
          >
            <Link
              href="/mode-selection"
              className="inline-block btn-secondary font-bold text-lg px-12 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bridging the Gap Section */}
      <ScrollReveal>
        <section className="money-image-background flex items-center min-h-[60vh]">
          <div className="w-full px-4 md:px-0 p-8 md:p-18">
            <div className="w-full md:max-w-3xl text-left md:px-8">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Bridging the gap between learning and doing.
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base md:text-lg mb-6 text-primary-100 leading-relaxed"
              >
                Our platform was built to make investing accessible, not intimidating. 
                We've seen how difficult it was for friends and family to actually open and fund accounts, 
                which is why we focus on guidance, simplicity, and action.
              </motion.p>

              {/* Phone mockup - Desktop (right side) */}
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

              {/* Phone mockup - Mobile (below text, centered) */}
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
                    title: "Guided Onboarding",
                    desc: "We walk you through each step of starting your investing journey, from account setup to first deposit."
                  },
                  {
                    title: "Simplified Decisions",
                    desc: "Clear, tailored advice replaces the confusion of endless articles and generic financial tips."
                  },
                  {
                    title: "Action-Focused",
                    desc: "You don't just learn — you take the real steps toward building long-term wealth."
                  }
                ].map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/20 backdrop-blur-sm rounded-xl p-6 min-h-[180px] flex flex-col"
                  >
                    <h3 className="font-semibold text-lg mb-2 text-white">{card.title}</h3>
                    <p className="text-primary-200 text-sm flex-1">{card.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Final CTA */}
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
              Ready to start growing your wealth?
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
                href="/mode-selection"
                className="inline-block btn-secondary text-xl font-bold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Start Your Journey →
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
      <section className="static-background py-20 pb-135">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold mb-4 text-primary-100"
          >
            Welcome Back!
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl mb-8 opacity-90 text-primary-400"
          >
            Continue your journey to financial freedom
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-4 justify-center"
          >
            <Link href="/journey" className="btn-border">
              Continue Journey
            </Link>
            <Link href="/dashboard" className="btn-secondary">
              Go to Dashboard
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}