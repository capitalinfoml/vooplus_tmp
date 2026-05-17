export type ServiceType =
  | 'real_estate'
  | 'events'
  | 'inspection'
  | 'mapping'
  | 'construction'
  | 'film'

export type ExperienceLevel = 'beginner' | 'developing' | 'established' | 'expert'

export interface RealEstateDetails {
  propertySizeSqft: number
  deliverables: ('photos' | 'video_walkthrough' | 'aerial_video')[]
  editingIncluded: boolean
  rushDelivery: boolean
}

export interface EventsDetails {
  eventDurationHours: number
  editedVideoMinutes: number
  travelDistanceKm: number
}

export interface InspectionDetails {
  assetType: 'roof' | 'bridge' | 'tower' | 'pipeline' | 'solar_panel' | 'wind_turbine' | 'building'
  assetCount: number
  reportIncluded: boolean
  thermalRequired: boolean
}

export interface MappingDetails {
  areaHectares: number
  gcpRequired: boolean
  deliverables: ('orthomosaic' | '3d_model' | 'point_cloud' | 'dtm')[]
}

export interface ConstructionDetails {
  siteSize: 'small' | 'medium' | 'large'
  frequency: 'monthly' | 'biweekly' | 'weekly'
  contractMonths: number
}

export interface FilmDetails {
  shootDays: number
  crewSize: number
  licensing: 'none' | 'limited' | 'perpetual'
}

export type ServiceDetails =
  | RealEstateDetails
  | EventsDetails
  | InspectionDetails
  | MappingDetails
  | ConstructionDetails
  | FilmDetails

export interface JobProfile {
  serviceType: ServiceType
  details: ServiceDetails
  country: string
  city: string
  experienceLevel: ExperienceLevel
  currency: string
}

export interface BreakdownItem {
  label: string
  usdCents: number
  note?: string
  isMultiplier?: boolean
  multiplierValue?: number
}

export interface PriceResult {
  lowUsd: number
  recommendedUsd: number
  premiumUsd: number
  breakdown: BreakdownItem[]
  serviceType: ServiceType
  currency: string
  exchangeRate: number
  countryMultiplier: number
  experienceMultiplier: number
  unitLabel: string
}

export interface AISuggestionsResult {
  deliverables: string[]
  upsells: string[]
  what_to_avoid_including: string[]
}
