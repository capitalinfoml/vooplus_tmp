'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { ServiceType, ExperienceLevel, ServiceDetails, JobProfile } from '@/types'
import { getCurrencyForCountry } from '@/lib/currency-rates'
import { StepJobType } from './StepJobType'
import { StepJobDetails, getDefaultDetails } from './StepJobDetails'
import { StepMarket } from './StepMarket'
import { StepExperience } from './StepExperience'

const STEPS = [
  { id: 1, label: 'Job type' },
  { id: 2, label: 'Details' },
  { id: 3, label: 'Market' },
  { id: 4, label: 'Experience' },
]

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((step, idx) => {
        const isDone = current > step.id
        const isCurrent = current === step.id
        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${isDone ? 'bg-accent text-bg-base' : isCurrent ? 'bg-accent/20 border-2 border-accent text-accent' : 'bg-bg-elevated border border-border-subtle text-text-muted'}
              `}>
                {isDone ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${isCurrent ? 'text-accent' : isDone ? 'text-text-secondary' : 'text-text-muted'}`}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 mb-5 ${current > step.id ? 'bg-accent' : 'bg-border-subtle'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export function CalculatorWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [serviceType, setServiceType] = useState<ServiceType | null>(null)
  const [details, setDetails] = useState<ServiceDetails | null>(null)
  const [country, setCountry] = useState('US')
  const [city, setCity] = useState('')
  const [experience, setExperience] = useState<ExperienceLevel | null>(null)

  const handleServiceSelect = useCallback((type: ServiceType) => {
    setServiceType(type)
    setDetails(getDefaultDetails(type))
    setStep(2)
  }, [])

  const canProceed = useCallback((): boolean => {
    if (step === 1) return serviceType !== null
    if (step === 2) return details !== null
    if (step === 3) return country.length === 2
    if (step === 4) return experience !== null
    return false
  }, [step, serviceType, details, country, experience])

  const handleNext = useCallback(() => {
    if (!canProceed()) return
    if (step < 4) {
      setStep((s) => s + 1)
      return
    }
    // Step 4 complete — navigate to results
    const profile: JobProfile = {
      serviceType: serviceType!,
      details: details!,
      country,
      city,
      experienceLevel: experience!,
      currency: getCurrencyForCountry(country),
    }
    // Persist to localStorage for hydration
    try {
      localStorage.setItem('df_last_calculation', JSON.stringify(profile))
    } catch {}
    // Encode for SSR
    const encoded = btoa(JSON.stringify(profile))
    router.push(`/calculate/results?d=${encodeURIComponent(encoded)}`)
  }, [step, canProceed, serviceType, details, country, city, experience, router])

  const handleBack = useCallback(() => {
    if (step > 1) setStep((s) => s - 1)
  }, [step])

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      {/* Header */}
      <header className="border-b border-border-subtle bg-bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg gradient-amber flex items-center justify-center">
              <svg className="w-4 h-4 text-bg-base" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </div>
            <span className="font-bold text-text-primary">DroneFee</span>
          </a>
          <span className="text-sm text-text-muted">Free pricing calculator</span>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        <StepIndicator current={step} />

        <div className="mb-10">
          {step === 1 && (
            <StepJobType selected={serviceType} onSelect={handleServiceSelect} />
          )}
          {step === 2 && serviceType && details && (
            <StepJobDetails
              serviceType={serviceType}
              details={details}
              onChange={setDetails}
            />
          )}
          {step === 3 && (
            <StepMarket
              country={country}
              city={city}
              onChange={(c, ci) => { setCountry(c); setCity(ci) }}
            />
          )}
          {step === 4 && (
            <StepExperience selected={experience} onSelect={setExperience} />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
          <button
            onClick={handleBack}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all border ${
              step === 1
                ? 'border-transparent text-text-muted cursor-not-allowed opacity-40'
                : 'border-border-subtle text-text-secondary hover:border-border-strong hover:text-text-primary'
            }`}
            disabled={step === 1}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>

          {step > 1 && (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                canProceed()
                  ? 'gradient-amber text-bg-base hover:opacity-90 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                  : 'bg-bg-elevated text-text-muted cursor-not-allowed'
              }`}
            >
              {step === 4 ? 'Calculate my rates' : 'Continue'}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
