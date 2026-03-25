'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/useTranslations'
import { useLocale } from '@/components/LocaleProvider'

type Product = { id: number; name: string; sort_order?: number }

export function PartnershipForm({ products }: { products: Product[] }) {
  const t = useTranslations()
  const { locale } = useLocale()
  const [form, setForm] = useState({
    company: '',
    contact: '',
    phone: '',
    email: '',
    product_interest: '',
    region: '',
    coop_type: '',
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
      const res = await fetch('/api/submit/partnership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || t.common.submitFailed)
      setSubmitted(true)
      setForm({ company: '', contact: '', phone: '', email: '', product_interest: '', region: '', coop_type: '', message: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.submitFailedRetry)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {submitted ? (
        <div className="py-16 text-center">
          <p className="text-green-600 font-medium text-lg">{t.partnershipForm.successMsg}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">{t.partnershipForm.company}</label>
              <input
                required
                value={form.company}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
                placeholder={t.partnershipForm.companyPlaceholderFull}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">{t.partnershipForm.contact}</label>
              <input
                required
                value={form.contact}
                onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
                placeholder={t.contactForm.contactPlaceholder}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">{t.partnershipForm.phone}</label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
                placeholder={t.contactForm.phonePlaceholder}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">{t.partnershipForm.email}</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
                placeholder="company@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-2">{t.partnershipForm.productInterest}</label>
            <select
              required
              value={form.product_interest}
              onChange={e => setForm(f => ({ ...f, product_interest: e.target.value }))}
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
            >
              <option value="">{t.contactForm.selectPlaceholder}</option>
              {products.map((p) => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-2">{t.partnershipForm.partnerType}</label>
            <select
              value={form.coop_type}
              onChange={e => setForm(f => ({ ...f, coop_type: e.target.value }))}
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
            >
              <option value="">{t.contactForm.selectPlaceholder}</option>
              <option value="分销代理商">{t.partnershipForm.distributor}</option>
              <option value="MSP 代理商">{t.partnershipForm.msp}</option>
              <option value="OEM 合作">{t.partnershipForm.oem}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-2">{t.partnershipForm.targetRegion}</label>
            <input
              value={form.region}
              onChange={e => setForm(f => ({ ...f, region: e.target.value }))}
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
              placeholder={t.partnershipForm.regionPlaceholder}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-2">{t.partnershipForm.supplement}</label>
            <textarea
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
              placeholder={t.partnershipForm.supplementPlaceholder}
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-ink-900 text-cream rounded-lg hover:bg-ink-800 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send size={20} />
            {submitting ? t.common.sending : t.partnershipForm.submit}
          </button>
        </form>
      )}
    </div>
  )
}
