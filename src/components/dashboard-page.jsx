import { AnimatedNumber } from './animated-number'
import { ZONES } from '../data/mock-data'
import { useApp } from '../context/app-context'
import { useLiveSensors } from '../context/app-context'

export function HeroStats() {
  const { activeZoneId } = useApp()
  const sensors = useLiveSensors(activeZoneId)
  const zone = ZONES.find(z => z.id === activeZoneId)

  return (
    <div className="glass-card p-5 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Soil moisture */}
        <div className="flex flex-col items-start p-4 rounded-2xl bg-white/60 border border-sky-200/50 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between w-full mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-earth-800 uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse-dot" />
              Soil Moisture
            </div>
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300/60">
              Live
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-3xl font-black tracking-tight text-earth-950 font-sans">
              <AnimatedNumber value={sensors.soilMoisture} suffix="%" />
            </span>
          </div>
          <div className="text-xs font-bold text-earth-600 mb-3">
            {sensors.soilMoisture >= 60 ? '🌿 Optimal root moisture'
              : sensors.soilMoisture >= 40 ? 'Adequate — monitor'
              : sensors.soilMoisture >= 30 ? '⚠️ Low — irrigate soon'
              : '🚨 Critical — water immediately'}
          </div>
          <div className="w-full progress-track">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(100, Math.max(5, sensors.soilMoisture))}%` }}
            />
          </div>
        </div>

        {/* Tank */}
        <div className="flex flex-col items-start p-4 rounded-2xl bg-white/60 border border-sky-200/50 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between w-full mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-earth-800 uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse-dot" />
              Water Tank
            </div>
            <span className="text-[10px] font-extrabold text-sky-800 bg-sky-100/80 px-2 py-0.5 rounded-full border border-sky-300/60">
              Reserve
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-3xl font-black tracking-tight text-earth-950 font-sans">
              <AnimatedNumber value={sensors.tankLevel} suffix="%" />
            </span>
          </div>
          <div className="text-xs font-bold text-earth-600 mb-3">
            {sensors.tankLevel >= 60 ? '💧 5,000L capacity ample'
              : sensors.tankLevel >= 40 ? 'Sufficient reserve'
              : sensors.tankLevel >= 20 ? '⚠️ Low — refill soon'
              : '🚨 Critical — refill now'}
          </div>
          <div className="w-full progress-track">
            <div
              className="progress-fill-sky"
              style={{ width: `${Math.min(100, Math.max(5, sensors.tankLevel))}%` }}
            />
          </div>
        </div>

        {/* Solar */}
        <div className="flex flex-col items-start p-4 rounded-2xl bg-white/60 border border-sky-200/50 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between w-full mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-earth-800 uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse-dot" />
              Solar Output
            </div>
            <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300/60">
              Active
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-3xl font-black tracking-tight text-earth-950 font-sans">
              <AnimatedNumber value={sensors.solarOutput} suffix="kW" />
            </span>
          </div>
          <div className="text-xs font-bold text-earth-600 mb-3">
            {zone?.solarOutput?.toFixed(1)} kW peak · battery {Math.round(sensors.batteryPct)}%
          </div>
          <div className="w-full progress-track">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(100, Math.max(5, sensors.batteryPct))}%` }}
            />
          </div>
        </div>

        {/* Health status */}
        <div className="flex flex-col items-start p-4 rounded-2xl bg-white/60 border border-sky-200/50 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between w-full mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-earth-800 uppercase tracking-wider">
              <span className={`w-2.5 h-2.5 rounded-full ${zone?.health === 'warning' ? 'bg-amber-500 animate-pulse-dot' : 'bg-emerald-500'}`} />
              Zone Health
            </div>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
              zone?.health === 'warning' 
                ? 'bg-amber-100/90 text-amber-900 border-amber-300/60' 
                : 'bg-emerald-100/90 text-emerald-900 border-emerald-300/60'
            }`}>
              {zone?.health === 'warning' ? 'Alert' : 'Nominal'}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className={`text-2xl font-black tracking-tight ${zone?.health === 'warning' ? 'text-amber-800' : 'text-emerald-900'}`}>
              {zone?.health === 'warning' ? 'Needs Attention' : 'All Optimal'}
            </span>
          </div>
          <div className="text-xs font-bold text-earth-600 mb-3">
            {zone?.health === 'warning' ? 'Review suggested watering action' : 'Telemetry healthy within bounds'}
          </div>
          <div className="w-full progress-track">
            <div
              className={zone?.health === 'warning' ? 'progress-fill' : 'progress-fill-emerald'}
              style={{ width: zone?.health === 'warning' ? '65%' : '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
