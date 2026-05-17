'use client'

import { useEffect, useState } from 'react'
import type { JobProfile, AISuggestionsResult } from '@/types'

interface Props {
  profile: JobProfile
  recommendedUsd: number
}

function Skeleton() {
  return (
    <div className="rounded-xl border border-border-subtle bg-bg-card p-5 space-y-3 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-4 rounded bg-border-default" />
        <div className="h-4 w-40 rounded bg-border-default" />
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-border-default mt-1.5 flex-shrink-0" />
          <div className="h-3.5 rounded bg-border-default flex-1" style={{ width: `${60 + i * 7}%` }} />
        </div>
      ))}
    </div>
  )
}

export function AISuggestions({ profile, recommendedUsd }: Props) {
  const [data, setData] = useState<AISuggestionsResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [section, setSection] = useState<'deliverables' | 'upsells' | 'avoid'>('deliverables')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch('/api/ai-suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, recommendedUsd }),
    })
      .then((r) => {
        if (!r.ok) throw new Error('unavailable')
        return r.json()
      })
      .then((d: AISuggestionsResult) => {
        if (!cancelled) { setData(d); setLoading(false) }
      })
      .catch(() => {
        if (!cancelled) { setError('AI suggestions unavailable'); setLoading(false) }
      })
    return () => { cancelled = true }
  }, [profile, recommendedUsd])

  if (loading) return <Skeleton />
  if (error || !data) return null

  const TABS = [
    { id: 'deliverables' as const, label: "What's included", items: data.deliverables },
    { id: 'upsells' as const, label: 'Upsell opportunities', items: data.upsells },
    { id: 'avoid' as const, label: 'Avoid including', items: data.what_to_avoid_including },
  ]

  const activeTab = TABS.find((t) => t.id === section)!

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-card overflow-hidden animate-fade-in">
      <div className="px-5 py-4 border-b border-border-subtle flex items-center gap-2">
        <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
        <h3 className="font-semibold text-text-primary">AI-powered scope guide</h3>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
          Claude
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-subtle">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSection(tab.id)}
            className={`flex-1 px-3 py-3 text-xs font-medium transition-colors ${
              section === tab.id
                ? 'text-accent border-b-2 border-accent bg-accent/5'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ul className="p-5 space-y-2.5">
        {activeTab.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              section === 'avoid' ? 'bg-danger' : 'bg-accent'
            }`} />
            <p className="text-sm text-text-secondary leading-relaxed">{item}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
