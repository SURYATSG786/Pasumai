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
      message: 'Supabase credentials missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    }
  }

  try {
    const { error } = await supabase.from('zones').select('id', { head: true, count: 'exact' })
    if (error && error.code !== 'PGRST116') {
      if (error.message && error.message.includes('relation "zones" does not exist')) {
        return {
          connected: true,
          tableReady: false,
          message: 'Connected to Supabase! (Database tables can be initialized).',
        }
      }
      return { connected: false, message: error.message }
    }
    return { connected: true, tableReady: true, message: 'Connected to Supabase live database!' }
  } catch (err) {
    return { connected: false, message: err.message || 'Connection failed' }
  }
}

/**
 * Fetch Farm Zones from Supabase with graceful fallback
 */
export async function fetchZonesFromSupabase() {
  if (!isSupabaseConfigured || !supabase) return FALLBACK_ZONES

  try {
    const { data, error } = await supabase
      .from('zones')
      .select('*')
      .order('id', { ascending: true })

    if (error || !data || data.length === 0) {
      return FALLBACK_ZONES
    }
    return data
  } catch (err) {
    console.warn('Using fallback zones due to query error:', err)
    return FALLBACK_ZONES
  }
}

/**
 * Fetch latest sensor telemetry for a zone
 */
export async function fetchLatestTelemetry(zoneId) {
  if (!isSupabaseConfigured || !supabase) return null

  try {
    const { data, error } = await supabase
      .from('sensor_telemetry')
      .select('*')
      .eq('zone_id', zoneId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) return null
    return data
  } catch (err) {
    return null
  }
}

/**
 * Log an irrigation event to Supabase
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
    if (error) console.warn('Supabase log error:', error.message)
    return data
  } catch (err) {
    console.warn('Failed to insert log to Supabase:', err)
    return null
  }
}

/**
 * Fetch past irrigation activity logs from Supabase
 */
export async function fetchIrrigationLogs(limit = 20) {
  if (!isSupabaseConfigured || !supabase) return []

  try {
    const { data, error } = await supabase
      .from('irrigation_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error || !data) return []
    return data.map(item => ({
      id: item.id,
      time: new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      text: `${item.mode === 'ai' ? '🤖 AI Scheduled' : '💧 Manual'} irrigation completed for ${item.zone_name || item.zone_id} (${item.duration_minutes} mins · ${item.water_liters} L).`,
      type: 'success',
    }))
  } catch (err) {
    return []
  }
}

/**
 * Subscribe to real-time IoT sensor readings
 */
export function subscribeToSensorUpdates(callback) {
  if (!isSupabaseConfigured || !supabase) return () => {}

  const channel = supabase
    .channel('realtime:sensor_telemetry')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'sensor_telemetry' },
      (payload) => {
        if (callback) callback(payload.new)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
