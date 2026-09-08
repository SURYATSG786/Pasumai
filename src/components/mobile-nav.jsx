import { useState } from 'react'
import { useApp } from '../context/app-context'
import { NavIcon } from './nav-icons'
import { NAV_ITEMS } from '../data/nav-items'
import { ZONES } from '../data/mock-data'

const PRIMARY_NAV_ITEMS = [
  { id: 'home', icon: 'home', label: 'Dashboard' },
  { id: 'zones', icon: 'zones', label: 'Zones' },
  { id: 'manual', icon: 'manual', label: 'Manual' },
  { id: 'ai', icon: 'ai', label: 'AI Advisor' },
]

export function MobileNav({ page, onNavigate }) {
  const { state, setActiveZone } = useApp()
  const [showDrawer, setShowDrawer] = useState(false)

  const handleSelect = (id) => {
    onNavigate(id)
    setShowDrawer(false)
  }

  const handleZoneSelect = (zoneId) => {
    setActiveZone(zoneId)
    setShowDrawer(false)
  }

  const isMoreActive = !PRIMARY_NAV_ITEMS.some(item => item.id === page)

  return (
    <>
      {/* Frosted Bottom Sheet Drawer for All 10 Modules & Farm Zones */}
      {showDrawer && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-[fade-in_0.2s_ease-out] md:hidden"
          onClick={() => setShowDrawer(false)}
        >
          <div 
            className="glass-card !rounded-b-none !rounded-t-[2.5rem] p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] border-t-3 border-emerald-400 shadow-2xl animate-[slide-up_0.25s_ease-out] max-h-[85vh] overflow-y-auto scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 rounded-full bg-emerald-400/80 mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4 px-1">
              <div>
                <h3 className="text-base font-black text-earth-950 tracking-tight">Farm Navigation & Zones</h3>
                <p className="text-xs text-earth-600 font-bold">Select active crop zone or module</p>
              </div>
              <button 
                onClick={() => setShowDrawer(false)}
                className="w-8 h-8 rounded-full bg-emerald-100/80 text-emerald-950 flex items-center justify-center font-black text-sm active:scale-95"
              >
                ✕
              </button>
            </div>

            {/* 1. Farm Zone Switcher (Coconut, Mango, Vegetables, Turmeric) */}
            <div className="mb-4 bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200/80">
              <div className="text-[11px] font-black uppercase text-earth-900 tracking-wider mb-2">
                Active Crop Zone
              </div>
              <div className="grid grid-cols-2 gap-2">
                {ZONES.map((z) => {
                  const isZoneActive = z.id === state.activeZoneId
                  return (
                    <button
                      key={z.id}
                      onClick={() => handleZoneSelect(z.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-black transition-all duration-150 cursor-pointer active:scale-95 text-left ${
                        isZoneActive
                          ? 'btn-primary !p-2.5 shadow-sm ring-2 ring-emerald-500/40'
                          : 'bg-white hover:bg-emerald-100/60 text-earth-900 border border-emerald-200'
                      }`}
                    >
                      <span className="text-lg">{z.emoji}</span>
                      <div className="truncate">
                        <div className="truncate leading-tight">{z.name}</div>
                        <div className="text-[10px] font-bold text-emerald-800 opacity-80">{z.area}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 2. Grid of All 10 Modules */}
            <div>
              <div className="text-[11px] font-black uppercase text-earth-900 tracking-wider mb-2 px-1">
                All Farm Modules
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 py-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = item.id === page
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-150 text-center cursor-pointer active:scale-95 ${
                        isActive
                          ? 'btn-primary !p-3 shadow-md'
                          : 'bg-white/80 hover:bg-white text-earth-900 border border-emerald-200/80 shadow-xs'
                      }`}
                    >
                      <NavIcon id={item.icon} className={`w-6 h-6 mb-1.5 ${isActive ? 'text-emerald-950' : 'text-emerald-700'}`} />
                      <span className="text-[11px] font-black leading-tight truncate w-full">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Dock Bar */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-bottom-bar px-2 pt-1.5 pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))] border-t-2 border-emerald-400/80 shadow-[0_-8px_25px_rgba(16,185,129,0.25)] backdrop-blur-2xl"
        aria-label="Mobile Navigation Dock"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {PRIMARY_NAV_ITEMS.map((item) => {
            const isActive = item.id === page
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 cursor-pointer active:scale-90 ${
                  isActive
                    ? 'btn-primary !py-1 !px-3 shadow-md'
                    : 'text-emerald-950/80 hover:text-emerald-950 hover:bg-emerald-200/40'
                }`}
              >
                <NavIcon
                  id={item.icon}
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'text-emerald-950 scale-110' : 'text-emerald-800'
                  }`}
                />
                <span
                  className={`text-[10px] font-black tracking-tight mt-0.5 ${
                    isActive ? 'text-emerald-950' : 'text-emerald-900'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            )
          })}

          {/* More Modules Toggle Button */}
          <button
            onClick={() => setShowDrawer(!showDrawer)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 cursor-pointer active:scale-90 ${
              isMoreActive || showDrawer
                ? 'btn-primary !py-1 !px-3 shadow-md'
                : 'text-emerald-950/80 hover:text-emerald-950 hover:bg-emerald-200/40'
            }`}
          >
            <svg 
              className={`w-5 h-5 transition-transform duration-200 ${
                isMoreActive || showDrawer ? 'text-emerald-950 scale-110' : 'text-emerald-800'
              }`} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
            <span
              className={`text-[10px] font-black tracking-tight mt-0.5 ${
                isMoreActive || showDrawer ? 'text-emerald-950' : 'text-emerald-900'
              }`}
            >
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  )
}

