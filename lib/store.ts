import fs from 'fs'
import path from 'path'
import { invalidateContent } from './sync'

// 支持环境变量 DATA_DIR（Docker 部署时设为 /app/data）
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data')
const DB_FILE = path.join(DATA_DIR, 'content.json')

export type LayoutSection = { id: string; label: string; visible: boolean; sort_order: number }

export type Store = {
  site_config: Record<string, string> & { contact_email?: string; partnership_email?: string }
  layout_config: LayoutSection[]
  hero_section: { id: number; title: string; subtitle: string; tagline: string; cta_text?: string; cta_link?: string; background_image?: string; sort_order: number }[]
  stats: { id: number; label: string; value: string; suffix?: string; section: string; sort_order: number }[]
  about_section: { id: number; title: string; content: string; image_url?: string; sort_order: number }[]
  services: { id: number; title: string; subtitle: string; description: string; features: string[]; icon: string; image_url?: string; sort_order: number }[]
  products: { id: number; name: string; tagline: string; description: string; features: string[]; highlights: string[]; image_url?: string; sort_order: number }[]
  certifications: { id: number; name: string; description: string; badge_text?: string; logo_url?: string; image_url?: string; sort_order: number }[]
  success_stories: { id: number; client_name: string; industry: string; service_type: string; requirements: string; solution: string; results: string[]; image_url?: string; sort_order: number }[]
  partnerships: { id: number; title: string; partner_profile: string; cooperation_content?: string; options?: { name: string; desc: string }[]; support: string[]; sort_order: number }[]
  offices: { id: number; city: string; country: string; is_24_7: number; sort_order: number }[]
  contact_info: { id: number; type: string; label: string; value: string; sort_order: number }[]
  admins: { id: number; username: string; password_hash: string }[]
}

const DEFAULT_LAYOUT: LayoutSection[] = [
  { id: 'hero', label: '首屏', visible: true, sort_order: 0 },
  { id: 'about', label: '关于我们', visible: true, sort_order: 1 },
  { id: 'services', label: '服务', visible: true, sort_order: 2 },
  { id: 'products', label: '产品', visible: true, sort_order: 3 },
  { id: 'certifications', label: '资质', visible: true, sort_order: 4 },
  { id: 'stories', label: '案例', visible: true, sort_order: 5 },
  { id: 'partnership', label: '合作', visible: true, sort_order: 6 },
  { id: 'blog', label: '博客', visible: true, sort_order: 7 },
  { id: 'contact', label: '联系', visible: true, sort_order: 8 },
]

const defaultStore: Store = {
  site_config: {
    company_name: 'Flyingnets Technology Co., Ltd.',
    tagline: 'AI · Security · Cloud',
    copyright: '© 2026 Flyingnets Technology Co., Ltd.',
    seo_title: 'Flyingnets | AI · Security · Cloud',
    seo_description: 'Flyingnets Technology - AI-empowered one-stop IT solution. Cloud, Security, and AI services for enterprise.',
    primary_color: '#b8954a',
    hero_layout: 'center',
    contact_email: 'sales@sgflyingnets.com',
    partnership_email: 'partner@sgflyingnets.com',
    note_rss_url: 'https://note.com/flyingnets/rss',
  },
  layout_config: DEFAULT_LAYOUT,
  hero_section: [{
    id: 1,
    title: 'FLYINGNETS',
    subtitle: 'Technology Co., Ltd.',
    tagline: 'AI · Security · Cloud — Your Trusted Partner',
    cta_text: '探索服务',
    cta_link: '#services',
    sort_order: 0,
  }],
  stats: [
    { id: 1, label: 'Years Industry Expertise', value: '15+', suffix: '', section: 'hero', sort_order: 0 },
    { id: 2, label: 'Enterprise Clients Trust', value: '500+', suffix: '', section: 'hero', sort_order: 1 },
    { id: 3, label: 'Global Office Locations', value: '7', suffix: '', section: 'hero', sort_order: 2 },
  ],
  about_section: [{
    id: 1,
    title: 'Company Overview',
    content: `Flyingnets takes cloud, security, and AI as its core service areas, proactively embracing AI technological innovation and strategically positioning itself to seize industry opportunities. Early adoption of the "AI+IT" integration strategy makes AI the core driving force throughout product development, service delivery, and operations, establishing Flyingnets as an "AI-empowered one-stop IT solution" provider.`,
    sort_order: 0,
  }],
  services: [
    { id: 1, title: '云服务', subtitle: 'AI 优化的云管理与成本控制', description: '企业云建设、混合云/多云架构设计、7×24 监控、AI 智能巡检与资源优化。', features: ['架构与迁移', 'Landing Zone', '7×24 监控', 'AI 资源优化', 'AI 合规保障'], icon: 'cloud', sort_order: 0 },
    { id: 2, title: '安全服务', subtitle: 'AI 驱动的威胁检测与事件响应', description: '信息安全咨询、零信任架构设计、7×24 SOC 运营与 AI 威胁检测。', features: ['风险评估', '零信任', '7×24 SOC', 'SIEM', '漏洞管理'], icon: 'shield', sort_order: 1 },
    { id: 3, title: '企业AI化服务', subtitle: '企业 AI 转型一站式服务', description: '基于 Synergy AI、ALL-SOC、ASSA 等产品，提供 AI 员工平台、安全运营中心、AI 安全网关部署。', features: ['AI 员工平台', '安全运营中心', 'AI 安全网关', '多场景 Agent'], icon: 'settings', sort_order: 2 },
    { id: 4, title: 'Microsoft服务', subtitle: '微软全球认证 MSSP 全栈安全托管', description: '飞络作为微软全球认证 MSSP 伙伴，提供 Azure、M365、Sentinel 全栈安全托管服务。', features: ['Azure 云安全', 'M365 Defender', 'Sentinel SOC', '7×24 MDR & SOC'], icon: 'building2', sort_order: 3 },
  ],
  products: [
    { id: 1, name: 'ALL-SOC Platform', tagline: 'AI-powered security operations portal', description: "Flyingnets' core R&D achievement. Compatible with on-premises/cloud/hybrid cloud, full-scenario security operations.", features: ['Log Collection', 'UEBA Analysis', 'Use Case Mgmt', 'Incident Tickets', 'Multi-Language Support'], highlights: ['AI SOC Assistant', 'AI Use Case Generation 300% efficiency', 'AI Incident Analysis 4x faster'], sort_order: 0 },
    { id: 2, name: 'Synergy AI Platform', tagline: 'Customizable AI Agents for enterprise', description: 'Personified AI Agents covering multi-department scenarios. Installable in customer internal environments.', features: ['AI Agent Workflow', 'Knowledge Base', 'Multi-System Integration'], highlights: ['Security Ops', 'Sales Support', 'Customer Service', 'Travel Assistant'], sort_order: 1 },
    { id: 3, name: 'ASSA Gateway', tagline: 'Enterprise AI security gateway', description: 'Protection hub between enterprise AI applications and external LLMs. Enabling enterprises to use AI with confidence.', features: ['Sensitive Data Anonymization', 'Data Leak Prevention', 'LLM Access Control', 'Token Cost Management'], highlights: ['AI Intelligent Anonymization', 'AI Efficiency Optimization', 'Compliance Management'], sort_order: 2 },
  ],
  certifications: [
    { id: 1, name: 'Microsoft Global MSSP', description: 'Only 3 in China. AI products on Microsoft Global Marketplace.', badge_text: 'Only 3 in China', sort_order: 0 },
    { id: 2, name: 'AWS Global MSSP', description: 'Only 3 in China. Comprehensive cloud and security services.', badge_text: 'Only 3 in China', sort_order: 1 },
    { id: 3, name: 'Alibaba Cloud MSP', description: 'International MSP + Well-Architected partner.', badge_text: 'MSP + WA', sort_order: 2 },
    { id: 4, name: 'Splunk MSP', description: 'Only 2 in China. SIEM/SOAR solutions.', badge_text: 'Only 2 in China', sort_order: 3 },
  ],
  success_stories: [
    { id: 1, client_name: "World's Top Consulting Company", industry: 'Consulting', service_type: 'SOC Operations', requirements: 'Automated security log analysis, improved threat detection, reduced manual costs.', solution: 'Deployed ALL-SOC platform with AI threat detection and incident analysis.', results: ['5x Threat Detection', '75% Workload Reduction'], sort_order: 0 },
    { id: 2, client_name: 'Fast-Moving Consumer Goods Manufacturer', industry: 'Manufacturing', service_type: 'Cloud MSP', requirements: '7×24 security monitoring for Alibaba Cloud and Azure, cost optimization.', solution: '7×24 Cloud MSP with AI intelligent ticketing and cost monitoring.', results: ['<1h Response Time', '60% False Positive Reduction'], sort_order: 1 },
    { id: 3, client_name: 'Multinational Enterprise', industry: 'Enterprise', service_type: 'AI Employee', requirements: 'Intelligent travel assistant for employees, automating booking and reimbursement.', solution: 'Customized Travel Assistant Agent with Synergy AI platform.', results: ['80% Booking Efficiency', '50% Labor Cost Savings'], sort_order: 2 },
  ],
  partnerships: [
    { id: 1, title: 'OEM Cooperation', partner_profile: 'Companies with software development capabilities but lacking proprietary AI platform, possessing industry client resources.', cooperation_content: 'Flyingnets provides Synergy AI full authorization; partner handles requirements analysis, localization deployment, and customer service.', support: ['Technical Deployment', 'Product Iterations', '7×24 Fault Response', 'Training Enablement', 'Use Case Library'], sort_order: 0 },
    { id: 2, title: 'SIEM Co-Creation', partner_profile: 'Companies with security capabilities but lacking proprietary SIEM platform and 7×24 SOC operations.', options: [{ name: 'Option A: ALL-SOC OEM', desc: "Full feature authorization, partner's own branding and pricing" }, { name: 'Option B: Joint Delivery', desc: 'Platform + dual-center 7×24 SOC, joint delivery with revenue sharing' }], support: ['White-label Customization', 'AI Agent Customization', 'Continuous Upgrades'], sort_order: 1 },
  ],
  offices: [
    { id: 1, city: 'Shanghai', country: 'China', is_24_7: 0, sort_order: 0 },
    { id: 2, city: 'Beijing', country: 'China', is_24_7: 0, sort_order: 1 },
    { id: 3, city: 'Chengdu', country: 'China', is_24_7: 1, sort_order: 2 },
    { id: 4, city: 'Guangzhou', country: 'China', is_24_7: 0, sort_order: 3 },
    { id: 5, city: 'Hong Kong', country: 'China', is_24_7: 0, sort_order: 4 },
    { id: 6, city: 'Singapore', country: 'Singapore', is_24_7: 0, sort_order: 5 },
    { id: 7, city: 'Tokyo', country: 'Japan', is_24_7: 1, sort_order: 6 },
  ],
  contact_info: [
    // { id: 1, type: 'phone', label: 'Mon-Fri 9:00-18:00', value: '+86-400-960-8690', sort_order: 0 },
    { id: 2, type: 'email', label: 'Business inquiries', value: 'sales@sgflyingnets.com', sort_order: 1 },
    // { id: 3, type: 'website', label: 'Company information', value: 'www.feiluocn.com', sort_order: 2 },
  ],
  admins: [],
}

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

export function readStore(): Store {
  ensureDir()
  if (!fs.existsSync(DB_FILE)) {
    return defaultStore
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8')
    const data = JSON.parse(raw) as Partial<Store>
    return { ...defaultStore, ...data }
  } catch {
    return defaultStore
  }
}

export function writeStore(updates: Partial<Store>) {
  ensureDir()
  const current = readStore()
  const next = { ...current }
  for (const [k, v] of Object.entries(updates)) {
    if (k in next) (next as Record<string, unknown>)[k] = v
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(next, null, 2), 'utf-8')
  invalidateContent('store_write')
}

