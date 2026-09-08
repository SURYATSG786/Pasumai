import { useLiveSensors, useApp } from '../context/app-context'
import { TEMP_COLORS, HUM_COLORS, tempStatus, humStatus } from '../utils/colors'
import { GaugeRing } from './shared-ui'
import { SoilMoistureLogsCard } from './soil-moisture-logs'

export function TempHumidityCard() {
  const { activeZoneId, isSensorPowered, toggleSensorPower } = useApp()
  const sensors = useLiveSensors(activeZoneId)
  const isPowered = isSensorPowered(activeZoneId)

  const temp = sensors.temperature
  const hum = sensors.humidity
  const t = tempStatus(temp)
  const h = humStatus(hum)

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------- */}
      {/* LIVE TELEMETRY & HARDWARE POWER CARD                          */}
      {/* ------------------------------------------------------------- */}
      <div className="glass-card p-5 sm:p-6 animate-fade-up">
        {/* Header with On/Off Switch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
              isPowered ? 'bg-gradient-to-br from-teal-400 to-emerald-600 text-white border border-teal-500' : 'bg-slate-200 text-slate-500 border border-slate-300'
            }`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20v-6M12 22a6 6 0 0 0 6-6M12 22a6 6 0 0 1-6-6M6 8a6 6 0 0 0 6 6" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">Microclimate Sensors</h2>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black border ${
                  isPowered
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-sm'
                    : 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isPowered ? 'bg-emerald-500 animate-pulse-dot' : 'bg-amber-500'}`} />
                  {isPowered ? 'LIVE STREAM' : 'STANDBY / SLEEP'}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                {isPowered
                  ? 'Real-time field temperature and humidity monitoring active.'
                  : 'Sensor telemetry paused. Low-power sleep mode active.'}
              </p>
            </div>
          </div>

          {/* Master Power Toggle Button */}
          <div className="flex items-center gap-3 glass p-2 px-3 rounded-2xl border-2 border-slate-200/80 self-start sm:self-auto shadow-sm">
            <div className="text-left">
              <span className="block text-[10px] uppercase font-black text-slate-500 tracking-wider">Sensor State</span>
              <span className="text-xs font-extrabold text-slate-800">
                {isPowered ? 'Power: ACTIVE' : 'Power: OFF'}
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isPowered}
              onClick={() => toggleSensorPower(activeZoneId)}
              className={`relative inline-flex h-7 w-13 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                isPowered ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-slate-300'
              }`}
            >
              <span className="sr-only">Toggle Sensor Power</span>
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isPowered ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Sensor Off Warning Banner (if toggled off) */}
        {!isPowered && (
          <div className="my-4 p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-up">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center flex-shrink-0 font-bold">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                  <line x1="12" y1="2" x2="12" y2="12" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-extrabold text-amber-950">Sensor hardware is switched OFF</div>
                <div className="text-[11px] font-semibold text-amber-900/90">
                  Showing last cached values. Power on sensor to resume continuous real-time monitoring.
                </div>
              </div>
            </div>
            <button
              onClick={() => toggleSensorPower(activeZoneId)}
              className="btn-primary text-xs py-2 px-4 shadow-sm"
            >
              Power Sensor ON
            </button>
          </div>
        )}

        {/* Sensor Gauges Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 transition-opacity duration-300 ${!isPowered ? 'opacity-70' : 'opacity-100'}`}>
          {/* Temperature */}
          <div className="glass p-5 rounded-2xl border-2 border-amber-200/80 shadow-sm flex flex-col items-center justify-center">
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">Field Temperature</span>
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                isPowered ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-100 text-slate-600 border-slate-300'
              }`}>
                {isPowered ? TEMP_COLORS[t].label : 'Cached'}
              </span>
            </div>

            <div className="my-2">
              <GaugeRing
                value={Math.round(temp)}
                max={50}
                size={88}
                unit="°C"
                color={isPowered ? TEMP_COLORS[t].value : '#94a3b8'}
                bgColor="rgba(203, 213, 225, 0.4)"
              />
            </div>

            {/* Mini range bar */}
            <div className="progress-track w-full mt-3 h-2.5 bg-slate-200/80">
              <div
                className="progress-fill h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, ((temp - (-5)) / 55) * 100))}%` }}
              />
            </div>
            <div className="w-full flex justify-between text-[10px] text-slate-500 font-bold mt-1.5 px-1">
              <span>0°C Min</span>
              <span className="text-slate-800 font-black">Ideal: 18°C – 32°C</span>
              <span>50°C Max</span>
            </div>
          </div>

          {/* Humidity */}
          <div className="glass p-5 rounded-2xl border-2 border-sky-200/80 shadow-sm flex flex-col items-center justify-center">
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">Ambient Humidity</span>
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                isPowered ? 'bg-sky-100 text-sky-900 border-sky-300' : 'bg-slate-100 text-slate-600 border-slate-300'
              }`}>
                {isPowered ? HUM_COLORS[h].label : 'Cached'}
              </span>
            </div>

            <div className="my-2">
              <GaugeRing
                value={Math.round(hum)}
                max={100}
                size={88}
                unit="%"
                color={isPowered ? HUM_COLORS[h].value : '#94a3b8'}
                bgColor="rgba(203, 213, 225, 0.4)"
              />
            </div>

            {/* Mini range bar */}
            <div className="progress-track w-full mt-3 h-2.5 bg-slate-200/80">
              <div
                className="progress-fill progress-fill-sky h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, hum))}%` }}
              />
            </div>
            <div className="w-full flex justify-between text-[10px] text-slate-500 font-bold mt-1.5 px-1">
              <span>0% Min</span>
              <span className="text-slate-800 font-black">Target: 40% – 70%</span>
              <span>100% Max</span>
            </div>
          </div>
        </div>

        {/* Summary status note */}
        <div className={`mt-4 flex items-center gap-3 text-xs p-3.5 rounded-2xl border-2 ${
          !isPowered
            ? 'bg-slate-100/80 border-slate-300 text-slate-700 font-bold'
            : t === 'ok' && h === 'ok'
            ? 'bg-emerald-500/10 border-emerald-300 text-emerald-950 font-extrabold'
            : t === 'danger' || h === 'danger'
            ? 'bg-rose-500/10 border-rose-300 text-rose-950 font-extrabold'
            : 'bg-amber-500/10 border-amber-300 text-amber-950 font-extrabold'
        }`}>
          <svg className="w-5 h-5 flex-shrink-0 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="12" x2="12" y2="16" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>
            {!isPowered
              ? 'Sensor paused — turning sensor ON will allow Pasumai AI to compute automated micro-climate irrigation adjustments.'
              : t === 'ok' && h === 'ok'
              ? 'Optimal conditions detected for this crop — maintaining automated solar schedule.'
              : t === 'danger' || h === 'danger'
              ? 'Conditions outside ideal band — AI recommends checking watering plan in AI Advisor.'
              : 'Conditions slightly fluctuating — monitoring live microclimate.'}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SOIL MOISTURE HOURLY LOG HISTORY COMPONENT                     */}
      {/* ------------------------------------------------------------- */}
      <SoilMoistureLogsCard />
    </div>
  )
}
