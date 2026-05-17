'use client'

import type { ExperienceLevel } from '@/types'
import { EXPERIENCE_MULTIPLIERS } from '@/lib/service-types'

const LEVELS: {
  id: ExperienceLevel
  label: string
  sub: string
  years: string
  description: string
}[] = [
  {
    id: 'beginner',
    label: 'Beginner',
    years: '< 1 year',
    sub: 'Building your portfolio',
    description: 'Still developing core skills, limited portfolio, lower equipment investment.',
  },
  {
    id: 'developing',
    label: 'Developing',
    years: '1–3 years',
    sub: 'Growing client base',
    description: 'Consistent results, growing portfolio, part-time or new full-time operator.',
  },
  {
    id: 'established',
    label: 'Established',
    years: '3–5 years',
    sub: 'Professional operator',
    description: 'Reliable delivery, repeat clients, specialized equipment, streamlined workflow.',
  },
  {
    id: 'expert',
    label: 'Expert',
    years: '5+ years',
    sub: 'Industry veteran',
    description: 'Premium brand, niche specialization, high-profile clients, top-tier equipment.',
  },
]

interface Props {
  selected: ExperienceLevel | null
  onSelect: (level: ExperienceLevel) => void
}

export function StepExperience({ selected, onSelect }: Props) {
  return (
    <div className="animate-slide-up">
      <h2 className="text-2xl font-bold text-text-primary mb-2">Your experience level</h2>
      <p className="text-text-secondary mb-8">
        This adjusts your recommended price relative to the market baseline
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {LEVELS.map((level) => {
          const multiplier = EXPERIENCE_MULTIPLIERS[level.id]
          const isSelected = selected === level.id
          const isAbove = multiplier > 1
          return (
            <button
              key={level.id}
              onClick={() => onSelect(level.id)}
              className={`
                relative text-left p-5 rounded-xl border transition-all duration-200
                ${isSelected
                  ? 'border-accent bg-accent/10 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                  : 'border-border-subtle bg-bg-card hover:border-border-strong hover:bg-bg-elevated'
                }
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className={`font-bold text-lg ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                    {level.label}
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">{level.years}</p>
                </div>
                <span className={`
                  text-sm font-mono font-bold px-2.5 py-1 rounded-lg
                  ${isSelected ? 'bg-accent text-bg-base' : isAbove ? 'bg-success/10 text-success' : 'bg-bg-elevated text-text-secondary'}
                `}>
                  {multiplier}×
                </span>
              </div>
              <p className="text-sm font-medium text-text-secondary mb-1">{level.sub}</p>
              <p className="text-xs text-text-muted leading-relaxed">{level.description}</p>

              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                  <svg className="w-3 h-3 text-bg-base" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <p className="mt-6 text-xs text-text-muted text-center">
        Market baseline is the mid-range USD price for established operators. Your multiplier positions you within that range.
      </p>
    </div>
  )
}
