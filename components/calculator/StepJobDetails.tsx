'use client'

import type {
  ServiceType,
  RealEstateDetails,
  EventsDetails,
  InspectionDetails,
  MappingDetails,
  ConstructionDetails,
  FilmDetails,
  ServiceDetails,
} from '@/types'

// ---------- shared UI atoms ----------

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-text-secondary mb-2">{children}</label>
}

function ToggleGroup<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
            value === o.value
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-border-subtle bg-bg-card text-text-secondary hover:border-border-strong'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function MultiSelect<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T[]
  options: { value: T; label: string }[]
  onChange: (v: T[]) => void
}) {
  const toggle = (v: T) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value.includes(o.value)
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              active
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border-subtle bg-bg-card text-text-secondary hover:border-border-strong'
            }`}
          >
            {active && (
              <svg className="inline w-3.5 h-3.5 mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-start gap-3 w-full text-left p-4 rounded-lg border transition-all ${
        checked ? 'border-accent bg-accent/10' : 'border-border-subtle bg-bg-card hover:border-border-strong'
      }`}
    >
      <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition-all ${
        checked ? 'bg-accent border-accent' : 'border-border-default bg-bg-elevated'
      }`}>
        {checked && (
          <svg className="w-3 h-3 text-bg-base" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        )}
      </div>
      <div>
        <p className={`text-sm font-medium ${checked ? 'text-accent' : 'text-text-primary'}`}>{label}</p>
        {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
      </div>
    </button>
  )
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  format: (v: number) => string
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label>{label}</Label>
        <span className="text-sm font-mono font-semibold text-accent">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-border-default accent-accent"
        style={{ accentColor: '#f59e0b' }}
      />
      <div className="flex justify-between text-xs text-text-muted mt-1">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  )
}

// ---------- per-service forms ----------

function RealEstateForm({
  details,
  onChange,
}: {
  details: RealEstateDetails
  onChange: (d: RealEstateDetails) => void
}) {
  return (
    <div className="space-y-6">
      <SliderField
        label="Property size"
        value={details.propertySizeSqft}
        min={500}
        max={15000}
        step={500}
        format={(v) => `${v.toLocaleString()} sqft`}
        onChange={(v) => onChange({ ...details, propertySizeSqft: v })}
      />
      <div>
        <Label>Deliverables</Label>
        <MultiSelect<'photos' | 'video_walkthrough' | 'aerial_video'>
          value={details.deliverables}
          options={[
            { value: 'photos', label: 'Photos' },
            { value: 'video_walkthrough', label: 'Video walkthrough' },
            { value: 'aerial_video', label: 'Aerial video' },
          ]}
          onChange={(v) => onChange({ ...details, deliverables: v })}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Toggle
          checked={details.editingIncluded}
          onChange={(v) => onChange({ ...details, editingIncluded: v })}
          label="Editing included"
          description="Post-processing, color grading"
        />
        <Toggle
          checked={details.rushDelivery}
          onChange={(v) => onChange({ ...details, rushDelivery: v })}
          label="Rush delivery"
          description="24–48hr turnaround"
        />
      </div>
    </div>
  )
}

function EventsForm({
  details,
  onChange,
}: {
  details: EventsDetails
  onChange: (d: EventsDetails) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Event duration</Label>
        <ToggleGroup
          value={String(details.eventDurationHours) as never}
          options={[2, 4, 6, 8].map((h) => ({ value: String(h) as never, label: `${h}hr` }))}
          onChange={(v) => onChange({ ...details, eventDurationHours: Number(v) })}
        />
      </div>
      <SliderField
        label="Edited highlight video"
        value={details.editedVideoMinutes}
        min={0}
        max={30}
        step={5}
        format={(v) => (v === 0 ? 'None' : `${v} min`)}
        onChange={(v) => onChange({ ...details, editedVideoMinutes: v })}
      />
      <SliderField
        label="Travel distance"
        value={details.travelDistanceKm}
        min={0}
        max={300}
        step={25}
        format={(v) => (v === 0 ? 'Local' : `${v} km`)}
        onChange={(v) => onChange({ ...details, travelDistanceKm: v })}
      />
    </div>
  )
}

const ASSET_TYPES: { value: InspectionDetails['assetType']; label: string }[] = [
  { value: 'roof', label: 'Roof' },
  { value: 'bridge', label: 'Bridge' },
  { value: 'tower', label: 'Tower' },
  { value: 'pipeline', label: 'Pipeline' },
  { value: 'solar_panel', label: 'Solar farm' },
  { value: 'wind_turbine', label: 'Wind turbine' },
  { value: 'building', label: 'Building' },
]

function InspectionForm({
  details,
  onChange,
}: {
  details: InspectionDetails
  onChange: (d: InspectionDetails) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Asset type</Label>
        <ToggleGroup
          value={details.assetType}
          options={ASSET_TYPES}
          onChange={(v) => onChange({ ...details, assetType: v })}
        />
      </div>
      <SliderField
        label="Number of assets"
        value={details.assetCount}
        min={1}
        max={10}
        step={1}
        format={(v) => `${v} asset${v !== 1 ? 's' : ''}`}
        onChange={(v) => onChange({ ...details, assetCount: v })}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Toggle
          checked={details.thermalRequired}
          onChange={(v) => onChange({ ...details, thermalRequired: v })}
          label="Thermal imaging"
          description="Requires specialized sensor"
        />
        <Toggle
          checked={details.reportIncluded}
          onChange={(v) => onChange({ ...details, reportIncluded: v })}
          label="Inspection report"
          description="Detailed annotated PDF"
        />
      </div>
    </div>
  )
}

function MappingForm({
  details,
  onChange,
}: {
  details: MappingDetails
  onChange: (d: MappingDetails) => void
}) {
  return (
    <div className="space-y-6">
      <SliderField
        label="Survey area"
        value={details.areaHectares}
        min={1}
        max={500}
        step={1}
        format={(v) => `${v} ha`}
        onChange={(v) => onChange({ ...details, areaHectares: v })}
      />
      <div>
        <Label>Deliverables</Label>
        <MultiSelect<'orthomosaic' | '3d_model' | 'point_cloud' | 'dtm'>
          value={details.deliverables}
          options={[
            { value: 'orthomosaic', label: 'Orthomosaic' },
            { value: '3d_model', label: '3D model' },
            { value: 'point_cloud', label: 'Point cloud' },
            { value: 'dtm', label: 'DTM / terrain' },
          ]}
          onChange={(v) => onChange({ ...details, deliverables: v })}
        />
      </div>
      <Toggle
        checked={details.gcpRequired}
        onChange={(v) => onChange({ ...details, gcpRequired: v })}
        label="Ground control points (GCPs)"
        description="Survey-grade accuracy — adds field time and processing"
      />
    </div>
  )
}

function ConstructionForm({
  details,
  onChange,
}: {
  details: ConstructionDetails
  onChange: (d: ConstructionDetails) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Site size</Label>
        <ToggleGroup
          value={details.siteSize}
          options={[
            { value: 'small', label: 'Small (< 1 ha)' },
            { value: 'medium', label: 'Medium (1–10 ha)' },
            { value: 'large', label: 'Large (> 10 ha)' },
          ]}
          onChange={(v) => onChange({ ...details, siteSize: v })}
        />
      </div>
      <div>
        <Label>Documentation frequency</Label>
        <ToggleGroup
          value={details.frequency}
          options={[
            { value: 'monthly', label: 'Monthly' },
            { value: 'biweekly', label: 'Bi-weekly' },
            { value: 'weekly', label: 'Weekly' },
          ]}
          onChange={(v) => onChange({ ...details, frequency: v })}
        />
      </div>
      <div>
        <Label>Contract length</Label>
        <ToggleGroup
          value={String(details.contractMonths) as never}
          options={[1, 3, 6, 12].map((m) => ({ value: String(m) as never, label: `${m}mo` }))}
          onChange={(v) => onChange({ ...details, contractMonths: Number(v) })}
        />
      </div>
    </div>
  )
}

function FilmForm({ details, onChange }: { details: FilmDetails; onChange: (d: FilmDetails) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Shoot days</Label>
        <ToggleGroup
          value={String(details.shootDays) as never}
          options={[1, 2, 3, 5].map((d) => ({ value: String(d) as never, label: `${d} day${d > 1 ? 's' : ''}` }))}
          onChange={(v) => onChange({ ...details, shootDays: Number(v) })}
        />
      </div>
      <div>
        <Label>Crew size</Label>
        <ToggleGroup
          value={String(details.crewSize) as never}
          options={[1, 2, 3].map((n) => ({ value: String(n) as never, label: `${n} person${n > 1 ? 's' : ''}` }))}
          onChange={(v) => onChange({ ...details, crewSize: Number(v) })}
        />
      </div>
      <div>
        <Label>Commercial licensing</Label>
        <ToggleGroup
          value={details.licensing}
          options={[
            { value: 'none', label: 'No license' },
            { value: 'limited', label: 'Limited use' },
            { value: 'perpetual', label: 'Perpetual' },
          ]}
          onChange={(v) => onChange({ ...details, licensing: v })}
        />
      </div>
    </div>
  )
}

// ---------- defaults ----------

export function getDefaultDetails(serviceType: ServiceType): ServiceDetails {
  switch (serviceType) {
    case 'real_estate':
      return { propertySizeSqft: 2500, deliverables: ['photos'], editingIncluded: false, rushDelivery: false } as RealEstateDetails
    case 'events':
      return { eventDurationHours: 4, editedVideoMinutes: 10, travelDistanceKm: 0 } as EventsDetails
    case 'inspection':
      return { assetType: 'roof', assetCount: 1, reportIncluded: true, thermalRequired: false } as InspectionDetails
    case 'mapping':
      return { areaHectares: 10, gcpRequired: false, deliverables: ['orthomosaic'] } as MappingDetails
    case 'construction':
      return { siteSize: 'medium', frequency: 'monthly', contractMonths: 3 } as ConstructionDetails
    case 'film':
      return { shootDays: 1, crewSize: 1, licensing: 'limited' } as FilmDetails
  }
}

// ---------- main component ----------

interface Props {
  serviceType: ServiceType
  details: ServiceDetails
  onChange: (details: ServiceDetails) => void
}

export function StepJobDetails({ serviceType, details, onChange }: Props) {
  return (
    <div className="animate-slide-up">
      <h2 className="text-2xl font-bold text-text-primary mb-2">Job details</h2>
      <p className="text-text-secondary mb-8">
        Tell us about the specific requirements — each factor affects your price
      </p>

      {serviceType === 'real_estate' && (
        <RealEstateForm details={details as RealEstateDetails} onChange={onChange} />
      )}
      {serviceType === 'events' && (
        <EventsForm details={details as EventsDetails} onChange={onChange} />
      )}
      {serviceType === 'inspection' && (
        <InspectionForm details={details as InspectionDetails} onChange={onChange} />
      )}
      {serviceType === 'mapping' && (
        <MappingForm details={details as MappingDetails} onChange={onChange} />
      )}
      {serviceType === 'construction' && (
        <ConstructionForm details={details as ConstructionDetails} onChange={onChange} />
      )}
      {serviceType === 'film' && (
        <FilmForm details={details as FilmDetails} onChange={onChange} />
      )}
    </div>
  )
}
