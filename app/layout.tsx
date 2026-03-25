import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { LocaleProvider } from '@/components/LocaleProvider'
import { ContentSyncNotifier } from '@/components/ContentSyncNotifier'

// 强制全站动态渲染，确保读取挂载的 data/content.json（含你的图片等修改）
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Flyingnets | AI · Security · Global',
  description: 'Flyingnets — Singapore-headquartered. AI-powered enterprise efficiency and security solutions for enterprises worldwide.',
  keywords: 'Flyingnets, AI, Security, Cloud, Global, Singapore, Enterprise, Efficiency, Solutions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="fonts-loaded">
      <body className="font-sans antialiased bg-cream text-ink-900">
        <Script id="ai-assistant-config" strategy="beforeInteractive">
          {`window.__AI_ASSISTANT_API__="${process.env.NEXT_PUBLIC_AI_ASSISTANT_API || 'https://20.188.26.9:8000'}";`}
        </Script>
        <Script src="/ai-assistant-widget.js" strategy="lazyOnload" />
        <LocaleProvider>
          <ContentSyncNotifier />
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
