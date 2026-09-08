import { useState, useMemo } from 'react'
import { useApp, useLiveSensors } from '../context/app-context'
import { ZONES } from '../data/mock-data'
import { INITIAL_SOIL_LOGS, computeSoilStats } from '../data/soil-moisture-history'

export function SoilMoistureLogsCard() {
  const { activeZoneId, isSensorPowered } = useApp()
  const sensors = useLiveSensors(activeZoneId)
  const isPowered = isSensorPowered(activeZoneId)
  const zone = ZONES.find((z) => z.id === activeZoneId)

  // Local logs state per zone
  const [logsState, setLogsState] = useState(INITIAL_SOIL_LOGS)
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'optimal' | 'adequate' | 'caution' | 'irrigated'
  const [searchQuery, setSearchQuery] = useState('')
  const [justLogged, setJustLogged] = useState(false)

  const currentZoneLogs = logsState[activeZoneId] || []

  // Add a new reading manually from live sensor
  const handleRecordReading = () => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    const currentMoisture = +sensors.soilMoisture.toFixed(1)
    const prevMoisture = currentZoneLogs[0]?.moisture || currentMoisture
    const delta = +(currentMoisture - prevMoisture).toFixed(1)

    let status = 'adequate'
    if (sensors.isIrrigating) status = 'irrigated'
    else if (currentMoisture >= 60) status = 'optimal'
    else if (currentMoisture >= 40) status = 'adequate'
    else status = 'caution'

    const newEntry = {
      id: `manual-${Date.now()}`,
      hour: timeStr,
      timeAgo: 'Just logged',
      moisture: currentMoisture,
      delta: delta,
      temp: +sensors.temperature.toFixed(1),
      hum: Math.round(sensors.humidity),
      status: status,
      note: sensors.isIrrigating ? 'Manual irrigation active' : 'Live sensor checkpoint snapshot',
    }

    setLogsState(prev => ({
      ...prev,
      [activeZoneId]: [newEntry, ...(prev[activeZoneId] || [])]
    }))

    setJustLogged(true)
    setTimeout(() => setJustLogged(false), 2200)
  }

  // Export logs to CSV
  const handleExportCSV = () => {
    const headers = ['Time', 'Relative', 'Soil Moisture (%)', 'Status', 'Hourly Delta (%)', 'Temperature (°C)', 'Humidity (%)', 'Telemetry Note']
    const rows = currentZoneLogs.map(l => [
      `"${l.hour}"`,
      `"${l.timeAgo}"`,
      l.moisture,
      `"${l.status}"`,
      l.delta,
      l.temp,
      l.hum,
      `"${l.note}"`
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `soil_moisture_${activeZoneId}_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return currentZoneLogs.filter(log => {
      if (statusFilter !== 'all' && log.status !== statusFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          log.hour.toLowerCase().includes(q) ||
          log.note.toLowerCase().includes(q) ||
          log.status.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [currentZoneLogs, statusFilter, searchQuery])

  const stats = useMemo(() => computeSoilStats(currentZoneLogs), [currentZoneLogs])
  return (
    <div className="glass-card !p-6 animate-fade-up">
      {/* ------------------------------------------------------------- */}
      {/* SECTION HEADER                                                */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-sky-200/50">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/80 border border-sky-200/60 flex items-center justify-center text-earth-800 shadow-xs flex-shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20v-6M12 22a6 6 0 0 0 6-6M12 22a6 6 0 0 1-6-6M6 8a6 6 0 0 0 6 6" />
              <path d="M4 14h2M18 14h2M3 18h3M18 18h3" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-earth-950 leading-tight">
                Soil Moisture Hourly Log Telemetry
              </h3>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/80 text-earth-900 border border-sky-300/60 shadow-xs">
                <span>{zone?.emoji}</span>
                <span>{zone?.name}</span>
                <span className="text-earth-500 font-bold">({zone?.soilType})</span>
              </span>
            </div>
            <p className="text-xs text-earth-600 font-semibold mt-0.5">
              Continuous 24-hour telemetry logging across root zone moisture sensors.
            </p>
          </div>
        </div>

        {/* Action Buttons: Record & Export */}
        <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-auto">
          <button
            onClick={handleRecordReading}
            className={`btn-primary !py-2.5 !px-4 ${justLogged ? '!bg-emerald-500 !text-white' : ''}`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <span>{justLogged ? '✓ Log Recorded!' : 'Log Current Reading'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="btn-ghost !py-2.5 !px-3.5"
            title="Download hourly logs as CSV spreadsheet"
          >
            <svg className="w-4 h-4 text-earth-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SUMMARY STATS GRID                                            */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 my-5">
        {/* 24h Average */}
        <div className="p-4 rounded-2xl bg-white/70 border border-sky-200/60 shadow-xs flex flex-col justify-between backdrop-blur-sm">
          <span className="text-[10px] uppercase font-black text-earth-500 tracking-wider">24h Average Moisture</span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black font-sans text-earth-950 tabular-nums">{stats.avg}%</span>
            <span className="text-xs font-bold text-sky-800">mean</span>
          </div>
          <span className="text-xs text-earth-500 font-bold mt-1">Target: 40% - 70%</span>
        </div>

        {/* 24h Range Min - Max */}
        <div className="p-4 rounded-2xl bg-white/70 border border-sky-200/60 shadow-xs flex flex-col justify-between backdrop-blur-sm">
          <span className="text-[10px] uppercase font-black text-earth-500 tracking-wider">24h Range Bounds</span>
          <div className="flex items-baseline gap-1.5 mt-1.5 font-sans tabular-nums">
            <span className="text-xl sm:text-2xl font-black text-rose-700">{stats.min}%</span>
            <span className="text-earth-400 text-xs font-bold">to</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-700">{stats.max}%</span>
          </div>
          <span className="text-xs text-earth-500 font-bold mt-1">Spread: {(stats.max - stats.min).toFixed(1)}%</span>
        </div>

        {/* Optimal Retention Time */}
        <div className="p-4 rounded-2xl bg-white/70 border border-sky-200/60 shadow-xs flex flex-col justify-between backdrop-blur-sm">
          <span className="text-[10px] uppercase font-black text-earth-500 tracking-wider">Optimal Range Time</span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl sm:text-3xl font-black font-sans text-emerald-800 tabular-nums">{stats.optimalPct}%</span>
            <span className="text-xs font-bold text-emerald-900">of day</span>
          </div>
          <span className="text-xs text-earth-500 font-bold mt-1">In ideal hydration bounds</span>
        </div>

        {/* Current Trend / Latest Delta */}
        <div className="p-4 rounded-2xl bg-white/70 border border-sky-200/60 shadow-xs flex flex-col justify-between backdrop-blur-sm">
          <span className="text-[10px] uppercase font-black text-earth-500 tracking-wider">1-Hour Trend Delta</span>
          <div className="flex items-baseline gap-1 mt-1.5 font-sans tabular-nums">
            <span className={`text-2xl sm:text-3xl font-black ${
              stats.latestDelta > 0 ? 'text-emerald-700' : stats.latestDelta < -1.5 ? 'text-amber-700' : 'text-earth-950'
            }`}>
              {stats.latestDelta > 0 ? `+${stats.latestDelta}` : stats.latestDelta}%
            </span>
            <span className="text-xs font-bold text-earth-500">/ hr</span>
          </div>
          <span className="text-xs text-earth-500 font-bold mt-1">
            {stats.latestDelta > 0 ? '💧 Soil absorption' : '☀️ Natural evaporation'}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 24-HOUR VISUAL TIMELINE STRIP                                 */}
      {/* ------------------------------------------------------------- */}
      <div className="my-5 p-4 rounded-2xl bg-white/60 border border-sky-200/60 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-earth-900">24-Hour Telemetry Bar Strip</span>
          <div className="flex items-center gap-3 text-xs font-bold text-earth-600 flex-wrap">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-md bg-emerald-500" /> Optimal (≥60%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-md bg-amber-400" /> Adequate (40-59%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-md bg-rose-400" /> Low (&lt;40%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-md bg-sky-500" /> Irrigated
            </span>
          </div>
        </div>

        {/* Bars Strip */}
        <div className="grid grid-cols-12 sm:grid-cols-24 gap-1 items-end h-20 pt-2">
          {[...currentZoneLogs].reverse().map((log, idx) => {
            const heightPct = Math.min(100, Math.max(18, (log.moisture / 100) * 100))
            const barColor =
              log.status === 'irrigated'
                ? 'bg-sky-500 hover:bg-sky-600 shadow-sm'
                : log.moisture >= 60
                ? 'bg-emerald-500 hover:bg-emerald-600 shadow-sm'
                : log.moisture >= 40
                ? 'bg-amber-400 hover:bg-amber-500 shadow-sm'
                : 'bg-rose-400 hover:bg-rose-500 shadow-sm'

            return (
              <div
                key={log.id || idx}
                className="group relative flex flex-col items-center h-full justify-end"
              >
                {/* Bar */}
                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${barColor}`}
                  style={{ height: `${heightPct}%` }}
                />

                {/* Tooltip on hover */}
                <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-20">
                  <div className="bg-earth-950 text-white text-xs font-bold py-1.5 px-2.5 rounded-xl shadow-xl whitespace-nowrap leading-tight text-center">
                    <div className="font-black text-amber-300">{log.hour}</div>
                    <div>Moisture: {log.moisture}%</div>
                    <div className="text-sky-300 text-[10px]">{log.note}</div>
                  </div>
                  <div className="w-2 h-2 bg-earth-950 rotate-45 -mt-1" />
                </div>
              </div>
            )
          })}
        </div>

        {/* Timeline Axis Labels */}
        <div className="flex justify-between text-[10px] font-mono font-bold text-earth-500 mt-2 px-1">
          <span>24 hrs ago</span>
          <span>18 hrs ago</span>
          <span>12 hrs ago</span>
          <span>6 hrs ago</span>
          <span className="font-black text-sky-800">Current</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FILTER & SEARCH BAR                                           */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 my-4">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          {[
            { id: 'all', label: 'All Logs' },
            { id: 'optimal', label: 'Optimal (≥60%)' },
            { id: 'adequate', label: 'Adequate (40-59%)' },
            { id: 'caution', label: 'Low (<40%)' },
            { id: 'irrigated', label: '💧 Irrigated' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 text-xs font-black rounded-xl whitespace-nowrap transition-all ${
                statusFilter === f.id
                  ? 'btn-primary !py-1.5 !px-3 text-xs shadow-xs'
                  : 'bg-white/70 text-earth-800 border border-sky-200/60 hover:bg-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[200px]">
          <input
            type="text"
            placeholder="Search logs or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sky-input !py-1.5 !pl-8 !text-xs"
          />
          <svg className="w-4 h-4 text-earth-500 absolute left-2.5 top-2.5 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TABULAR HOURLY LOGS TABLE                                     */}
      {/* ------------------------------------------------------------- */}
      <div className="overflow-x-auto rounded-2xl border border-sky-200/60 max-h-[380px] overflow-y-auto bg-white/70 backdrop-blur-sm shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          {/* Table Header with Sticky Alignment */}
          <thead className="bg-white/95 sticky top-0 z-10 border-b border-sky-200/60 text-earth-900 font-black uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-3.5 text-left w-28">Timestamp</th>
              <th className="py-3 px-3.5 text-left w-44">Soil Moisture</th>
              <th className="py-3 px-3.5 text-center w-28">Status</th>
              <th className="py-3 px-3.5 text-center w-28">1h Delta</th>
              <th className="py-3 px-3.5 text-center w-32">Temp / Humidity</th>
              <th className="py-3 px-3.5 text-left">Telemetry & Operational Note</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-sky-100/70 font-semibold text-earth-900">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-earth-500 font-bold">
                  No moisture log entries found matching the filter.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const isPositive = log.delta > 0
                const isZero = log.delta === 0

                return (
                  <tr key={log.id} className="hover:bg-white/90 transition-colors">
                    {/* Timestamp */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-black text-earth-950 font-mono">{log.hour}</div>
                      <div className="text-[10px] text-earth-500 font-bold">{log.timeAgo}</div>
                    </td>

                    {/* Soil Moisture */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-black text-sm tabular-nums text-earth-950 w-12">
                          {log.moisture.toFixed(1)}%
                        </span>
                        {/* Mini bar */}
                        <div className="w-20 progress-track !h-2">
                          <div
                            className={
                              log.status === 'irrigated'
                                ? 'progress-fill-sky'
                                : log.moisture >= 60
                                ? 'progress-fill-emerald'
                                : 'progress-fill'
                            }
                            style={{ width: `${Math.min(100, Math.max(0, log.moisture))}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                        log.status === 'irrigated'
                          ? 'bg-sky-100 text-sky-900 border-sky-300'
                          : log.status === 'optimal'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : log.status === 'adequate'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-rose-100 text-rose-900 border-rose-300'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          log.status === 'irrigated'
                            ? 'bg-sky-500'
                            : log.status === 'optimal'
                            ? 'bg-emerald-500'
                            : log.status === 'adequate'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`} />
                        {log.status === 'irrigated'
                          ? 'Irrigated'
                          : log.status === 'optimal'
                          ? 'Optimal'
                          : log.status === 'adequate'
                          ? 'Adequate'
                          : 'Low / Caution'}
                      </span>
                    </td>

                    {/* Hourly Delta */}
                    <td className="py-3 px-3.5 text-center whitespace-nowrap font-mono text-xs font-black tabular-nums">
                      <span className={
                        isPositive ? 'text-emerald-700' : isZero ? 'text-earth-400' : 'text-amber-800'
                      }>
                        {isPositive ? `+${log.delta}%` : `${log.delta}%`}
                      </span>
                    </td>

                    {/* Temp & Humidity */}
                    <td className="py-3 px-3.5 text-center whitespace-nowrap text-earth-700 font-mono font-bold text-xs">
                      <span>{log.temp.toFixed(1)}°C</span>
                      <span className="text-sky-300 mx-1">·</span>
                      <span>{log.hum}%</span>
                    </td>

                    {/* Telemetry Note */}
                    <td className="py-3 px-3.5 text-left text-earth-800 text-xs font-bold">
                      <span className="line-clamp-1">{log.note}</span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div className="mt-3.5 pt-3 border-t border-sky-200/50 flex items-center justify-end text-xs font-bold text-earth-500">
        <div className="flex items-center gap-3">
          <span>Logged Every <span className="font-black text-earth-900">60 mins</span></span>
        </div>
      </div>
    </div>
  )
}
