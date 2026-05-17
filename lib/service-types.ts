import type { ServiceType } from '@/types'

export const SERVICE_CATALOG: Record<
  ServiceType,
  {
    label: string
    deliverables: string[]
    typical_duration_hours: { min: number; max: number }
    factors: string[]
    description: string
    icon: string
  }
> = {
  real_estate: {
    label: 'Real Estate Photography',
    description: 'Aerial photos & video for property listings',
    icon: 'building',
    deliverables: ['photos', 'video_walkthrough', 'aerial_video'],
    typical_duration_hours: { min: 1, max: 4 },
    factors: ['property_size_sqft', 'editing_included', 'rush_delivery'],
  },
  events: {
    label: 'Events & Weddings',
    description: 'Cinematic coverage for special occasions',
    icon: 'camera',
    deliverables: ['highlight_reel', 'raw_footage', 'photos'],
    typical_duration_hours: { min: 2, max: 8 },
    factors: ['event_duration', 'edited_video_minutes', 'travel_distance_km'],
  },
  inspection: {
    label: 'Infrastructure Inspection',
    description: 'Detailed asset inspection with reports',
    icon: 'search',
    deliverables: ['inspection_report', 'thermal_images', 'annotated_video'],
    typical_duration_hours: { min: 2, max: 6 },
    factors: ['asset_type', 'asset_count', 'report_included', 'thermal_required'],
  },
  mapping: {
    label: 'Survey & Mapping',
    description: 'Precision mapping, 3D models & point clouds',
    icon: 'map',
    deliverables: ['orthomosaic', '3d_model', 'point_cloud', 'dtm'],
    typical_duration_hours: { min: 4, max: 16 },
    factors: ['area_hectares', 'gcp_required', 'deliverable_type'],
  },
  construction: {
    label: 'Construction Progress',
    description: 'Regular site documentation & 3D models',
    icon: 'crane',
    deliverables: ['weekly_report', '3d_progress_model', 'comparison_video'],
    typical_duration_hours: { min: 2, max: 4 },
    factors: ['site_size', 'frequency', 'contract_months'],
  },
  film: {
    label: 'Film & Commercial',
    description: 'Cinematic drone work for film & advertising',
    icon: 'film',
    deliverables: ['raw_4k_footage', 'edited_sequence', 'bts_content'],
    typical_duration_hours: { min: 4, max: 12 },
    factors: ['shoot_days', 'crew_size', 'licensing'],
  },
}

export const PRICING_BENCHMARKS = {
  real_estate: { hourly: { min: 150, mid: 250, max: 450 } },
  events: { hourly: { min: 200, mid: 350, max: 600 } },
  inspection: { hourly: { min: 250, mid: 400, max: 700 } },
  mapping: { per_hectare: { min: 30, mid: 60, max: 120 } },
  construction: { monthly_retainer: { min: 500, mid: 1200, max: 3000 } },
  film: { daily: { min: 1500, mid: 3000, max: 8000 } },
}

export const COUNTRY_MULTIPLIERS: Record<string, number> = {
  US: 1.0,
  GB: 0.95,
  AU: 0.9,
  CA: 0.85,
  DE: 0.9,
  FR: 0.85,
  NL: 0.9,
  SE: 0.85,
  NO: 1.1,
  CH: 1.2,
  AE: 0.8,
  SG: 0.85,
  BR: 0.35,
  MX: 0.4,
  ZA: 0.3,
  IN: 0.25,
  NG: 0.2,
}

export const DEFAULT_COUNTRY_MULTIPLIER = 0.6

export const EXPERIENCE_MULTIPLIERS: Record<string, number> = {
  beginner: 0.7,
  developing: 0.9,
  established: 1.1,
  expert: 1.4,
}

export function getCountryMultiplier(countryCode: string): number {
  return COUNTRY_MULTIPLIERS[countryCode] ?? DEFAULT_COUNTRY_MULTIPLIER
}
