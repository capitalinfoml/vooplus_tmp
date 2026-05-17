import type {
  JobProfile,
  PriceResult,
  BreakdownItem,
  RealEstateDetails,
  EventsDetails,
  InspectionDetails,
  MappingDetails,
  ConstructionDetails,
  FilmDetails,
} from '@/types'
import {
  PRICING_BENCHMARKS,
  getCountryMultiplier,
  EXPERIENCE_MULTIPLIERS,
} from './service-types'
import { getCurrencyForCountry, getExchangeRate } from './currency-rates'

// All internal values in USD cents (integers)

function dollars(usd: number): number {
  return Math.round(usd * 100)
}

function calcRealEstate(details: RealEstateDetails): {
  baseCents: number
  breakdown: BreakdownItem[]
  unitLabel: string
} {
  const { hourly } = PRICING_BENCHMARKS.real_estate
  const breakdown: BreakdownItem[] = []

  // Duration based on property size
  let hours: number
  if (details.propertySizeSqft < 1000) hours = 1.0
  else if (details.propertySizeSqft < 2000) hours = 1.5
  else if (details.propertySizeSqft < 4000) hours = 2.5
  else if (details.propertySizeSqft < 8000) hours = 3.5
  else hours = 4.5

  const baseCents = dollars(hourly.mid * hours)
  breakdown.push({
    label: `Base rate (${hours}hr shoot)`,
    usdCents: baseCents,
    note: `$${hourly.mid}/hr × ${hours} hrs`,
  })

  let total = baseCents

  // Deliverable additions
  const hasVideo = details.deliverables.includes('video_walkthrough')
  const hasAerial = details.deliverables.includes('aerial_video')
  if (hasVideo && hasAerial) {
    const add = dollars(300)
    breakdown.push({ label: 'Video walkthrough + aerial video', usdCents: add })
    total += add
  } else if (hasVideo) {
    const add = dollars(150)
    breakdown.push({ label: 'Video walkthrough', usdCents: add })
    total += add
  } else if (hasAerial) {
    const add = dollars(200)
    breakdown.push({ label: 'Aerial video', usdCents: add })
    total += add
  }

  if (details.editingIncluded) {
    const add = Math.round(total * 0.25)
    breakdown.push({ label: 'Editing & post-production', usdCents: add, note: '+25%' })
    total += add
  }

  if (details.rushDelivery) {
    const add = Math.round(total * 0.3)
    breakdown.push({ label: 'Rush delivery', usdCents: add, note: '+30%' })
    total += add
  }

  return { baseCents: total, breakdown, unitLabel: 'per job' }
}

function calcEvents(details: EventsDetails): {
  baseCents: number
  breakdown: BreakdownItem[]
  unitLabel: string
} {
  const { hourly } = PRICING_BENCHMARKS.events
  const breakdown: BreakdownItem[] = []

  const baseCents = dollars(hourly.mid * details.eventDurationHours)
  breakdown.push({
    label: `Event coverage (${details.eventDurationHours}hr)`,
    usdCents: baseCents,
    note: `$${hourly.mid}/hr × ${details.eventDurationHours} hrs`,
  })

  let total = baseCents

  if (details.editedVideoMinutes > 0) {
    const add = dollars(details.editedVideoMinutes * 15)
    breakdown.push({
      label: `Edited highlight reel (${details.editedVideoMinutes}min)`,
      usdCents: add,
      note: '$15/min editing',
    })
    total += add
  }

  if (details.travelDistanceKm > 50) {
    const billableKm = details.travelDistanceKm - 50
    const add = dollars(billableKm * 1.2)
    breakdown.push({
      label: `Travel surcharge (${billableKm}km beyond 50km)`,
      usdCents: add,
      note: '$1.20/km',
    })
    total += add
  }

  return { baseCents: total, breakdown, unitLabel: 'per event' }
}

function calcInspection(details: InspectionDetails): {
  baseCents: number
  breakdown: BreakdownItem[]
  unitLabel: string
} {
  const { hourly } = PRICING_BENCHMARKS.inspection
  const breakdown: BreakdownItem[] = []

  const baseHours = 3
  const baseCents = dollars(hourly.mid * baseHours)
  breakdown.push({
    label: `Inspection (${baseHours}hr baseline)`,
    usdCents: baseCents,
    note: `$${hourly.mid}/hr`,
  })

  let total = baseCents

  if (details.assetCount > 1) {
    const add = Math.round(baseCents * (details.assetCount - 1) * 0.25)
    breakdown.push({
      label: `Additional assets (×${details.assetCount})`,
      usdCents: add,
      note: '+25% per extra asset',
    })
    total += add
  }

  if (details.thermalRequired) {
    const add = Math.round(total * 0.5)
    breakdown.push({ label: 'Thermal imaging equipment', usdCents: add, note: '+50%' })
    total += add
  }

  if (details.reportIncluded) {
    const add = dollars(300)
    breakdown.push({ label: 'Detailed inspection report', usdCents: add })
    total += add
  }

  return { baseCents: total, breakdown, unitLabel: 'per inspection' }
}

function calcMapping(details: MappingDetails): {
  baseCents: number
  breakdown: BreakdownItem[]
  unitLabel: string
} {
  const { per_hectare } = PRICING_BENCHMARKS.mapping
  const breakdown: BreakdownItem[] = []

  const baseCents = dollars(per_hectare.mid * details.areaHectares)
  breakdown.push({
    label: `Survey area (${details.areaHectares} ha)`,
    usdCents: baseCents,
    note: `$${per_hectare.mid}/hectare`,
  })

  let total = baseCents

  if (details.gcpRequired) {
    const add = dollars(500)
    breakdown.push({ label: 'Ground control points (GCPs)', usdCents: add })
    total += add
  }

  const has3D = details.deliverables.includes('3d_model')
  const hasPointCloud = details.deliverables.includes('point_cloud')
  const hasDTM = details.deliverables.includes('dtm')

  if (has3D) {
    const add = Math.round(total * 0.5)
    breakdown.push({ label: '3D model processing', usdCents: add, note: '+50%' })
    total += add
  } else if (hasPointCloud) {
    const add = Math.round(total * 0.3)
    breakdown.push({ label: 'Point cloud generation', usdCents: add, note: '+30%' })
    total += add
  }

  if (hasDTM) {
    const add = Math.round(total * 0.15)
    breakdown.push({ label: 'DTM/terrain model', usdCents: add, note: '+15%' })
    total += add
  }

  return { baseCents: total, breakdown, unitLabel: 'per project' }
}

function calcConstruction(details: ConstructionDetails): {
  baseCents: number
  breakdown: BreakdownItem[]
  unitLabel: string
} {
  const { monthly_retainer } = PRICING_BENCHMARKS.construction
  const breakdown: BreakdownItem[] = []

  const siteMult = { small: 0.7, medium: 1.0, large: 1.6 }[details.siteSize]
  const baseMonthly = dollars(monthly_retainer.mid * siteMult)
  breakdown.push({
    label: `Monthly site documentation (${details.siteSize} site)`,
    usdCents: baseMonthly,
    note: `$${monthly_retainer.mid}/mo × ${siteMult}× site multiplier`,
  })

  let monthly = baseMonthly

  if (details.frequency === 'weekly') {
    const add = Math.round(monthly * 1.5)
    breakdown.push({ label: 'Weekly frequency (vs monthly)', usdCents: add, note: '+150%' })
    monthly += add
  } else if (details.frequency === 'biweekly') {
    const add = Math.round(monthly * 0.6)
    breakdown.push({ label: 'Bi-weekly frequency (vs monthly)', usdCents: add, note: '+60%' })
    monthly += add
  }

  let contractDiscount = 0
  if (details.contractMonths >= 6) {
    contractDiscount = Math.round(monthly * 0.1)
    breakdown.push({
      label: `Long-term contract discount (${details.contractMonths}mo)`,
      usdCents: -contractDiscount,
      note: '−10% for 6+ months',
    })
  }

  const finalMonthly = monthly - contractDiscount
  const total = finalMonthly * details.contractMonths

  breakdown.push({
    label: `Contract total (${details.contractMonths} months)`,
    usdCents: total - finalMonthly,
    note: `${details.contractMonths} × ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(finalMonthly / 100)}/mo`,
  })

  return { baseCents: total, breakdown, unitLabel: `${details.contractMonths}-month contract` }
}

function calcFilm(details: FilmDetails): {
  baseCents: number
  breakdown: BreakdownItem[]
  unitLabel: string
} {
  const { daily } = PRICING_BENCHMARKS.film
  const breakdown: BreakdownItem[] = []

  const baseCents = dollars(daily.mid * details.shootDays)
  breakdown.push({
    label: `Shoot days (${details.shootDays} day${details.shootDays > 1 ? 's' : ''})`,
    usdCents: baseCents,
    note: `$${daily.mid.toLocaleString()}/day`,
  })

  let total = baseCents

  if (details.crewSize > 1) {
    const add = dollars(1500 * (details.crewSize - 1) * details.shootDays)
    breakdown.push({
      label: `Additional crew (${details.crewSize - 1} person${details.crewSize > 2 ? 's' : ''})`,
      usdCents: add,
      note: '$1,500/person/day',
    })
    total += add
  }

  if (details.licensing === 'limited') {
    const add = dollars(1000)
    breakdown.push({ label: 'Limited commercial license', usdCents: add })
    total += add
  } else if (details.licensing === 'perpetual') {
    const add = dollars(2000)
    breakdown.push({ label: 'Perpetual commercial license', usdCents: add })
    total += add
  }

  return { baseCents: total, breakdown, unitLabel: 'per project' }
}

export function calculatePrice(profile: JobProfile): PriceResult {
  const currency = profile.currency || getCurrencyForCountry(profile.country)
  const countryMultiplier = getCountryMultiplier(profile.country)
  const experienceMultiplier = EXPERIENCE_MULTIPLIERS[profile.experienceLevel] ?? 1.0
  const exchangeRate = getExchangeRate(currency)

  let baseCents: number
  let breakdown: BreakdownItem[]
  let unitLabel: string

  switch (profile.serviceType) {
    case 'real_estate': {
      const r = calcRealEstate(profile.details as RealEstateDetails)
      baseCents = r.baseCents
      breakdown = r.breakdown
      unitLabel = r.unitLabel
      break
    }
    case 'events': {
      const r = calcEvents(profile.details as EventsDetails)
      baseCents = r.baseCents
      breakdown = r.breakdown
      unitLabel = r.unitLabel
      break
    }
    case 'inspection': {
      const r = calcInspection(profile.details as InspectionDetails)
      baseCents = r.baseCents
      breakdown = r.breakdown
      unitLabel = r.unitLabel
      break
    }
    case 'mapping': {
      const r = calcMapping(profile.details as MappingDetails)
      baseCents = r.baseCents
      breakdown = r.breakdown
      unitLabel = r.unitLabel
      break
    }
    case 'construction': {
      const r = calcConstruction(profile.details as ConstructionDetails)
      baseCents = r.baseCents
      breakdown = r.breakdown
      unitLabel = r.unitLabel
      break
    }
    case 'film': {
      const r = calcFilm(profile.details as FilmDetails)
      baseCents = r.baseCents
      breakdown = r.breakdown
      unitLabel = r.unitLabel
      break
    }
    default:
      baseCents = 0
      breakdown = []
      unitLabel = 'per job'
  }

  // Apply country adjustment as a breakdown item
  if (countryMultiplier !== 1.0) {
    const diff = Math.round(baseCents * (countryMultiplier - 1))
    breakdown.push({
      label: `${profile.country} market adjustment`,
      usdCents: diff,
      note: `${countryMultiplier}× USD baseline`,
      isMultiplier: true,
      multiplierValue: countryMultiplier,
    })
  }

  const countryAdjusted = Math.round(baseCents * countryMultiplier)

  // Apply experience multiplier
  const diff = Math.round(countryAdjusted * (experienceMultiplier - 1))
  breakdown.push({
    label: `Experience level (${profile.experienceLevel})`,
    usdCents: diff,
    note: `${experienceMultiplier}× multiplier`,
    isMultiplier: true,
    multiplierValue: experienceMultiplier,
  })

  const recommendedUsd = Math.round(countryAdjusted * experienceMultiplier)
  const lowUsd = Math.round(countryAdjusted * 0.7)
  const premiumUsd = Math.round(countryAdjusted * 1.4)

  return {
    lowUsd,
    recommendedUsd,
    premiumUsd,
    breakdown,
    serviceType: profile.serviceType,
    currency,
    exchangeRate,
    countryMultiplier,
    experienceMultiplier,
    unitLabel,
  }
}

export function serializeJobProfile(profile: JobProfile): string {
  return Buffer.from(JSON.stringify(profile)).toString('base64')
}

export function deserializeJobProfile(encoded: string): JobProfile | null {
  try {
    return JSON.parse(Buffer.from(encoded, 'base64').toString('utf-8')) as JobProfile
  } catch {
    return null
  }
}
