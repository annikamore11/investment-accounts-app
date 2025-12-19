'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import dynamic from 'next/dynamic'

// Dynamically import Player to avoid SSR issues
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false }
)

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
  const [currentStep, setCurrentStep] = useState(0)
  const playerRef = useRef(null)
  const pathname = usePathname()  // Changed from useLocation

  const steps = [
    { title: "Open the right accounts" },
    { title: "Choose the right investments" },
    { title: "Save the right amount" },
    { title: "Automate it all" }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      if (playerRef.current) {
        playerRef.current.stop()
        playerRef.current.play()
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [pathname])  // Changed from location.key

  useEffect(() => {
    setCurrentStep(0)
    const timers = steps.map((_, i) =>
      setTimeout(() => setCurrentStep(i + 1), (i + 1) * 800)
    )
    return () => timers.forEach(clearTimeout)
  }, [pathname])  // Changed from location.key

  if (user) {
    return <LoggedInHome user={user} />
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      {/* Hero Section */}
      <section className="flex items-center justify-center px-4 pt-20 min-h-[100vh] md:min-h-screen static-background">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16 animate-fadeIn">
            <h1 className="text-5xl md:text-6xl font-bold text-primary-100 mb-6">
              Start your investment journey today.
            </h1>
            <p className="text-xl text-primary-400 mb-4 max-w-2xl mx-auto">
              We walk you through the first steps... wherever you are in life.
            </p>
          </div>

          {/* Visual + Steps Section */}
          <section className="relative pb-10 lg:pb-15 flex flex-col md:flex-row items-center justify-center gap-16 md:gap-28 px-6 md:px-16">
            
            {/* LEFT: Animation + Signup */}
            <div className="relative flex flex-col items-center w-full md:w-1/2">
              <div className="absolute inset-0 bg-linear-to-b from-green-100/30 to-transparent blur-2xl rounded-full"></div>
              <Player
                ref={playerRef}
                autoplay
                loop={false}
                keepLastFrame
                src="/assets/animations/growing.json"
                style={{
                  width: "100%",
                  maxWidth: "750px",
                  height: "auto",
                  transform: "scale(1.3)",
                }}
              />
            </div>
          
            {/* RIGHT: Steps */}
            <div className="flex flex-col space-y-6 lg:space-y-10 max-w-md w-full">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: currentStep > index ? 1 : 0,
                    y: currentStep > index ? 0 : 20,
                  }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="flex items-center space-x-4"
                >
                  <div className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg bg-green-500">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg md:text-xl text-primary-100">
                      {step.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <div className="text-center animate-slideUp pb-10">
            <Link
              href="/mode-selection"
              className="inline-block btn-secondary font-bold text-xl px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Bridging the Gap Section */}
      <ScrollReveal>
        <section className="money-image-background flex items-center min-h-[60vh] ">
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