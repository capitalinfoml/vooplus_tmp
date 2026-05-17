'use client'

import type { ServiceType } from '@/types'
import { SERVICE_CATALOG } from '@/lib/service-types'

const ICONS: Record<ServiceType, React.ReactNode> = {
  real_estate: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
  ),
  events: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
  ),
  inspection: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
  mapping: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
    </svg>
  ),
  construction: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
    </svg>
  ),
  film: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125V9.375c0-.621.504-1.125 1.125-1.125h.375m16.5 11.25h-1.5c-.621 0-1.125-.504-1.125-1.125M20.625 19.5V9.375c0-.621-.504-1.125-1.125-1.125h-.375M6 18.375v-9a1.125 1.125 0 011.125-1.125h9.75A1.125 1.125 0 0118 9.375v9M6 18.375c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125M6 18.375c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125m-12 0v-9m12 9v-9" />
    </svg>
  ),
}

interface Props {
  selected: ServiceType | null
  onSelect: (type: ServiceType) => void
}

export function StepJobType({ selected, onSelect }: Props) {
  const types = Object.entries(SERVICE_CATALOG) as [ServiceType, typeof SERVICE_CATALOG[ServiceType]][]

  return (
    <div className="animate-slide-up">
      <h2 className="text-2xl font-bold text-text-primary mb-2">What type of drone job?</h2>
      <p className="text-text-secondary mb-8">Select the service that best matches your work</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {types.map(([type, info]) => {
          const isSelected = selected === type
          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className={`
                relative text-left p-5 rounded-xl border transition-all duration-200 group
                ${isSelected
                  ? 'border-accent bg-accent/10 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                  : 'border-border-subtle bg-bg-card hover:border-border-strong hover:bg-bg-elevated hover:-translate-y-0.5'
                }
              `}
            >
              {isSelected && (
                <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                  <svg className="w-3 h-3 text-bg-base" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
              )}
              <div className={`mb-3 ${isSelected ? 'text-accent' : 'text-text-secondary group-hover:text-accent transition-colors'}`}>
                {ICONS[type]}
              </div>
              <h3 className={`font-semibold mb-1 ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                {info.label}
              </h3>
              <p className="text-sm text-text-muted leading-snug">{info.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {info.deliverables.slice(0, 2).map((d) => (
                  <span key={d} className="text-xs px-2 py-0.5 rounded-full bg-bg-elevated text-text-muted border border-border-subtle">
                    {d.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
