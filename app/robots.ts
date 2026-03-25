import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    sitemap: 'https://www.sgflyingnets.com/sitemap.xml',
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*'],
      },
    ],
  }
}
