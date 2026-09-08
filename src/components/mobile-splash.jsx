import { useState, useEffect } from 'react'

export function MobileSplash({ onFinish }) {
  const [step, setStep] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    // Stage 1: Solar calibration
    const t1 = setTimeout(() => setStep(1), 500)
    // Stage 2: Connecting to sensors
    const t2 = setTimeout(() => setStep(2), 1000)
    // Stage 3: Ready, fade out
    const t3 = setTimeout(() => {
      setFading(true)
      setTimeout(() => {
        onFinish()
      }, 400)
    }, 1600)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onFinish])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Status */}
      <div className="w-full flex justify-between items-center text-xs font-black text-emerald-300/80 pt-4">
        <span>PASUMAI 1.0</span>
        <button
          onClick={onFinish}
          className="text-xs bg-emerald-800/60 px-3 py-1 rounded-full border border-emerald-500/40 text-emerald-200 active:scale-95"
        >
          Skip ➔
        </button>
      </div>

      {/* Center Logo & Animation */}
      <div className="flex flex-col items-center text-center">
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-500 to-emerald-300 shadow-[0_0_50px_rgba(52,211,153,0.5)] border-3 border-emerald-200 animate-pulse">
          <svg viewBox="0 0 32 32" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="splashSun" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fef08a" />
                <stop offset="1" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="splashPanel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#064e3b" />
                <stop offset="1" stopColor="#022c22" />
              </linearGradient>
            </defs>
            <circle cx="16" cy="9" r="4.5" fill="url(#splashSun)" />
            <g stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round">
              <line x1="16" y1="2.5" x2="16" y2="0.5" />
              <line x1="16" y1="15.5" x2="16" y2="17.5" />
              <line x1="9.5" y1="9" x2="7.5" y2="9" />
              <line x1="22.5" y1="9" x2="24.5" y2="9" />
              <line x1="11.5" y1="4.5" x2="10" y2="3" />
              <line x1="20.5" y1="13.5" x2="22" y2="15" />
              <line x1="20.5" y1="4.5" x2="22" y2="3" />
              <line x1="11.5" y1="13.5" x2="10" y2="15" />
            </g>
            <rect x="11" y="18" width="18" height="7" rx="1.5" fill="url(#splashPanel)" stroke="#34d399" strokeWidth="1" />
            <g stroke="#6ee7b7" strokeWidth="0.8" opacity="0.8">
              <line x1="11" y1="21.5" x2="29" y2="21.5" />
              <line x1="11" y1="23.5" x2="29" y2="23.5" />
              <line x1="17" y1="18" x2="17" y2="25" />
              <line x1="23" y1="18" x2="23" y2="25" />
            </g>
          </svg>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-white font-sans">Pasumai</h1>
        <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest mt-1">Smart Solar Irrigation</p>

        {/* Dynamic loading text */}
        <div className="mt-8 flex items-center gap-2 text-xs font-extrabold text-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>
            {step === 0 && 'Connecting to Solar Grid...'}
            {step === 1 && 'Syncing Soil & Weather Telemetry...'}
            {step === 2 && 'Calibrating AI Irrigation Engine...'}
          </span>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-[10px] font-bold text-emerald-400/60 pb-4">
        Autonomous Eco-Irrigation System · Tamil Nadu
      </div>
    </div>
  )
}
