// Single source of truth for navigation: the header nav bar, the home
// page "jump to a feature" cards, and each full-page feature view all
// read from this list so everything stays in sync.

export const NAV_ITEMS = [
  { id: 'home', icon: 'home', label: 'Dashboard' },
  { id: 'zones', icon: 'zones', label: 'Zones' },
  { id: 'weather', icon: 'weather', label: 'Weather' },
  { id: 'sensors', icon: 'sensors', label: 'Sensors' },
  { id: 'manual', icon: 'manual', label: 'Manual' },
  { id: 'tank', icon: 'tank', label: 'Water Tank' },
  { id: 'schedule', icon: 'schedule', label: 'Schedule' },
  { id: 'solar', icon: 'solar', label: 'Solar' },
  { id: 'consumption', icon: 'consumption', label: 'Usage' },
  { id: 'ai', icon: 'ai', label: 'AI Advisor' },
]

// Extra metadata for every page that isn't the home dashboard — used to
// render the page header (title/subtitle) and the home page shortcut
// cards (accent colour + a one-line "live glance" computed from the
// active zone's sensor snapshot).
export const FEATURE_PAGES = [
  {
    id: 'zones',
    icon: 'zones',
    label: 'Zones',
    title: 'Farm Zones & Sub-Plots',
    subtitle: 'Interactive crop zones, plot layout, and sub-plot telemetry monitor',
    accent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ring: 'ring-emerald-200/60',
    glance: (zone) => `${zone?.crop} · ${zone?.area}`,
  },
  {
    id: 'weather',
    icon: 'weather',
    label: 'Weather',
    title: 'Weather & Irrigation Impact',
    subtitle: 'Live forecast and how it changes today\u2019s watering plan',
    accent: 'bg-amber-50 text-amber-600 border-amber-100',
    ring: 'ring-amber-200/60',
    glance: (zone) => `${zone?.temperature?.toFixed(0)}\u00b0C now`,
  },
  {
    id: 'sensors',
    icon: 'sensors',
    label: 'Sensors',
    title: 'Temperature & Humidity',
    subtitle: 'Real-time in-field readings and hardware power control',
    accent: 'bg-teal-50 text-teal-600 border-teal-100',
    ring: 'ring-teal-200/60',
    glance: (zone) => `${zone?.humidity}% humidity`,
  },
  {
    id: 'manual',
    icon: 'manual',
    label: 'Manual',
    title: 'Manual Control & Overrides',
    subtitle: 'Direct control: Irrigate zones on-demand & refill water tank',
    accent: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    ring: 'ring-emerald-200/60',
    glance: () => 'Pump & Tank Controls',
  },
  {
    id: 'tank',
    icon: 'tank',
    label: 'Water Tank',
    title: 'Water Tank',
    subtitle: 'Reserve level, refill status and 7-day trend',
    accent: 'bg-amber-50 text-amber-600 border-amber-100',
    ring: 'ring-amber-200/60',
    glance: (zone) => `${zone?.tankLevel}% filled`,
  },
  {
    id: 'schedule',
    icon: 'schedule',
    label: 'Schedule',
    title: 'Irrigation Schedule',
    subtitle: 'Upcoming, active and completed watering events',
    accent: 'bg-earth-50 text-earth-600 border-earth-100',
    ring: 'ring-earth-200/60',
    glance: (zone) => zone?.nextIrrigation || '\u2014',
  },
  {
    id: 'solar',
    icon: 'solar',
    label: 'Solar',
    title: 'Solar Power',
    subtitle: 'Panel output, battery charge and pump energy flow',
    accent: 'bg-amber-50 text-amber-600 border-amber-100',
    ring: 'ring-amber-200/60',
    glance: (zone) => `${zone?.solarOutput?.toFixed(1)} kW`,
  },
  {
    id: 'consumption',
    icon: 'consumption',
    label: 'Usage',
    title: 'Water Consumption',
    subtitle: 'Usage vs. AI water savings across daily, weekly, monthly views',
    accent: 'bg-teal-50 text-teal-600 border-teal-100',
    ring: 'ring-teal-200/60',
    glance: () => 'Trends & savings',
  },
  {
    id: 'ai',
    icon: 'ai',
    label: 'AI Advisor',
    title: 'AI Prediction & Recommendations',
    subtitle: 'Smart, explainable suggestions from the Pasumai engine',
    accent: 'bg-earth-900 text-amber-300 border-earth-800',
    ring: 'ring-earth-300/40',
    glance: (zone) => (zone?.health === 'warning' ? 'Action suggested' : 'All clear'),
  },
]

export function getFeaturePage(id) {
  return FEATURE_PAGES.find((p) => p.id === id) || null
}
