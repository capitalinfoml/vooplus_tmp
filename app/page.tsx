import { redirect } from 'next/navigation'

// Phase 1: redirect to calculator — landing page built in Phase 5
export default function Home() {
  redirect('/calculate')
}
