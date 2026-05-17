'use client'

import { useState } from 'react'
import type { PriceResult, JobProfile } from '@/types'
import { SERVICE_CATALOG, PRICING_BENCHMARKS, getCountryMultiplier } from '@/lib/service-types'
import { displayPrice } from '@/lib/currency-rates'
import { getCountryByCode } from '@/lib/countries'
import { PriceBreakdown } from './PriceBreakdown'
import { AISuggestions } from './AISuggestions'
import { RateCardGenerator } from './RateCardGenerator'

interface Props {
  result: PriceResult
  profile: JobProfile
}

function BenchmarkRow({ label, usd, currency }: { label: string; usd: number; currency: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border-subtle last:border-0">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-sm font-mono font-semibold text-text-primary">
        {displayPrice(usd, currency)}
      </span>
    </div>
  )
}

export function ResultsView({ result, profile }: Props) {
  const [showRateCard, setShowRateCard] = useState(false)
  const serviceInfo = SERVICE_CATALOG[result.serviceType]
  const country = getCountryByCode(profile.country)
  const countryMult = getCountryMultiplier(profile.country)

  // Derive community benchmark range from PRICING_BENCHMARKS × country multiplier
  const benchmarks = PRICING_BENCHMARKS[result.serviceType]
  let benchLow = 0
  let benchHigh = 0
  const isHourly = 'hourly' in benchmarks
  const isPerHectare = 'per_hectare' in benchmarks
  const isMonthly = 'monthly_retainer' in benchmarks
  const isDaily = 'daily' in benchmarks

  if (isHourly) {
    const b = (benchmarks as typeof PRICING_BENCHMARKS.real_estate)
    benchLow = Math.round(b.hourly.min * countryMult * 200)   // ~2hr job
    benchHigh = Math.round(b.hourly.max * countryMult * 400)  // ~4hr job
  } else if (isPerHectare) {
    const b = (benchmarks as typeof PRICING_BENCHMARKS.mapping)
    benchLow = Math.round(b.per_hectare.min * countryMult * 1000)
    benchHigh = Math.round(b.per_hectare.max * countryMult * 10000)
  } else if (isMonthly) {
    const b = (benchmarks as typeof PRICING_BENCHMARKS.construction)
    benchLow = Math.round(b.monthly_retainer.min * countryMult * 100)
    benchHigh = Math.round(b.monthly_retainer.max * countryMult * 100)
  } else if (isDaily) {
    const b = (benchmarks as typeof PRICING_BENCHMARKS.film)
    benchLow = Math.round(b.daily.min * countryMult * 100)
    benchHigh = Math.round(b.daily.max * countryMult * 100)
  }

  const tiers = [
    {
      label: 'Budget',
      value: result.lowUsd,
      sub: 'Beginner operators',
      color: 'text-text-secondary',
      bg: 'bg-bg-elevated',
      border: 'border-border-subtle',
    },
    {
      label: 'Recommended',
      value: result.recommendedUsd,
      sub: `For ${profile.experienceLevel} operators`,
      color: 'text-accent',
      bg: 'bg-accent/10',
      border: 'border-accent',
      featured: true,
    },
    {
      label: 'Premium',
      value: result.premiumUsd,
      sub: 'Expert operators',
      color: 'text-success',
      bg: 'bg-success/5',
      border: 'border-success/30',
    },
  ]

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <header className="border-b border-border-subtle bg-bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg gradient-amber flex items-center justify-center">
              <svg className="w-4 h-4 text-bg-base" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </div>
            <span className="font-bold text-text-primary">DroneFee</span>
          </a>
          <a
            href="/calculate"
            className="text-sm text-text-secondary hover:text-accent transition-colors"
          >
            ← New calculation
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Title */}
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold text-text-primary">{serviceInfo.label}</h1>
            {country && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-bg-elevated border border-border-subtle text-sm text-text-secondary">
                {country.emoji} {country.name}
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-bg-elevated border border-border-subtle text-sm text-text-secondary capitalize">
              {profile.experienceLevel} level
            </span>
          </div>
          <p className="text-text-muted">
            Based on market benchmarks adjusted for purchasing power parity. Prices in {result.currency}.
          </p>
        </div>

        {/* Three-tier pricing */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-slide-up">
          {tiers.map((tier) => (
            <div
              key={tier.label}
              className={`relative rounded-xl border p-6 ${tier.bg} ${tier.border} ${
                tier.featured ? 'shadow-[0_0_24px_rgba(245,158,11,0.12)]' : ''
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold gradient-amber text-bg-base">
                  Your rate
                </span>
              )}
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${tier.color}`}>
                {tier.label}
              </p>
              <p className={`text-2xl sm:text-3xl font-bold font-mono ${tier.color} mb-1`}>
                {displayPrice(tier.value, result.currency)}
              </p>
              <p className="text-xs text-text-muted">{tier.sub}</p>
              <p className="text-xs text-text-muted mt-0.5">{result.unitLabel}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <PriceBreakdown result={result} />

            {/* Community benchmarks (SSR-safe, hardcoded data) */}
            <div className="rounded-xl border border-border-subtle bg-bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border-subtle">
                <h3 className="font-semibold text-text-primary">
                  Market rates in {country?.name ?? profile.country}
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Derived from industry benchmarks × local PPP adjustment
                </p>
              </div>
              <div className="p-5 space-y-0">
                <BenchmarkRow
                  label="Entry-level operators"
                  usd={benchLow}
                  currency={result.currency}
                />
                <BenchmarkRow
                  label="Mid-market rate"
                  usd={Math.round((benchLow + benchHigh) / 2)}
                  currency={result.currency}
                />
                <BenchmarkRow
                  label="Premium operators"
                  usd={benchHigh}
                  currency={result.currency}
                />
              </div>
              <div className="px-5 py-3 border-t border-border-subtle bg-bg-elevated/50">
                <p className="text-xs text-text-muted">
                  Community rates data coming soon.{' '}
                  <span className="text-accent cursor-pointer">Report your actual rate →</span>
                </p>
              </div>
            </div>

            <AISuggestions profile={profile} recommendedUsd={result.recommendedUsd} />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Rate card CTA */}
            {!showRateCard ? (
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 text-center">
                <div className="w-12 h-12 rounded-xl gradient-amber flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-bg-base" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Generate your Rate Card</h3>
                <p className="text-sm text-text-secondary mb-5">
                  Create a shareable 1200×628px image showing your rates. Download free, no account needed.
                </p>
                <button
                  onClick={() => setShowRateCard(true)}
                  className="w-full py-2.5 px-4 rounded-lg gradient-amber text-bg-base text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Generate Rate Card
                </button>
              </div>
            ) : (
              <RateCardGenerator
                result={result}
                serviceType={result.serviceType}
                country={profile.country}
              />
            )}

            {/* Auth CTA */}
            <div className="rounded-xl border border-border-subtle bg-bg-card p-6">
              <h3 className="font-semibold text-text-primary mb-2">Save & create proposals</h3>
              <p className="text-sm text-text-secondary mb-4">
                Turn this calculation into a professional client proposal with one click.
              </p>
              <ul className="space-y-2 mb-5">
                {[
                  'Save unlimited calculations',
                  'Generate PDF proposals',
                  'Track proposal status',
                  'Community benchmark data',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                    <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="/auth/signup"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg border border-accent text-accent text-sm font-semibold hover:bg-accent hover:text-bg-base transition-all"
              >
                Create free account
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <p className="text-xs text-text-muted text-center mt-2">Free plan includes 3 proposals</p>
            </div>

            {/* Recalculate */}
            <a
              href="/calculate"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg border border-border-subtle text-text-secondary text-sm font-medium hover:border-border-strong hover:text-text-primary transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Recalculate
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
