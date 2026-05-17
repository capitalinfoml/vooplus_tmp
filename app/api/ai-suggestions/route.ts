import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { JobProfile, AISuggestionsResult } from '@/types'
import { SERVICE_CATALOG } from '@/lib/service-types'
import { getCountryByCode } from '@/lib/countries'
import { displayPrice } from '@/lib/currency-rates'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'AI suggestions unavailable — ANTHROPIC_API_KEY not configured' },
      { status: 503 },
    )
  }

  let profile: JobProfile
  let recommendedUsd: number
  try {
    const body = await req.json()
    profile = body.profile as JobProfile
    recommendedUsd = body.recommendedUsd as number
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const service = SERVICE_CATALOG[profile.serviceType]
  const country = getCountryByCode(profile.country)
  const price = displayPrice(recommendedUsd, profile.currency || 'USD')

  const userPrompt = `
Job profile:
- Service: ${service.label}
- Country: ${country?.name ?? profile.country}
- Experience level: ${profile.experienceLevel}
- Recommended price: ${price}
- Job details: ${JSON.stringify(profile.details)}

Given this drone job profile, list 5-7 professional deliverables to include at the recommended price point. JSON only: {"deliverables": string[], "upsells": string[], "what_to_avoid_including": string[]}. Be specific, not generic.`

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 800,
      system:
        'Given this drone job profile, list 5-7 professional deliverables to include at the recommended price point. JSON only: {"deliverables": string[], "upsells": string[], "what_to_avoid_including": string[]}. Be specific, not generic.',
      messages: [{ role: 'user', content: userPrompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')

    const result: AISuggestionsResult = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)
  } catch (err) {
    console.error('AI suggestions error:', err)
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 })
  }
}
