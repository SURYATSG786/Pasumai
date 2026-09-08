import { useState, useEffect } from 'react'
import { useApp, useLiveSensors } from '../context/app-context'
import { ZONES } from '../data/mock-data'
import { NavIcon } from './nav-icons'

export function ManualControlCard() {
  const {
    activeZoneId,
    setActiveZone,
    isIrrigating,
    startIrrigation,
    stopIrrigation,
    toggleIrrigation,
    isFillingTank,
    startTankRefill,
    stopTankRefill,
    toggleTankRefill,
    stopAllManual,
    activityLogs,
    isSensorPowered,
    toggleSensorPower,
  } = useApp()

  const sensors = useLiveSensors(activeZoneId)
  const zone = ZONES.find((z) => z.id === activeZoneId)
  const isCurrentZoneIrrigating = isIrrigating(activeZoneId)
  const isSensorOn = isSensorPowered(activeZoneId)

  // Irrigation duration selector (minutes)
  const [duration, setDuration] = useState(10)
  const [irrigationElapsed, setIrrigationElapsed] = useState(0)
  const [waterDispensed, setWaterDispensed] = useState(0)

  // Timer effect when irrigating
  useEffect(() => {
    let timer = null
    if (isCurrentZoneIrrigating) {
      timer = setInterval(() => {
        setIrrigationElapsed((prev) => prev + 1)
        setWaterDispensed((prev) => +(prev + 0.31).toFixed(1)) // ~18.5 L/min -> ~0.31 L/sec
      }, 1000)
    } else {
      setIrrigationElapsed(0)
    }
    return () => clearInterval(timer)
  }, [isCurrentZoneIrrigating])

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60)
    const remSecs = secs % 60
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`
  }

  const isLowTank = sensors.tankLevel < 10

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Top Banner: Mode & Emergency Stop */}
      <div className="glass-card !p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs ${
            isCurrentZoneIrrigating || isFillingTank
              ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
              : 'bg-white/80 text-earth-800 border-sky-200/60'
          }`}>
            <NavIcon id="manual" className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-earth-950">Direct Manual Overrides</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                isCurrentZoneIrrigating || isFillingTank
                  ? 'bg-amber-100 text-amber-900 border-amber-400'
                  : 'bg-white/80 text-earth-800 border-sky-300/50'
              }`}>
                {isCurrentZoneIrrigating || isFillingTank ? '● Active Manual Override' : 'Automatic AI Mode'}
              </span>
            </div>
            <p className="text-xs text-earth-600 font-semibold mt-0.5">
              Take direct manual control of solenoid valves, irrigation lines, and water tank refill pump.
            </p>
          </div>
        </div>

        {/* Emergency Stop All Button */}
        {(isCurrentZoneIrrigating || isFillingTank) && (
          <button
            onClick={stopAllManual}
            className="btn-danger !py-2.5 !px-4 text-xs font-black shadow-lg"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
            <span>EMERGENCY STOP ALL</span>
          </button>
        )}
      </div>

      {/* Main Control Grid: 1. Irrigation, 2. Water Tank Refill */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ========================================================================= */}
        {/* CARD 1: IRRIGATE NOW / STOP IRRIGATION                                    */}
        {/* ========================================================================= */}
        <div className={`glass-card !p-6 transition-all duration-300 relative overflow-hidden ${
          isCurrentZoneIrrigating ? 'ring-2 ring-amber-400 shadow-xl' : ''
        }`}>
          {/* Active Irrigation Ambient Glow */}
          {isCurrentZoneIrrigating && (
            <div className="absolute -top-16 -right-16 w-52 h-52 bg-amber-400/25 rounded-full blur-3xl pointer-events-none" />
          )}

          {/* Section Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-sky-200/50">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs ${
                isCurrentZoneIrrigating ? 'bg-amber-400 text-earth-950 border-amber-500 animate-bounce' : 'bg-white/80 text-earth-700 border-sky-200/60'
              }`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2.5C9.5 8 6 10 6 14a6 6 0 0 0 12 0c0-4-3.5-6-6-11.5Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-black text-earth-950">Irrigation Line Valve</h3>
                <span className="text-xs font-bold text-earth-500">Sub-surface Drip Line Solenoid</span>
              </div>
            </div>

            <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border ${
              isCurrentZoneIrrigating
                ? 'bg-amber-100 text-amber-900 border-amber-400'
                : 'bg-white/80 text-earth-700 border-sky-300/50'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isCurrentZoneIrrigating ? 'bg-amber-500 animate-pulse-dot' : 'bg-earth-400'}`} />
              {isCurrentZoneIrrigating ? 'PUMP RUNNING' : 'VALVE CLOSED'}
            </div>
          </div>

          {/* Zone Selector for Irrigation */}
          <div className="mt-4">
            <label className="text-xs font-black uppercase tracking-wider text-earth-700 block mb-2">
              Select Target Farm Zone:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ZONES.map((z) => {
                const isSelected = z.id === activeZoneId
                const isZoneRunning = isIrrigating(z.id)
                return (
                  <button
                    key={z.id}
                    onClick={() => setActiveZone(z.id)}
                    className={`option !p-2.5 flex flex-col justify-between ${
                      isSelected ? 'selected' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-base">{z.emoji}</span>
                      {isZoneRunning && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse-dot" />
                      )}
                    </div>
                    <div className="text-xs font-black truncate mt-1 text-earth-950">{z.name}</div>
                    <div className="text-[10px] text-earth-500 font-bold truncate">{z.crop}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Preset Duration Selector */}
          <div className="mt-4">
            <label className="text-xs font-black uppercase tracking-wider text-earth-700 block mb-2">
              Run Duration Preset:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 30].map((mins) => (
                <button
                  key={mins}
                  disabled={isCurrentZoneIrrigating}
                  onClick={() => setDuration(mins)}
                  className={`py-2 text-xs font-black rounded-xl border transition-all ${
                    duration === mins
                      ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-sm'
                      : 'bg-white/70 text-earth-800 border-sky-200/60 hover:bg-white disabled:opacity-50'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Low Water Warning (if tank level too low) */}
          {isLowTank && !isCurrentZoneIrrigating && (
            <div className="mt-4 p-3 rounded-2xl bg-rose-100/90 border border-rose-300 text-rose-950 text-xs font-bold flex items-center gap-2.5">
              <svg className="w-5 h-5 flex-shrink-0 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>Tank level is critically low ({Math.round(sensors.tankLevel)}%). Refill the water tank before irrigating.</span>
            </div>
          )}

          {/* Live Telemetry Display when irrigating */}
          <div className="mt-4 p-3.5 rounded-2xl bg-white/70 border border-sky-200/60 grid grid-cols-3 gap-2 text-center backdrop-blur-sm">
            <div>
              <span className="text-[10px] uppercase font-black text-earth-500 block">Line Pressure</span>
              <span className="text-base font-black text-earth-950">
                {isCurrentZoneIrrigating ? '2.4 bar' : '0.0 bar'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-black text-earth-500 block">Flow Rate</span>
              <span className="text-base font-black text-sky-800">
                {isCurrentZoneIrrigating ? '18.5 L/min' : '0.0 L/min'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-black text-earth-500 block">Soil Moisture</span>
              <span className="text-base font-black text-earth-950">
                {Math.round(sensors.soilMoisture)}%
              </span>
            </div>
          </div>

          {/* Active Timer and Water Dispensed Counter */}
          {isCurrentZoneIrrigating && (
            <div className="mt-4 p-3.5 rounded-2xl bg-amber-100/90 border border-amber-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <span className="text-xs font-black text-amber-950">
                  Elapsed: <span className="font-mono text-amber-900">{formatTimer(irrigationElapsed)}</span>
                </span>
              </div>
              <span className="text-xs font-black text-amber-950">
                Dispensed: <span className="font-mono">{waterDispensed} L</span>
              </span>
            </div>
          )}

          {/* MAIN ACTION BUTTON: IRRIGATE NOW / STOP IRRIGATION */}
          <div className="mt-5">
            {isCurrentZoneIrrigating ? (
              <button
                onClick={() => stopIrrigation(activeZoneId)}
                className="btn-danger w-full !py-3.5 text-base font-black shadow-lg"
              >
                <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
                <span>Stop Irrigation</span>
                <span className="text-xs font-bold opacity-90">({zone?.name})</span>
              </button>
            ) : (
              <button
                onClick={() => startIrrigation(activeZoneId)}
                disabled={isLowTank}
                className="btn-primary w-full !py-3.5 text-base font-black shadow-lg"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Irrigate Now</span>
                <span className="text-xs font-bold opacity-90">({duration} min on {zone?.name})</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 2: FILL WATER IN TANK / STOP FILLING                                */}
        {/* ========================================================================= */}
        <div className={`glass-card !p-6 transition-all duration-300 relative overflow-hidden ${
          isFillingTank ? 'ring-2 ring-sky-400 shadow-xl' : ''
        }`}>
          {/* Active Refill Ambient Glow */}
          {isFillingTank && (
            <div className="absolute -top-16 -right-16 w-52 h-52 bg-sky-400/25 rounded-full blur-3xl pointer-events-none" />
          )}

          {/* Section Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-sky-200/50">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs ${
                isFillingTank ? 'bg-sky-500 text-white border-sky-600 animate-pulse' : 'bg-white/80 text-earth-700 border-sky-200/60'
              }`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2.5C9.5 8 6 10 6 14a6 6 0 0 0 12 0c0-4-3.5-6-6-11.5Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-black text-earth-950">Water Tank Refill Pump</h3>
                <span className="text-xs font-bold text-earth-500">Deep Borewell Solar Inflow</span>
              </div>
            </div>

            <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border ${
              isFillingTank
                ? 'bg-sky-100 text-sky-900 border-sky-300'
                : 'bg-white/80 text-earth-700 border-sky-300/50'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isFillingTank ? 'bg-sky-500 animate-pulse-dot' : 'bg-earth-400'}`} />
              {isFillingTank ? 'REFILLING TANK' : 'INFLOW IDLE'}
            </div>
          </div>

          {/* Tank Level Visual Status */}
          <div className="mt-4 p-4 rounded-2xl bg-white/70 border border-sky-200/60 flex items-center gap-4">
            {/* Visual Tank Mini Pillar */}
            <div className="relative w-12 h-24 rounded-2xl border-2 border-sky-300 bg-white/90 overflow-hidden flex-shrink-0 shadow-inner">
              <div
                className={`absolute bottom-0 left-0 right-0 transition-all duration-700 rounded-b-[12px] ${
                  sensors.tankLevel > 60 ? 'bg-sky-500' : sensors.tankLevel > 30 ? 'bg-amber-400' : 'bg-rose-400'
                }`}
                style={{ height: `${Math.min(100, Math.max(8, sensors.tankLevel))}%` }}
              >
                {isFillingTank && (
                  <div className="absolute inset-0 bg-white/40 animate-pulse" />
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-black uppercase tracking-wide text-sky-950">Tank Reserve Capacity</span>
                <span className="text-2xl font-black text-sky-950 font-sans">{Math.round(sensors.tankLevel)}%</span>
              </div>

              {/* Progress track */}
              <div className="mt-2.5 progress-track">
                <div
                  className="progress-fill-sky"
                  style={{ width: `${sensors.tankLevel}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-sky-900 font-bold mt-1.5">
                <span>0% Empty</span>
                <span>{(sensors.tankLevel * 50).toFixed(0)} / 5,000 Litres</span>
                <span>100% Full</span>
              </div>
            </div>
          </div>

          {/* Tank Telemetry Grid */}
          <div className="mt-4 p-3.5 rounded-2xl bg-white/70 border border-sky-200/60 grid grid-cols-3 gap-2 text-center backdrop-blur-sm">
            <div>
              <span className="text-[10px] uppercase font-black text-earth-500 block">Inflow Speed</span>
              <span className="text-base font-black text-sky-800">
                {isFillingTank ? '35.0 L/min' : '0.0 L/min'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-black text-earth-500 block">Pump Power</span>
              <span className="text-base font-black text-earth-950">
                {isFillingTank ? '1.2 kW Solar' : 'Standby'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-black text-earth-500 block">Auto Cutoff</span>
              <span className="text-base font-black text-emerald-700">
                At 100% Full
              </span>
            </div>
          </div>

          {/* Refilling status notice */}
          {isFillingTank && (
            <div className="mt-4 p-3.5 rounded-2xl bg-sky-100/90 border border-sky-300 text-sky-950 text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
                <span>Refill valve active · Borewell solar pump running</span>
              </div>
              <span className="font-mono font-black">+35 L/min</span>
            </div>
          )}

          {/* MAIN ACTION BUTTON: FILL WATER IN TANK / STOP FILLING */}
          <div className="mt-5">
            {isFillingTank ? (
              <button
                onClick={stopTankRefill}
                className="btn-danger w-full !py-3.5 text-base font-black shadow-lg"
              >
                <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
                <span>Stop Filling Water</span>
              </button>
            ) : (
              <button
                onClick={startTankRefill}
                disabled={sensors.tankLevel >= 100}
                className="btn-sky-3d w-full !py-3.5 text-base font-black shadow-lg"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span>{sensors.tankLevel >= 100 ? 'Tank is Already 100% Full' : 'Fill Water in Tank'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sensor Quick Toggle Card + Operational Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sensor Quick Toggle Bar */}
        <div className="glass-card !p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <NavIcon id="sensors" className="w-4 h-4 text-sky-700" />
              <h4 className="text-xs font-black uppercase tracking-wider text-earth-900">Sensor Hardware State</h4>
            </div>
            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
              isSensorOn ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-earth-100 text-earth-700 border-earth-300'
            }`}>
              {isSensorOn ? 'ACTIVE ON' : 'STANDBY OFF'}
            </span>
          </div>

          <p className="text-xs text-earth-600 font-semibold mb-4">
            Toggle {zone?.name} sensor telemetry stream directly:
          </p>

          <button
            onClick={() => toggleSensorPower(activeZoneId)}
            className={`w-full py-3 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all ${
              isSensorOn
                ? 'btn-ghost'
                : 'btn-emerald-3d'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isSensorOn ? 'bg-emerald-500' : 'bg-earth-400'}`} />
            {isSensorOn ? `Turn Sensor OFF (${zone?.name})` : `Turn Sensor ON (${zone?.name})`}
          </button>
        </div>

        {/* System Activity & Safety Log */}
        <div className="lg:col-span-2 glass-card !p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-earth-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <h4 className="text-xs font-black uppercase tracking-wider text-earth-900">Manual Operations & Audit Log</h4>
            </div>
            <span className="text-xs text-sky-800 font-black">Live Sync</span>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className={`p-2.5 rounded-xl text-xs flex items-start gap-2.5 border font-semibold ${
                  log.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : log.type === 'danger'
                    ? 'bg-rose-50 border-rose-200 text-rose-950'
                    : log.type === 'warning'
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-white/80 border-sky-100 text-earth-900'
                }`}
              >
                <span className="text-[10px] font-mono opacity-70 flex-shrink-0 mt-0.5">{log.time}</span>
                <span className="flex-1 leading-snug">{log.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
