// Persisted app state (localStorage-backed).
// Swap accessors for API calls when wiring a real backend.

const STORAGE_KEY = 'agriwatt-state'
const DEFAULT = {
  activeZoneId: 'zone-1',
  darkMode: false,
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...DEFAULT, ...parsed }
    }
  } catch (e) {
    console.warn('[AgriWatt] state load failed:', e)
  }
  return DEFAULT
}

export function saveState(s) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  } catch (e) {
    console.warn('[AgriWatt] state save failed:', e)
  }
}
