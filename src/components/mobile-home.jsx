import { useApp, useLiveSensors } from '../context/app-context'
import { ZONES } from '../data/mock-data'
import { NavIcon } from './nav-icons'
import { MascotGuide } from './mascot-guide'
import { AnimatedNumber } from './animated-number'

const ZONE_IMAGES = {
  z1: '/images/zones/coconut.jpg',
  z2: '/images/zones/mango.jpg',
  z3: '/images/zones/vegetable.jpg',
  z4: '/images/zones/turmeric.jpg',
}

export function MobileHome({ onNavigate }) {
  const { 
    state, 
    isIrrigating, 
    toggleIrrigation, 
    isFillingTank, 
    toggleTankRefill 
  } = useApp()
  
  const zone = ZONES.find((z) => z.id === state.activeZoneId) || ZONES[0]
  const sensors = useLiveSensors(zone.id)
  const isCurrentlyIrrigating = isIrrigating(zone.id)

  return (
    <div className="space-y-4 px-3 py-3 animate-fade-up">
      {/* 1. Hero 1-Tap Mobile Pump Control Widget */}
      <div className={`p-4 rounded-3xl border-2 transition-all duration-300 shadow-md ${
        isCurrentlyIrrigating 
          ? 'bg-gradient-to-br from-emerald-100 via-teal-100 to-emerald-200 border-emerald-500 ring-4 ring-emerald-400/30' 
          : 'glass-card border-emerald-300/80'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold shadow-xs ${
              isCurrentlyIrrigating ? 'bg-emerald-500 text-white animate-spin' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}>
              <NavIcon id="manual" className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-earth-950 leading-tight">
                {zone.crop} Drip Line
              </div>
              <div className="text-[11px] font-bold text-emerald-800">
                {isCurrentlyIrrigating ? '💧 Pump Active · 18.5 L/min' : 'Ready for on-demand irrigation'}
              </div>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
            isCurrentlyIrrigating ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white text-earth-700 border-emerald-200'
          }`}>
            {isCurrentlyIrrigating ? 'Irrigating' : 'Standby'}
          </span>
        </div>

        {/* Big Tap-to-Irrigate Action Button */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            onClick={() => toggleIrrigation(zone.id, 10)}
            className={`w-full py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer ${
              isCurrentlyIrrigating
                ? 'btn-danger !py-3'
                : 'btn-primary !py-3'
            }`}
          >
            {isCurrentlyIrrigating ? (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
                <span>STOP PUMP</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>START IRRIGATE (10m)</span>
              </>
            )}
          </button>

          <button
            onClick={() => toggleTankRefill()}
            className={`w-full py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer ${
              isFillingTank ? 'btn-danger !py-3' : 'btn-sky-3d !py-3'
            }`}
          >
            <NavIcon id="tank" className="w-4 h-4" />
            <span>{isFillingTank ? 'STOP REFILL' : 'REFILL TANK'}</span>
          </button>
        </div>
      </div>

      {/* 3. Real-Time Telemetry 2x2 Mobile Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Soil Moisture Card */}
        <div 
          onClick={() => onNavigate('sensors')} 
          className="glass-card !p-3.5 flex flex-col justify-between cursor-pointer active:scale-95 transition-transform"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-earth-800">Moisture</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-earth-950">
              <AnimatedNumber value={sensors.soilMoisture} suffix="%" />
            </span>
            <p className="text-[10px] font-bold text-emerald-800 mt-0.5 truncate">
              {sensors.soilMoisture >= 50 ? '🌿 Optimal Soil' : '⚠️ Low Moisture'}
            </p>
          </div>
          <div className="w-full progress-track !h-2">
            <div className="progress-fill" style={{ width: `${sensors.soilMoisture}%` }} />
          </div>
        </div>

        {/* Water Tank Card */}
        <div 
          onClick={() => onNavigate('tank')} 
          className="glass-card !p-3.5 flex flex-col justify-between cursor-pointer active:scale-95 transition-transform"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-earth-800">Tank Reserve</span>
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse-dot" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-earth-950">
              <AnimatedNumber value={sensors.tankLevel} suffix="%" />
            </span>
            <p className="text-[10px] font-bold text-sky-800 mt-0.5 truncate">
              {sensors.tankLevel >= 40 ? '💧 5,000L Reserve' : '⚠️ Low Water'}
            </p>
          </div>
          <div className="w-full progress-track !h-2">
            <div className="progress-fill-sky" style={{ width: `${sensors.tankLevel}%` }} />
          </div>
        </div>

        {/* Solar Generation Card */}
        <div 
          onClick={() => onNavigate('solar')} 
          className="glass-card !p-3.5 flex flex-col justify-between cursor-pointer active:scale-95 transition-transform"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-earth-800">Solar Power</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse-dot" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-earth-950">
              <AnimatedNumber value={sensors.solarOutput} suffix=" kW" />
            </span>
            <p className="text-[10px] font-bold text-amber-900 mt-0.5 truncate">
              Battery {Math.round(sensors.batteryPct)}% charged
            </p>
          </div>
          <div className="w-full progress-track !h-2">
            <div className="progress-fill" style={{ width: `${sensors.batteryPct}%` }} />
          </div>
        </div>

        {/* Weather Card */}
        <div 
          onClick={() => onNavigate('weather')} 
          className="glass-card !p-3.5 flex flex-col justify-between cursor-pointer active:scale-95 transition-transform"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-earth-800">Weather</span>
            <span className="text-sm">☀️</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-earth-950">
              {zone.temperature}°C
            </span>
            <p className="text-[10px] font-bold text-earth-700 mt-0.5 truncate">
              {zone.humidity}% Humidity
            </p>
          </div>
          <div className="text-[10px] font-black text-emerald-800 bg-emerald-100/90 rounded-md px-1.5 py-0.5 text-center">
            Zero rain risk
          </div>
        </div>
      </div>

      {/* 4. AI Recommendation Alert Card */}
      <div 
        onClick={() => onNavigate('ai')}
        className="glass-card !p-4 border-2 border-emerald-400/80 cursor-pointer active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-950 flex items-center justify-center font-bold">
              <NavIcon id="ai" className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-earth-950">Pasumai AI Engine</span>
          </div>
          <span className="text-[10px] font-black text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300">
            Active
          </span>
        </div>
        <p className="text-xs font-extrabold text-earth-900 leading-snug">
          {zone.health === 'warning'
            ? `⚠️ ${zone.name} soil moisture dropped below threshold. Recommended: 10m pulse irrigation at 16:30.`
            : `🌿 Solar efficiency is peak. Next scheduled cycle for ${zone.name} is ${zone.nextIrrigation}.`}
        </p>
        <div className="mt-2.5 flex items-center justify-between text-xs font-black text-sky-800">
          <span>View AI analysis & reasoning</span>
          <NavIcon id="arrow-right" className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* 5. Swipeable Photographic Farm Plot Map Cards */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-black uppercase text-earth-900">Aerial Crop Plots</span>
          <button 
            onClick={() => onNavigate('zones')} 
            className="text-[11px] font-black text-emerald-800 hover:text-emerald-950"
          >
            View All ➔
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {ZONES.map((z) => (
            <div
              key={z.id}
              onClick={() => {
                setActiveZone(z.id)
                onNavigate('zones')
              }}
              className="relative h-28 rounded-2xl overflow-hidden border-2 border-emerald-300/80 cursor-pointer active:scale-95 transition-transform shadow-xs"
            >
              <img
                src={ZONE_IMAGES[z.id]}
                alt={z.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white">
                <div>
                  <div className="text-xs font-black leading-tight flex items-center gap-1">
                    <span>{z.emoji}</span>
                    <span>{z.crop}</span>
                  </div>
                  <div className="text-[10px] text-white/90 font-bold">{z.area}</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Mascot Guide Chat Widget */}
      <div className="glass-card !p-4 flex flex-col items-center">
        <MascotGuide zone={zone} />
      </div>
    </div>
  )
}
