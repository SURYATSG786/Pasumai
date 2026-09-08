import { NavIcon } from './nav-icons'

const BOTTOM_NAV_ITEMS = [
  { id: 'home', icon: 'home', label: 'Dashboard' },
  { id: 'zones', icon: 'zones', label: 'Zones' },
  { id: 'weather', icon: 'weather', label: 'Weather' },
  { id: 'manual', icon: 'manual', label: 'Manual' },
  { id: 'ai', icon: 'ai', label: 'AI Advisor' },
]

export function MobileNav({ page, onNavigate }) {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-bottom-bar px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] border-t-2 border-emerald-400/80 shadow-[0_-8px_25px_rgba(16,185,129,0.25)] backdrop-blur-2xl"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = item.id === page
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
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
      </div>
    </nav>
  )
}
