'use client'

const formatWithCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

/**
 * Whole-dollar input. Shows thousands separators, reports a number (or '')
 * to the parent, and clamps to [min, max].
 */
export default function DollarInput({
  value = '',
  onChange,
  placeholder = '0',
  min = 0,
  max,
  className = '',
  showCommas = true,
  autoFocus = false,
}) {
  const digits = String(value).replace(/[^\d]/g, '')
  const displayValue = digits && showCommas ? formatWithCommas(digits) : digits

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^\d]/g, '')
    if (raw === '') return onChange('')

    let num = parseInt(raw, 10)
    if (min !== undefined && num < min) num = min
    if (max !== undefined && num > max) num = max
    onChange(num)
  }

  return (
    <div
      className={`flex items-center gap-2 bg-primary-50 rounded-xl p-4 border-2 border-primary-300 focus-within:border-accent-green-500 transition-all duration-300 ${className}`}
    >
      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-800">$</span>
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="flex-1 text-xl sm:text-2xl md:text-3xl font-bold text-primary-900 bg-transparent outline-none"
      />
    </div>
  )
}
