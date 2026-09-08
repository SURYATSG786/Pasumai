import { useState, useEffect, useRef } from 'react'

export function AnimatedNumber({ value, suffix = '', duration = 500, decimals = 1 }) {
  const ref = useRef({ value, duration, decimals })

  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const start = 0
    const end = typeof value === 'number' ? value : parseFloat(value) || 0
    const startTime = performance.now()

    const tick = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = start + (end - start) * eased
      setDisplay(prev => current)
      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)

    // Reset on value change
    return () => {
      ref.current = { value, duration, decimals }
    }
  }, [value, duration])

  return (
    <span className="tabular-nums">
      {Math.round(display * Math.pow(10, decimals)) / Math.pow(10, decimals)}
      {suffix && <span>{suffix}</span>}
    </span>
  )
}
