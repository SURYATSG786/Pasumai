import { useApp } from '../context/app-context'
import { ZONES } from '../data/mock-data'
import { HEALTH_COLORS } from '../utils/colors'

// Map of photographic aerial crop textures for each zone
const ZONE_IMAGES = {
  z1: '/images/zones/coconut.jpg',
  z2: '/images/zones/mango.jpg',
  z3: '/images/zones/vegetable.jpg',
  z4: '/images/zones/turmeric.jpg',
}

function FarmPlotMap({ activeId, onSelectZone }) {
  return (
    <div className="relative w-full rounded-3xl bg-emerald-50/60 p-4 sm:p-6 border-2 border-emerald-200/80 shadow-inner overflow-hidden">
      {/* Background farm grid line accents */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.06)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(16,185,129,0.06)_1.5px,transparent_1.5px)] bg-[size:36px_36px] pointer-events-none" />

      {/* Top-right mini plot index indicator */}
      <div className="absolute top-4 right-4 hidden sm:flex items-center bg-white/70 backdrop-blur-md p-1.5 rounded-2xl border border-emerald-300/60 shadow-xs z-10">
        <div className="w-6 h-6 grid grid-cols-2 gap-0.5 border border-emerald-400/80 rounded p-0.5 bg-emerald-100/50">
          <div className="bg-emerald-400 rounded-xs" />
          <div className="bg-amber-400 rounded-xs" />
          <div className="bg-emerald-500 rounded-xs" />
          <div className="bg-emerald-400 rounded-xs" />
        </div>
      </div>

      {/* Main Grid Layout of the 4 Real Crop Fields */}
      <div className="relative z-1 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 min-h-[380px]">
        
        {/* Plot 1: Coconut Grove (Top Left - 5 cols) */}
        <button
          type="button"
          onClick={() => onSelectZone('z1')}
          className={`group md:col-span-5 relative h-48 sm:h-56 rounded-[2rem] overflow-hidden border-3 transition-all duration-300 text-left cursor-pointer shadow-md ${
            activeId === 'z1'
              ? 'border-emerald-400 ring-4 ring-emerald-400/40 scale-[1.01] shadow-xl'
              : 'border-white/80 hover:border-emerald-300 hover:scale-[1.01]'
          }`}
        >
          {/* Real aerial palm tree image */}
          <img
            src={ZONE_IMAGES.z1}
            alt="Coconut Grove Aerial"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Subtle gradient vignette for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

          {/* Label overlay */}
          <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl filter drop-shadow-md">🌴</span>
              <span className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-sans">
                Coconut
              </span>
            </div>
            <span className="text-sm sm:text-base font-extrabold text-white/95 mt-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              2.4 ac
            </span>
          </div>

          {/* Floating Sensor Node Badge */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white">
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse-dot" />
            </div>
          </div>
        </button>

        {/* Plot 2: Mango Orchard (Top Center - 4 cols) */}
        <button
          type="button"
          onClick={() => onSelectZone('z2')}
          className={`group md:col-span-4 relative h-48 sm:h-56 rounded-[2rem] overflow-hidden border-3 transition-all duration-300 text-left cursor-pointer shadow-md ${
            activeId === 'z2'
              ? 'border-emerald-400 ring-4 ring-emerald-400/40 scale-[1.01] shadow-xl'
              : 'border-white/80 hover:border-emerald-300 hover:scale-[1.01]'
          }`}
        >
          {/* Real aerial mango trees image */}
          <img
            src={ZONE_IMAGES.z2}
            alt="Mango Orchard Aerial"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

          <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl filter drop-shadow-md">🥭</span>
              <span className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-sans">
                Mango
              </span>
            </div>
            <span className="text-sm sm:text-base font-extrabold text-white/95 mt-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              3.1 ac
            </span>
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white">
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse-dot" />
            </div>
          </div>
        </button>

        {/* Plot 3: Vegetable Patch (Top Right - 3 cols, vertical layout) */}
        <button
          type="button"
          onClick={() => onSelectZone('z3')}
          className={`group md:col-span-3 relative h-48 sm:h-56 rounded-[2rem] overflow-hidden border-3 transition-all duration-300 text-left cursor-pointer shadow-md ${
            activeId === 'z3'
              ? 'border-amber-400 ring-4 ring-amber-400/40 scale-[1.01] shadow-xl'
              : 'border-white/80 hover:border-amber-300 hover:scale-[1.01]'
          }`}
        >
          {/* Real aerial vegetable rows image */}
          <img
            src={ZONE_IMAGES.z3}
            alt="Vegetable Patch Aerial"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

          <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl filter drop-shadow-md">🥬</span>
              <span className="text-base sm:text-lg font-black text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Vegetables
              </span>
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-white/95 mt-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              0.9 ac
            </span>
          </div>

          {/* Attention indicator badge */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-amber-500 border-2 border-white shadow-md flex items-center justify-center text-white">
              <span className="text-[10px] font-black">!</span>
            </div>
          </div>
        </button>

        {/* Plot 4: Turmeric Field (Bottom - Span 12 cols, wide panoramic plot) */}
        <button
          type="button"
          onClick={() => onSelectZone('z4')}
          className={`group md:col-span-12 relative h-32 sm:h-36 rounded-[2rem] overflow-hidden border-3 transition-all duration-300 text-left cursor-pointer shadow-md ${
            activeId === 'z4'
              ? 'border-emerald-400 ring-4 ring-emerald-400/40 scale-[1.005] shadow-xl'
              : 'border-white/80 hover:border-emerald-300 hover:scale-[1.005]'
          }`}
        >
          {/* Real aerial turmeric crop foliage image */}
          <img
            src={ZONE_IMAGES.z4}
            alt="Turmeric Field Aerial"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/50" />

          <div className="relative h-full flex items-center justify-between px-6 sm:px-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white">
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse-dot" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl filter drop-shadow-md">🟠</span>
                  <span className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    Turmeric Field
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] block mt-0.5">
                  1.6 ac · Deep Root Drip Line
                </span>
              </div>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-white/90 text-emerald-950 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
              Active Moisture Feed
            </span>
          </div>
        </button>

      </div>
    </div>
  )
}

export function ZoneSelector() {
  const { state, setActiveZone } = useApp()
  const activeId = state.activeZoneId
  const activeZone = ZONES.find(z => z.id === activeId)

  return (
    <div className="glass-card p-5 sm:p-6 animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-100 border-2 border-emerald-400/80 flex items-center justify-center text-emerald-950 shadow-xs font-bold">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-earth-900 block">Farm Zones & Sub-Plots</span>
            <span className="text-[11px] font-bold text-emerald-800">Aerial Crop Plot Navigator</span>
          </div>
        </div>
        <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-300">
          4 Zones Active
        </span>
      </div>

      {/* Interactive option buttons for zones */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {ZONES.map((zone) => {
          const isActive = zone.id === activeId

          return (
            <button
              key={zone.id}
              onClick={() => setActiveZone(zone.id)}
              className={`option !p-3.5 flex flex-col justify-between cursor-pointer ${
                isActive ? 'selected !border-emerald-600 !shadow-[0_0_0_3.5px_rgba(16,185,129,0.3)]' : ''
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xl">{zone.emoji}</span>
                {zone.health === 'warning' ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse-dot" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                )}
              </div>
              <div className="mt-2 text-left">
                <div className="text-sm font-extrabold text-earth-950 truncate">{zone.name}</div>
                <div className="text-xs text-earth-600 font-bold truncate">{zone.crop} · {zone.area}</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Real Top-Down Aerial Photographic Farm Map */}
      <div className="border-t border-emerald-200/60 pt-4">
        <div className="flex items-center justify-end mb-3">
          <span className="text-xs font-bold text-earth-600">
            {ZONES.filter(z => z.health === 'warning').length > 0
              ? `⚠️ ${ZONES.filter(z => z.health === 'warning').length} zone needs attention`
              : '✅ All zones nominal'}
          </span>
        </div>

        {/* Aerial Photographic Plot Map with trees */}
        <FarmPlotMap activeId={activeId} onSelectZone={setActiveZone} />

        {/* Active Zone Telemetry & Details Card */}
        {activeZone && (
          <div className="mt-5 p-4 sm:p-5 rounded-3xl glass border-2 border-emerald-300/80 shadow-md">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-3">
                <span className="text-3xl filter drop-shadow-sm">{activeZone.emoji}</span>
                <div>
                  <div className="text-base sm:text-lg font-black text-earth-950 leading-tight">{activeZone.name}</div>
                  <div className="text-xs font-extrabold text-emerald-800">{activeZone.crop} · {activeZone.area}</div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                activeZone.health === 'warning' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-emerald-100 text-emerald-900 border-emerald-300'
              }`}>
                {activeZone.health === 'warning' ? 'Needs Attention' : 'Optimal Health'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white/80 border border-emerald-200 shadow-xs">
                <span className="text-earth-500 font-black block text-[10px] uppercase tracking-wider">Soil Moisture</span>
                <div className="font-black text-earth-950 text-base mt-0.5">{activeZone.soilMoisture}%</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/80 border border-emerald-200 shadow-xs">
                <span className="text-earth-500 font-black block text-[10px] uppercase tracking-wider">Temperature</span>
                <div className="font-black text-earth-950 text-base mt-0.5">{activeZone.temperature}°C</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/80 border border-emerald-200 shadow-xs">
                <span className="text-earth-500 font-black block text-[10px] uppercase tracking-wider">Tank Reserve</span>
                <div className={`font-black text-base mt-0.5 ${activeZone.tankLevel < 40 ? 'text-amber-700' : 'text-earth-950'}`}>{activeZone.tankLevel}%</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/80 border border-emerald-200 shadow-xs">
                <span className="text-earth-500 font-black block text-[10px] uppercase tracking-wider">Solar Power</span>
                <div className="font-black text-earth-950 text-base mt-0.5">{activeZone.solarOutput} kW</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/80 border border-emerald-200 shadow-xs">
                <span className="text-earth-500 font-black block text-[10px] uppercase tracking-wider">Next Cycle</span>
                <div className="font-black text-earth-950 text-base mt-0.5">{activeZone.nextIrrigation}</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/80 border border-emerald-200 shadow-xs">
                <span className="text-earth-500 font-black block text-[10px] uppercase tracking-wider">AI Priority</span>
                <div className={`font-black text-base mt-0.5 ${
                  activeZone.priority === 'critical' ? 'text-rose-600' :
                  activeZone.priority === 'high' ? 'text-amber-600' : 'text-emerald-700'
                }`}>{activeZone.priority.toUpperCase()}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
