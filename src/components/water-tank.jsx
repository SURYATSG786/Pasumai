import { useLiveSensors } from '../context/app-context'
import { useApp } from '../context/app-context'
import { TANK_COLORS, tankStatus, formatTank } from '../utils/colors'

const LEVEL_THRESHOLDS = [
  { pct: 100, label: 'Full', color: 'text-earth-700' },
  { pct: 80,  label: 'High', color: 'text-earth-600' },
  { pct: 60,  label: 'Good', color: 'text-earth-500' },
  { pct: 40,  label: 'Low',  color: 'text-amber-600' },
  { pct: 20,  label: 'Critical', color: 'text-rose-500' },
]

function WaterDropIcon({ color }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5C9.5 8 6 10 6 14a6 6 0 0 0 12 0c0-4-3.5-6-6-11.5Z" />
    </svg>
  )
}

export function WaterTankCard() {
  const { activeZoneId } = useApp()
  const sensors = useLiveSensors(activeZoneId)
  const level = Math.round(sensors.tankLevel)
  const status = tankStatus(level)

  return (
    <div className="glass-card !p-6 animate-fade-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-white/80 border border-sky-200/60 flex items-center justify-center text-sky-700 shadow-xs">
            <WaterDropIcon color="#0284c7" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-earth-900">Water Tank Monitoring</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-black border ${TANK_COLORS[status].bg} ${TANK_COLORS[status].text} ${TANK_COLORS[status].ring} shadow-xs`}>
          {TANK_COLORS[status].label}
        </div>
      </div>

      {/* Tank visual */}
      <div className="flex items-stretch gap-5 sm:gap-8">
        {/* Vertical tank */}
        <div className="relative flex flex-col items-center justify-end w-20 sm:w-24 h-[220px]">
          {/* Container */}
          <div
            className="absolute inset-0 rounded-2xl border-2 border-sky-300 bg-white/80 overflow-hidden shadow-inner backdrop-blur-sm"
          >
            {/* Water body */}
            <div
              className="absolute bottom-0 left-0 right-0 rounded-b-2xl overflow-hidden"
              style={{
                height: `${Math.max(level, 4)}%`,
                transition: 'height 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <div
                className="w-full h-full"
                style={{
                  background: status === 'ok'
                    ? 'linear-gradient(180deg, #38bdf8 0%, #0284c7 60%, #0369a1 100%)'
                    : status === 'low'
                    ? 'linear-gradient(180deg, #f59e0b 0%, #d97706 60%, #b45309 100%)'
                    : 'linear-gradient(180deg, #f43f5e 0%, #e11d48 60%, #be123c 100%)',
                  opacity: 0.92,
                }}
              />
              {/* Water surface shimmer */}
              <div
                className="absolute top-0 left-0 right-0 h-[6px] rounded-t-lg bg-white/40"
              />
            </div>

            {/* Level labels */}
            {LEVEL_THRESHOLDS.map((t) => (
              <div
                key={t.pct}
                className={`absolute left-1 right-1 text-[10px] font-black ${t.color} ${level >= t.pct ? 'opacity-90' : 'opacity-30'} text-right pr-1`}
                style={{ bottom: `${100 - t.pct}%`, transform: 'translateY(50%)' }}
              >
                {t.label}
              </div>
            ))}
          </div>

          {/* Top cap */}
          <div className="relative w-14 h-2.5 bg-sky-200 border border-sky-300 rounded-full -mb-1 mt-2 shadow-xs" />
        </div>

        {/* Side info */}
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-earth-950 font-sans">
                {level}%
              </span>
              <span className="text-base text-earth-600 font-extrabold">Capacity</span>
            </div>
            <div className="mt-1 text-xs text-earth-600 font-bold">
              {level >= 80 ? `Strong reserves — ${(level * 50).toFixed(0)} L available in primary cistern`
                : level >= 40 ? `Sufficient for ${Math.round(level / 40 * 6)} more planned irrigations`
                : level >= 20 ? `⚠️ Low — refill recommended before next cycle`
                : `🚨 Critical — refill immediately to avoid dry pump run`}
            </div>
          </div>

          {/* Quick stats row */}
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="bg-white/70 rounded-2xl p-3 border border-sky-200/60 shadow-xs">
              <div className="text-[10px] text-earth-500 font-black uppercase tracking-wider">Tank Capacity</div>
              <div className="text-sm font-black text-earth-950 mt-0.5">5,000 L</div>
            </div>
            <div className="bg-white/70 rounded-2xl p-3 border border-sky-200/60 shadow-xs">
              <div className="text-[10px] text-earth-500 font-black uppercase tracking-wider">Current Volume</div>
              <div className="text-sm font-black text-sky-800 mt-0.5">{(level * 50).toFixed(0)} L</div>
            </div>
            <div className="bg-white/70 rounded-2xl p-3 border border-sky-200/60 shadow-xs">
              <div className="text-[10px] text-earth-500 font-black uppercase tracking-wider">Used Today</div>
              <div className="text-sm font-black text-earth-950 mt-0.5">380 L</div>
            </div>
            <div className="bg-white/70 rounded-2xl p-3 border border-sky-200/60 shadow-xs">
              <div className="text-[10px] text-earth-500 font-black uppercase tracking-wider">Space Free</div>
              <div className={`text-sm font-black mt-0.5 ${level < 40 ? 'text-amber-800' : 'text-earth-950'}`}>
                {((100 - level) * 50).toFixed(0)} L
              </div>
            </div>
          </div>

          {/* Low-level warning */}
          {status !== 'ok' && (
            <div
              className={`mt-3 p-3 rounded-2xl border ${
                status === 'low' ? 'bg-amber-100/90 border-amber-300 text-amber-950' : 'bg-rose-100/90 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className={`mt-0.5 flex-shrink-0 ${status === 'low' ? 'text-amber-600' : 'text-rose-600'}`}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5Z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider">{status === 'low' ? 'Low water level alert' : 'Critical water level'}</div>
                  <div className="text-xs font-semibold mt-0.5">
                    {level < 20 ? 'Tank critically low — pump may run dry. Refill immediately.'
                      : 'Tank running low — schedule refill before evening irrigation cycle.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {status === 'ok' && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-earth-700 font-bold">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse-dot" />
              Tank reserves nominal and stable
            </div>
          )}
        </div>
      </div>

      {/* Historical chart: last 7 days */}
      <div className="mt-5 border-t border-sky-200/50 pt-4">
        <div className="flex items-center justify-between text-xs text-earth-600 font-extrabold mb-2">
          <span>Tank reserve history — last 7 days</span>
          <span className="text-sky-800 font-black">Lowest point: 28%</span>
        </div>
        <div className="flex items-end gap-2 h-16">
          {[
            { day: 'Mon', val: 78, color: level >= 40 ? 'bg-sky-400' : 'bg-amber-400' },
            { day: 'Tue', val: 74, color: level >= 40 ? 'bg-sky-400' : 'bg-amber-400' },
            { day: 'Wed', val: 68, color: level >= 40 ? 'bg-sky-400' : 'bg-amber-400' },
            { day: 'Thu', val: 61, color: level >= 40 ? 'bg-sky-400' : 'bg-amber-400' },
            { day: 'Fri', val: 53, color: level >= 40 ? 'bg-sky-400' : 'bg-amber-400' },
            { day: 'Sat', val: 42, color: level >= 40 ? 'bg-sky-400' : 'bg-amber-400' },
            { day: 'Sun', val: level, color: level >= 40 ? 'bg-sky-500' : level >= 20 ? 'bg-amber-500' : 'bg-rose-500' },
          ].map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 group relative h-full justify-end">
              <div className="w-full bg-sky-100/60 rounded-t-lg relative overflow-hidden h-full flex flex-col justify-end">
                <div
                  className={`w-full rounded-t-lg ${d.color} transition-all duration-500 shadow-xs`}
                  style={{ height: `${Math.max(d.val, 8)}%` }}
                />
              </div>
              <div className="text-[10px] font-mono font-bold text-earth-600 group-hover:text-earth-900 whitespace-nowrap">
                {d.day}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
