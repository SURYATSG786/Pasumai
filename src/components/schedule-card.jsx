import { getScheduleForZone } from '../data/mock-data'
import { useApp } from '../context/app-context'
import { useLiveSensors } from '../context/app-context'

  const STATUS_STYLE = {
    scheduled:   { bg: 'bg-earth-50',  dot: 'bg-earth-400',   text: 'text-earth-700',   border: 'border-earth-200' },
    'in-progress': { bg: 'bg-teal-50',   dot: 'bg-teal-400',    text: 'text-teal-700',    border: 'border-teal-200' },
    completed:   { bg: 'bg-earth-50/60', dot: 'bg-earth-300/60', text: 'text-earth-500', border: 'border-earth-100' },
  }

function WateringIcon({ status }) {
  if (status === 'in-progress') {
    return (
      <svg className="w-5 h-5 text-teal-500 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.5C9.5 8 6 10 6 14a6 6 0 0 0 12 0c0-4-3.5-6-6-11.5Z" />
      </svg>
    )
  }
  if (status === 'completed') {
    return (
      <svg className="w-5 h-5 text-earth-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    )
  }
  return (
    <svg className="w-5 h-5 text-earth-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export function ScheduleCard() {
  const { state, setActiveZone } = useApp()
  const activeId = state.activeZoneId
  const events = getScheduleForZone(activeId)
  const sensors = useLiveSensors(activeId)

  return (
    <div className="glass-card !p-6 animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-white/80 border border-sky-200/60 flex items-center justify-center text-sky-700 shadow-xs">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-earth-900">Automated Irrigation Schedule</span>
        </div>
        <span className="text-xs font-black text-sky-900 bg-white/80 px-3 py-1 rounded-full border border-sky-300/50 shadow-xs">
          {activeId.slice(5).toUpperCase()} Zone
        </span>
      </div>

      {/* Timeline */}
      <div className="relative pl-1 space-y-2.5 my-4">
        {/* Vertical rail */}
        <div className="absolute left-[18px] top-3 bottom-3 w-0.5 bg-sky-200/60" />

        {events.map((evt) => {
          const isWatering = evt.status === 'in-progress'
          const isDone = evt.status === 'completed'

          return (
            <div
              key={evt.id}
              className={`relative flex items-center gap-3.5 p-3.5 pl-4 rounded-2xl border transition-all duration-200 ${
                isWatering
                  ? 'bg-amber-100/90 border-amber-300 shadow-sm'
                  : isDone
                  ? 'bg-white/60 border-sky-100 text-earth-600 opacity-75'
                  : 'bg-white/90 border-sky-200/60 shadow-xs'
              }`}
            >
              {/* Dot on rail */}
              <div className="flex-shrink-0 relative z-10">
                <div
                  className={`w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                    isWatering ? 'bg-amber-500 animate-pulse' : isDone ? 'bg-emerald-500' : 'bg-sky-400'
                  }`}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Date */}
                  <span className={`text-xs font-black ${
                    isWatering ? 'text-amber-950' : isDone ? 'text-earth-600' : 'text-earth-950'
                  }`}>
                    {evt.date}
                  </span>
                  {evt.note && (
                    <span className="text-[10px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded-md font-black">AI OPTIMIZED</span>
                  )}

                  {/* Time */}
                  <span className="text-xs font-mono font-bold text-sky-800">
                    {evt.time}
                  </span>

                  {/* Status badge */}
                  <span className={`ml-auto text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isWatering 
                      ? 'bg-amber-200 text-amber-900 border-amber-400' 
                      : isDone 
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                      : 'bg-sky-100 text-sky-900 border-sky-300'
                  }`}>
                    {isWatering ? 'Watering Now' : evt.status}
                  </span>
                </div>

                {/* Watering details */}
                <div className="mt-1 flex items-center gap-3 text-xs text-earth-700 font-bold">
                  <span>💧 {evt.amount}</span>
                  {evt.duration !== '—' && <span>⏱ Duration: {evt.duration}</span>}
                </div>
              </div>

              {/* Watering icon */}
              <div className="flex-shrink-0">
                <WateringIcon status={evt.status} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Manual override */}
      <div className="mt-5 border-t border-sky-200/50 pt-4">
        <div className="flex items-center justify-end">
          <button
            className="btn-primary !py-2.5 !px-5"
            disabled={sensors.tankLevel < 15}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2.5C9.5 8 6 10 6 14a6 6 0 0 0 12 0c0-4-3.5-6-6-11.5Z" />
            </svg>
            <span>Water Now</span>
          </button>
        </div>
        {sensors.tankLevel < 15 && (
          <div className="mt-2 text-xs font-bold text-rose-600 flex items-center gap-1.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>Manual override disabled — tank critically low. Refill required.</span>
          </div>
        )}
      </div>
    </div>
  )
}
