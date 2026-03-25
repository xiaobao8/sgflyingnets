'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogOut, Settings, ChevronRight, Mail, FileText, ExternalLink, Wrench, Shield, Image, Briefcase, MessageSquare, Search, Cpu, Users, BarChart3, RefreshCw } from 'lucide-react'
import Link from 'next/link'

// 按业务分组：网站内容管理 / 业务数据中心 / AI营销配置 / 系统设置
const SECTION_GROUPS = [
  {
    title: '网站内容管理',
    items: [
      { id: 'layout', label: '布局管理', href: '/admin/layout', icon: Settings },
      { id: 'hero_section', label: '首屏 Hero', href: '/admin/hero', icon: Image },
      { id: 'about_section', label: '关于我们', href: '/admin/about', icon: Settings },
      { id: 'products', label: '产品介绍', href: '/admin/products', icon: Settings },
      { id: 'services', label: '服务内容', href: '/admin/services', icon: Settings },
      { id: 'certifications', label: '资质认证', href: '/admin/certifications', icon: Settings },
      { id: 'success_stories', label: '成功案例', href: '/admin/stories', icon: Settings },
      { id: 'partnerships', label: '合作模式', href: '/admin/partnerships', icon: Settings },
      { id: 'offices', label: '办公室', href: '/admin/offices', icon: Settings },
      { id: 'contact_info', label: '联系信息', href: '/admin/contact', icon: Settings },
    ],
  },
  {
    title: '业务数据中心',
    items: [
      { id: 'submissions', label: '表单提交', href: '/admin/submissions', icon: FileText },
      { id: 'media', label: '媒体库', href: '/admin/media', icon: Image },
      { id: 'stats', label: '核心数据', href: '/admin/stats', icon: BarChart3 },
    ],
  },
  {
    title: 'AI 营销配置',
    items: [
      { id: 'ai', label: 'AI 基础设置', href: '/admin/ai', icon: MessageSquare },
      { id: 'ai_prompts', label: '提示词管理', href: '/admin/ai/prompts', icon: Settings },
      { id: 'ai_knowledge', label: '知识库管理', href: '/admin/ai/knowledge', icon: Settings },
      { id: 'materials', label: '材料库管理', href: '/admin/materials', icon: FileText },
      { id: 'ai_config', label: 'LLM 配置', href: '/admin/ai/config', icon: Cpu },
      { id: 'ai_sales', label: '内部销售邮箱', href: '/admin/ai/sales', icon: Users },
    ],
  },
  {
    title: '系统设置',
    items: [
      { id: 'site_config', label: '网站配置', href: '/admin/config', icon: Wrench },
      { id: 'account', label: '账号安全', href: '/admin/account', icon: Shield },
      { id: 'sync_status', label: '同步状态', href: '/admin/sync', icon: RefreshCw },
    ],
  },
]

type Stats = {
  submissions: { total: number; contact: number; partnership: number; today: number; week: number }
  smtpConfigured: boolean
  contactEmail: string
  partnershipEmail: string
}

type AiStats = { daily?: number; monthly?: number } | null

export default function AdminPage() {
  const router = useRouter()
  const [auth, setAuth] = useState<{ authenticated: boolean } | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [aiStats, setAiStats] = useState<AiStats>(null)

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setAuth(data)
        if (!data.authenticated) router.push('/admin/login')
      })
      .catch(() => router.push('/admin/login'))
  }, [router])

  useEffect(() => {
    if (auth?.authenticated) {
      fetch('/api/admin/stats', { credentials: 'include' })
        .then(res => res.json())
        .then(d => setStats(d))
        .catch(() => setStats(null))
      fetch('/api/ai/proxy?path=' + encodeURIComponent('/api/token-usage'), { credentials: 'include' })
        .then(res => res.json())
        .then(d => setAiStats(d))
        .catch(() => setAiStats(null))
    }
  }, [auth?.authenticated])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    router.push('/admin/login')
  }

  if (!auth?.authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-10 h-10 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
      </div>
    )
  }

  const cardBase = 'admin-card bg-white border border-slate-200/80 rounded-2xl p-6 min-h-[128px] flex flex-col justify-between hover:border-slate-300'

  return (
    <div className="min-h-screen">
      {/* 顶部导航区 */}
      <header className="sticky top-0 z-50 h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 admin-header">
        <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Flyingnets</h1>
        <div className="hidden sm:flex items-center gap-4 flex-1 max-w-sm lg:max-w-md mx-6">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="搜索模块..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-shadow"
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Link href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
            <ExternalLink size={16} /> 查看网站
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
            <LogOut size={18} />
            退出
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* 仪表盘 */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h2 className="admin-section-title text-slate-900 text-xl mb-6">仪表盘</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <Link href="/admin/submissions" className={cardBase}>
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-3">
                <FileText size={18} className="text-slate-400" /> 表单提交
              </div>
              <div className="text-2xl font-semibold text-slate-900 tracking-tight">{stats?.submissions?.total ?? '-'}</div>
              <div className="text-xs text-slate-400 mt-2">今日 +{stats?.submissions?.today ?? 0}</div>
            </Link>
            <Link href="/admin/submissions?type=contact" className={cardBase}>
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-3">
                <Mail size={18} className="text-slate-400" /> 联系表单
              </div>
              <div className="text-2xl font-semibold text-slate-900 tracking-tight">{stats?.submissions?.contact ?? '-'}</div>
              <div className="text-xs text-slate-400 mt-2">本周 +{stats?.submissions?.week ?? 0}</div>
            </Link>
            <Link href="/admin/submissions?type=partnership" className={cardBase}>
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-3">
                <Briefcase size={18} className="text-slate-400" /> 合作登记
              </div>
              <div className="text-2xl font-semibold text-slate-900 tracking-tight">{stats?.submissions?.partnership ?? '-'}</div>
            </Link>
            <Link href="/admin/ai/config" className={cardBase}>
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-3">邮件配置</div>
              <div className={`text-sm font-semibold ${stats?.smtpConfigured ? 'text-emerald-600' : 'text-amber-600'}`}>
                {stats?.smtpConfigured ? '已配置' : '未配置'}
              </div>
              <div className="text-xs text-slate-400 mt-2 truncate" title={stats?.contactEmail || stats?.partnershipEmail}>
                {stats?.contactEmail || stats?.partnershipEmail || '请配置 SMTP'}
              </div>
            </Link>
            <Link href="/admin/ai" className={cardBase}>
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-3">
                <MessageSquare size={18} className="text-slate-400" /> AI 咨询量
              </div>
              <div className="text-2xl font-semibold text-slate-900 tracking-tight">-</div>
              <div className="text-xs text-slate-400 mt-2">悬浮球对话</div>
            </Link>
            <Link href="/admin/ai/data" className={cardBase}>
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-3">
                <Cpu size={18} className="text-slate-400" /> Token 消耗
              </div>
              <div className="text-2xl font-semibold text-slate-900 tracking-tight">{aiStats ? (aiStats.daily ?? '-') : '-'}</div>
              <div className="text-xs text-slate-400 mt-2">今日 / 本月 {(aiStats?.monthly ?? '-')}</div>
            </Link>
          </div>
          <div className="mt-6 h-44 admin-card bg-white border border-slate-200/80 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
            数据趋势图表占位
          </div>
        </motion.section>

        <hr className="border-slate-200 my-10" />

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-10"
        >
          <h2 className="admin-section-title text-slate-900 text-xl mb-6">快捷操作</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/submissions"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium text-sm shadow-sm"
            >
              <FileText size={18} /> 查看表单提交
            </Link>
            <Link
              href="/admin/ai/config"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors font-medium text-slate-700 text-sm admin-card"
            >
              <Mail size={18} /> 邮件与配置
            </Link>
            <Link
              href="/admin/media"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors font-medium text-slate-700 text-sm admin-card"
            >
              <Image size={18} /> 媒体库
            </Link>
            <Link
              href="/admin/ai"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium text-sm shadow-sm"
            >
              <MessageSquare size={18} /> AI 助手配置
            </Link>
          </div>
        </motion.section>

        <hr className="border-slate-200 my-10" />

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="admin-section-title text-slate-900 text-xl mb-6">功能模块</h2>
          <div className="space-y-10">
            {SECTION_GROUPS.map((group, gi) => (
              <div key={group.title}>
                <h3 className="admin-module-title mb-4">{group.title}</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.items.map((s) => {
                    const Icon = s.icon
                    return (
                      <Link
                        key={s.id}
                        href={s.href}
                        className="admin-card flex items-center justify-between p-5 bg-white border border-slate-200/80 rounded-2xl hover:border-slate-300 group min-h-[72px]"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                            <Icon size={20} className="text-slate-600 shrink-0" />
                          </div>
                          <span className="font-medium text-slate-900 text-sm">{s.label}</span>
                        </div>
                        <ChevronRight size={20} className="text-slate-400 group-hover:text-slate-600 shrink-0 transition-colors" />
                      </Link>
                    )
                  })}
                </div>
                {gi < SECTION_GROUPS.length - 1 && <hr className="border-slate-100 mt-10" />}
              </div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  )
}
