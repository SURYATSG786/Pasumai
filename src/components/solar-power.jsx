import { useEffect, useState } from 'react'
import { useLiveSensors } from '../context/app-context'
import { useApp } from '../context/app-context'

// ------------------------------------------------------------------
// Animated energy-flow diagram: Sun → Solar Panel → Battery → Pump
// Pure SVG with CSS-driven stroke-dashoffset animation (no extra deps).
// ------------------------------------------------------------------
function EnergyFlowSVG({ panelW, batteryPct, pumpActive }) {
  const w = 320
  const h = 130

  const sunX = 50, sunY = 50
  const panelX = 180, panelY = 40
  const battX = 180, battY = 90
  const pumpX = 280, pumpY = 90

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="overflow-visible select-none">
      {/* Sun glow */}
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#ffd633" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ffb300" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={sunX} cy={sunY} r="40" fill="url(#sunGlow)" className="animate-pulse-dot" style={{ animationDuration: '3s' }} />

      {/* Sun rays (slow spin) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * 360
        const rad = (angle * Math.PI) / 180
        const r1 = 32, r2 = 48
        const x1 = sunX + Math.cos(rad) * r1
        const y1 = sunY + Math.sin(rad) * r1
        const x2 = sunX + Math.cos(rad) * r2
        const y2 = sunY + Math.sin(rad) * r2
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="animate-spin-slow"
            style={{ animationDelay: `${i * 200}ms`, animationDuration: '8s' }}
          />
        )
      })}

      {/* Sun body */}
      <circle cx={sunX} cy={sunY} r="18" fill="#ffd633" stroke="#f59e0b" strokeWidth="2.5" />
      <circle cx={sunX} cy={sunY} r="18" fill="#fff" opacity="0.4" className="animate-pulse-dot" style={{ animationDuration: '4s' }} />

      {/* Flow: Sun → Panel (curved) */}
      <path
        d={`M ${sunX + 22} ${sunY} C ${sunX + 80} ${sunY - 20}, ${panelX - 70} ${panelY + 10}, ${panelX - 30} ${panelY}`}
        fill="none"
        stroke="#f59e0b"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="600"
        strokeDashoffset="600"
        className="animate-[energy-flow_2.4s_0.2s_ease-in-out]"
        style={{ opacity: 0.9 }}
      />

      {/* Solar panel */}
      <g transform={`translate(${panelX - 30}, ${panelY - 15})`}>
        <rect x="0" y="0" width="60" height="24" rx="4" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
        <g stroke="#bae6fd" strokeWidth="1" opacity="0.8">
          <line x1="0" y1="12" x2="60" y2="12" />
          <line x1="15" y1="0" x2="15" y2="24" />
          <line x1="30" y1="0" x2="30" y2="24" />
          <line x1="45" y1="0" x2="45" y2="24" />
        </g>
        <rect x="0" y="0" width="60" height="24" rx="4" fill="#ffffff" opacity="0.2" className="animate-pulse-dot" style={{ animationDuration: '2s' }} />
      </g>
      <text x={panelX} y={panelY + 38} textAnchor="middle" fontSize="10" fill="#0369a1" fontWeight="800" fontFamily="Space Grotesk, sans-serif">Solar Panel</text>

      {/* Flow: Panel → Battery (straight) */}
      <line
        x1={panelX} y1={panelY + 15} x2={battX} y2={battY - 15}
        stroke="#10b981"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="120"
        strokeDashoffset="120"
        className="animate-[energy-flow_1.6s_0.6s_ease-in-out]"
        style={{ opacity: 0.85 }}
      />

      {/* Battery */}
      <g transform={`translate(${battX - 18}, ${battY - 22})`}>
        <rect x="0" y="0" width="36" height="44" rx="6" fill="#ffffff" stroke="#0f766e" strokeWidth="2.5" />
        <rect x="14" y="-3" width="8" height="3" rx="1" fill="#0f766e" />
        <rect
          x="3"
          y={44 - (batteryPct / 100) * 40}
          width="30"
          height={(batteryPct / 100) * 40}
          rx="3"
          fill={
            batteryPct > 60 ? '#10b981' :
            batteryPct > 30 ? '#f59e0b' :
            '#ef4444'
          }
          className="animate-pulse-dot"
          style={{ animationDuration: '3s' }}
        />
        <rect x="3" y="3" width="30" height="40" rx="3" fill="#10b981" opacity="0.1" />
      </g>
      <text x={battX} y={battY + 38} textAnchor="middle" fontSize="10" fill="#0f766e" fontWeight="800" fontFamily="Space Grotesk, sans-serif">Battery</text>

      {/* Flow: Battery → Pump (curved) */}
      <path
        d={`M ${battX + 18} ${battY - 8} C ${battX + 60} ${battY - 8}, ${pumpX - 40} ${pumpY - 5}, ${pumpX - 12} ${pumpY - 5}`}
        fill="none"
        stroke={pumpActive ? '#f59e0b' : '#0ea5e9'}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="180"
        strokeDashoffset="180"
        className="animate-[energy-flow_1.4s_1s_ease-in-out]"
        style={{ opacity: 0.9 }}
      />

      {/* Pump */}
      <g transform={`translate(${pumpX - 16}, ${pumpY - 16})`}>
        <rect x="0" y="12" width="32" height="8" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
        <path d="M8 12L8 0C8 0 8 -4 12 -4C16 -4 16 0 16 0L16 12Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
        <rect x="26" y="12" width="10" height="4" rx="1" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />

        {/* Animated water drops when pumping */}
        {pumpActive && (
          <g>
            <circle cx="36" cy="20" r="2.5" fill="#38bdf8" opacity="0.85">
              <animate attributeName="cy" values="16;36" dur="1.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0" dur="1.4s" repeatCount="indefinite" />
              <animate attributeName="r" values="3;1.5" dur="1.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="36" cy="20" r="2.5" fill="#38bdf8" opacity="0.85">
              <animate attributeName="cy" values="16;36" dur="1.4s" begin="0.47s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0" dur="1.4s" begin="0.47s" repeatCount="indefinite" />
              <animate attributeName="r" values="3;1.5" dur="1.4s" begin="0.47s" repeatCount="indefinite" />
            </circle>
            <circle cx="36" cy="20" r="2.5" fill="#38bdf8" opacity="0.85">
              <animate attributeName="cy" values="16;36" dur="1.4s" begin="0.93s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0" dur="1.4s" begin="0.93s" repeatCount="indefinite" />
              <animate attributeName="r" values="3;1.5" dur="1.4s" begin="0.93s" repeatCount="indefinite" />
            </circle>
          </g>
        )}
      </g>
      <text x={pumpX} y={pumpY + 38} textAnchor="middle" fontSize="10" fill="#0284c7" fontWeight="800" fontFamily="Space Grotesk, sans-serif">Pump Motor</text>
    </svg>
  )
}

// ------------------------------------------------------------------
// Solar Power Card — the main feature module
// ------------------------------------------------------------------
export function SolarPowerCard() {
  const { activeZoneId } = useApp()
  const sensors = useLiveSensors(activeZoneId)
  const [pumpActive, setPumpActive] = useState(false)

  // Simulate pump cycling every 8s for demo feel
  useEffect(() => {
    const pumpInterval = setInterval(() => {
      setPumpActive(prev => !prev)
    }, 8000)
    return () => clearInterval(pumpInterval)
  }, [])

  const panelW = sensors.solarOutput
  const batteryPct = Math.round(sensors.batteryPct)

  const energyToday = panelW * 6.4 // ~6.4 sun-hours avg
  const co2Saved = energyToday * 0.35 // kg CO2 per kWh

  return (
    <div className="glass-card p-5 sm:p-6 animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-300 to-yellow-500 border border-amber-400 flex items-center justify-center text-amber-950 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Solar Power Grid</h3>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800/80">PV Arrays & Off-Grid Battery</span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100/90 text-emerald-900 border border-emerald-300 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
          Active Generation
        </span>
      </div>

      {/* Energy flow diagram */}
      <div className="bg-white/60 dark:bg-slate-900/40 rounded-2xl border-2 border-sky-200/60 p-3 sm:p-4 overflow-hidden backdrop-blur-md shadow-inner flex justify-center">
        <EnergyFlowSVG panelW={panelW} batteryPct={batteryPct} pumpActive={pumpActive} />
      </div>

      {/* Stats row */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Panel output */}
        <div className="glass p-3.5 rounded-2xl border-2 border-amber-200/60 shadow-sm flex flex-col justify-between">
          <div className="text-[11px] text-amber-900/80 font-extrabold uppercase tracking-wider">Panel Output</div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-900">{panelW.toFixed(1)}</span>
            <span className="text-xs font-bold text-amber-700">kW</span>
          </div>
          <div className="mt-2 h-6 w-full">
            <MiniSparkline data={[2.4, 2.2, 2.6, 2.8, 2.7, 2.9, panelW]} color="#f59e0b" height={24} width={80} />
          </div>
        </div>

        {/* Battery */}
        <div className="glass p-3.5 rounded-2xl border-2 border-teal-200/60 shadow-sm flex flex-col justify-between">
          <div className="text-[11px] text-teal-900/80 font-extrabold uppercase tracking-wider">Battery Reserve</div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-2xl font-black ${batteryPct > 60 ? 'text-slate-900' : batteryPct > 30 ? 'text-amber-800' : 'text-rose-700'}`}>
              {batteryPct}%
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold">
            <span className={`w-2.5 h-2.5 rounded-full ${batteryPct > 60 ? 'bg-emerald-500' : batteryPct > 30 ? 'bg-amber-400' : 'bg-rose-500'} animate-pulse-dot`} style={{ animationDuration: '2.5s' }} />
            <span className={batteryPct > 60 ? 'text-emerald-800' : batteryPct > 30 ? 'text-amber-800' : 'text-rose-800'}>
              {batteryPct > 60 ? 'Optimal Charge' : batteryPct > 30 ? 'Discharging' : 'Critically Low'}
            </span>
          </div>
        </div>

        {/* Energy today */}
        <div className="glass p-3.5 rounded-2xl border-2 border-emerald-200/60 shadow-sm flex flex-col justify-between">
          <div className="text-[11px] text-emerald-900/80 font-extrabold uppercase tracking-wider">Daily Clean Yield</div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-900">{energyToday.toFixed(0)}</span>
            <span className="text-xs font-bold text-emerald-700">kWh</span>
          </div>
          <div className="mt-2 text-xs font-bold text-emerald-800 flex items-center gap-1">
            <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 14c-1 3-1 5 0 8s3 4 4 4h10a5 5 0 0 0 10-6v-2M5 14h14M12 14V8" />
            </svg>
            <span>−{co2Saved.toFixed(1)} kg CO₂ Saved</span>
          </div>
        </div>
      </div>

      {/* Pumping status */}
      <div className={`mt-4 flex items-center gap-2.5 text-xs p-3 rounded-2xl border-2 transition-all ${
        pumpActive
          ? 'bg-gradient-to-r from-sky-500/15 to-emerald-500/15 border-sky-400 text-sky-950 font-extrabold'
          : 'bg-white/60 border-slate-300 text-slate-700 font-bold'
      }`}>
        <span className={`relative w-3 h-3 rounded-full ${pumpActive ? 'bg-sky-500' : 'bg-slate-400'} ${pumpActive ? 'animate-pulse-dot' : ''}`} style={{ animationDuration: pumpActive ? '1.4s' : 'inherit' }} />
        <span>
          {pumpActive ? 'Irrigation Pump Active — Solar Direct Flow Enabled' : 'Irrigation Pump Idle — Storing Power in Battery'}
        </span>
        <span className="ml-auto text-[11px] font-black text-slate-500 bg-white/70 px-2 py-0.5 rounded-lg">
          {pumpActive ? 'Cycle: In Progress' : 'Next: 06:00 AM'}
        </span>
      </div>
    </div>
  )
}

// Mini sparkline used inside solar card
function MiniSparkline({ data, color, height, width }) {
  const max = Math.max(...data, 0.1)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - (v / max) * height
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
