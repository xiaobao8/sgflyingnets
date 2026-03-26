import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  redirect('/contact')
}
