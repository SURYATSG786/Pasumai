import { useState } from 'react'
import { ZONES } from '../data/mock-data'
import { useApp } from '../context/app-context'
import { useLiveSensors } from '../context/app-context'

const AI_ALERTS = [
  {
    id: 'ai-1',
    title: 'Soil moisture dropping fast',
    plain: 'Soil will dry out in 4 hrs — irrigate at 6 PM',
    detail: 'Soil moisture is falling at 2.1%/hr. At current rate, critical threshold (30%) reached by 6:12 PM. Recommended action: schedule irrigation for 6 PM when temperatures moderate.',
    confidence: 93,
    level: 'warning',
    icon: '⚠️',
    action: 'Schedule irrigation',
    suggestedTime: 'Today, 6:00 PM',
    co2Impact: '−0.12 kg CO₂ (vs. manual watering at noon)',
  },
  {
    id: 'ai-2',
    title: 'Rain expected — postpone irrigation',
    plain: 'Rain expected in 6 hrs — irrigation postponed',
    detail: 'Weather forecast shows 65% probability of rain starting 9 PM. Soil moisture forecast: from 41% to 58% after rainfall. Recommended: skip today\'s scheduled irrigation and reduce tomorrow\'s amount by 30%.',
    confidence: 88,
    level: 'info',
    icon: '🌧️',
    action: 'Skip & adjust',
    suggestedTime: 'Next cycle: Tomorrow 8:00 AM',
    co2Impact: '−0.08 kg CO₂ (pump not needed)',
  },
  {
    id: 'ai-3',
    title: 'Optimal watering window',
    plain: 'Best time to water: 5:30 AM — lowest evaporation',
    detail: 'Analysis shows watering at 5:30 AM reduces evaporation loss by 34% compared to the current 6:00 AM schedule. Soil will retain 22% more moisture through the day. Suggested shift saves ~12 L per cycle.',
    confidence: 96,
    level: 'info',
    icon: '✅',
    action: 'Shift schedule',
    suggestedTime: 'Shift to 5:30 AM daily',
    co2Impact: '−0.02 kg CO₂ per cycle (less pump time)',
  },
]

export function AIRecommendationCard() {
  const { activeZoneId } = useApp()
  const zone = ZONES.find(z => z.id === activeZoneId)
  const sensors = useLiveSensors(activeZoneId)
  const [alertIdx, setAlertIdx] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [fired, setFired] = useState(false)

  const alert = AI_ALERTS[alertIdx]
  const zoneHealth = zone?.health

  // Cycle through alerts every ~12s to feel "live AI"
  useState(() => {
    const interval = setInterval(() => {
      setAlertIdx(prev => (prev + 1) % AI_ALERTS.length)
      setFired(false)
      setExpanded(false)
    }, 12000)
    return () => clearInterval(interval)
  })

  const handleAction = () => {
    setFired(true)
    setTimeout(() => {
      setFired(false)
      // In a real app: POST /api/zones/{id}/irrigation-schedule
    }, 1500)
  }

  return (
    <div className="glass-card !p-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-white/80 border border-sky-200/60 flex items-center justify-center text-amber-600 shadow-xs">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.4-2.84 5.82A7 7 0 0 1 2 9a7 7 0 0 1 4.13-2.03C7.69 5.29 9.5 4.5 12 4.5c2.5 0 4.31.79 5.87 2.03A7 7 0 0 1 19 9a7 7 0 0 1-7 7c0 2.38 1.19 4.4 2.84 5.82A7 7 0 0 1 12 16a7 7 0 0 1-5.13-2.47C7.69 14.71 5.5 15.5 2 15.5a7 7 0 0 1 5.13-6.97A7 7 0 0 1 12 2z" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-earth-900 block">AI Irrigation Advisor</span>
            <div className="text-[11px] text-emerald-800 font-bold">Automated Crop Watering Guidance</div>
          </div>
        </div>

        {/* Confidence badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/80 border border-sky-300/50 shadow-xs text-earth-900">
          <svg className="w-3.5 h-3.5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 12 15 15 12" />
          </svg>
          <span>{alert.confidence}% Confidence</span>
        </div>
      </div>

      {/* Main alert card */}
      <div className={`rounded-2xl p-5 border transition-all duration-300 ${
        alert.level === 'warning'
          ? 'bg-amber-50/90 border-amber-300/80 shadow-md'
          : 'bg-white/80 border-sky-200/60 shadow-sm'
      } ${fired ? 'scale-[0.98] opacity-60' : ''}`}>
        {/* Icon + title */}
        <div className="flex items-start gap-3.5">
          <div className="mt-0.5 flex-shrink-0 text-2xl">
            <span>{alert.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-sm font-black ${
              alert.level === 'warning' ? 'text-amber-950' : 'text-earth-950'
            }`}>
              {alert.title}
            </div>
            <div className={`text-base font-extrabold mt-1 leading-snug ${
              alert.level === 'warning' ? 'text-amber-900' : 'text-sky-900'
            }`}>
              {alert.plain}
            </div>

            {/* Confidence info */}
            <div className="mt-2.5 flex items-center gap-2.5">
              <GaugeRingSm value={alert.confidence} max={100} size={32} color={
                alert.confidence >= 90 ? '#2d6a4f' : alert.confidence >= 80 ? '#c47e1e' : '#e11d48'
              } />
              <span className="text-xs text-earth-600 font-bold">
                Live Sensor Verification · {alert.confidence >= 90 ? 'High Accuracy' : 'Optimal Accuracy'}
              </span>
            </div>
          </div>
        </div>

        {/* Detail */}
        <div className={`mt-3 text-xs leading-relaxed border-t border-sky-200/50 text-earth-700 font-semibold ${expanded ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'} transition-all duration-200`}>
          <p className="mt-2">{alert.detail}</p>

          {/* Suggested action row */}
          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider text-earth-500">Suggested:</span>
            <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-amber-100 text-amber-950 border border-amber-300">
              {alert.suggestedTime}
            </span>
            <span className="text-xs text-emerald-800 font-bold">{alert.co2Impact}</span>
          </div>
        </div>

        {/* Expand button */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="mt-3 text-xs text-sky-800 font-extrabold hover:text-sky-950 transition-colors flex items-center gap-1.5"
        >
          <span>{expanded ? 'Show less' : 'Read agronomy analysis'}</span>
          <svg className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Action buttons */}
        <div className="mt-4 flex gap-3 items-center flex-wrap">
          <button
            onClick={handleAction}
            className={`btn-primary !py-2.5 !px-5 ${fired ? 'pointer-events-none opacity-60' : ''}`}
          >
            {fired ? (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>Schedule Applied!</span>
              </span>
            ) : (
              <span>{alert.action}</span>
            )}
          </button>
          
          <button
            className="btn-ghost !py-2.5 !px-4"
            onClick={() => setAlertIdx(prev => (prev + 1) % AI_ALERTS.length)}
          >
            <span>Next Suggestion</span>
          </button>
        </div>
      </div>

      {/* Footer: zone context */}
      <div className="mt-3.5 flex items-center justify-between text-xs text-earth-600 font-bold">
        <span>Active Zone: <strong className="text-earth-950">{zone?.name || 'All zones'}</strong></span>
        <span className="text-emerald-700">● Smart Optimization Enabled</span>
      </div>
    </div>
  )
}

function GaugeRingSm({ value, max, size, color }) {
  const r = (size - 4) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.min(value, max) / max
  const offset = circ * (1 - pct)
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(229,231,235,0.6)" strokeWidth="3" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{ filter: `drop-shadow(0 0 3px ${color}50)` }} />
    </svg>
  )
}
