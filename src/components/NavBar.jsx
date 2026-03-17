'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { Menu, X, ChevronDown, PlayCircle, BookOpen, TrendingUp } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [journeyDropdownOpen, setJourneyDropdownOpen] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <nav className="bg-zinc-950 z-50 fixed top-0 left-0 right-0">
      <div className="w-full mx-auto px-8 pt-2">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/assets/logo/Title.svg"
                alt="Company Title"
                className="h-20 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Journey Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setJourneyDropdownOpen(true)}
              onMouseLeave={() => setJourneyDropdownOpen(false)}
            >
              <button className="text-primary-50 hover:text-primary-200 px-3 py-2 flex items-center gap-1">
                Your Financial Journey
                <ChevronDown className={`w-4 h-4 transition-transform ${journeyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {journeyDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
                  <Link 
                    href="/journey/overview" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors group"
                  >
                    <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                      <BookOpen className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-primary-50 font-medium">How It Works</div>
                    </div>
            </Link>
                  
                  <Link 
                    href="/journey" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors group"
                  >
                    <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                      <PlayCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-primary-50 font-medium">
                        {user ? 'Continue Journey' : 'Start Journey'}
                      </div>
                    </div>
                  </Link>

                  {user && (
                    <Link 
                      href="/dashboard" 
                      className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors group border-t border-zinc-800"
                    >
                      <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <div className="text-primary-50 font-medium">View Dashboard</div>
                        <div className="text-xs text-primary-400">Track your progress</div>
                      </div>
                    </Link>
                  )}
                </div>
              )}
            </div>

            <Link href="/retirement" className="text-primary-50 hover:text-primary-200 px-3 py-2">
              Learn More
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="btn-border">
                  Dashboard
                </Link>
                <button onClick={handleSignOut} className="btn-secondary">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="btn-border">
                  Sign In
                </Link>
                <Link href="/login?mode=signup" className="btn-secondary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary-100 hover:text-primary-200 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-zinc-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block text-gray-100 hover:text-primary-200 hover:bg-zinc-800 px-3 py-2 rounded-md font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/journey/overview"
              className="block text-primary-100 hover:text-primary-200 hover:bg-zinc-800 px-3 py-2 rounded-md font-medium"
              onClick={() => setIsOpen(false)}
            >
              What's the Journey?
            </Link>
            <Link
              href="/journey"
              className="block text-primary-100 hover:text-primary-200 hover:bg-zinc-800 px-3 py-2 rounded-md font-medium"
              onClick={() => setIsOpen(false)}
            >
              {user ? 'Continue Journey' : 'Start Journey'}
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="block text-primary-100 hover:text-primary-200 hover:bg-zinc-800 px-3 py-2 rounded-md font-medium"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/retirement"
              className="block text-primary-100 hover:text-primary-200 hover:bg-zinc-800 px-3 py-2 rounded-md font-medium"
              onClick={() => setIsOpen(false)}
            >
              Learn More
            </Link>
            
            {user ? (
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsOpen(false)
                  }}
                className="block w-full text-left text-primary-100 hover:text-primary-200 hover:bg-zinc-800 px-3 py-2 rounded-md font-medium"
                >
                  Sign Out
                </button>
            ) : (
              <Link
                href="/login"
                className="block text-primary-100 hover:text-primary-200 hover:bg-zinc-800 px-3 py-2 rounded-md font-medium"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar