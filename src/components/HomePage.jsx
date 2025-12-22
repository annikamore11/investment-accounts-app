'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import dynamic from 'next/dynamic'

// Dynamically import Spline to avoid SSR issues
const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false })

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
      <section className="relative flex items-center justify-center px-6 py-16 min-h-screen static-background overflow-hidden" style={{ perspective: '1000px' }}>

        {/* Spline 3D Scene - Background Layer */}
        <div className="absolute inset-0 opacity-40" style={{ transform: 'translateZ(-150px)' }}>
          <Spline scene="https://prod.spline.design/A6lJNLTwSUCrOSOw/scene.splinecode" />
        </div>

        {/* 3D Layered Background */}
        <div className="absolute inset-0 overflow-hidden">

          {/* Layer 1 - Deepest - Large Blobs */}
          <motion.div
            className="absolute inset-0"
            style={{ transform: 'translateZ(-200px)' }}
          >
            <motion.div
              animate={{
                x: [0, 150, 0],
                y: [0, -80, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/4 right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-green-500/15 to-green-600/5 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                x: [0, -120, 0],
                y: [0, 90, 0],
                scale: [1, 1.4, 1],
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute bottom-1/4 left-[-10%] w-[550px] h-[550px] bg-gradient-to-tr from-green-600/12 to-green-400/3 rounded-full blur-3xl"
            />
          </motion.div>

          {/* Layer 2 - Middle - Chain Link Rings */}
          <motion.div
            className="absolute inset-0"
            style={{ transform: 'translateZ(-100px)' }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`ring-${i}`}
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  rotate: [0, 180, 360],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 2.5,
                }}
                className="absolute border-2 border-green-500/20 rounded-full"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 3) * 20}%`,
                  width: `${100 + i * 30}px`,
                  height: `${100 + i * 30}px`,
                }}
              />
            ))}
          </motion.div>

          {/* Layer 3 - Floating Connected Nodes (Chain Effect) */}
          <motion.div
            className="absolute inset-0"
            style={{ transform: 'translateZ(-50px)' }}
          >
            {/* Connection Lines - Sequential Animation */}
            <svg className="absolute inset-0 w-full h-full opacity-10">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Animated connecting lines */}
              <motion.path
                d="M 100 150 L 300 100 L 500 200 L 700 150"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 1, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.path
                d="M 150 400 L 350 350 L 550 450 L 750 400"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 1, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
            </svg>

            {/* Floating Nodes */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`node-${i}`}
                animate={{
                  y: [0, -30, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 5 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.8,
                }}
                className="absolute w-3 h-3 bg-green-500/60 rounded-full shadow-lg shadow-green-500/50"
                style={{
                  left: `${15 + i * 12}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
              />
            ))}
          </motion.div>

          {/* Layer 4 - Front - Particles */}
          <motion.div
            className="absolute inset-0"
            style={{ transform: 'translateZ(0px)' }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                animate={{
                  y: [0, -120, 0],
                  x: [0, Math.random() * 60 - 30, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 10 + Math.random() * 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 8,
                }}
                className="absolute w-1.5 h-1.5 bg-green-400/60 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Growth Chart SVG - Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 0.12, x: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-3/4 hidden lg:block pointer-events-none"
        >
          <svg viewBox="0 0 400 400" className="w-full h-full opacity-50">
            {/* Upward trending bars */}
            <motion.rect
              initial={{ height: 0, y: 400 }}
              animate={{ height: 100, y: 300 }}
              transition={{ duration: 1, delay: 1 }}
              x="50" width="40" fill="url(#greenGradient)" rx="4"
            />
            <motion.rect
              initial={{ height: 0, y: 400 }}
              animate={{ height: 150, y: 250 }}
              transition={{ duration: 1, delay: 1.2 }}
              x="120" width="40" fill="url(#greenGradient)" rx="4"
            />
            <motion.rect
              initial={{ height: 0, y: 400 }}
              animate={{ height: 220, y: 180 }}
              transition={{ duration: 1, delay: 1.4 }}
              x="190" width="40" fill="url(#greenGradient)" rx="4"
            />
            <motion.rect
              initial={{ height: 0, y: 400 }}
              animate={{ height: 300, y: 100 }}
              transition={{ duration: 1, delay: 1.6 }}
              x="260" width="40" fill="url(#greenGradient)" rx="4"
            />
            <motion.rect
              initial={{ height: 0, y: 400 }}
              animate={{ height: 380, y: 20 }}
              transition={{ duration: 1, delay: 1.8 }}
              x="330" width="40" fill="url(#greenGradient)" rx="4"
            />

            {/* Upward arrow */}
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 2 }}
              d="M 60 350 Q 150 300, 240 180 T 360 40"
              stroke="url(#greenGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <motion.path
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 3.5 }}
              d="M 360 40 L 350 50 L 360 45 L 370 50 Z"
              fill="#22c55e"
            />

            <defs>
              <linearGradient id="greenGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#16a34a" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        <div className="max-w-6xl w-full relative z-10 text-center" style={{ transform: 'translateZ(50px)', transformStyle: 'preserve-3d' }}>

          {/* Main Title - Large and Bold - Centered */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-16"
            style={{ transform: 'translateZ(80px)' }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-primary-100 leading-[0.9] mb-6">
              Finally.
            </h1>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-green-600">
                A Path From
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-green-600 to-green-500">
                Learning to Earning
              </span>
            </h2>
          </motion.div>

          {/* Steps - Centered Grid Layout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mb-12"
            style={{ transform: 'translateZ(60px)' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                  className="group cursor-default"
                >
                  <div className="relative inline-block w-full text-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <h3 className="relative text-xl md:text-2xl font-bold text-primary-200 group-hover:text-primary-50 transition-colors duration-300 py-2">
                      {step.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA - Bold and Prominent - Centered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            style={{ transform: 'translateZ(100px)' }}
          >
            <Link
              href="/mode-selection"
              className="group relative inline-block"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-green-500 to-green-600 text-zinc-950 font-bold text-xl md:text-2xl px-16 py-5 rounded-full hover:from-green-400 hover:to-green-500 transition-all duration-300 shadow-2xl group-hover:shadow-green-500/50 group-hover:scale-105 transform">
                Get Started
              </div>
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