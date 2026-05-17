import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { calculatePrice } from '@/lib/calculate-price'
import { getCurrencyForCountry } from '@/lib/currency-rates'
import type { JobProfile } from '@/types'
import { ResultsView } from '@/components/results/ResultsView'

interface Props {
  searchParams: { d?: string }
}

function parseProfile(encoded: string): JobProfile | null {
  try {
    const json = Buffer.from(decodeURIComponent(encoded), 'base64').toString('utf-8')
    return JSON.parse(json) as JobProfile
  } catch {
    return null
  }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return {
    title: 'Your Drone Rates — DroneFee',
    description: 'Your personalised drone service price calculation based on market benchmarks.',
  }
}

export default function ResultsPage({ searchParams }: Props) {
  const { d } = searchParams

  if (!d) redirect('/calculate')

  const profile = parseProfile(d)
  if (!profile) redirect('/calculate')

  // Ensure currency is set
  if (!profile.currency) {
    profile.currency = getCurrencyForCountry(profile.country)
  }

  // Run calculation server-side (satisfies JS-disabled SSR requirement for benchmarks)
  const result = calculatePrice(profile)

  return <ResultsView result={result} profile={profile} />
}
