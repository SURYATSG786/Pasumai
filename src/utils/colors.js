// Color helpers used across components to keep status colors consistent.
// Light / dark variants are picked from the current Tailwind class set.

export const TEMP_COLORS = {
  ok:     { bg: 'bg-earth-100',  ring: 'ring-earth-300',   label: 'Healthy',   value: '#1b4d38' },
  caution:{ bg: 'bg-amber-50',   ring: 'ring-amber-300',   label: 'Caution',   value: '#c47e1e' },
  danger: { bg: 'bg-rose-50',    ring: 'ring-rose-300',    label: 'Alert',     value: '#c5304a' },
}

export const HUM_COLORS = {
  ok:     { bg: 'bg-earth-100',  ring: 'ring-earth-300',   label: 'Comfortable', value: '#1b4d38' },
  caution:{ bg: 'bg-amber-50',   ring: 'ring-amber-300',   label: 'Dry air',   value: '#c47e1e' },
  danger: { bg: 'bg-teal-50',    ring: 'ring-teal-300',    label: 'Humid',    value: '#1a6b62' },
}

export const TANK_COLORS = {
  ok:     { bg: 'bg-earth-100', ring: 'ring-earth-300', body: 'bg-earth-500', label: 'OK' },
  low:    { bg: 'bg-amber-50',  ring: 'ring-amber-300', body: 'bg-amber-500', label: 'Low' },
  danger: { bg: 'bg-rose-50',   ring: 'ring-rose-300',  body: 'bg-rose-500',  label: 'Critical' },
}

export const HEALTH_COLORS = {
  ok:     { dot: 'bg-earth-500',      bg: 'bg-earth-50',    text: 'text-earth-800', badge: 'bg-earth-500' },
  warning:{ dot: 'bg-amber-400',      bg: 'bg-amber-50',    text: 'text-amber-800', badge: 'bg-amber-400' },
  danger: { dot: 'bg-rose-400',       bg: 'bg-rose-50',     text: 'text-rose-800',  badge: 'bg-rose-400' },
}

export function tempStatus(temp) {
  if (temp >= 18 && temp <= 32) return 'ok'
  if (temp >= 12 && temp <= 38) return 'caution'
  return 'danger'
}

export function humStatus(hum) {
  if (hum >= 40 && hum <= 70) return 'ok'
  if (hum >= 30 && hum <= 80) return 'caution'
  return 'danger'
}

export function tankStatus(pct) {
  if (pct >= 40) return 'ok'
  if (pct >= 20) return 'low'
  return 'danger'
}

export function tier(t) {
  return t < 20 ? 1 : t < 40 ? 2 : t < 60 ? 3 : t < 80 ? 4 : 5
}

export function formatTemp(t) {
  return `${t.toFixed(1)}°C`
}

export function formatHum(h) {
  return `${Math.round(h)}%`
}

export function formatTank(p) {
  return `${Math.round(p)}%`
}

export function formatL(l) {
  return `${l.toFixed(1)} L`
}

export function formatKwh(k) {
  return `${k.toFixed(2)} kWh`
}

export function formatWatts(w) {
  return `${w.toFixed(1)} W`
}

export function formatMoney(cents) {
  return `₹${(cents / 100).toFixed(2)}`
}

export function formatLitro(l) {
  return `${l} L`
}

export function formatPeriod(prefix, n) {
  if (n < 60) return `${n} min ago`
  const h = Math.floor(n / 60)
  if (h < 24) return `${h} hr ago`
  return `${Math.floor(h / 24)} day${Math.floor(h / 24) > 1 ? 's' : ''} ago`
}

export const solarGlowColors = [
  'rgba(230, 158, 90, 0.25)',
  'rgba(230, 158, 90, 0.12)',
  'rgba(230, 158, 90, 0.06)',
]
