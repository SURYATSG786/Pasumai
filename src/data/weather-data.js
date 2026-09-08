export const WEATHER_DATA = [
  { hour: '00:00', temp: 26.4, humidity: 78, rain: 0, icon: 'clear-night' },
  { hour: '01:00', temp: 25.8, humidity: 80, rain: 0, icon: 'clear-night' },
  { hour: '02:00', temp: 25.2, humidity: 82, rain: 0, icon: 'cloudy' },
  { hour: '03:00', temp: 24.9, humidity: 83, rain: 0, icon: 'cloudy' },
  { hour: '04:00', temp: 24.7, humidity: 84, rain: 0, icon: 'cloudy' },
  { hour: '05:00', temp: 24.8, humidity: 83, rain: 0.2, icon: 'rain' },
  { hour: '06:00', temp: 25.6, humidity: 80, rain: 0.4, icon: 'rain' },
  { hour: '07:00', temp: 26.9, humidity: 76, rain: 0.3, icon: 'rain' },
  { hour: '08:00', temp: 28.4, humidity: 72, rain: 0.1, icon: 'cloudy-rain' },
  { hour: '09:00', temp: 29.8, humidity: 68, rain: 0, icon: 'cloudy' },
  { hour: '10:00', temp: 31.2, humidity: 64, rain: 0, icon: 'partly-cloudy' },
  { hour: '11:00', temp: 32.5, humidity: 58, rain: 0, icon: 'partly-cloudy' },
  { hour: '12:00', temp: 33.1, humidity: 54, rain: 0, icon: 'sunny' },
  { hour: '13:00', temp: 33.4, humidity: 52, rain: 0, icon: 'sunny' },
  { hour: '14:00', temp: 33.2, humidity: 53, rain: 0, icon: 'sunny' },
  { hour: '15:00', temp: 32.6, humidity: 56, rain: 0, icon: 'cloudy' },
  { hour: '16:00', temp: 31.8, humidity: 60, rain: 0, icon: 'partly-cloudy' },
  { hour: '17:00', temp: 30.9, humidity: 64, rain: 0, icon: 'cloudy' },
  { hour: '18:00', temp: 29.8, humidity: 70, rain: 0.05, icon: 'cloudy' },
  { hour: '19:00', temp: 28.6, humidity: 75, rain: 0, icon: 'cloudy' },
  { hour: '20:00', temp: 27.4, humidity: 80, rain: 0, icon: 'clear-night' },
  { hour: '21:00', temp: 26.8, humidity: 82, rain: 0, icon: 'clear-night' },
  { hour: '22:00', temp: 26.5, humidity: 83, rain: 0, icon: 'clear-night' },
  { hour: '23:00', temp: 26.4, humidity: 83, rain: 0, icon: 'clear-night' },
]

export const FAN_EVENTS = [
  { id: 'evt-1', type: 'rain', label: 'Light rain in 4 hrs — delaying irrigation', severity: 'info', hourOffset: 4, icon: 'rain' },
  { id: 'evt-2', type: 'heat', label: 'High heat warning — soil dries faster at 6 PM', severity: 'warning', hourOffset: 18, icon: 'sun' },
  { id: 'evt-3', type: 'wind', label: 'Wind speed 35 km/h — shield sensitive crops', severity: 'info', hourOffset: 10, icon: 'wind' },
]

// ------------------------------------------------------------------
// SVG weather icons — plain inline SVG strings for use with
// dangerouslySetInnerHTML (lightweight, no icon library needed).
// ------------------------------------------------------------------
export function weatherIcon(name) {
  const map = {
    sunny: `
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>`,

    'partly-cloudy': `
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 6a4 4 0 0 0-4 4H8M12 6a4 4 0 0 0 4 4h4"/>
      </svg>`,

    cloudy: `
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2v2M4 8H2M8 8H6M16 8H14M20 8H18M8 12H4M20 12H16M12 14v-4M12 16a4 4 0 0 1 4 4h2a4 4 0 0 1 4 4M12 16a4 4 0 0 0-4 4h-2a4 4 0 0 0-4 4"/>
      </svg>`,

    'cloudy-rain': `
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 6a4 4 0 0 0-4 4h-2a4 4 0 0 0-4 4M12 14v-4M12 16a4 4 0 0 0-4 4h-2a4 4 0 0 0-4 4M16 14v1"/>
        <line x1="9" y1="18" x2="7" y2="22"/>
        <line x1="13" y1="18" x2="11" y2="22"/>
        <line x1="17" y1="18" x2="15" y2="22"/>
      </svg>`,

    rain: `
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 15a4 4 0 0 0 8 0M12 16a4 4 0 0 0-4 4h-2a4 4 0 0 0-4-4M15 10v1M9 10v1"/>
        <line x1="12" y1="18" x2="12" y2="21"/>
        <line x1="10" y1="19" x2="10" y2="22"/>
        <line x1="14" y1="19" x2="14" y2="22"/>
      </svg>`,

    'clear-night': `
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>`,

    wind: `
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9.59 4.59A2 2 0 1 1 11 6H9M15 12a4 4 0 1 0-8 0"/>
        <path d="M15 18a4 4 0 1 0-8 0"/>
        <path d="M17 5h.5"/>
        <path d="M15.5 2.5H3.21"/>
        <path d="M3 2.5H2"/>
      </svg>`,

    snow: `
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <circle cx="9" cy="9" r="1"/>
        <circle cx="15" cy="9" r="1"/>
        <circle cx="12" cy="15" r="1"/>
        <circle cx="9" cy="15" r="1"/>
      </svg>`,
  }
  return map[name] || map['clear-night']
}

// ------------------------------------------------------------------
// Natural-language weather advisory for the irrigation card.
// ------------------------------------------------------------------
export function weatherDescription(icon, temp, humidity, rain) {
  if (rain > 0.3) return 'Moderate rain — irrigation paused'
  if (rain > 0)   return 'Light rain — irrigation delayed'
  if (temp > 33)   return 'High heat — soil drying fast'
  if (humidity > 80) return 'High humidity — no irrigation needed'
  if (temp < 20)  return 'Cool night — water sparingly'
  return 'Clear conditions — standard schedule'
}
