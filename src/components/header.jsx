import { useApp } from '../context/app-context'
import { NAV_ITEMS } from '../data/nav-items'
import { NavIcon } from './nav-icons'

export function Header({ page, onNavigate }) {
  const { state, toggleDarkMode, connected } = useApp()

  return (
    <header className="sticky top-0 z-30 glass-header">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        
        {/* Main top bar */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-1.5 sm:gap-3">
          
          {/* Left: Brand Logo & Title */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 py-1 px-1.5 sm:px-2 rounded-xl hover:bg-emerald-200/40 active:scale-95 transition-all cursor-pointer"
          >
            <div className="relative w-8 h-8 sm:w-8.5 sm:h-8.5 flex items-center justify-center rounded-xl bg-emerald-100/95 shadow-xs border-2 border-emerald-400/80">
              <svg viewBox="0 0 32 32" className="w-5.5 h-5.5 sm:w-6 sm:h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="brandSun" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#34d399" />
                    <stop offset="1" stopColor="#10b981" />
                  </linearGradient>
                  <linearGradient id="brandPanel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#059669" />
                    <stop offset="1" stopColor="#047857" />
                  </linearGradient>
                </defs>
                <circle cx="16" cy="9" r="4" fill="url(#brandSun)" />
                <g stroke="#059669" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="16" y1="3" x2="16" y2="1" />
                  <line x1="16" y1="17" x2="16" y2="19" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                  <line x1="24" y1="9" x2="26" y2="9" />
                  <line x1="11.5" y1="4.5" x2="10.2" y2="3.2" />
                  <line x1="20.5" y1="13.5" x2="21.8" y2="14.8" />
                  <line x1="20.5" y1="4.5" x2="21.8" y2="3.2" />
                  <line x1="11.5" y1="13.5" x2="10.2" y2="14.8" />
                </g>
                <rect x="12" y="18" width="16" height="6" rx="1" fill="url(#brandPanel)" />
                <g stroke="#f5f9f6" strokeWidth="0.6" opacity="0.6">
                  <line x1="12" y1="20.5" x2="28" y2="20.5" />
                  <line x1="12" y1="22.5" x2="28" y2="22.5" />
                  <line x1="16" y1="18" x2="16" y2="24" />
                  <line x1="20" y1="18" x2="20" y2="24" />
                </g>
              </svg>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse-dot" style={{ animationDuration: '2.4s' }} />
            </div>
            <div className="text-left">
              <div className="text-sm lg:text-base font-black tracking-tight text-emerald-950 leading-none">Pasumai</div>
              <div className="text-[9px] text-emerald-800 font-bold -mt-0.5">Smart Solar</div>
            </div>
          </button>

          {/* Center (Desktop/Tablet >= md): All 10 Feature Items Displayed Side-by-Side Without Swiping */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-1 sm:gap-1.5 min-w-0">
            {NAV_ITEMS.map((item) => {
              const isActive = item.id === page
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl text-[10px] sm:text-[11px] lg:text-xs font-black tracking-tight whitespace-nowrap transition-all duration-150 flex-shrink-0 cursor-pointer ${
                    isActive
                      ? 'btn-primary !py-1 !px-2 sm:!py-1.5 sm:!px-2.5 !text-[10px] sm:!text-[11px] lg:!text-xs shadow-md'
                      : 'bg-emerald-100/80 hover:bg-emerald-200/90 text-emerald-950 border border-emerald-300 hover:border-emerald-500 shadow-xs'
                  }`}
                >
                  <NavIcon id={item.icon} className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${isActive ? 'text-emerald-950' : 'text-emerald-800'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Right: Live Badge & Dark Mode toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Live status badge */}
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black tracking-wider text-emerald-950 bg-emerald-100/90 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border-2 border-emerald-400 shadow-xs backdrop-blur-md">
              <span className={`inline-block w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse-dot' : 'bg-rose-500'}`} />
              <span className="uppercase font-black">{connected ? 'Live' : 'Offline'}</span>
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-xl bg-emerald-100/80 hover:bg-emerald-200/90 border border-emerald-300 shadow-xs text-emerald-950 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {state.darkMode ? (
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>

        </div>

      </div>
    </header>
  )
}

