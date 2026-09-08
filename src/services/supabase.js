import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

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
    const { data, error } = await supabase.from('zones').select('count', { count: 'exact', head: true })
    if (error && error.code !== 'PGRST116') {
      // If table doesn't exist yet, connection itself succeeded
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
