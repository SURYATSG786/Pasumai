import { tempStatus, humStatus, tankStatus } from '../utils/colors'

export function StatusDot({ color, size = '4' }) {
  return (
    <span className={`inline-block w-${size}/12 h-${size}/12 rounded-full ${color} animate-pulse-dot align-middle`} />
  )
}

export function StatusBadge({ label, color }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${color.bg} ${color.text} border ${color.border || 'border-sky-200/60'} shadow-xs`}>
      <span className={`inline-block w-2 h-2 rounded-full ${color.dot}`} />
      {label}
    </span>
  )
}

export function MetricCard({ icon, label, value, unit, sublabel, trend, trendUp, accent, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`glass-card !p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-soft-lg active:scale-[0.99] group ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-earth-600 text-xs font-black uppercase tracking-wider">{label}</span>
            {onClick && (
              <svg className="w-3.5 h-3.5 text-sky-700 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-earth-950 font-sans">{value}</span>
            {unit && <span className="text-sm text-earth-600 font-extrabold">{unit}</span>}
          </div>
          {sublabel && (
            <span className="text-xs text-earth-500 font-bold mt-0.5">{sublabel}</span>
          )}
        </div>

        {icon && (
          <div className={`flex items-center justify-center w-10 h-10 rounded-2xl border shadow-xs ${accent || 'bg-white/80 border-sky-200/60'}`}>
            {icon}
          </div>
        )}
      </div>

      {trend !== undefined && (
        <div className="mt-2.5 flex items-center gap-1 text-xs font-black">
          <svg className={`w-3.5 h-3.5 ${trendUp ? 'text-emerald-700' : 'text-rose-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
          <span className={trendUp ? 'text-emerald-800' : 'text-rose-700'}>
            {trendUp ? '+' : ''}{trend}%
          </span>
          <span className="text-earth-400 font-semibold ml-0.5">vs last cycle</span>
        </div>
      )}
    </button>
  )
}

export function GaugeRing({ value, max, size = 64, label, unit, color, bgColor }) {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(value, max) / max
  const offset = circumference * (1 - pct)
  const r = radius
  const cx = size / 2
  const cy = size / 2

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={bgColor || 'rgba(229, 231, 235, 0.6)'}
          strokeWidth="6"
        />
        {/* Value arc */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
          style={{ filter: 'drop-shadow(0 0 4px ' + color + '40)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-earth-900">{value}</span>
        <span className="text-[11px] text-earth-500 font-medium">{unit || ''}</span>
        {label && <span className="text-[10px] text-earth-400/70 mt-0.5">{label}</span>}
      </div>
    </div>
  )
}

export function MiniSparkline({ data, color, height = 40, width = 80 }) {
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const points = data.length
    ? data.map((v, i) => {
        const x = (i / (data.length - 1)) * width
        const y = height - ((v - min) / (max - min || 1)) * height
        return `${x},${y}`
      }).join(' ')
    : ''
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-500"
      />
    </svg>
  )
}

export function SkeletonPulse({ children, className = '' }) {
  return (
    <div className={`animate-pulse bg-earth-100/50 rounded-lg ${className}`}>
      {children}
    </div>
  )
}

export function LiveIndicator({ connected, label = 'Live' }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-medium text-earth-600 bg-earth-50 px-2 py-1 rounded-full border border-earth-100">
      <span className={`inline-block w-2 h-2 rounded-full ${connected ? 'bg-earth-500 animate-pulse-dot' : 'bg-rose-400'}`} />
      <span className="tracking-wide">{label}</span>
      {connected ? null : (
        <span className="text-rose-500 ml-0.5 font-semibold">— Offline</span>
      )}
    </div>
  )
}
