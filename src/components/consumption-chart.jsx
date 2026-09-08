import { useState } from 'react'
import { WaterConsumption as WATER_CONSUMPTION } from '../data/mock-data'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, Legend, Cell } from 'recharts'

const TOOLTIP_STYLE = {
  contentStyle: {
    background: 'rgba(255, 255, 255, 0.95)',
    border: '2px solid rgba(14, 165, 233, 0.35)',
    borderRadius: '18px',
    padding: '12px 14px',
    boxShadow: '0 18px 40px -10px rgba(3, 32, 56, 0.2)',
    fontSize: '12px',
    color: '#0f172a',
    backdropFilter: 'blur(16px)',
  },
  labelStyle: { color: '#0369a1', fontWeight: 800, marginBottom: 6, fontFamily: 'Space Grotesk, sans-serif' },
  itemStyle: { marginBottom: 3, fontWeight: 700 },
}

const COLORS = {
  used: '#f59e0b',
  saved: '#10b981',
}

export function ConsumptionChart() {
  const [period, setPeriod] = useState('weekly')

  const dataMap = {
    daily: WATER_CONSUMPTION.daily,
    weekly: WATER_CONSUMPTION.weekly,
    monthly: WATER_CONSUMPTION.monthly,
  }

  const labelKey = period === 'daily' ? 'date' : period === 'weekly' ? 'week' : 'month'
  const data = dataMap[period]

  const totalUsed = data.reduce((sum, d) => sum + d.used, 0)
  const totalSaved = data.reduce((sum, d) => sum + d.saved, 0)
  const totalCut = totalUsed > 0 ? ((totalSaved / totalUsed) * 100).toFixed(0) : 0

  return (
    <div className="glass-card p-5 sm:p-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 border border-teal-300 flex items-center justify-center text-white shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Water Consumption & AI Savings</h3>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800/80">Flow Telemetry Analytics</span>
          </div>
        </div>

        {/* Period toggle */}
        <div className="flex glass rounded-2xl border-2 border-slate-200/80 p-1 self-start sm:self-auto gap-1">
          {(['daily', 'weekly', 'monthly']).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all duration-150 ${
                period === p
                  ? 'btn-primary py-1 px-3 text-xs shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[240px] sm:h-[260px] glass rounded-2xl p-3 border-2 border-slate-200/80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey={labelKey}
              tick={{ fontSize: 11, fill: '#475569', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#475569', fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
              width={38}
              tickFormatter={(v) => `${v}L`}
            />
            <Tooltip content={<WaterTooltip />} />
            <Legend
              verticalAlign="top"
              height={28}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }}
            />
            <Bar
              dataKey="used"
              fill={COLORS.used}
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
              name="Water Used (L)"
              animationDuration={600}
              animationBegin={0}
            />
            <Bar
              dataKey="saved"
              fill={COLORS.saved}
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
              name="Water Saved by AI (L)"
              animationDuration={600}
              animationBegin={0}
            />
            {/* Reference line for target */}
            <ReferenceLine
              y={totalUsed * 0.6}
              stroke="#0284c7"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{ value: 'Target Baseline', position: 'right', fill: '#0284c7', fontSize: 10, fontWeight: 800 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary footer */}
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-200/80 pt-3 gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-lg bg-amber-400 border border-amber-500 shadow-sm" />
            <span className="text-xs font-bold text-slate-700">Actual Usage</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-lg bg-emerald-500 border border-emerald-600 shadow-sm" />
            <span className="text-xs font-bold text-slate-700">AI Conservation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-sky-500 rounded-full" />
            <span className="text-xs font-bold text-slate-700">Efficiency Target (60%)</span>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-[11px] font-black uppercase tracking-wider text-emerald-800">Conservation Gain</div>
          <div className="text-2xl font-black text-emerald-950">−{totalCut}%</div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass p-3 rounded-2xl border-2 border-amber-200/80">
          <div className="text-[10px] text-amber-900 font-black uppercase tracking-wider">Total Consumed</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{totalUsed} Liters</div>
        </div>
        <div className="glass p-3 rounded-2xl border-2 border-emerald-200/80">
          <div className="text-[10px] text-emerald-900 font-black uppercase tracking-wider">AI Conserved</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{totalSaved} Liters</div>
        </div>
        <div className="glass p-3 rounded-2xl border-2 border-sky-200/80">
          <div className="text-[10px] text-sky-900 font-black uppercase tracking-wider">Efficiency Gain</div>
          <div className="text-xl font-black text-sky-950 mt-0.5">+{totalCut}% Net Cut</div>
        </div>
      </div>
    </div>
  )
}

function WaterTooltip({ active, payload, label }) {
  if (!active || !payload) return null
  const used = payload.find(p => p.dataKey === 'used')
  const saved = payload.find(p => p.dataKey === 'saved')
  return (
    <div style={TOOLTIP_STYLE.contentStyle}>
      <div style={TOOLTIP_STYLE.labelStyle}>{label}</div>
      {used && (
        <div style={TOOLTIP_STYLE.itemStyle}>
          <span style={{ display: 'inline-block', width: 10, height: 10, background: COLORS.used, borderRadius: 3, marginRight: 6 }} />
          <span>Consumed: </span>
          <span style={{ fontWeight: 800 }}>{used.value}L</span>
        </div>
      )}
      {saved && (
        <div style={TOOLTIP_STYLE.itemStyle}>
          <span style={{ display: 'inline-block', width: 10, height: 10, background: COLORS.saved, borderRadius: 3, marginRight: 6 }} />
          <span>Saved by AI: </span>
          <span style={{ fontWeight: 800, color: '#10b981' }}>{saved.value}L</span>
        </div>
      )}
    </div>
  )
}
