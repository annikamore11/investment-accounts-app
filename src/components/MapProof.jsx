'use client'
import { useEffect, useRef, useState } from 'react'

const SEED = {
  journeys: 847,
  avgAge: 27,
  cities: [
    { name: 'New York',    x: 0.818, y: 0.295, count: 94 },
    { name: 'Los Angeles', x: 0.112, y: 0.560, count: 81 },
    { name: 'Chicago',     x: 0.618, y: 0.285, count: 67 },
    { name: 'Houston',     x: 0.496, y: 0.680, count: 58 },
    { name: 'Austin',      x: 0.478, y: 0.695, count: 52 },
    { name: 'Atlanta',     x: 0.672, y: 0.565, count: 49 },
    { name: 'Denver',      x: 0.368, y: 0.380, count: 43 },
    { name: 'Seattle',     x: 0.118, y: 0.158, count: 39 },
    { name: 'Miami',       x: 0.712, y: 0.745, count: 36 },
    { name: 'Boston',      x: 0.858, y: 0.245, count: 33 },
    { name: 'Phoenix',     x: 0.228, y: 0.585, count: 30 },
    { name: 'Nashville',   x: 0.648, y: 0.495, count: 27 },
    { name: 'Portland',    x: 0.108, y: 0.198, count: 24 },
    { name: 'Minneapolis', x: 0.538, y: 0.215, count: 22 },
    { name: 'Charlotte',   x: 0.712, y: 0.495, count: 19 },
  ],
  events: [
    { city: 'Austin',    age: 23, action: 'started their journey' },
    { city: 'Brooklyn',  age: 24, action: 'opened a Roth IRA' },
    { city: 'Denver',    age: 26, action: 'set their emergency fund goal' },
    { city: 'Atlanta',   age: 22, action: 'made their first deposit' },
    { city: 'Seattle',   age: 25, action: 'completed the journey' },
    { city: 'Miami',     age: 27, action: 'opened a brokerage account' },
    { city: 'Chicago',   age: 24, action: 'started their journey' },
    { city: 'Nashville', age: 23, action: 'opened a Roth IRA' },
    { city: 'Boston',    age: 21, action: 'set their emergency fund goal' },
    { city: 'Phoenix',   age: 28, action: 'started their journey' },
  ],
}

function useAnimatedCount(target, duration = 1800, startDelay = 400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const steps = duration / 16
      const increment = target / steps
      let current = 0
      const interval = setInterval(() => {
        current = Math.min(current + increment, target)
        setValue(Math.round(current))
        if (current >= target) clearInterval(interval)
      }, 16)
      return () => clearInterval(interval)
    }, startDelay)
    return () => clearTimeout(timeout)
  }, [target, duration, startDelay])
  return value
}

export default function MapProof() {
  const mapRef = useRef(null)
  const svgRef = useRef(null)
  const journeyCount = useAnimatedCount(SEED.journeys, 1800, 400)
  const ageCount = useAnimatedCount(SEED.avgAge, 900, 400)
  const [eventIdx, setEventIdx] = useState(0)
  const [eventVisible, setEventVisible] = useState(true)
  const maxCount = Math.max(...SEED.cities.map(c => c.count))

  // Load D3 + TopoJSON dynamically (avoids SSR issues)
  useEffect(() => {
    if (!svgRef.current) return
    let cancelled = false

    Promise.all([
      import('d3'),
      import('topojson-client'),
      fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(r => r.json()),
    ]).then(([d3, topojson, us]) => {
      if (cancelled || !svgRef.current) return

      const svg = d3.select(svgRef.current)
      const proj = d3.geoAlbersUsa().scale(1000).translate([480, 280])
      const path = d3.geoPath().projection(proj)
      const features = topojson.feature(us, us.objects.states)

      svg.selectAll('path')
        .data(features.features)
        .join('path')
        .attr('d', path)
        .attr('fill', 'rgba(255,255,255,0.04)')
        .attr('stroke', 'rgba(255,255,255,0.09)')
        .attr('stroke-width', 0.6)
        .style('opacity', 0)
        .transition().duration(600).delay((_, i) => i * 10)
        .style('opacity', 1)
    })

    return () => { cancelled = true }
  }, [])

  // Rotate live event feed
  useEffect(() => {
    const interval = setInterval(() => {
      setEventVisible(false)
      setTimeout(() => {
        setEventIdx(i => (i + 1) % SEED.events.length)
        setEventVisible(true)
      }, 300)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  const currentEvent = SEED.events[eventIdx]

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#080808] overflow-hidden">
      {/* Top bar */}
      <div className="flex items-start justify-between gap-5 p-7 pb-0">
        <div>
          <p className="text-[10px] tracking-[1.8px] uppercase text-white/30 mb-2">
            No experience needed
          </p>
          <h2 className="text-2xl font-medium tracking-tight leading-snug text-white">
            People everywhere are{' '}
            <em className="font-light not-italic text-green-400">starting from zero.</em>
          </h2>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2.5 text-right">
            <div className="font-mono text-2xl font-medium text-white tracking-tight leading-none">
              {journeyCount.toLocaleString()}
            </div>
            <div className="text-[10px] tracking-wider uppercase text-white/30 mt-1">journeys started</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2.5 text-right">
            <div className="font-mono text-2xl font-medium text-white tracking-tight leading-none">
              avg <span className="text-green-400">{ageCount}</span>
            </div>
            <div className="text-[10px] tracking-wider uppercase text-white/30 mt-1">years old</div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative w-full" ref={mapRef}>
        <svg
          ref={svgRef}
          viewBox="0 0 960 560"
          className="w-full block"
          xmlns="http://www.w3.org/2000/svg"
        />
        {/* City bubbles — positioned as % of container */}
        {SEED.cities.map((city, i) => {
          const size = 22 + (city.count / maxCount) * 26
          const fontSize = size < 30 ? 9 : size < 38 ? 11 : 13
          return (
            <div
              key={city.name}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
              style={{
                left: `${city.x * 100}%`,
                top: `${city.y * 100}%`,
                animation: 'mapFadeInUp 0.4s ease forwards',
                animationDelay: `${0.8 + i * 0.08}s`,
                opacity: 0,
              }}
            >
              <div
                className="rounded-full flex items-center justify-center font-mono font-medium text-white border border-green-500/50"
                style={{
                  width: size,
                  height: size,
                  fontSize,
                  background: 'rgba(34,197,94,0.18)',
                  animation: 'mapRipple 2.5s ease-out infinite',
                  animationDelay: `${i * 0.15}s`,
                }}
              >
                {city.count}
              </div>
              <span className="text-[8px] text-white/35 mt-1 whitespace-nowrap">{city.name}</span>
            </div>
          )
        })}
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between gap-4 px-7 py-5 border-t border-white/[0.05]">
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full bg-green-500"
            style={{ animation: 'mapBlink 2s infinite' }}
          />
          <span className="text-[11px] text-white/35">updating live</span>
        </div>

        {/* Age mini bars */}
        <div className="flex items-end gap-1 h-8">
          {[
            { label: '18',  h: 40,  highlight: false },
            { label: '22',  h: 100, highlight: true  },
            { label: '27',  h: 88,  highlight: true  },
            { label: '32',  h: 62,  highlight: false },
            { label: '38+', h: 30,  highlight: false },
          ].map(b => (
            <div key={b.label} className="flex flex-col items-center gap-0.5">
              <div
                className={`w-4 rounded-t-sm border transition-all duration-1000 ${
                  b.highlight
                    ? 'bg-green-500 border-green-500'
                    : 'bg-green-500/25 border-green-500/35'
                }`}
                style={{ height: b.h * 0.28 }}
              />
              <span className="text-[8px] font-mono text-white/25">{b.label}</span>
            </div>
          ))}
        </div>

        {/* Live event */}
        <div
          className="text-right text-[11px] text-white/40 transition-opacity duration-300"
          style={{ opacity: eventVisible ? 1 : 0 }}
        >
          <span className="text-green-400 font-medium font-mono">{currentEvent.age} yr old</span>
          {' '}in {currentEvent.city}{' '}
          <span className="text-white/30">{currentEvent.action}</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes mapRipple {
          0%   { box-shadow: 0 0 0 0 rgba(29,158,117,0.35); }
          70%  { box-shadow: 0 0 0 10px rgba(29,158,117,0); }
          100% { box-shadow: 0 0 0 0 rgba(29,158,117,0); }
        }
        @keyframes mapFadeInUp {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 8px)); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
        @keyframes mapBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.25; }
        }
      `}</style>
    </div>
  )
}
