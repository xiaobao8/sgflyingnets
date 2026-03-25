'use client'

import Link from 'next/link'
import { useTranslations } from '@/lib/i18n/useTranslations'

export function Footer({ config }: { config: Record<string, string> }) {
  const t = useTranslations()
  const copyright = config.copyright || '© 2026 Flyingnets'
  const tagline = config.tagline || 'AI · Security · Global'

  return (
    <footer className="bg-ink-950 text-cream py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <p className="font-display font-semibold text-lg">{config.company_name || 'Flyingnets'}</p>
            <p className="text-ink-400 text-sm mt-2">{tagline}</p>
          </div>
          <div>
            <p className="text-ink-500 text-sm font-medium mb-4">{t.footer.quickLinks}</p>
            <div className="flex flex-col gap-2">
              <Link href="/services" className="text-ink-400 hover:text-gold-400 text-sm transition-colors">{t.nav.services}</Link>
              <Link href="/products" className="text-ink-400 hover:text-gold-400 text-sm transition-colors">{t.nav.products}</Link>
              <Link href="/certifications" className="text-ink-400 hover:text-gold-400 text-sm transition-colors">{t.nav.certifications}</Link>
              <Link href="/cases" className="text-ink-400 hover:text-gold-400 text-sm transition-colors">{t.nav.cases}</Link>
              <Link href="/contact" className="text-ink-400 hover:text-gold-400 text-sm transition-colors">{t.nav.about}</Link>
              <Link href="/partnership" className="text-ink-400 hover:text-gold-400 text-sm transition-colors">{t.nav.partnership}</Link>
            </div>
          </div>
          <div>
            <p className="text-ink-500 text-sm font-medium mb-4">{t.footer.contactUs}</p>
            {/* <p className="text-ink-400 text-sm">+86-400-960-8690</p> */}
            <a href="mailto:sales@sgflyingnets.com" className="text-ink-400 hover:text-gold-400 text-sm block mt-2 transition-colors">sales@sgflyingnets.com</a>
          </div>
          <div>
            <p className="text-ink-500 text-sm font-medium mb-4">{t.footer.globalOffices}</p>
            <p className="text-ink-400 text-sm">{t.footer.officesList}</p>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-ink-800 text-center">
          <p className="text-ink-500 text-sm">{copyright}</p>
        </div>
      </div>
    </footer>
  )
}
