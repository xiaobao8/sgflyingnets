import type { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sgflyingnets.com'

const publicRoutes = [
  '',
  '/about',
  '/services',
  '/products',
  '/cases',
  '/certifications',
  '/blog',
  '/contact',
  '/partnership',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return publicRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.8,
  }))
}
