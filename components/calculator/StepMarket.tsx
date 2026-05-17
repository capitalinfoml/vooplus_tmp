'use client'

import { useState } from 'react'
import { COUNTRIES } from '@/lib/countries'
import { COUNTRY_MULTIPLIERS } from '@/lib/service-types'

interface Props {
  country: string
  city: string
  onChange: (country: string, city: string) => void
}

export function StepMarket({ country, city, onChange }: Props) {
  const [search, setSearch] = useState('')

  const filtered = search.length > 0
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.toLowerCase().includes(search.toLowerCase()),
      )
    : COUNTRIES

  const selectedCountry = COUNTRIES.find((c) => c.code === country)
  const multiplier = COUNTRY_MULTIPLIERS[country]

  return (
    <div className="animate-slide-up">
      <h2 className="text-2xl font-bold text-text-primary mb-2">Where are you based?</h2>
      <p className="text-text-secondary mb-8">
        Rates vary significantly by market — we adjust for purchasing power parity
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Country selector */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Country</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search countries…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-bg-card border border-border-subtle text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors mb-2"
            />
          </div>

          <div className="h-56 overflow-y-auto rounded-lg border border-border-subtle bg-bg-card">
            {filtered.length === 0 ? (
              <p className="text-text-muted text-sm p-4 text-center">No countries found</p>
            ) : (
              filtered.map((c) => {
                const mult = COUNTRY_MULTIPLIERS[c.code]
                const isSelected = country === c.code
                return (
                  <button
                    key={c.code}
                    onClick={() => {
                      onChange(c.code, city)
                      setSearch('')
                    }}
                    className={`
                      w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors
                      ${isSelected ? 'bg-accent/10 text-accent' : 'text-text-primary hover:bg-bg-elevated'}
                    `}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-lg leading-none">{c.emoji}</span>
                      <span className="text-sm font-medium">{c.name}</span>
                    </span>
                    {mult && (
                      <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                        mult >= 1 ? 'bg-success/10 text-success' : 'bg-text-muted/10 text-text-muted'
                      }`}>
                        {mult >= 1 ? '+' : ''}{Math.round((mult - 1) * 100)}%
                      </span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* City + summary */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">City (optional)</label>
            <input
              type="text"
              placeholder="e.g. Sydney, Toronto, Dubai…"
              value={city}
              onChange={(e) => onChange(country, e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-bg-card border border-border-subtle text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
            />
            <p className="text-xs text-text-muted mt-1.5">Used for community rate comparisons</p>
          </div>

          {selectedCountry && (
            <div className="rounded-xl border border-border-subtle bg-bg-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedCountry.emoji}</span>
                <div>
                  <p className="font-semibold text-text-primary">{selectedCountry.name}</p>
                  <p className="text-xs text-text-muted">{selectedCountry.code}</p>
                </div>
              </div>
              {multiplier !== undefined ? (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Market rate adjustment</span>
                  <span className={`font-mono font-semibold ${multiplier >= 1 ? 'text-success' : multiplier >= 0.6 ? 'text-accent' : 'text-text-secondary'}`}>
                    {multiplier}× USD baseline
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Market rate adjustment</span>
                  <span className="font-mono font-semibold text-text-secondary">0.6× USD baseline</span>
                </div>
              )}
              <p className="text-xs text-text-muted leading-relaxed">
                Prices adjusted for local purchasing power parity relative to US market rates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
