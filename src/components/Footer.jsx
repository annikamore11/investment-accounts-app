'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { SendHorizonal } from 'lucide-react'

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false)
  const footerRef = useRef(null)

  // Play the line animation once, the first time the footer scrolls fully into view
  useEffect(() => {
    const el = footerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 1.0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <footer ref={footerRef} className="relative bg-zinc-950 text-white py-16 overflow-hidden z-60">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">FundJoi</h3>
            <p className="text-gray-400">Guiding you through your financial future, one step at a time.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/journey" className="hover:text-green-500">Start Journey</Link></li>
              <li><Link href="/about" className="hover:text-green-500">About</Link></li>
              <li><Link href="/contact" className="hover:text-green-500">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/privacy" className="hover:text-green-500">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-green-500">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {isVisible && (
          <div className="animated-line-container mt-16 pt-8 max-w-6xl mx-auto">
            <div className="animated-line"></div>
            <div className="line-icon">
              <SendHorizonal className="w-6 h-6 text-primary-500" />
            </div>
          </div>
        )}

        <div className="pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} FundJoi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
