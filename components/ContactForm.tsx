'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/useTranslations'
import { useLocale } from '@/components/LocaleProvider'

type Product = { id: number; name: string; sort_order: number }

export function ContactForm({ products }: { products: Product[] }) {
  const t = useTranslations()
  const { locale } = useLocale()
  const [form, setForm] = useState({
    company: '',
    contact: '',
    phone: '',
    email: '',
    product_interest: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/submit/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || t.common.submitFailed)
      setSubmitted(true)
      setForm({ company: '', contact: '', phone: '', email: '', product_interest: '', message: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.submitFailedRetry)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white border border-ink-200 rounded-2xl p-10 shadow-sm">
      <h3 className="font-serif text-2xl font-bold text-ink-900 mb-6">{t.contactForm.title}</h3>
      {submitted ? (
        <div className="py-12 text-center">
          <p className="text-green-600 font-medium text-lg">{t.contactForm.successMsg}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-2">{t.contactForm.company}</label>
            <input
              required
              value={form.company}
              onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
              placeholder={t.contactForm.companyPlaceholder}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">{t.contactForm.contact}</label>
              <input
                required
                value={form.contact}
                onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
                placeholder={t.contactForm.contactPlaceholder}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">{t.contactForm.phone}</label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
                placeholder={t.contactForm.phonePlaceholder}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-2">{t.contactForm.email}</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
              placeholder="company@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-2">{t.contactForm.productInterest}</label>
            <select
              value={form.product_interest}
              onChange={e => setForm(f => ({ ...f, product_interest: e.target.value }))}
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
            >
              <option value="">{t.contactForm.selectPlaceholder}</option>
              <option value="云服务">{t.contactForm.cloudService}</option>
              <option value="安全服务">{t.contactForm.securityService}</option>
              <option value="企业AI化服务">{t.contactForm.aiService}</option>
              <option value="Microsoft服务">{t.contactForm.microsoftService}</option>
              {products.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-2">{t.contactForm.message}</label>
            <textarea
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
              placeholder={t.contactForm.messagePlaceholder}
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-ink-900 text-cream rounded-lg hover:bg-ink-800 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send size={20} />
            {submitting ? t.common.sending : t.common.submit}
          </button>
        </form>
      )}
    </div>
  )
}
