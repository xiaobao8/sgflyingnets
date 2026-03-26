import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { LocaleProvider } from '@/components/LocaleProvider'
import { ContentSyncNotifier } from '@/components/ContentSyncNotifier'

// 强制全站动态渲染，确保读取挂载的 data/content.json（含你的图片等修改）
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.sgflyingnets.com'),
  title: 'FLYINGNETS株式会社 | 日本・東京 | Microsoft Security・SOC・MSSP',
  description: 'FLYINGNETS株式会社は東京を拠点に、Microsoft Securityを基盤としたSOC・MDR・MSSPサービスを提供しています。Azure Expert MSPとして、日本企業のセキュリティ強化とDX推進を支援します。',
  keywords: 'FLYINGNETS,日本,東京,Microsoft Security,SOC,MDR,MSSP,Azure Expert MSP,AI,サイバーセキュリティ',
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
          {`window.__AI_ASSISTANT_API__="${process.env.NEXT_PUBLIC_AI_ASSISTANT_API || 'https://www.sgflyingnets.com'}";`}
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
