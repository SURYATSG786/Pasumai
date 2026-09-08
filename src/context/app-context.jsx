import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { 
  isSupabaseConfigured, 
  testSupabaseConnection, 
  fetchLatestSoilMoisture, 
  fetchSoilMoistureLogs, 
  subscribeToSoilMoistureUpdates,
  recordIrrigationLog 
} from '../services/supabase'

const AppContext = createContext()

const INITIAL_ZONES_SENSORS = {
  'zone-1': { temperature: 29.4, humidity: 68, soilMoisture: 53, soilMoistureRaw: 1700, tankLevel: 74, solarOutput: 2.8, batteryPct: 82 },
  'zone-2': { temperature: 31.2, humidity: 54, soilMoisture: 53, soilMoistureRaw: 1700, tankLevel: 58, solarOutput: 2.4, batteryPct: 76 },
  'zone-3': { temperature: 32.6, humidity: 52, soilMoisture: 53, soilMoistureRaw: 1700, tankLevel: 31, solarOutput: 2.1, batteryPct: 71 },
  'zone-4': { temperature: 28.8, humidity: 72, soilMoisture: 53, soilMoistureRaw: 1700, tankLevel: 91, solarOutput: 3.1, batteryPct: 88 },
}

export function AppProvider({ children }) {
  const [state, setState] = useState({
    activeZoneId: 'zone-1',
    darkMode: false,
    connected: true,
    supabaseConnected: false,
    lastUpdated: Date.now(),
    stats: {
      totalWaterSaved: 1287,
      totalEnergyGenerated: 4821,
      totalIrrigationEvents: 118,
      co2SavedKg: 11.4,
    },
  })

  // Real Supabase Soil Moisture State
  const [liveSoilData, setLiveSoilData] = useState({
    percent: 53,
    raw: 1700,
    isLive: false,
    lastUpdated: null,
    logs: [],
  })

  // Sensor power state per zone (true = ON, false = OFF)
  const [sensorPower, setSensorPower] = useState({
    'zone-1': true,
    'zone-2': true,
    'zone-3': true,
    'zone-4': true,
  })

  // Manual irrigation status per zone
  const [irrigationActive, setIrrigationActive] = useState({
    'zone-1': false,
    'zone-2': false,
    'zone-3': false,
    'zone-4': false,
  })

  // Manual tank refill status (global/borewell pump)
  const [tankRefillActive, setTankRefillActive] = useState(false)

  // Live sensors state across all zones
  const [zonesSensors, setZonesSensors] = useState(INITIAL_ZONES_SENSORS)

  // System activity log for manual operations
  const [activityLogs, setActivityLogs] = useState([
    { id: 1, time: '08:30 AM', text: 'System diagnostics complete. All 4 zone sensors operational.', type: 'info' },
    { id: 2, time: '06:00 AM', text: 'Scheduled automated irrigation completed for Coconut Grove (Zone 1).', type: 'success' },
  ])

  const logActivity = useCallback((text, type = 'info') => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setActivityLogs(prev => [
      { id: Date.now() + Math.random(), time: timeStr, text, type },
      ...prev.slice(0, 19)
    ])
  }, [])

  // -------------------------------------------------------------
  // PHASE 1: REAL SOIL MOISTURE FETCHING & REALTIME SUBSCRIPTION
  // -------------------------------------------------------------
  useEffect(() => {
    if (isSupabaseConfigured) {
      testSupabaseConnection().then(res => {
        setState(prev => ({ ...prev, supabaseConnected: res.connected }))
        if (res.connected) {
          logActivity('⚡ Connected to Supabase Cloud Database!', 'success')
          
          // 1. Fetch latest Soil Moisture reading from sensor_telemetry
          fetchLatestSoilMoisture().then(latest => {
            if (latest) {
              setLiveSoilData(prev => ({
                ...prev,
                percent: latest.moisturePercent,
                raw: latest.moistureRaw,
                isLive: true,
                lastUpdated: latest.createdAt,
              }))
              logActivity(`🌿 Live Soil Moisture Synced from Supabase: ${latest.moisturePercent}% (Raw: ${latest.moistureRaw})`, 'success')
            }
          })

          // 2. Fetch historical sensor_telemetry logs
          fetchSoilMoistureLogs(50).then(logs => {
            if (logs && logs.length > 0) {
              setLiveSoilData(prev => ({
                ...prev,
                logs: logs,
              }))
            }
          })
        }
      })

      // 3. Realtime subscription to sensor_telemetry INSERTs
      const unsubscribe = subscribeToSoilMoistureUpdates((newReading) => {
        if (newReading) {
          setLiveSoilData(prev => {
            const timeStr = new Date(newReading.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            const dateStr = new Date(newReading.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            const delta = +(newReading.moisturePercent - prev.percent).toFixed(1)
            
            const newLogEntry = {
              id: newReading.id || Date.now(),
              hour: timeStr,
              dateStr: dateStr,
              timeAgo: 'Just now',
              moisture: newReading.moisturePercent,
              moistureRaw: newReading.moistureRaw,
              delta: delta,
              status: newReading.moisturePercent >= 60 ? 'optimal' : newReading.moisturePercent >= 40 ? 'adequate' : 'caution',
              note: newReading.moistureRaw ? `ESP32 ADC: ${newReading.moistureRaw} raw` : 'ESP32 Live Telemetry',
              createdAt: newReading.createdAt,
            }

            return {
              ...prev,
              percent: newReading.moisturePercent,
              raw: newReading.moistureRaw,
              isLive: true,
              lastUpdated: newReading.createdAt,
              logs: [newLogEntry, ...(prev.logs || [])].slice(0, 50),
            }
          })

          logActivity(`📡 Live ESP32 Sensor Update: ${newReading.moisturePercent}% (Raw: ${newReading.moistureRaw})`, 'success')
        }
      })

      return () => {
        if (unsubscribe) unsubscribe()
      }
    }
  }, [logActivity])




  const setActiveZone = useCallback((zoneId) => {
    setState(prev => ({ ...prev, activeZoneId: zoneId, lastUpdated: Date.now() }))
  }, [])

  const toggleDarkMode = useCallback(() => {
    setState(prev => ({ ...prev, darkMode: !prev.darkMode }))
  }, [])

  // Toggle Sensor Power
  const toggleSensorPower = useCallback((zoneId) => {
    const targetZone = zoneId || state.activeZoneId
    setSensorPower(prev => {
      const nextVal = !prev[targetZone]
      logActivity(`Sensor power for ${targetZone.toUpperCase()} turned ${nextVal ? 'ON (Active telemetry resumed)' : 'OFF (Standby mode)'}`, nextVal ? 'success' : 'warning')
      return { ...prev, [targetZone]: nextVal }
    })
  }, [state.activeZoneId, logActivity])

  const setSensorPowerState = useCallback((zoneId, isPowered) => {
    setSensorPower(prev => ({ ...prev, [zoneId]: isPowered }))
  }, [])

  // Manual Irrigation Controls
  const startIrrigation = useCallback((zoneId) => {
    const targetZone = zoneId || state.activeZoneId
    setZonesSensors(current => {
      const curTank = current[targetZone]?.tankLevel || 0
      if (curTank < 10) {
        logActivity(`Cannot start irrigation on ${targetZone.toUpperCase()}: Tank level too low (< 10%). Refill tank first!`, 'danger')
        return current
      }
      setIrrigationActive(prev => ({ ...prev, [targetZone]: true }))
      logActivity(`Manual irrigation STARTED on ${targetZone.toUpperCase()} (Flow: 18.5 L/min, Pressure: 2.4 bar)`, 'success')
      return current
    })
  }, [state.activeZoneId, logActivity])

  const stopIrrigation = useCallback((zoneId) => {
    const targetZone = zoneId || state.activeZoneId
    setIrrigationActive(prev => {
      if (prev[targetZone]) {
        logActivity(`Manual irrigation STOPPED on ${targetZone.toUpperCase()}`, 'info')
      }
      return { ...prev, [targetZone]: false }
    })
  }, [state.activeZoneId, logActivity])

  const toggleIrrigation = useCallback((zoneId) => {
    const targetZone = zoneId || state.activeZoneId
    if (irrigationActive[targetZone]) {
      stopIrrigation(targetZone)
    } else {
      startIrrigation(targetZone)
    }
  }, [irrigationActive, startIrrigation, stopIrrigation])

  // Manual Tank Refill Controls
  const startTankRefill = useCallback(() => {
    setTankRefillActive(true)
    logActivity('Manual water tank refill STARTED via Borewell Solar Pump (Inflow: 35 L/min)', 'success')
  }, [logActivity])

  const stopTankRefill = useCallback(() => {
    setTankRefillActive(false)
    logActivity('Manual water tank refill STOPPED', 'info')
  }, [logActivity])

  const toggleTankRefill = useCallback(() => {
    if (tankRefillActive) {
      stopTankRefill()
    } else {
      startTankRefill()
    }
  }, [tankRefillActive, startTankRefill, stopTankRefill])

  // Emergency Stop All
  const stopAllManual = useCallback(() => {
    setIrrigationActive({ 'zone-1': false, 'zone-2': false, 'zone-3': false, 'zone-4': false })
    setTankRefillActive(false)
    logActivity('EMERGENCY STOP executed: All irrigation pumps and tank refill valves halted.', 'danger')
  }, [logActivity])

  // Connectivity fluctuation simulator
  const [connected, setConnected] = useState(state.connected)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.98) {
        setConnected(prev => !prev)
      }
    }, 12000)
    return () => clearInterval(interval)
  }, [])

  // Dynamic simulation loop for sensors, irrigation effect & tank refill
  useEffect(() => {
    const interval = setInterval(() => {
      setZonesSensors(prev => {
        const next = { ...prev }
        Object.keys(next).forEach(zId => {
          const isPowered = sensorPower[zId] !== false
          const isZoneIrrigating = !!irrigationActive[zId]
          const cur = { ...next[zId] }

          // If tank refill is active, increase tank level smoothly
          if (tankRefillActive) {
            cur.tankLevel = Math.min(100, +(cur.tankLevel + 1.2).toFixed(1))
          }

          // If zone is irrigating:
          if (isZoneIrrigating) {
            // Soil moisture rises
            cur.soilMoisture = Math.min(96, +(cur.soilMoisture + 0.8).toFixed(1))
            // Tank level drops unless refilling faster
            if (!tankRefillActive) {
              cur.tankLevel = Math.max(0, +(cur.tankLevel - 0.4).toFixed(1))
            }
          }

          // If sensor is powered, allow natural slight environmental drift
          if (isPowered && Math.random() > 0.5) {
            const tempDelta = (Math.random() - 0.5) * 0.2
            const humDelta = (Math.random() - 0.5) * 0.4
            cur.temperature = Math.min(48, Math.max(15, +(cur.temperature + tempDelta).toFixed(1)))
            cur.humidity = Math.min(98, Math.max(20, +(cur.humidity + humDelta).toFixed(1)))
            cur.solarOutput = Math.min(5.5, Math.max(0, +(cur.solarOutput + (Math.random() - 0.5) * 0.05).toFixed(2)))
          }

          next[zId] = cur
        })

        // Auto stop tank refill when all tanks reach 100%
        const activeTank = next[state.activeZoneId]?.tankLevel || 0
        if (tankRefillActive && activeTank >= 100) {
          setTankRefillActive(false)
          logActivity('Water tank reached 100% capacity. Inflow auto-cutoff safety activated.', 'success')
        }

        // Auto stop irrigation if tank depleted
        Object.keys(irrigationActive).forEach(zId => {
          if (irrigationActive[zId] && (next[zId]?.tankLevel || 0) <= 5) {
            setIrrigationActive(p => ({ ...p, [zId]: false }))
            logActivity(`Irrigation auto-stopped on ${zId.toUpperCase()}: Low water protection triggered (tank <= 5%).`, 'danger')
          }
        })

        return next
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [sensorPower, irrigationActive, tankRefillActive, state.activeZoneId, logActivity])

  const value = useMemo(() => ({
    state,
    activeZoneId: state.activeZoneId,
    setActiveZone,
    toggleDarkMode,
    connected,
    setConnected,
    // Sensor Power Controls
    sensorPower,
    isSensorPowered: (zoneId) => sensorPower[zoneId || state.activeZoneId] !== false,
    toggleSensorPower,
    setSensorPowerState,
    // Manual Irrigation Controls
    irrigationActive,
    isIrrigating: (zoneId) => !!irrigationActive[zoneId || state.activeZoneId],
    startIrrigation,
    stopIrrigation,
    toggleIrrigation,
    // Manual Tank Refill Controls
    tankRefillActive,
    isFillingTank: tankRefillActive,
    startTankRefill,
    stopTankRefill,
    toggleTankRefill,
    // Emergency Stop
    stopAllManual,
    // Live sensor state map
    zonesSensors,
    // Activity Logs
    activityLogs,
    logActivity,
    // Real Supabase Soil Moisture State
    liveSoilData,
  }), [
    state,
    setActiveZone,
    toggleDarkMode,
    connected,
    sensorPower,
    toggleSensorPower,
    setSensorPowerState,
    irrigationActive,
    startIrrigation,
    stopIrrigation,
    toggleIrrigation,
    tankRefillActive,
    startTankRefill,
    stopTankRefill,
    toggleTankRefill,
    stopAllManual,
    zonesSensors,
    activityLogs,
    logActivity,
    liveSoilData,
  ])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export function useLiveSensors(zoneId) {
  const { zonesSensors, sensorPower, irrigationActive, tankRefillActive, liveSoilData } = useApp()
  const currentZone = zoneId || 'zone-1'
  const base = zonesSensors[currentZone] || INITIAL_ZONES_SENSORS['zone-1']
  const isPowered = sensorPower[currentZone] !== false

  // Overwrite soil moisture with real live Supabase reading
  const soilMoisture = liveSoilData?.percent ?? base.soilMoisture
  const soilMoistureRaw = liveSoilData?.raw ?? 1700
  const isSoilMoistureLive = liveSoilData?.isLive ?? false

  return {
    ...base,
    soilMoisture,
    soilMoistureRaw,
    isSoilMoistureLive,
    soilMoistureLastUpdated: liveSoilData?.lastUpdated,
    isPowered,
    isIrrigating: !!irrigationActive[currentZone],
    isFillingTank: tankRefillActive,
  }
}

