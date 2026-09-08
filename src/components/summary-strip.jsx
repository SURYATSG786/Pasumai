import { useApp } from '../context/app-context'
import { useLiveSensors } from '../context/app-context'
import { ZONES } from '../data/mock-data'
import { HEALTH_COLORS } from '../utils/colors'

export function SummaryStrip() {
  const { state, activeZoneId } = useApp()
  const zone = ZONES.find(z => z.id === activeZoneId)
  const { totalWaterSaved, totalEnergyGenerated, totalIrrigationEvents, co2SavedKg } = state.stats

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-up">
      {/* Water saved today */}
      <MetricTile
        icon={<WaterDropIcon />}
        accent="bg-earth-500"
        label="Water saved today"
        value={`${Math.round(zone?.tankLevel || 74 * 0.32)} L`}
        sub="vs manual schedule"
        trend="+18%"
        trendUp
      />
      {/* Energy generated today */}
      <MetricTile
        icon={<SunIcon />}
        accent="bg-amber-500"
        label="Energy generated today"
        value={`${Math.round((zone?.solarOutput || 2.8) * 6.4)} kWh`}
        sub="solar contribution"
        trend="+6%"
        trendUp
      />
      {/* AI scheduling efficiency */}
      <MetricTile
        icon={<AIIcon />}
        accent="bg-earth-400"
        label="AI scheduling efficiency"
        value="91%"
        sub="vs baseline watering"
        trend="+4%"
        trendUp
      />
      {/* CO₂ saved */}
      <MetricTile
        icon={<CO2Icon />}
        accent="bg-teal-500"
        label="CO₂ saved (lifetime)"
        value={`${co2SavedKg.toFixed(1)} kg`}
        sub="from solar pumping"
        trend="—"
        trendUp={false}
        subtle
      />
    </div>
  )
}

function MetricTile({ icon, accent, label, value, sub, trend, trendUp, subtle }) {
  return (
    <div className="glass-card !p-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-[11px] font-black uppercase tracking-wider text-earth-700">{label}</span>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black text-earth-950 leading-none font-sans">{value}</span>
          </div>
          {sub && <span className="text-xs font-bold text-earth-500 mt-1">{sub}</span>}
        </div>
        <div className={`rounded-xl p-2 ${accent} shadow-xs flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      {trend !== '—' && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-extrabold">
          <svg className={`w-3.5 h-3.5 ${trendUp ? 'text-emerald-600' : 'text-rose-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
          <span className={trendUp ? 'text-emerald-700' : 'text-rose-600'}>{trend}</span>
          <span className="text-earth-400 font-medium ml-0.5">vs previous</span>
        </div>
      )}
    </div>
  )
}

function WaterDropIcon() {
  return (
    <svg className="w-4 h-4 text-earth-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5C9.5 8 6 10 6 14a6 6 0 0 0 12 0c0-4-3.5-6-6-11.5Z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
    </svg>
  )
}

function AIIcon() {
  return (
    <svg className="w-4 h-4 text-earth-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.4-2.84 5.82A7 7 0 0 1 2 9a7 7 0 0 1 4.13-2.03C7.69 5.29 9.5 4.5 12 4.5c2.5 0 4.31.79 5.87 2.03A7 7 0 0 1 19 9a7 7 0 0 1-7 7c0 2.38 1.19 4.4 2.84 5.82A7 7 0 0 1 12 16a7 7 0 0 1-5.13-2.47C7.69 14.71 5.5 15.5 2 15.5a7 7 0 0 1 5.13-6.97A7 7 0 0 1 12 2z" />
    </svg>
  )
}

function CO2Icon() {
  return (
    <svg className="w-4 h-4 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}
