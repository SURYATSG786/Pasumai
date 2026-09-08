import { useApp, useLiveSensors } from '../context/app-context'
import { ZONES, getScheduleForZone } from '../data/mock-data'
import { getFeaturePage } from '../data/nav-items'
import { NavIcon } from './nav-icons'
import { MetricCard } from './shared-ui'

import { WeatherCard } from './weather-card'
import { TempHumidityCard } from './temp-humidity'
import { ManualControlCard } from './manual-control'
import { WaterTankCard } from './water-tank'
import { ScheduleCard } from './schedule-card'
import { SolarPowerCard } from './solar-power'
import { ConsumptionChart } from './consumption-chart'
import { AIRecommendationCard } from './ai-recommendation'
import { ZoneSelector } from './zone-selector'

const PAGE_COMPONENTS = {
  zones: ZoneSelector,
  weather: WeatherCard,
  sensors: TempHumidityCard,
  manual: ManualControlCard,
  tank: WaterTankCard,
  schedule: ScheduleCard,
  solar: SolarPowerCard,
  consumption: ConsumptionChart,
  ai: AIRecommendationCard,
}

export function FeaturePage({ pageId, onNavigate }) {
  const meta = getFeaturePage(pageId)
  const Comp = PAGE_COMPONENTS[pageId]
  const { state, isIrrigating, isFillingTank, isSensorPowered } = useApp()
  const zone = ZONES.find((z) => z.id === state.activeZoneId)
  const sensors = useLiveSensors(state.activeZoneId)

  if (!meta || !Comp) return null

  return (
    <div key={pageId} className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-5 sm:space-y-6 animate-[fade-up_0.35s_ease-out]">
      {/* Page header */}
      <div className="glass-card !p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs ${meta.accent}`}>
            <NavIcon id={meta.icon} className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-earth-950 tracking-tight leading-tight">{meta.title}</h1>
            <p className="text-xs sm:text-sm text-earth-600 font-bold mt-0.5">{meta.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-black text-earth-900 bg-white/80 px-3.5 py-1.5 rounded-2xl border border-sky-200/60 shadow-xs self-start sm:self-auto">
          <span className="text-base">{zone?.emoji}</span>
          <span>{zone?.name}</span>
        </div>
      </div>

      {/* Contextual quick facts */}
      <QuickFacts
        pageId={pageId}
        zone={zone}
        sensors={sensors}
        onNavigate={onNavigate}
        isIrrigating={isIrrigating(state.activeZoneId)}
        isFillingTank={isFillingTank}
        isSensorPowered={isSensorPowered(state.activeZoneId)}
      />

      {/* Main feature card, full width */}
      <Comp />
    </div>
  )
}

function QuickFacts({ pageId, zone, sensors, onNavigate, isIrrigating, isFillingTank, isSensorPowered }) {
  if (!zone) return null

  const cards = (() => {
    switch (pageId) {
      case 'zones':
        return [
          { label: 'Crop Planted', value: zone.crop, sublabel: `Area: ${zone.area}`, accent: 'bg-emerald-50' },
          { label: 'Soil Health', value: zone.health === 'warning' ? 'Needs Attention' : 'Optimal', sublabel: zone.soilType, accent: zone.health === 'warning' ? 'bg-amber-50' : 'bg-emerald-50' },
          { label: 'Water Requirement', value: zone.irrigationAmt, sublabel: 'Standard daily baseline', accent: 'bg-sky-50' },
        ]
      case 'weather':
        return [
          { label: 'Humidity', value: Math.round(sensors.humidity), unit: '%', sublabel: 'Current reading', accent: 'bg-sky-50' },
          { label: 'Soil moisture', value: Math.round(sensors.soilMoisture), unit: '%', sublabel: 'Affects irrigation timing', accent: 'bg-earth-50' },
          { label: 'Next irrigation', value: zone.nextIrrigation, sublabel: 'Auto-adjusted for weather', accent: 'bg-amber-50', onClick: () => onNavigate('schedule') },
        ]
      case 'sensors':
        return [
          { label: 'Sensor Power', value: isSensorPowered ? 'Active' : 'Standby', sublabel: isSensorPowered ? 'Live telemetry' : 'Hardware sleep', accent: isSensorPowered ? 'bg-teal-50' : 'bg-amber-50' },
          { label: 'Soil moisture', value: Math.round(sensors.soilMoisture), unit: '%', sublabel: zone.soilType, accent: 'bg-earth-50' },
          { label: 'Tank level', value: Math.round(sensors.tankLevel), unit: '%', sublabel: 'Water reserve', accent: 'bg-amber-50', onClick: () => onNavigate('tank') },
        ]
      case 'manual':
        return [
          { label: 'Irrigation Pump', value: isIrrigating ? 'Running' : 'Idle', sublabel: isIrrigating ? '18.5 L/min flow' : 'Ready to start', accent: isIrrigating ? 'bg-emerald-50' : 'bg-earth-50' },
          { label: 'Tank Refill', value: isFillingTank ? 'Refilling' : 'Idle', sublabel: isFillingTank ? '35 L/min inflow' : `${Math.round(sensors.tankLevel)}% capacity`, accent: isFillingTank ? 'bg-sky-50' : 'bg-amber-50', onClick: () => onNavigate('tank') },
          { label: 'Selected Zone', value: zone.name, sublabel: zone.crop, accent: 'bg-teal-50' },
        ]
      case 'tank':
        return [
          { label: 'Irrigation amount', value: zone.irrigationAmt, sublabel: 'Planned daily use', accent: 'bg-earth-50' },
          { label: 'Last irrigation', value: zone.lastIrrigation, sublabel: 'Most recent watering', accent: 'bg-amber-50' },
          { label: 'Next irrigation', value: zone.nextIrrigation, sublabel: 'Scheduled', accent: 'bg-teal-50', onClick: () => onNavigate('schedule') },
        ]
      case 'schedule':
        return [
          { label: 'Events for this zone', value: getScheduleForZone(zone.id).length, sublabel: 'Total scheduled + completed', accent: 'bg-earth-50' },
          { label: 'Pump status', value: zone.pumpStatus === 'active' || isIrrigating ? 'Active' : 'Idle', sublabel: 'Current state', accent: 'bg-teal-50' },
          { label: 'Priority', value: zone.priority, sublabel: 'AI-assessed urgency', accent: 'bg-amber-50' },
        ]
      case 'solar':
        return [
          { label: 'Battery charge', value: Math.round(sensors.batteryPct), unit: '%', sublabel: sensors.batteryPct > 60 ? 'Charged' : sensors.batteryPct > 30 ? 'Draining' : 'Low', accent: 'bg-amber-50' },
          { label: 'Peak output', value: zone.solarOutput?.toFixed(1), unit: 'kW', sublabel: 'Rated for this zone', accent: 'bg-teal-50' },
          { label: 'Pump status', value: zone.pumpStatus === 'active' || isIrrigating ? 'Running' : 'Idle', sublabel: 'Draws from battery', accent: 'bg-earth-50' },
        ]
      case 'consumption':
        return [
          { label: 'Zone area', value: zone.area, sublabel: zone.crop, accent: 'bg-earth-50' },
          { label: 'Daily target', value: zone.irrigationAmt, sublabel: 'Baseline plan', accent: 'bg-amber-50' },
          { label: 'Soil type', value: zone.soilType, sublabel: 'Affects retention', accent: 'bg-teal-50' },
        ]
      case 'ai':
        return [
          { label: 'Zone health', value: zone.health === 'warning' ? 'Needs attention' : 'All good', sublabel: 'Overall status', accent: zone.health === 'warning' ? 'bg-amber-50' : 'bg-earth-50' },
          { label: 'Days to harvest', value: zone.daysToHarvest, sublabel: zone.crop, accent: 'bg-teal-50' },
          { label: 'Priority', value: zone.priority, sublabel: 'AI-assessed urgency', accent: 'bg-amber-50' },
        ]
      default:
        return []
    }
  })()

  if (!cards.length) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {cards.map((c, i) => (
        <MetricCard
          key={i}
          label={c.label}
          value={c.value}
          unit={c.unit}
          sublabel={c.sublabel}
          accent={c.accent}
          onClick={c.onClick}
        />
      ))}
    </div>
  )
}
