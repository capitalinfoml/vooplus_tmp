import type { Metadata } from 'next'
import { CalculatorWizard } from '@/components/calculator/CalculatorWizard'

export const metadata: Metadata = {
  title: 'Drone Rate Calculator — DroneFee',
  description:
    'Calculate professional drone service rates for your market. Real estate, events, inspection, mapping, construction, and film. Free, instant, no sign-up.',
}

export default function CalculatePage() {
  return <CalculatorWizard />
}
