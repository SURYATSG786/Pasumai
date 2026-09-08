import { useState } from 'react'
import { NavIcon } from './nav-icons'
import { NAV_ITEMS } from '../data/nav-items'

const PRIMARY_NAV_ITEMS = [
  { id: 'home', icon: 'home', label: 'Dashboard' },
  { id: 'zones', icon: 'zones', label: 'Zones' },
  { id: 'manual', icon: 'manual', label: 'Manual' },
  { id: 'ai', icon: 'ai', label: 'AI Advisor' },
]

export function MobileNav({ page, onNavigate }) {
  const [showDrawer, setShowDrawer] = useState(false)

  const handleSelect = (id) => {
    onNavigate(id)
    setShowDrawer(false)
  }

  const isMoreActive = !PRIMARY_NAV_ITEMS.some(item => item.id === page)

  return (
    <>
      {/* Frosted Bottom Sheet Drawer for All 10 Modules */}
      {showDrawer && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-[fade-in_0.2s_ease-out] md:hidden"
          onClick={() => setShowDrawer(false)}
        >
          <div 
            className="glass-card !rounded-b-none !rounded-t-[2.5rem] p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] border-t-3 border-emerald-400 shadow-2xl animate-[slide-up_0.25s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 rounded-full bg-emerald-400/80 mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4 px-1">
              <div>
                <h3 className="text-base font-black text-earth-950 tracking-tight">All Farm Modules</h3>
                <p className="text-xs text-earth-600 font-bold">Quickly jump to any farm system</p>
              </div>
              <button 
                onClick={() => setShowDrawer(false)}
                className="w-8 h-8 rounded-full bg-emerald-100/80 text-emerald-950 flex items-center justify-center font-black text-sm active:scale-95"
              >
                ✕
              </button>
            </div>

            {/* Grid of all modules */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[60vh] overflow-y-auto scrollbar-hide py-1">
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

