const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data')
const DB_FILE = path.join(DATA_DIR, 'content.json')

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

const layoutConfig = [
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

const store = {
  site_config: {
    company_name: 'Flyingnets Technology Co., Ltd.',
    tagline: 'AI · Security · Cloud',
    copyright: '© 2026 Flyingnets Technology Co., Ltd.',
    seo_title: 'Flyingnets | AI 赋能的云安全与智能运营专家',
    seo_description: 'Flyingnets — 中国仅三家 Microsoft/AWS 全球 MSSP 之一。提供云服务、安全运营、企业 AI 化一站式解决方案，助力 500+ 企业数字化转型。',
    primary_color: '#b8954a',
    hero_layout: 'center',
    contact_email: 'sales@sgflyingnets.com',
    partnership_email: 'partner@sgflyingnets.com',
    note_rss_url: 'https://note.com/flyingnets/rss',
  },
  layout_config: layoutConfig,
  hero_section: [{
    id: 1,
    title: 'FLYINGNETS',
    subtitle: 'Technology Co., Ltd.',
    tagline: '以 AI 重塑云与安全，让企业智能运营更从容',
    cta_text: '探索我们的能力',
    cta_link: '/services',
    background_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
    sort_order: 0,
  }],
  stats: [
    { id: 1, label: '年行业深耕', value: '15+', suffix: '', section: 'hero', sort_order: 0 },
    { id: 2, label: '企业客户信赖', value: '500+', suffix: '', section: 'hero', sort_order: 1 },
    { id: 3, label: '全球办公室', value: '7', suffix: '', section: 'hero', sort_order: 2 },
  ],
  about_section: [{
    id: 1,
    title: 'Flyingnets — AI 赋能的云安全与智能运营专家',
    content: `Flyingnets（Flyingnets Technology）成立于 2010 年，以云、安全、AI 为核心业务，是中国领先的「AI+IT」一体化解决方案提供商。

我们率先将 AI 深度融入产品研发、服务交付与运营全流程，打造「AI 赋能的 IT 一站式解决方案」。从云架构设计、安全运营中心（SOC）到企业 AI 员工平台，Flyingnets以自研 Synergy AI、ALL-SOC、ASSA 等产品矩阵，为金融、制造、咨询、零售等行业客户提供可落地的智能化转型路径。

作为中国仅三家 Microsoft 全球 MSSP、仅三家 AWS 全球 MSSP 之一，Flyingnets与阿里云、Splunk 等建立战略合作，产品已上架 Microsoft 全球市场。我们拥有 7 个全球办公室、130+ 专业团队，为 500+ 企业客户提供 7×24 安全运营与云管理服务。

Flyingnets相信：真正的智能运营，不是堆砌工具，而是让 AI 成为业务的一部分。`,
    image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    sort_order: 0,
  }],
  services: [
    {
      id: 1,
      title: '云服务',
      subtitle: 'AI 优化的云管理与成本控制',
      description: '从企业云建设、混合云/多云架构设计到 Landing Zone 构建，Flyingnets提供全生命周期云管理服务。7×24 监控与 AI 智能巡检，将 4 小时人工工作压缩至 10 分钟；AI 资源优化可降低 30% 过度配置，年节省成本数万至数十万。我们深度服务 AWS、Azure、阿里云等主流云平台，助力企业安全上云、合规用云、智能管云。',
      features: ['云架构设计与迁移', 'Landing Zone 构建', '7×24 监控运维', 'AI 智能巡检', 'AI 资源优化', 'AI 合规保障'],
      icon: 'cloud',
      sort_order: 0,
    },
    {
      id: 2,
      title: '安全服务',
      subtitle: 'AI 驱动的威胁检测与事件响应',
      description: 'Flyingnets提供信息安全咨询、零信任架构设计、7×24 SOC 运营与 AI 威胁检测。基于自研 ALL-SOC 平台，有效告警提升 138%，调查时间减少 87.5%，人工操作减少 75%。我们帮助客户构建纵深防御体系，从风险评估、合规咨询到 SIEM/SOAR 落地，让安全运营从「救火」走向「预见」。',
      features: ['风险评估与合规', '零信任架构', '7×24 SOC 运营', 'SIEM 平台', '漏洞管理', '全链路防护'],
      icon: 'shield',
      sort_order: 1,
    },
    {
      id: 3,
      title: '企业 AI 化服务',
      subtitle: '企业 AI 转型一站式服务',
      description: '基于 Synergy AI、ALL-SOC、ASSA 等自研产品，Flyingnets为企业提供 AI 员工平台部署、安全运营中心建设、AI 安全网关配置。覆盖安全运维、销售支持、客户服务、差旅助理等多部门场景，支持私有化部署与知识库定制。让 AI 真正成为企业的「数字员工」，而非停留在概念验证阶段。',
      features: ['AI 员工平台定制', '安全运营中心', 'AI 安全网关', '多场景 AI Agent', '知识库构建', '7×24 运维支持'],
      icon: 'settings',
      sort_order: 2,
    },
    {
      id: 4,
      title: 'Microsoft服务',
      subtitle: '微软全球认证 MSSP 全栈安全托管',
      description: '飞络作为微软全球认证 MSSP 服务伙伴，依托自身专业的安全服务能力与对微软全系列安全产品的深度理解，聚焦为企业提供全方位、一体化安全托管服务。我们通过标准化、定制化服务，充分盘活微软各类安全产品价值，打通产品协同壁垒，将微软产品的技术优势转化为企业可落地的安全防护能力，助力企业筑牢安全防线、降低安全风险、提升合规水平，为企业数字化转型保驾护航。',
      features: ['Azure 云安全架构与治理', 'M365 Defender 全栈部署', 'Microsoft Purview 数据治理', 'Sentinel SIEM/SOAR 实施', '7×24 MDR & SOC 托管服务'],
      icon: 'building2',
      sort_order: 3,
    },
  ],
  products: [
    {
      id: 1,
      name: 'ALL-SOC Platform',
      tagline: 'AI 驱动的安全运营中心平台',
      description: 'Flyingnets核心自研产品，兼容本地/云/混合云，支持全场景安全运营。集成日志采集、UEBA 分析、用例管理、事件工单、多语言支持。AI SOC 助手将用例生成效率提升 300%，事件分析速度提升 4 倍，让安全团队从重复劳动中解放，聚焦高价值决策。',
      features: ['日志采集与归一化', 'UEBA 用户行为分析', '用例管理与编排', '事件工单与闭环', '多语言支持', 'AI SecOps 智能运营'],
      highlights: ['AI SOC 助手', '用例生成效率提升 300%', '事件分析速度提升 4 倍', 'AI Operator 全自动 SOC'],
      image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
      sort_order: 0,
    },
    {
      id: 2,
      name: 'Synergy AI Platform',
      tagline: '可定制的企业级 AI Agent 平台',
      description: '支持私有化部署的 AI Agent 工作流平台，覆盖安全运维、销售支持、客户服务、差旅助理等多部门场景。内置知识库构建、多系统集成能力，可快速对接企业现有 IT 系统。让每个部门都能拥有专属的「AI 员工」，在合规前提下释放生产力。',
      features: ['AI Agent 工作流', '知识库构建', '多系统集成', '私有化部署', 'AI 员工效能管理'],
      highlights: ['安全运维', '销售支持', '客户服务', '差旅助理', '效能与日志管理'],
      image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
      sort_order: 1,
    },
    {
      id: 3,
      name: 'ASSA Gateway',
      tagline: '企业 AI 安全网关',
      description: '连接企业 AI 应用与外部大模型的安全枢纽。提供敏感数据脱敏、数据防泄漏、LLM 访问控制、Token 成本管理。AI 智能脱敏与效率优化，让企业在享受 AI 红利的同时，满足合规要求，控制成本与风险。',
      features: ['敏感数据智能脱敏', '数据防泄漏', 'LLM 访问控制', 'Token 成本管理', '企业 Agent 管理'],
      highlights: ['AI 智能脱敏', '效率优化', '合规管理', 'Agent 全生命周期'],
      image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
      sort_order: 2,
    },
  ],
  certifications: [
    { id: 1, name: 'Microsoft Global MSSP', description: '中国仅三家。AI 产品已上架 Microsoft 全球市场，服务全球客户。', badge_text: '中国仅三家', sort_order: 0 },
    { id: 2, name: 'AWS Global MSSP', description: '中国仅三家。提供全面的云与安全服务，覆盖 AWS 全产品线。', badge_text: '中国仅三家', sort_order: 1 },
    { id: 3, name: 'Alibaba Cloud MSP', description: '国际 MSP + 架构完善计划（Well-Architected）合作伙伴。', badge_text: 'MSP + WA', sort_order: 2 },
    { id: 4, name: 'Splunk MSP', description: '中国仅两家。SIEM/SOAR 解决方案与 7×24 运营服务。', badge_text: '中国仅两家', sort_order: 3 },
  ],
  success_stories: [
    {
      id: 1,
      client_name: '全球顶尖咨询公司',
      industry: '咨询',
      service_type: 'SOC 运营',
      requirements: '自动化安全日志分析、提升威胁检测能力、降低人工成本。',
      solution: '部署 ALL-SOC 平台，结合 AI 威胁检测与事件分析，实现 7×24 智能运营。',
      results: ['威胁检测能力提升 5 倍', '工作量减少 75%'],
      sort_order: 0,
    },
    {
      id: 2,
      client_name: '快消品制造企业',
      industry: '制造',
      service_type: '云 MSP',
      requirements: '阿里云与 Azure 7×24 安全监控、成本优化。',
      solution: '7×24 云 MSP 服务，AI 智能工单与成本监控，响应时间 <1 小时。',
      results: ['响应时间 <1 小时', '误报率降低 60%'],
      sort_order: 1,
    },
    {
      id: 3,
      client_name: '跨国集团',
      industry: '企业',
      service_type: 'AI 员工',
      requirements: '员工差旅智能助理，自动化预订与报销流程。',
      solution: '基于 Synergy AI 定制差旅助理 Agent，对接内部系统。',
      results: ['预订效率提升 80%', '人力成本节省 50%'],
      sort_order: 2,
    },
    {
      id: 4,
      client_name: '跨国制药企业',
      industry: '制药',
      service_type: '云服务 + 安全',
      requirements: '多云环境统一管理，满足 GxP 合规要求，7×24 安全监控。',
      solution: '部署混合云架构，ALL-SOC 平台实现统一安全运营，AI 智能巡检保障合规。',
      results: ['合规 100% 通过', '运维成本降低 40%'],
      sort_order: 3,
    },
    {
      id: 5,
      client_name: '头部消费品集团',
      industry: '消费品',
      service_type: 'Synergy AI',
      requirements: '销售团队需要智能话术支持，客户服务需 7×24 智能应答。',
      solution: '定制销售支持 Agent 与客服 Agent，对接 CRM 与工单系统。',
      results: ['销售转化率提升 25%', '客服人力节省 60%'],
      sort_order: 4,
    },
    {
      id: 6,
      client_name: '金融机构',
      industry: '金融',
      service_type: 'ASSA + 安全服务',
      requirements: '内部引入大模型应用，需保障敏感数据不外泄，满足监管要求。',
      solution: '部署 ASSA 网关实现数据脱敏与访问控制，配合 SOC 安全运营。',
      results: ['0 数据泄露', '合规审计通过'],
      sort_order: 5,
    },
  ],
  partnerships: [
    {
      id: 1,
      title: 'OEM 合作',
      partner_profile: '具备软件开发能力、缺乏自有 AI 平台、拥有行业客户资源的公司。',
      cooperation_content: 'Flyingnets提供 Synergy AI 全授权；合作伙伴负责需求分析、本地化部署与客户服务。',
      support: ['技术部署', '产品迭代', '7×24 故障响应', '培训赋能', '用例库支持'],
      sort_order: 0,
    },
    {
      id: 2,
      title: 'SIEM 共创',
      partner_profile: '具备安全能力、缺乏自有 SIEM 平台与 7×24 SOC 运营能力的公司。',
      options: [
        { name: '方案 A：ALL-SOC OEM', desc: '全功能授权，合作伙伴自有品牌与定价' },
        { name: '方案 B：联合交付', desc: '平台 + 双中心 7×24 SOC，联合交付与分成' },
      ],
      support: ['白标定制', 'AI Agent 定制', '持续升级'],
      sort_order: 1,
    },
  ],
  offices: [
    { id: 1, city: '上海', country: '中国', is_24_7: 0, sort_order: 0 },
    { id: 2, city: '北京', country: '中国', is_24_7: 0, sort_order: 1 },
    { id: 3, city: '成都', country: '中国', is_24_7: 1, sort_order: 2 },
    { id: 4, city: '广州', country: '中国', is_24_7: 0, sort_order: 3 },
    { id: 5, city: '香港', country: '中国', is_24_7: 0, sort_order: 4 },
    { id: 6, city: '新加坡', country: '新加坡', is_24_7: 0, sort_order: 5 },
    { id: 7, city: '东京', country: '日本', is_24_7: 1, sort_order: 6 },
  ],
  contact_info: [
    // { id: 1, type: 'phone', label: '工作日 9:00-18:00', value: '+86-400-960-8690', sort_order: 0 },
    { id: 2, type: 'email', label: '商务咨询', value: 'sales@sgflyingnets.com', sort_order: 1 },
    // { id: 3, type: 'website', label: '公司官网', value: 'www.feiluocn.com', sort_order: 2 },
  ],
  admins: [],
}

// 可被环境变量 ADMIN_INITIAL_PASSWORD 覆盖
const initialPassword =
  process.env.ADMIN_INITIAL_PASSWORD || 'EoMYW5wsaKDS3rPa890CVLpIhlNe'
const hash = bcrypt.hashSync(initialPassword, 10)
store.admins = [{ id: 1, username: 'admin', password_hash: hash }]

ensureDir()
fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf-8')
console.log('Seed data written to', DB_FILE)

