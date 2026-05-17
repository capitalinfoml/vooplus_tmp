'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import type { PriceResult, ServiceType } from '@/types'
import { SERVICE_CATALOG } from '@/lib/service-types'
import { displayPrice } from '@/lib/currency-rates'
import { getCountryByCode } from '@/lib/countries'

type Theme = 'dark' | 'light'

// Retina canvas: 2× physical
const W = 1200
const H = 628
const SCALE = 2

interface RateCardConfig {
  businessName: string
  serviceLabel: string
  country: string
  currency: string
  lowUsd: number
  recommendedUsd: number
  premiumUsd: number
  deliverables: string[]
  theme: Theme
  unitLabel: string
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawDark(ctx: CanvasRenderingContext2D, cfg: RateCardConfig) {
  // Background
  ctx.fillStyle = '#0a0a0f'
  ctx.fillRect(0, 0, W, H)

  // Subtle grid texture
  ctx.strokeStyle = 'rgba(255,255,255,0.02)'
  ctx.lineWidth = 1
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  }
  for (let y = 0; y < H; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  }

  // Top gradient bar
  const bar = ctx.createLinearGradient(0, 0, W, 0)
  bar.addColorStop(0, '#f59e0b')
  bar.addColorStop(1, '#f97316')
  ctx.fillStyle = bar
  ctx.fillRect(0, 0, W, 5)

  // Glow orb behind price
  const glow = ctx.createRadialGradient(900, 300, 0, 900, 300, 300)
  glow.addColorStop(0, 'rgba(245,158,11,0.08)')
  glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow
  ctx.fillRect(600, 0, W, H)

  // Business name
  ctx.fillStyle = '#64748b'
  ctx.font = 'bold 15px Arial, Helvetica, sans-serif'
  ctx.letterSpacing = '2px'
  ctx.fillText(cfg.businessName.toUpperCase(), 60, 80)
  ctx.letterSpacing = '0px'

  // Drone icon (simple SVG path drawn as canvas)
  ctx.strokeStyle = '#f59e0b'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(48, 72, 6, 0, Math.PI * 2)
  ctx.stroke()

  // Service title
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 56px Arial, Helvetica, sans-serif'
  const titleLines = cfg.serviceLabel.length > 20
    ? [cfg.serviceLabel.slice(0, cfg.serviceLabel.lastIndexOf(' ', 20)), cfg.serviceLabel.slice(cfg.serviceLabel.lastIndexOf(' ', 20) + 1)]
    : [cfg.serviceLabel]
  titleLines.forEach((line, i) => ctx.fillText(line, 60, 155 + i * 65))

  const titleBottom = 155 + titleLines.length * 65

  // Country badge
  const country = getCountryByCode(cfg.country)
  if (country) {
    ctx.fillStyle = 'rgba(255,255,255,0.06)'
    roundRect(ctx, 60, titleBottom + 10, 140, 34, 8)
    ctx.fill()
    ctx.fillStyle = '#94a3b8'
    ctx.font = '15px Arial, Helvetica, sans-serif'
    ctx.fillText(`${country.emoji}  ${country.name}`, 76, titleBottom + 32)
  }

  // Price range
  const priceGrad = ctx.createLinearGradient(60, 0, 500, 0)
  priceGrad.addColorStop(0, '#f59e0b')
  priceGrad.addColorStop(1, '#fb923c')
  ctx.fillStyle = priceGrad
  ctx.font = 'bold 52px Arial, Helvetica, sans-serif'
  const lowStr = displayPrice(cfg.lowUsd, cfg.currency)
  const highStr = displayPrice(cfg.premiumUsd, cfg.currency)
  ctx.fillText(`${lowStr} – ${highStr}`, 60, titleBottom + 90)

  ctx.fillStyle = '#64748b'
  ctx.font = '14px Arial, Helvetica, sans-serif'
  ctx.fillText(cfg.unitLabel.toUpperCase(), 60, titleBottom + 115)

  // Deliverables
  const dlY = titleBottom + 150
  ctx.fillStyle = '#94a3b8'
  ctx.font = 'bold 11px Arial, Helvetica, sans-serif'
  ctx.letterSpacing = '1.5px'
  ctx.fillText('WHAT\'S INCLUDED', 60, dlY)
  ctx.letterSpacing = '0px'

  cfg.deliverables.slice(0, 4).forEach((d, i) => {
    const y = dlY + 24 + i * 28

    // Dot
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.arc(67, y - 5, 3, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#e2e8f0'
    ctx.font = '16px Arial, Helvetica, sans-serif'
    ctx.fillText(d, 82, y)
  })

  // Right panel: CTA box
  ctx.fillStyle = 'rgba(245,158,11,0.08)'
  roundRect(ctx, W - 340, 60, 280, 130, 12)
  ctx.fill()
  ctx.strokeStyle = 'rgba(245,158,11,0.3)'
  ctx.lineWidth = 1
  roundRect(ctx, W - 340, 60, 280, 130, 12)
  ctx.stroke()

  ctx.fillStyle = '#f59e0b'
  ctx.font = 'bold 20px Arial, Helvetica, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Get a custom quote', W - 200, 115)
  ctx.fillStyle = '#94a3b8'
  ctx.font = '14px Arial, Helvetica, sans-serif'
  ctx.fillText('Contact us for your project', W - 200, 140)
  ctx.textAlign = 'left'

  // Recommended price highlight (right side)
  ctx.fillStyle = 'rgba(255,255,255,0.04)'
  roundRect(ctx, W - 340, 220, 280, 180, 12)
  ctx.fill()

  ctx.fillStyle = '#64748b'
  ctx.font = 'bold 10px Arial, Helvetica, sans-serif'
  ctx.letterSpacing = '1.5px'
  ctx.textAlign = 'center'
  ctx.fillText('RECOMMENDED PRICE', W - 200, 250)
  ctx.letterSpacing = '0px'

  ctx.fillStyle = '#f8fafc'
  ctx.font = 'bold 38px Arial, Helvetica, sans-serif'
  ctx.fillText(displayPrice(cfg.recommendedUsd, cfg.currency), W - 200, 305)

  ctx.fillStyle = '#475569'
  ctx.font = '13px Arial, Helvetica, sans-serif'
  ctx.fillText(cfg.unitLabel, W - 200, 330)

  ctx.textAlign = 'left'

  // Footer
  ctx.fillStyle = '#1e1e2e'
  ctx.fillRect(0, H - 48, W, 48)

  ctx.fillStyle = '#334155'
  ctx.font = '13px Arial, Helvetica, sans-serif'
  ctx.fillText('Built with DroneFee.com', 60, H - 18)

  ctx.fillStyle = '#334155'
  ctx.font = '13px Arial, Helvetica, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('Professional drone pricing', W - 60, H - 18)
  ctx.textAlign = 'left'
}

function drawLight(ctx: CanvasRenderingContext2D, cfg: RateCardConfig) {
  // Background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)

  // Left accent column
  const col = ctx.createLinearGradient(0, 0, 0, H)
  col.addColorStop(0, '#f59e0b')
  col.addColorStop(1, '#f97316')
  ctx.fillStyle = col
  ctx.fillRect(0, 0, 6, H)

  // Business name
  ctx.fillStyle = '#94a3b8'
  ctx.font = 'bold 14px Arial, Helvetica, sans-serif'
  ctx.letterSpacing = '2px'
  ctx.fillText(cfg.businessName.toUpperCase(), 60, 75)
  ctx.letterSpacing = '0px'

  // Service title
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 54px Arial, Helvetica, sans-serif'
  const titleLines = cfg.serviceLabel.length > 20
    ? [cfg.serviceLabel.slice(0, cfg.serviceLabel.lastIndexOf(' ', 20)), cfg.serviceLabel.slice(cfg.serviceLabel.lastIndexOf(' ', 20) + 1)]
    : [cfg.serviceLabel]
  titleLines.forEach((line, i) => ctx.fillText(line, 60, 148 + i * 62))

  const titleBottom = 148 + titleLines.length * 62

  // Country
  const country = getCountryByCode(cfg.country)
  if (country) {
    ctx.fillStyle = '#f1f5f9'
    roundRect(ctx, 60, titleBottom + 8, 140, 30, 6)
    ctx.fill()
    ctx.fillStyle = '#64748b'
    ctx.font = '14px Arial, Helvetica, sans-serif'
    ctx.fillText(`${country.emoji}  ${country.name}`, 74, titleBottom + 27)
  }

  // Price range
  ctx.fillStyle = '#f59e0b'
  ctx.font = 'bold 50px Arial, Helvetica, sans-serif'
  ctx.fillText(`${displayPrice(cfg.lowUsd, cfg.currency)} – ${displayPrice(cfg.premiumUsd, cfg.currency)}`, 60, titleBottom + 90)

  ctx.fillStyle = '#94a3b8'
  ctx.font = '13px Arial, Helvetica, sans-serif'
  ctx.fillText(cfg.unitLabel.toUpperCase(), 60, titleBottom + 114)

  // Separator line
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(60, titleBottom + 135)
  ctx.lineTo(580, titleBottom + 135)
  ctx.stroke()

  // Deliverables
  const dlY = titleBottom + 163
  cfg.deliverables.slice(0, 4).forEach((d, i) => {
    const y = dlY + i * 28
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.arc(68, y - 5, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#334155'
    ctx.font = '16px Arial, Helvetica, sans-serif'
    ctx.fillText(d, 84, y)
  })

  // Right panel CTA
  ctx.fillStyle = '#0f172a'
  roundRect(ctx, W - 340, 60, 280, 130, 14)
  ctx.fill()

  ctx.fillStyle = '#f59e0b'
  ctx.font = 'bold 20px Arial, Helvetica, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Get a custom quote', W - 200, 115)
  ctx.fillStyle = '#94a3b8'
  ctx.font = '14px Arial, Helvetica, sans-serif'
  ctx.fillText('Contact us for your project', W - 200, 140)
  ctx.textAlign = 'left'

  // Recommended price right panel
  ctx.fillStyle = '#f8fafc'
  roundRect(ctx, W - 340, 220, 280, 180, 14)
  ctx.fill()
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1.5
  roundRect(ctx, W - 340, 220, 280, 180, 14)
  ctx.stroke()

  ctx.fillStyle = '#94a3b8'
  ctx.font = 'bold 10px Arial, Helvetica, sans-serif'
  ctx.letterSpacing = '1.5px'
  ctx.textAlign = 'center'
  ctx.fillText('RECOMMENDED PRICE', W - 200, 250)
  ctx.letterSpacing = '0px'

  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 36px Arial, Helvetica, sans-serif'
  ctx.fillText(displayPrice(cfg.recommendedUsd, cfg.currency), W - 200, 304)

  ctx.fillStyle = '#94a3b8'
  ctx.font = '13px Arial, Helvetica, sans-serif'
  ctx.fillText(cfg.unitLabel, W - 200, 328)

  ctx.textAlign = 'left'

  // Footer
  ctx.fillStyle = '#f1f5f9'
  ctx.fillRect(0, H - 44, W, 44)

  ctx.fillStyle = '#94a3b8'
  ctx.font = '13px Arial, Helvetica, sans-serif'
  ctx.fillText('Built with DroneFee.com', 60, H - 16)

  ctx.textAlign = 'right'
  ctx.fillText('Professional drone pricing', W - 60, H - 16)
  ctx.textAlign = 'left'
}

interface Props {
  result: PriceResult
  serviceType: ServiceType
  country: string
}

export function RateCardGenerator({ result, serviceType, country }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [theme, setTheme] = useState<Theme>('dark')
  const [businessName, setBusinessName] = useState('')
  const [copied, setCopied] = useState(false)

  const serviceInfo = SERVICE_CATALOG[serviceType]

  // Load persisted business name
  useEffect(() => {
    try {
      const saved = localStorage.getItem('df_business_name')
      if (saved) setBusinessName(saved)
    } catch {}
  }, [])

  const saveBusinessName = (name: string) => {
    setBusinessName(name)
    try { localStorage.setItem('df_business_name', name) } catch {}
  }

  const cfg: RateCardConfig = {
    businessName: businessName || 'Your Business',
    serviceLabel: serviceInfo.label,
    country,
    currency: result.currency,
    lowUsd: result.lowUsd,
    recommendedUsd: result.recommendedUsd,
    premiumUsd: result.premiumUsd,
    deliverables: serviceInfo.deliverables.slice(0, 4).map((d) =>
      d.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    ),
    theme,
    unitLabel: result.unitLabel,
  }

  const drawCard = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, W * SCALE, H * SCALE)
    ctx.save()
    ctx.scale(SCALE, SCALE)
    if (theme === 'dark') drawDark(ctx, cfg)
    else drawLight(ctx, cfg)
    ctx.restore()
  }, [theme, cfg])

  useEffect(() => {
    drawCard()
  }, [drawCard])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `dronefee-rate-card-${serviceType}-${country.toLowerCase()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const shareText = `Here's what I charge for ${serviceInfo.label} in ${getCountryByCode(country)?.name ?? country}:\n\n💰 ${displayPrice(result.lowUsd, result.currency)} – ${displayPrice(result.premiumUsd, result.currency)} ${result.unitLabel}\n\nCalculated with DroneFee.com — the free pricing tool for drone operators.`

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border-subtle flex items-center gap-3 flex-wrap">
        <div>
          <h3 className="font-semibold text-text-primary">Rate Card Generator</h3>
          <p className="text-xs text-text-muted mt-0.5">Download & share your pricing</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* Theme toggle */}
          <div className="flex rounded-lg border border-border-subtle overflow-hidden">
            {(['dark', 'light'] as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  theme === t ? 'bg-accent text-bg-base' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {t === 'dark' ? '🌙 Dark' : '☀️ Light'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Business name input */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Business name (shown on card)</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => saveBusinessName(e.target.value)}
            placeholder="Your Business Name"
            className="w-full px-4 py-2.5 rounded-lg bg-bg-elevated border border-border-subtle text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none text-sm transition-colors"
          />
        </div>

        {/* Canvas preview */}
        <div className="rounded-lg overflow-hidden border border-border-subtle bg-bg-base">
          <canvas
            ref={canvasRef}
            width={W * SCALE}
            height={H * SCALE}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            aria-label="Rate card preview"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-amber text-bg-base text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download PNG
          </button>

          <button
            onClick={handleCopyShare}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border-subtle text-text-secondary text-sm font-medium hover:border-border-strong hover:text-text-primary transition-all"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
                </svg>
                Copy share text
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-text-muted">
          Card exports at 2× resolution (2400×1256px) for crisp display on all screens.
        </p>
      </div>
    </div>
  )
}
