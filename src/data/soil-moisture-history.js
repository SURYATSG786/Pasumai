// Hourly Soil Moisture History data & generator
// Generates realistic 24-hour hourly records for each zone

export const INITIAL_SOIL_LOGS = {
  'zone-1': [
    { id: 'z1-24', hour: '10:00 AM', timeAgo: 'Just now', moisture: 62.4, delta: -0.6, temp: 29.4, hum: 68, status: 'optimal', note: 'Standard transpiration curve' },
    { id: 'z1-23', hour: '09:00 AM', timeAgo: '1 hr ago', moisture: 63.0, delta: -0.8, temp: 28.6, hum: 70, status: 'optimal', note: 'Morning solar heating begins' },
    { id: 'z1-22', hour: '08:00 AM', timeAgo: '2 hrs ago', moisture: 63.8, delta: -0.4, temp: 27.2, hum: 74, status: 'optimal', note: 'Stable root zone moisture' },
    { id: 'z1-21', hour: '07:00 AM', timeAgo: '3 hrs ago', moisture: 64.2, delta: +12.2, temp: 25.8, hum: 78, status: 'irrigated', note: 'Automated solar drip cycle (45L)' },
    { id: 'z1-20', hour: '06:00 AM', timeAgo: '4 hrs ago', moisture: 52.0, delta: -0.2, temp: 24.5, hum: 82, status: 'adequate', note: 'Pre-irrigation baseline reading' },
    { id: 'z1-19', hour: '05:00 AM', timeAgo: '5 hrs ago', moisture: 52.2, delta: -0.1, temp: 24.1, hum: 84, status: 'adequate', note: 'Overnight condensation retention' },
    { id: 'z1-18', hour: '04:00 AM', timeAgo: '6 hrs ago', moisture: 52.3, delta: -0.1, temp: 23.9, hum: 85, status: 'adequate', note: 'Minimal nocturnal evaporation' },
    { id: 'z1-17', hour: '03:00 AM', timeAgo: '7 hrs ago', moisture: 52.4, delta: -0.1, temp: 24.0, hum: 85, status: 'adequate', note: 'Stable soil matrix' },
    { id: 'z1-16', hour: '02:00 AM', timeAgo: '8 hrs ago', moisture: 52.5, delta: -0.2, temp: 24.2, hum: 84, status: 'adequate', note: 'Night equilibrium' },
    { id: 'z1-15', hour: '01:00 AM', timeAgo: '9 hrs ago', moisture: 52.7, delta: -0.3, temp: 24.8, hum: 82, status: 'adequate', note: 'Cool night retention' },
    { id: 'z1-14', hour: '12:00 AM', timeAgo: '10 hrs ago', moisture: 53.0, delta: -0.4, temp: 25.4, hum: 80, status: 'adequate', note: 'Midnight baseline' },
    { id: 'z1-13', hour: '11:00 PM', timeAgo: '11 hrs ago', moisture: 53.4, delta: -0.5, temp: 26.2, hum: 77, status: 'adequate', note: 'Post-sunset cooling' },
    { id: 'z1-12', hour: '10:00 PM', timeAgo: '12 hrs ago', moisture: 53.9, delta: -0.6, temp: 27.0, hum: 74, status: 'adequate', note: 'Evening settling' },
    { id: 'z1-11', hour: '09:00 PM', timeAgo: '13 hrs ago', moisture: 54.5, delta: -0.8, temp: 28.1, hum: 71, status: 'adequate', note: 'Dusk moisture retention' },
    { id: 'z1-10', hour: '08:00 PM', timeAgo: '14 hrs ago', moisture: 55.3, delta: -1.0, temp: 29.0, hum: 68, status: 'adequate', note: 'Post-irrigation stabilization' },
    { id: 'z1-09', hour: '07:00 PM', timeAgo: '15 hrs ago', moisture: 56.3, delta: -1.2, temp: 30.2, hum: 65, status: 'adequate', note: 'Sun down temperature drop' },
    { id: 'z1-08', hour: '06:00 PM', timeAgo: '16 hrs ago', moisture: 57.5, delta: -1.4, temp: 31.5, hum: 61, status: 'adequate', note: 'Late afternoon decline' },
    { id: 'z1-07', hour: '05:00 PM', timeAgo: '17 hrs ago', moisture: 58.9, delta: -1.6, temp: 32.8, hum: 58, status: 'adequate', note: 'Peak heat evaporation' },
    { id: 'z1-06', hour: '04:00 PM', timeAgo: '18 hrs ago', moisture: 60.5, delta: -1.8, temp: 33.5, hum: 55, status: 'optimal', note: 'Afternoon sun absorption' },
    { id: 'z1-05', hour: '03:00 PM', timeAgo: '19 hrs ago', moisture: 62.3, delta: -1.7, temp: 33.8, hum: 54, status: 'optimal', note: 'High canopy transpiration' },
    { id: 'z1-04', hour: '02:00 PM', timeAgo: '20 hrs ago', moisture: 64.0, delta: -1.5, temp: 33.2, hum: 56, status: 'optimal', note: 'Midday heat load' },
    { id: 'z1-03', hour: '01:00 PM', timeAgo: '21 hrs ago', moisture: 65.5, delta: -1.2, temp: 32.0, hum: 60, status: 'optimal', note: 'Early afternoon retention' },
    { id: 'z1-02', hour: '12:00 PM', timeAgo: '22 hrs ago', moisture: 66.7, delta: -0.9, temp: 30.8, hum: 63, status: 'optimal', note: 'Noon sunlight peak' },
    { id: 'z1-01', hour: '11:00 AM', timeAgo: '23 hrs ago', moisture: 67.6, delta: -0.5, temp: 29.5, hum: 66, status: 'optimal', note: 'Morning equilibrium' },
  ],
  'zone-2': [
    { id: 'z2-24', hour: '10:00 AM', timeAgo: 'Just now', moisture: 48.2, delta: -0.9, temp: 31.2, hum: 54, status: 'adequate', note: 'Clay loam steady retention' },
    { id: 'z2-23', hour: '09:00 AM', timeAgo: '1 hr ago', moisture: 49.1, delta: -1.1, temp: 30.4, hum: 56, status: 'adequate', note: 'Solar heating increase' },
    { id: 'z2-22', hour: '08:00 AM', timeAgo: '2 hrs ago', moisture: 50.2, delta: -0.6, temp: 28.8, hum: 62, status: 'adequate', note: 'Morning canopy uptake' },
    { id: 'z2-21', hour: '07:00 AM', timeAgo: '3 hrs ago', moisture: 50.8, delta: +14.8, temp: 27.0, hum: 68, status: 'irrigated', note: 'Mango micro-sprinkler cycle (62L)' },
    { id: 'z2-20', hour: '06:00 AM', timeAgo: '4 hrs ago', moisture: 36.0, delta: -0.3, temp: 25.2, hum: 74, status: 'caution', note: 'Low threshold trigger reached' },
    { id: 'z2-19', hour: '05:00 AM', timeAgo: '5 hrs ago', moisture: 36.3, delta: -0.2, temp: 24.8, hum: 76, status: 'caution', note: 'Nocturnal baseline' },
    { id: 'z2-18', hour: '04:00 AM', timeAgo: '6 hrs ago', moisture: 36.5, delta: -0.1, temp: 24.5, hum: 78, status: 'caution', note: 'Minimal nocturnal drift' },
    { id: 'z2-17', hour: '03:00 AM', timeAgo: '7 hrs ago', moisture: 36.6, delta: -0.2, temp: 24.9, hum: 77, status: 'caution', note: 'Dry air retention' },
    { id: 'z2-16', hour: '02:00 AM', timeAgo: '8 hrs ago', moisture: 36.8, delta: -0.3, temp: 25.5, hum: 75, status: 'caution', note: 'Night soil settling' },
    { id: 'z2-15', hour: '01:00 AM', timeAgo: '9 hrs ago', moisture: 37.1, delta: -0.4, temp: 26.2, hum: 72, status: 'caution', note: 'Pre-dawn cooling' },
    { id: 'z2-14', hour: '12:00 AM', timeAgo: '10 hrs ago', moisture: 37.5, delta: -0.5, temp: 27.0, hum: 70, status: 'caution', note: 'Midnight check' },
    { id: 'z2-13', hour: '11:00 PM', timeAgo: '11 hrs ago', moisture: 38.0, delta: -0.7, temp: 27.8, hum: 67, status: 'caution', note: 'Post-dusk cooling' },
    { id: 'z2-12', hour: '10:00 PM', timeAgo: '12 hrs ago', moisture: 38.7, delta: -0.8, temp: 28.9, hum: 64, status: 'caution', note: 'Evening evaporation' },
    { id: 'z2-11', hour: '09:00 PM', timeAgo: '13 hrs ago', moisture: 39.5, delta: -1.0, temp: 30.1, hum: 60, status: 'caution', note: 'Dusk transition' },
    { id: 'z2-10', hour: '08:00 PM', timeAgo: '14 hrs ago', moisture: 40.5, delta: -1.2, temp: 31.4, hum: 57, status: 'adequate', note: 'Twilight reading' },
    { id: 'z2-09', hour: '07:00 PM', timeAgo: '15 hrs ago', moisture: 41.7, delta: -1.4, temp: 32.6, hum: 54, status: 'adequate', note: 'Late afternoon uptake' },
    { id: 'z2-08', hour: '06:00 PM', timeAgo: '16 hrs ago', moisture: 43.1, delta: -1.6, temp: 33.8, hum: 51, status: 'adequate', note: 'Afternoon sun impact' },
    { id: 'z2-07', hour: '05:00 PM', timeAgo: '17 hrs ago', moisture: 44.7, delta: -1.8, temp: 34.5, hum: 48, status: 'adequate', note: 'Peak orchard temperature' },
    { id: 'z2-06', hour: '04:00 PM', timeAgo: '18 hrs ago', moisture: 46.5, delta: -1.9, temp: 34.9, hum: 46, status: 'adequate', note: 'High canopy transpiration' },
    { id: 'z2-05', hour: '03:00 PM', timeAgo: '19 hrs ago', moisture: 48.4, delta: -1.8, temp: 34.2, hum: 49, status: 'adequate', note: 'Midday peak evaporation' },
    { id: 'z2-04', hour: '02:00 PM', timeAgo: '20 hrs ago', moisture: 50.2, delta: -1.6, temp: 33.1, hum: 52, status: 'optimal', note: 'Early afternoon rate' },
    { id: 'z2-03', hour: '01:00 PM', timeAgo: '21 hrs ago', moisture: 51.8, delta: -1.3, temp: 31.8, hum: 55, status: 'optimal', note: 'Noon moisture status' },
    { id: 'z2-02', hour: '12:00 PM', timeAgo: '22 hrs ago', moisture: 53.1, delta: -1.0, temp: 30.5, hum: 58, status: 'optimal', note: 'Midday baseline' },
    { id: 'z2-01', hour: '11:00 AM', timeAgo: '23 hrs ago', moisture: 54.1, delta: -0.7, temp: 29.2, hum: 61, status: 'optimal', note: 'Morning balance' },
  ],
  'zone-3': [
    { id: 'z3-24', hour: '10:00 AM', timeAgo: 'Just now', moisture: 41.0, delta: -1.4, temp: 32.6, hum: 52, status: 'caution', note: 'Shallow root vegetables drying fast' },
    { id: 'z3-23', hour: '09:00 AM', timeAgo: '1 hr ago', moisture: 42.4, delta: -1.6, temp: 31.5, hum: 54, status: 'adequate', note: 'High ambient solar heat' },
    { id: 'z3-22', hour: '08:00 AM', timeAgo: '2 hrs ago', moisture: 44.0, delta: -1.2, temp: 29.8, hum: 58, status: 'adequate', note: 'Early vegetable bed transpiration' },
    { id: 'z3-21', hour: '07:00 AM', timeAgo: '3 hrs ago', moisture: 45.2, delta: -0.6, temp: 27.5, hum: 66, status: 'adequate', note: 'Morning sun exposure' },
    { id: 'z3-20', hour: '06:00 AM', timeAgo: '4 hrs ago', moisture: 45.8, delta: -0.2, temp: 25.0, hum: 76, status: 'adequate', note: 'Dew retention baseline' },
    { id: 'z3-19', hour: '05:00 AM', timeAgo: '5 hrs ago', moisture: 46.0, delta: -0.1, temp: 24.2, hum: 80, status: 'adequate', note: 'Nocturnal equilibrium' },
    { id: 'z3-18', hour: '04:00 AM', timeAgo: '6 hrs ago', moisture: 46.1, delta: -0.2, temp: 24.0, hum: 82, status: 'adequate', note: 'Pre-dawn stability' },
    { id: 'z3-17', hour: '03:00 AM', timeAgo: '7 hrs ago', moisture: 46.3, delta: -0.2, temp: 24.4, hum: 81, status: 'adequate', note: 'Night matrix retention' },
    { id: 'z3-16', hour: '02:00 AM', timeAgo: '8 hrs ago', moisture: 46.5, delta: -0.3, temp: 25.1, hum: 79, status: 'adequate', note: 'Night soil cooling' },
    { id: 'z3-15', hour: '01:00 AM', timeAgo: '9 hrs ago', moisture: 46.8, delta: -0.4, temp: 26.0, hum: 76, status: 'adequate', note: 'Midnight check' },
    { id: 'z3-14', hour: '12:00 AM', timeAgo: '10 hrs ago', moisture: 47.2, delta: -0.6, temp: 27.2, hum: 72, status: 'adequate', note: 'Late evening retention' },
    { id: 'z3-13', hour: '11:00 PM', timeAgo: '11 hrs ago', moisture: 47.8, delta: -0.8, temp: 28.5, hum: 68, status: 'adequate', note: 'Post-sunset decline' },
    { id: 'z3-12', hour: '10:00 PM', timeAgo: '12 hrs ago', moisture: 48.6, delta: -1.0, temp: 29.8, hum: 64, status: 'adequate', note: 'Evening settling' },
    { id: 'z3-11', hour: '09:00 PM', timeAgo: '13 hrs ago', moisture: 49.6, delta: -1.2, temp: 31.0, hum: 60, status: 'adequate', note: 'Dusk moisture drop' },
    { id: 'z3-10', hour: '08:00 PM', timeAgo: '14 hrs ago', moisture: 50.8, delta: -1.5, temp: 32.4, hum: 56, status: 'adequate', note: 'Twilight transpiration' },
    { id: 'z3-09', hour: '07:00 PM', timeAgo: '15 hrs ago', moisture: 52.3, delta: -1.8, temp: 33.8, hum: 52, status: 'adequate', note: 'Late afternoon heat load' },
    { id: 'z3-08', hour: '06:00 PM', timeAgo: '16 hrs ago', moisture: 54.1, delta: +18.5, temp: 34.5, hum: 48, status: 'irrigated', note: 'Evening AI micro-drip cycle (28L)' },
    { id: 'z3-07', hour: '05:00 PM', timeAgo: '17 hrs ago', moisture: 35.6, delta: -2.1, temp: 35.8, hum: 44, status: 'caution', note: 'Critical low threshold alerted' },
    { id: 'z3-06', hour: '04:00 PM', timeAgo: '18 hrs ago', moisture: 37.7, delta: -2.2, temp: 36.2, hum: 42, status: 'caution', note: 'Extreme afternoon heat loss' },
    { id: 'z3-05', hour: '03:00 PM', timeAgo: '19 hrs ago', moisture: 39.9, delta: -2.0, temp: 35.5, hum: 45, status: 'caution', note: 'Midday transpiration peak' },
    { id: 'z3-04', hour: '02:00 PM', timeAgo: '20 hrs ago', moisture: 41.9, delta: -1.8, temp: 34.0, hum: 49, status: 'adequate', note: 'Early afternoon decline' },
    { id: 'z3-03', hour: '01:00 PM', timeAgo: '21 hrs ago', moisture: 43.7, delta: -1.5, temp: 32.5, hum: 53, status: 'adequate', note: 'Noon reading' },
    { id: 'z3-02', hour: '12:00 PM', timeAgo: '22 hrs ago', moisture: 45.2, delta: -1.1, temp: 31.0, hum: 57, status: 'adequate', note: 'Midday baseline' },
    { id: 'z3-01', hour: '11:00 AM', timeAgo: '23 hrs ago', moisture: 46.3, delta: -0.8, temp: 29.5, hum: 62, status: 'adequate', note: 'Morning balance' },
  ],
  'zone-4': [
    { id: 'z4-24', hour: '10:00 AM', timeAgo: 'Just now', moisture: 72.0, delta: -0.4, temp: 28.8, hum: 72, status: 'optimal', note: 'High retention in red soil' },
    { id: 'z4-23', hour: '09:00 AM', timeAgo: '1 hr ago', moisture: 72.4, delta: -0.5, temp: 28.0, hum: 74, status: 'optimal', note: 'Gentle morning transpiration' },
    { id: 'z4-22', hour: '08:00 AM', timeAgo: '2 hrs ago', moisture: 72.9, delta: -0.3, temp: 26.8, hum: 77, status: 'optimal', note: 'Deep soil moisture reservoir' },
    { id: 'z4-21', hour: '07:00 AM', timeAgo: '3 hrs ago', moisture: 73.2, delta: -0.2, temp: 25.5, hum: 80, status: 'optimal', note: 'Morning dew absorption' },
    { id: 'z4-20', hour: '06:00 AM', timeAgo: '4 hrs ago', moisture: 73.4, delta: -0.1, temp: 24.2, hum: 84, status: 'optimal', note: 'Nocturnal moisture retention' },
    { id: 'z4-19', hour: '05:00 AM', timeAgo: '5 hrs ago', moisture: 73.5, delta: 0.0, temp: 23.8, hum: 86, status: 'optimal', note: 'Cool baseline' },
    { id: 'z4-18', hour: '04:00 AM', timeAgo: '6 hrs ago', moisture: 73.5, delta: -0.1, temp: 23.5, hum: 87, status: 'optimal', note: 'Stable matrix' },
    { id: 'z4-17', hour: '03:00 AM', timeAgo: '7 hrs ago', moisture: 73.6, delta: -0.1, temp: 23.9, hum: 85, status: 'optimal', note: 'Night equilibrium' },
    { id: 'z4-16', hour: '02:00 AM', timeAgo: '8 hrs ago', moisture: 73.7, delta: -0.2, temp: 24.5, hum: 83, status: 'optimal', note: 'Late night retention' },
    { id: 'z4-15', hour: '01:00 AM', timeAgo: '9 hrs ago', moisture: 73.9, delta: -0.3, temp: 25.2, hum: 81, status: 'optimal', note: 'Midnight check' },
    { id: 'z4-14', hour: '12:00 AM', timeAgo: '10 hrs ago', moisture: 74.2, delta: -0.4, temp: 26.0, hum: 78, status: 'optimal', note: 'Post-dusk cooling' },
    { id: 'z4-13', hour: '11:00 PM', timeAgo: '11 hrs ago', moisture: 74.6, delta: -0.5, temp: 27.1, hum: 75, status: 'optimal', note: 'Evening decline' },
    { id: 'z4-12', hour: '10:00 PM', timeAgo: '12 hrs ago', moisture: 75.1, delta: -0.6, temp: 28.0, hum: 72, status: 'optimal', note: 'Dusk stabilization' },
    { id: 'z4-11', hour: '09:00 PM', timeAgo: '13 hrs ago', moisture: 75.7, delta: -0.8, temp: 29.2, hum: 69, status: 'optimal', note: 'Twilight settling' },
    { id: 'z4-10', hour: '08:00 PM', timeAgo: '14 hrs ago', moisture: 76.5, delta: -0.9, temp: 30.5, hum: 65, status: 'optimal', note: 'Late afternoon rate' },
    { id: 'z4-09', hour: '07:00 PM', timeAgo: '15 hrs ago', moisture: 77.4, delta: -1.1, temp: 31.8, hum: 62, status: 'optimal', note: 'Afternoon sun reduction' },
    { id: 'z4-08', hour: '06:00 PM', timeAgo: '16 hrs ago', moisture: 78.5, delta: -1.3, temp: 32.9, hum: 58, status: 'optimal', note: 'Turmeric crop absorption' },
    { id: 'z4-07', hour: '05:00 PM', timeAgo: '17 hrs ago', moisture: 79.8, delta: -1.4, temp: 33.6, hum: 55, status: 'optimal', note: 'Peak heat loss' },
    { id: 'z4-06', hour: '04:00 PM', timeAgo: '18 hrs ago', moisture: 81.2, delta: -1.5, temp: 34.0, hum: 53, status: 'optimal', note: 'Afternoon transpiration' },
    { id: 'z4-05', hour: '03:00 PM', timeAgo: '19 hrs ago', moisture: 82.7, delta: -1.4, temp: 33.5, hum: 56, status: 'optimal', note: 'Midday sunlight' },
    { id: 'z4-04', hour: '02:00 PM', timeAgo: '20 hrs ago', moisture: 84.1, delta: -1.2, temp: 32.2, hum: 60, status: 'optimal', note: 'Post-irrigation absorption' },
    { id: 'z4-03', hour: '01:00 PM', timeAgo: '21 hrs ago', moisture: 85.3, delta: -0.9, temp: 31.0, hum: 64, status: 'optimal', note: 'High capacity absorption' },
    { id: 'z4-02', hour: '12:00 PM', timeAgo: '22 hrs ago', moisture: 86.2, delta: -0.6, temp: 29.8, hum: 68, status: 'optimal', note: 'Noon baseline' },
    { id: 'z4-01', hour: '11:00 AM', timeAgo: '23 hrs ago', moisture: 86.8, delta: -0.4, temp: 28.5, hum: 71, status: 'optimal', note: 'Optimal bed retention' },
  ],
}

export function computeSoilStats(logs) {
  if (!logs || !logs.length) {
    return { avg: 0, min: 0, max: 0, optimalPct: 0, count: 0, latestDelta: 0 }
  }

  const values = logs.map(l => l.moisture)
  const sum = values.reduce((a, b) => a + b, 0)
  const avg = +(sum / values.length).toFixed(1)
  const min = +Math.min(...values).toFixed(1)
  const max = +Math.max(...values).toFixed(1)
  const inRangeCount = values.filter(v => v >= 40 && v <= 75).length
  const optimalPct = Math.round((inRangeCount / values.length) * 100)
  const latestDelta = logs[0]?.delta || 0

  return { avg, min, max, optimalPct, count: logs.length, latestDelta }
}
