'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useTranslations } from '@/lib/i18n/useTranslations'

const navKeys = ['home', 'services', 'products', 'certifications', 'cases', 'about', 'partnership', 'blog'] as const

const navHrefs: Record<string, string> = {
  home: '/',
  services: '/services',
  products: '/products',
  certifications: '/certifications',
  cases: '/cases',
  about: '/contact',
  partnership: '/partnership',
  blog: 'https://note.com/flyingnets',
}

const externalLinks = new Set(['blog'])

export function Navigation({ config }: { config: Record<string, string> }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const t = useTranslations()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const tagline = config.tagline || 'AI · Security · Cloud'

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="relative flex items-center justify-center p-2 rounded-xl transition-all duration-300 group-hover:scale-[1.02] shadow-[0_0_24px_rgba(185,149,74,0.35),0_0_48px_rgba(255,255,255,0.15)] group-hover:shadow-[0_0_32px_rgba(185,149,74,0.45),0_0_64px_rgba(255,255,255,0.2)]">
            <img
              src="/images/logo.png"
              alt={config.company_name || 'FLYINGNETS'}
              className="h-6 sm:h-7 w-auto max-w-[90px] sm:max-w-[105px] object-contain relative z-10"
            />
          </span>
          <span className={`hidden sm:inline text-xs tracking-widest uppercase group-hover:text-gold-400 transition-colors ${
            scrolled ? 'text-ink-500' : 'text-cream'
          }`}>
            {tagline}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navKeys.map((key) => {
            const href = navHrefs[key]
            const isExternal = externalLinks.has(key)
            const cls = `text-sm font-medium transition-colors tracking-wide ${
              pathname === href ? 'text-gold-400' : scrolled ? 'text-ink-600 hover:text-gold-600' : 'text-ink-300 hover:text-gold-400'
            }`
            return isExternal ? (
              <a key={key} href={href} target="_self" rel="noopener noreferrer" className={cls}>
                {t.nav[key]}
              </a>
            ) : (
              <Link key={key} href={href} className={cls}>
                {t.nav[key]}
              </Link>
            )
          })}
          <LanguageSwitcher variant={scrolled ? 'dark' : 'light'} />
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden p-2 transition-colors ${scrolled ? 'text-ink-700' : 'text-cream'}`}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cream border-t border-ink-200"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navKeys.map((key) => {
                const href = navHrefs[key]
                const isExternal = externalLinks.has(key)
                return isExternal ? (
                  <a
                    key={key}
                    href={href}
                    target="_self"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="text-ink-700 hover:text-gold-600 transition-colors"
                  >
                    {t.nav[key]}
                  </a>
                ) : (
                  <Link
                    key={key}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="text-ink-700 hover:text-gold-600 transition-colors"
                  >
                    {t.nav[key]}
                  </Link>
                )
              })}
              <div className="flex items-center gap-4 pt-2 border-t border-ink-200">
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
