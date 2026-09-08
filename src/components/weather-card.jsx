import { useEffect, useState } from 'react'
import { WEATHER_DATA, weatherIcon, weatherDescription } from '../data/weather-data'
import { LiveIndicator } from './shared-ui'

export function WeatherCard() {
  const [current, setCurrent] = useState(WEATHER_DATA[0])
  const [idx, setIdx] = useState(7) // default to ~7am
  const [advisory, setAdvisory] = useState(null)

  useEffect(() => {
    // Cycle through a few representative hours every 6s to feel "live"
    const interval = setInterval(() => {
      setIdx(prev => (prev + 1) % WEATHER_DATA.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const h = WEATHER_DATA[idx]
    setCurrent(h)

    // Derive advisory text
    if (h.rain > 0.3) {
      setAdvisory({ type: 'rain-heavy', text: 'Rain expected — irrigation postponed until skies clear', delay: '⚠️ irrigation paused' })
    } else if (h.rain > 0) {
      setAdvisory({ type: 'rain', text: 'Light rain in next hour — irrigation delayed 6 hrs', delay: '🌧️ irrigation postponed 6 hrs' })
    } else if (h.temp > 33) {
      setAdvisory({ type: 'heat', text: 'High heat — soil drying faster than usual. Watering amount increased by 15%', delay: '🔥 heat-adjusted' })
    } else if (h.humidity > 80) {
      setAdvisory({ type: 'humid', text: 'High humidity — no extra water needed today', delay: '💧 moisture retained' })
    } else if (h.temp < 20) {
      setAdvisory({ type: 'cool', text: 'Cool night — watering reduced to baseline', delay: '🌙 reduced schedule' })
    } else {
      setAdvisory({ type: 'normal', text: 'Clear sky — standard irrigation schedule', delay: '☀️ normal schedule' })
    }
  }, [idx])

  const isRain = current.rain > 0

  // Dynamic icon background by weather type
  const iconBg = current.icon === 'sunny'
    ? 'bg-amber-100/90 border-amber-300'
    : current.icon === 'clear-night'
    ? 'bg-indigo-100/90 border-indigo-300'
    : current.icon === 'cloudy-rain' || current.icon === 'rain'
    ? 'bg-rose-100/90 border-rose-300'
    : 'bg-sky-100/90 border-sky-300'

  const iconColor = current.icon === 'rain' ? 'text-rose-600' : current.icon === 'clear-night' ? 'text-indigo-600' : current.icon === 'cloudy-rain' ? 'text-rose-600' : 'text-amber-600'

  return (
    <div className="glass-card p-5 sm:p-6 animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 border border-sky-300 flex items-center justify-center text-white shadow-sm">
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
            <h3 className="text-base font-black text-slate-900 tracking-tight">Weather Intelligence</h3>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800/80">Hyper-Local Microclimate Forecast</span>
          </div>
        </div>
        <LiveIndicator label="LIVE RADAR" />
      </div>

      {/* Current conditions row */}
      <div className="flex items-center gap-5 flex-wrap">
        {/* Icon + temp big */}
        <div className="flex items-center gap-3.5">
          <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 shadow-sm ${iconBg}`}>
            <span className={`text-2xl ${iconColor}`} dangerouslySetInnerHTML={{ __html: weatherIcon(current.icon) }} />
          </div>
          <div>
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-none">{current.temp.toFixed(1)}°</div>
            <div className="text-xs font-bold text-slate-500 mt-1">Feels like {current.temp.toFixed(1)}°C · {weatherDescription(current.icon)}</div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block flex-1 min-w-[1px] border-t border-slate-200/80 self-stretch my-2" />

        {/* Details block */}
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <div className="glass px-3 py-2 rounded-xl border-2 border-slate-200 flex items-center gap-2">
            <svg className="w-4 h-4 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2v2M4 8H2M8 8H6M16 8H14M20 8H18M8 12H4M20 12H16M12 14v-4M12 16a4 4 0 0 1 4 4h2a4 4 0 0 1 4 4M12 16a4 4 0 0 0-4 4h-2a4 4 0 0 0-4 4" />
            </svg>
            <span className="text-slate-800 font-extrabold">{current.humidity.toFixed(0)}% Humidity</span>
          </div>

          <div className={`glass px-3 py-2 rounded-xl border-2 ${isRain ? 'border-rose-300 text-rose-900 bg-rose-50/80' : 'border-slate-200 text-slate-800'} flex items-center gap-2`}>
            <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="14" x2="12" y2="18" />
              <line x1="9" y1="17" x2="9" y2="19" />
              <line x1="15" y1="17" x2="15" y2="19" />
            </svg>
            <span className="font-extrabold">{isRain ? `${current.rain.toFixed(1)} mm Precip` : '0 mm Precip'}</span>
          </div>

          <div className="glass px-3 py-2 rounded-xl border-2 border-slate-200 flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span className="text-slate-800 font-extrabold">{current.hour}</span>
          </div>
        </div>
      </div>

      {/* Heatmap micro-chart: 24h temperature sparkline */}
      <div className="mt-4 border-t border-slate-200/80 pt-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
          <span>24-Hour Diurnal Cycle</span>
          <span className="text-slate-900 font-extrabold">{Math.min(...WEATHER_DATA.map(d => d.temp)).toFixed(1)}°C Min – {Math.max(...WEATHER_DATA.map(d => d.temp)).toFixed(1)}°C Peak</span>
        </div>
        <div className="relative h-18 w-full glass rounded-2xl p-2 border-2 border-slate-200/80">
          <svg viewBox={`0 0 240 60`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
            {/* Grid lines */}
            <g stroke="rgba(203, 213, 225, 0.4)" strokeWidth="0.5">
              <line x1="0" y1="15" x2="240" y2="15" />
              <line x1="0" y1="30" x2="240" y2="30" />
              <line x1="0" y1="45" x2="240" y2="45" />
            </g>
            {/* Area fill */}
            {WEATHER_DATA.map((d, i) => {
              const x = (i / (WEATHER_DATA.length - 1)) * 240
              const y = 60 - ((d.temp - 24) / (34 - 24)) * 56
              return (
                <rect
                  key={i}
                  x={x - 4}
                  y={y - 2}
                  width="8"
                  height="4"
                  fill={d.temp > 33 ? '#fca5a5' : d.temp > 30 ? '#ffd633' : '#38bdf8'}
                  opacity="0.4"
                  rx="2"
                />
              )
            })}
            {/* Line */}
            <polyline
              points={WEATHER_DATA.map((d, i) => {
                const x = (i / (WEATHER_DATA.length - 1)) * 240
                const y = 60 - ((d.temp - 24) / (34 - 24)) * 56
                return `${x},${y}`
              }).join(' ')}
              fill="none"
              stroke="#0284c7"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="340"
              strokeDashoffset="340"
              className="animate-[energy-flow_1.8s_ease-in-out]"
            />
            {/* Current dot */}
            <circle
              cx={(idx / (WEATHER_DATA.length - 1)) * 240}
              cy={60 - ((current.temp - 24) / (34 - 24)) * 56}
              r="5"
              fill="#ffb300"
              stroke="#b45309"
              strokeWidth="1.5"
              className="animate-pulse-dot"
              style={{ animationDuration: '2.2s' }}
            />
          </svg>
          {/* Current time marker */}
          <div
            className="absolute bottom-1 left-0 w-0.5 bg-amber-500 h-[80%] pointer-events-none rounded-full shadow-sm"
            style={{ left: `${(idx / (WEATHER_DATA.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Advisory banner */}
      <div
        className={`mt-4 rounded-2xl p-3.5 border-2 flex items-start gap-3 shadow-sm ${
          advisory?.type === 'rain-heavy' ? 'bg-rose-500/15 border-rose-400 text-rose-950' :
          advisory?.type === 'rain'      ? 'bg-amber-500/15 border-amber-400 text-amber-950' :
          advisory?.type === 'heat'      ? 'bg-amber-500/15 border-amber-400 text-amber-950' :
          advisory?.type === 'humid'     ? 'bg-teal-500/15 border-teal-400 text-teal-950' :
          'bg-sky-500/15 border-sky-400 text-sky-950'
        }`}
      >
        <div className="mt-0.5 flex-shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" strokeWidth="3" />
            <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="3" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-black uppercase tracking-wider">{advisory?.delay}</div>
          <div className="text-xs sm:text-sm font-extrabold mt-0.5">{advisory?.text}</div>
        </div>
      </div>
    </div>
  )
}
