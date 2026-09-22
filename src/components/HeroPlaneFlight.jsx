// A paper airplane enters from off-screen on the left, climbs up and
// across the full width of the hero — banking through one loose loop
// partway through, same flourish the original hero flight had — and
// exits off-screen on the right. Same "flight" language as the footer
// and journey sidebar (a plane riding a line that draws in behind it),
// scaled up into the hero's own signature moment. Artwork is lifted
// straight from public/assets/animations/paper-plane-hero-svgator.svg
// (recolored to the theme's green — the original's near-black wouldn't
// read against the dark hero — and driven with CSS motion-path since
// that export has no animation of its own, just the static artwork +
// path).
//
// The wrapper spans the full hero (not a small side box) and the SVG uses
// preserveAspectRatio="none" so the viewBox's 0-1000/0-400 coordinate
// space maps directly to 0-100% of the hero's actual width/height
// regardless of viewport aspect — that's what makes "start past x=0" and
// "end past x=1000" reliably read as fully off-screen on both edges.
// Hidden below xl: at narrower desktop widths there isn't a clear strip
// for it to occupy at all.
const FLIGHT_PATH =
  'M -150 420 C -36 325.1 169.3 301.3 351.8 271.6 C 534.2 242 659.6 180.3 602.6 120.9 C 552.5 68.7 415.6 71.1 388.2 130.4 C 356.3 201.6 511.4 268.1 671.1 244.3 C 842.1 218.2 803.3 111.4 844.4 54.4 C 890 -7.3 1013.2 -31 1150 -50'
const FLIGHT_PATH_LENGTH = 2062 // unchanged

export default function HeroPlaneFlight() {
  return (
    <div className="hidden xl:block absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        viewBox="0 0 1000 400"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="w-full h-full"
      >
      <defs>
        <mask id="hero-trail-reveal" maskUnits="userSpaceOnUse" x="-300" y="-300" width="1700" height="1000">
          <path
            className="hero-trail-draw"
            d={FLIGHT_PATH}
            fill="none"
            stroke="#fff"
            strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray={FLIGHT_PATH_LENGTH}
            strokeDashoffset={FLIGHT_PATH_LENGTH}
          />
        </mask>
      </defs>

      <g mask="url(#hero-trail-reveal)">
        <path
          d={FLIGHT_PATH}
          fill="none"
          stroke="#97A395"
          strokeOpacity={0.5}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray="11 12"
        />
      </g>

      <g className="hero-plane-fly">
        <g
          transform="scale(0.065) rotate(15.46) translate(-85 -600)"
          fill="#85BC97"
          stroke="#85BC97"
          strokeWidth={11}
          strokeLinejoin="round"
          fillRule="evenodd"
        >
          <path d="M537.14,475.22c.37512.50015-7.6392,7.2559-22.677,19.154-15.037,11.898-37.099,28.938-64.765,50.011s-60.938,46.178-98.338,74.211c-37.401,28.032-78.93,58.992-123.06,91.777-.00001.00001-.00002.00001-.00003.00002-16.502-16.86-33.415-34.163-50.624-51.782-9.7535-9.9855-19.407-19.872-28.94-29.636.00002,0,.00003-.00001.00004-.00001c54.152-22.166,105.46-43.106,151.97-61.942c46.506-18.836,88.208-35.568,123.16-49.395c34.951-13.826,63.152-24.748,82.671-32.042c19.52-7.2942,30.358-10.962,30.601-10.356.24262.60655-10.13,5.423-29.179,13.556s-46.773,19.582-81.247,33.526c-34.475,13.944-75.7,30.383-121.77,48.576-46.067,18.193-96.977,38.142-150.84,59.179-.00001.00001-.00002.00001-.00003.00002c8.9661,8.7347,18.035,17.57,27.193,26.496c16.159,15.75,32.026,31.226,47.528,46.371.00001-.00001.00002-.00001.00003-.00002c43.203-32.712,83.909-63.429,120.74-91.07s69.786-52.206,97.43-72.616s49.978-36.666,65.507-47.693s24.254-16.826,24.629-16.326l.01099.00099Z" />
          <path d="M535.71,475.22c.16084.61674-10.972,4.1483-31.467,10.031-20.495,5.8829-50.351,14.117-87.593,24.153s-81.87,21.875-131.86,34.983c-49.989,13.108-105.34,27.486-163.98,42.617-.00001.00001-.00002.00001-.00003.00001-12.44-16.83-25.122-34.01-37.98-51.44-4.558-6.18-9.092-12.32-13.6-18.43c128.05-12.18,243.51-23,327.46-30.55c83.948-7.5493,136.39-11.831,139.02-11.412.005.0508.005.0509.005.0509s.00001.00009.005.0509c-2.5134.89431-54.727,6.2729-137.89,14.149-83.164,7.8764-197.28,18.25-324.2,29.608c4.3606,5.2553,8.7448,10.539,13.151,15.85c12.429,14.981,24.674,29.748,36.695,44.273.00002-.00001.00003-.00001.00004-.00001c57.873-15.256,112.48-29.553,161.88-42.366c49.402-12.813,93.602-24.14,130.62-33.472c37.022-9.3315,66.865-16.667,87.504-21.512c20.639-4.8446,32.074-7.1986,32.235-6.5818l-.00501-.002Z" />
          <path d="M124.29,580.93c.66648.1786.59133,2.9759-.21125,7.8272-.80258,4.8512-2.3334,11.756-4.504,20.191-2.1705,8.4347-4.9808,18.399-8.2615,29.416-3.2807,11.016-7.031,23.085-11.007,35.768-1.6034,5.1144-3.1817,10.135-4.7166,15.034h.000005c7.2936-8.7132,14.184-16.865,20.507-24.131s12.079-13.645,17.035-18.852c4.9553-5.207,9.1094-9.2416,12.155-11.859c3.0453-2.6172,4.9812-3.8174,5.4333-3.3925s-.62749,2.4334-3.0925,5.6798-6.3162,7.7302-11.341,13.143c-5.0244,5.4124-11.222,11.753-18.307,18.755-7.0851,7.0016-15.057,14.664-23.559,22.759-.000002,0-.000004.00001-.000005.00001c1.1424-5.0927,2.3125-10.328,3.5107-15.668c2.9712-13.243,5.8412-25.879,8.5829-37.337s5.3561-21.736,7.7417-30.303c2.3856-8.5675,4.5424-15.424,6.2885-20.084c1.7461-4.6596,3.0806-7.1226,3.7471-6.944L124.29,580.93Z" />
          <path d="M94.843,690.68c-.59913-.93389,17.858-9.5921,41.2-19.326c23.341-9.7342,42.771-16.877,43.37-15.943.59913.9339-17.858,9.5921-41.2,19.326-23.341,9.7342-42.771,16.877-43.37,15.943Z" />
        </g>
      </g>
      </svg>
    </div>
  )
}