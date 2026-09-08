import { useApp } from '../context/app-context'
import { ZONES } from '../data/mock-data'
import { FEATURE_PAGES } from '../data/nav-items'
import { NavIcon } from './nav-icons'
import { HeroStats } from './dashboard-page'
import { SummaryStrip } from './summary-strip'
import { AIRecommendationCard } from './ai-recommendation'
import { MascotGuide } from './mascot-guide'

export function HomePage({ onNavigate }) {
  const { state } = useApp()
  const zone = ZONES.find((z) => z.id === state.activeZoneId)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-5 sm:space-y-6">
      {/* Welcome banner */}
      <div className="glass-card p-6 sm:p-8">
        <div className="relative flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black text-sky-900 uppercase tracking-wider bg-white/70 px-2.5 py-1 rounded-xl border border-sky-300/40">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
              <span className="text-sky-300">·</span>
              <span className={`text-xs font-extrabold px-2.5 py-1 rounded-xl border ${
                zone?.health === 'warning' 
                  ? 'bg-amber-100/90 text-amber-900 border-amber-300/60' 
                  : 'bg-emerald-100/90 text-emerald-900 border-emerald-300/60'
              }`}>
                {zone?.health === 'warning' ? `⚠️ ${zone?.name} needs attention` : `🌿 ${zone?.name} — optimal`}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-earth-900 tracking-tight leading-tight">
              {greeting}, <span className="text-sky-700">{zone?.crop}</span> farmer 👋
            </h1>
            <p className="text-sm sm:text-base text-earth-700 font-medium mt-2 max-w-xl">
              Here's what's happening across <strong className="text-earth-900">{zone?.name}</strong> today.
              {zone?.health === 'warning'
                ? ' Your AI advisor has a suggestion worth a look.'
                : ' Everything is tracking well — pick a page below for the full picture.'}
            </p>

            <div className="mt-5 grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-wrap gap-2.5 sm:gap-3 items-stretch sm:items-center">
              <button
                onClick={() => onNavigate('ai')}
                className="btn-primary !w-full sm:!w-auto !py-3 sm:!py-2.5"
              >
                <NavIcon id="ai" className="w-4 h-4" />
                <span>Ask AI Advisor</span>
                <NavIcon id="arrow-right" className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onNavigate('manual')}
                className="btn-emerald-3d !w-full sm:!w-auto !py-3 sm:!py-2.5"
              >
                <NavIcon id="manual" className="w-4 h-4" />
                <span>Manual Pump</span>
              </button>
              
              <button
                onClick={() => onNavigate('schedule')}
                className="btn-ghost !w-full sm:!w-auto !py-3 sm:!py-2.5 xs:col-span-2"
              >
                <span>View Schedule</span>
              </button>
            </div>
          </div>

          {/* Mascot */}
          <div className="flex-shrink-0 w-full sm:w-auto self-center mt-2 sm:mt-0 flex justify-center">
            <MascotGuide zone={zone} />
          </div>

        </div>
      </div>

      {/* Hero stat tiles */}
      <HeroStats />

      {/* Colourful metric strip */}
      <SummaryStrip />

      {/* Feature shortcuts — the entry point into each independent page */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-sm font-black text-earth-900 uppercase tracking-wider">Explore your farm modules</h2>
          <span className="text-xs font-bold text-earth-500">Tap any module to open full page</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {FEATURE_PAGES.map((f) => (
            <button
              key={f.id}
              onClick={() => onNavigate(f.id)}
              className="glass-card !p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-soft-lg active:scale-[0.98] group cursor-pointer"
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs mb-3.5 ${f.accent} group-hover:scale-105 transition-transform`}>
                <NavIcon id={f.icon} className="w-5 h-5" />
              </div>
              <div className="text-base font-extrabold text-earth-950 tracking-tight">{f.label}</div>
              <div className="text-xs text-earth-600 font-semibold mt-1">{f.glance(zone)}</div>
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-sky-700 group-hover:text-sky-900 transition-colors">
                <span>Open Module</span>
                <NavIcon id="arrow-right" className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* AI recommendation — always prominent on the home overview */}
      <AIRecommendationCard />
    </div>
  )
}
