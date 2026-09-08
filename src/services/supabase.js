import { createClient } from '@supabase/supabase-js'
import { ZONES as FALLBACK_ZONES } from '../data/mock-data'

const DEFAULT_URL = 'https://irxsothgamllsoeqllef.supabase.co'
const DEFAULT_KEY = 'sb_publishable_pVKAyyXXMelzZJKl2gvGcg_16JMKxH6'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-ref')
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null

/**
 * Test connectivity to Supabase
 */
export async function testSupabaseConnection() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      message: 'Supabase credentials missing.',
    }
  }

  try {
    const { error } = await supabase.from('sensor_telemetry').select('id', { head: true, count: 'exact' })
    if (error && error.code !== 'PGRST116') {
      if (error.message && error.message.includes('relation "sensor_telemetry" does not exist')) {
        return {
          connected: true,
          tableReady: false,
          message: 'Connected to Supabase (Table sensor_telemetry awaiting creation).',
        }
      }
      return { connected: true, tableReady: true, message: 'Connected to Supabase live database!' }
    }
    return { connected: true, tableReady: true, message: 'Connected to Supabase live database!' }
  } catch (err) {
    return { connected: false, message: err.message || 'Connection failed' }
  }
}

/**
 * Fetch latest real soil moisture reading from Supabase
 * Query: select * from sensor_telemetry order by created_at desc limit 1;
 */
export async function fetchLatestSoilMoisture() {
  if (!isSupabaseConfigured || !supabase) return null

  try {
    const { data, error } = await supabase
      .from('sensor_telemetry')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error || !data) return null
    return {
      id: data.id,
      moisturePercent: Number(data.moisture_percent ?? data.soil_moisture ?? 0),
      moistureRaw: Number(data.moisture_raw ?? 0),
      createdAt: data.created_at || new Date().toISOString(),
    }
  } catch (err) {
    console.warn('Error fetching latest soil moisture from Supabase:', err)
    return null
  }
}

/**
 * Fetch historical soil moisture logs from Supabase
 */
export async function fetchSoilMoistureLogs(limit = 50) {
  if (!isSupabaseConfigured || !supabase) return []

  try {
    const { data, error } = await supabase
      .from('sensor_telemetry')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error || !data) return []

    return data.map((row, idx, arr) => {
      const moisture = Number(row.moisture_percent ?? row.soil_moisture ?? 0)
      const raw = Number(row.moisture_raw ?? 0)
      const prevRow = arr[idx + 1]
      const prevMoisture = prevRow ? Number(prevRow.moisture_percent ?? prevRow.soil_moisture ?? moisture) : moisture
      const delta = +(moisture - prevMoisture).toFixed(1)

      let status = 'adequate'
      if (moisture >= 60) status = 'optimal'
      else if (moisture >= 40) status = 'adequate'
      else status = 'caution'

      const date = new Date(row.created_at || Date.now())
      const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

      return {
        id: row.id,
        hour: timeStr,
        dateStr: dateStr,
        timeAgo: `${dateStr} · ${timeStr}`,
        moisture: moisture,
        moistureRaw: raw,
        delta: delta,
        status: status,
        note: raw ? `ESP32 ADC: ${raw} raw` : 'ESP32 Live Telemetry',
        createdAt: row.created_at,
      }
    })
  } catch (err) {
    console.warn('Error fetching soil moisture logs from Supabase:', err)
    return []
  }
}

/**
 * Realtime subscription to sensor_telemetry table
 */
export function subscribeToSoilMoistureUpdates(callback) {
  if (!isSupabaseConfigured || !supabase) return () => {}

  const channel = supabase
    .channel('realtime:sensor_telemetry_live')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'sensor_telemetry' },
      (payload) => {
        if (payload && payload.new) {
          const row = payload.new
          const parsed = {
            id: row.id,
            moisturePercent: Number(row.moisture_percent ?? row.soil_moisture ?? 0),
            moistureRaw: Number(row.moisture_raw ?? 0),
            createdAt: row.created_at || new Date().toISOString(),
          }
          if (callback) callback(parsed)
        }
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

/**
 * Record an irrigation event
 */
export async function recordIrrigationLog({ zoneId, zoneName, durationMin, waterDispensedLiters, mode = 'manual' }) {
  if (!isSupabaseConfigured || !supabase) return null

  try {
    const { data, error } = await supabase.from('irrigation_logs').insert([
      {
        zone_id: zoneId,
        zone_name: zoneName,
        duration_minutes: durationMin,
        water_liters: waterDispensedLiters,
        mode: mode,
        timestamp: new Date().toISOString(),
      },
    ])
    return data
  } catch (err) {
    return null
  }
}
