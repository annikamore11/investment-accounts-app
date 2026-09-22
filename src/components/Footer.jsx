'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { SendHorizonal } from 'lucide-react'

const Footer = () => {
  // Content fades/slides up the first time the footer starts entering the
  // viewport — same threshold/rootMargin as the landing page's own Reveal,
  // so the footer reads as the last section in that same scroll-reveal
  // sequence instead of just sitting there already rendered on load.
  const [isContentVisible, setIsContentVisible] = useState(false)
  // Separate, stricter trigger for the decorative line: it only draws once
  // the whole footer (not just its top edge) is in view.
  const [isLineVisible, setIsLineVisible] = useState(false)
  // Copyright line waits for the line-draw animation to actually finish
  // (growLine/moveIcon are both 3s) instead of appearing at the same time
  // as everything else — it's the last thing in, after the line.
  const [isCopyrightVisible, setIsCopyrightVisible] = useState(false)
  const footerRef = useRef(null)

  useEffect(() => {
    const el = footerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsContentVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '-80px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const el = footerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLineVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 1.0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isLineVisible) return
    const timer = setTimeout(() => setIsCopyrightVisible(true), 3000)
    return () => clearTimeout(timer)
  }, [isLineVisible])

  return (
    <footer ref={footerRef} className="journey-theme relative bg-primary-900 text-primary-50 py-16 overflow-hidden z-60">
      <div
        className={`max-w-6xl mx-auto px-6 relative z-10 transition-all duration-700 ease-out ${
          isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">FundJoi</h3>
            <p className="text-primary-300">Guiding you through your financial future, one step at a time.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-primary-300">
              <li><Link href="/journey" className="hover:text-accent-green-400">Start Journey</Link></li>
              <li><Link href="/about" className="hover:text-accent-green-400">About</Link></li>
              <li><Link href="/contact" className="hover:text-accent-green-400">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-primary-300">
              <li><Link href="/privacy" className="hover:text-accent-green-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-accent-green-400">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {isLineVisible && (
          <div className="animated-line-container mt-16 pt-8 max-w-6xl mx-auto">
            <div className="animated-line"></div>
            <div className="line-icon">
              <SendHorizonal className="w-6 h-6 text-primary-500" />
            </div>
          </div>
        )}

        <div
          className={`pt-8 text-center text-primary-400 transition-opacity duration-500 ease-out ${
            isCopyrightVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p>&copy; {new Date().getFullYear()} FundJoi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
