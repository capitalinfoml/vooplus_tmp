'use client'

import type { PriceResult } from '@/types'
import { displayPrice } from '@/lib/currency-rates'

interface Props {
  result: PriceResult
}

export function PriceBreakdown({ result }: Props) {
  const { breakdown, currency, recommendedUsd } = result

  // Running total for display
  let running = 0

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border-subtle">
        <h3 className="font-semibold text-text-primary">Price breakdown</h3>
        <p className="text-xs text-text-muted mt-0.5">How your recommended price is calculated</p>
      </div>
      <div className="divide-y divide-border-subtle">
        {breakdown.map((item, i) => {
          if (!item.isMultiplier) running += item.usdCents
          const isNegative = item.usdCents < 0
          return (
            <div key={i} className="flex items-start justify-between px-5 py-3.5 gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary truncate">{item.label}</p>
                {item.note && (
                  <p className="text-xs text-text-muted mt-0.5">{item.note}</p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-sm font-mono font-semibold ${
                  item.isMultiplier
                    ? item.usdCents > 0 ? 'text-success' : item.usdCents < 0 ? 'text-danger' : 'text-text-muted'
                    : isNegative ? 'text-success' : 'text-text-primary'
                }`}>
                  {item.isMultiplier
                    ? item.usdCents > 0
                      ? `+${displayPrice(Math.abs(item.usdCents), currency)}`
                      : `−${displayPrice(Math.abs(item.usdCents), currency)}`
                    : isNegative
                    ? `−${displayPrice(Math.abs(item.usdCents), currency)}`
                    : displayPrice(item.usdCents, currency)
                  }
                </p>
              </div>
            </div>
          )
        })}
        {/* Total row */}
        <div className="flex items-center justify-between px-5 py-4 bg-accent/5">
          <div>
            <p className="text-sm font-semibold text-text-primary">Recommended price</p>
            <p className="text-xs text-text-muted mt-0.5">{result.unitLabel}</p>
          </div>
          <p className="text-lg font-bold font-mono text-accent">
            {displayPrice(recommendedUsd, currency)}
          </p>
        </div>
      </div>
    </div>
  )
}
