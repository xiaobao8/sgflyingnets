/**
 * 多语言内容翻译 - 当 locale 为 en/ja 时，组件使用此内容替代 content.json
 * 确保地道、自然的英语和日语表达
 */

export const contentEn = {
  hero: {
    tagline: 'AI-powered enterprise efficiency · Security that protects your business',
    cta_text: 'Explore our capabilities',
  },
  about: {
    title: 'Flyingnets — AI & Security-Driven Global Enterprise Solutions',
    content: `Flyingnets is headquartered in Singapore and is a leading AI and security integrated solution provider in the Asia-Pacific region. We use AI technology to enhance enterprise efficiency and security technology to protect enterprise information, helping global enterprises achieve intelligent transformation.

Flyingnets operates six regional offices in Japan, Hong Kong, Shanghai, Chengdu, Beijing, and Guangzhou, forming a global service network covering Asia-Pacific. We pioneered deep integration of AI across product development, service delivery, and operations — from Security Operations Centers (SOC) to enterprise AI workforce platforms. Through our proprietary Synergy AI, ALL-SOC, and ASSA product suite, we deliver actionable intelligent transformation paths for clients in finance, manufacturing, consulting, retail, and beyond.

As a Microsoft Global MSSP and AWS Global MSSP certified partner, Flyingnets has strategic partnerships with Alibaba Cloud, Splunk, and other industry leaders. Our products are listed on the Microsoft Global Marketplace. With a team of 130+ professionals, we deliver 7×24 security operations and cloud management to 500+ enterprise clients worldwide.

At Flyingnets, we believe true intelligent operations mean making AI part of your business — while security guards every piece of your enterprise data.`,
  },
  services: [
    {
      title: 'Cloud Services',
      subtitle: 'AI-optimized cloud management and cost control',
      description: 'From enterprise cloud build-out to hybrid and multi-cloud architecture design and Landing Zone implementation, Flyingnets delivers full-lifecycle cloud management. 7×24 monitoring and AI-powered inspection compress 4 hours of manual work into 10 minutes; AI resource optimization reduces over-provisioning by 30%, saving tens of thousands to hundreds of thousands annually. We serve AWS, Azure, Alibaba Cloud, and other major platforms, helping enterprises migrate securely, operate compliantly, and manage intelligently.',
      features: [
        'Cloud architecture design and migration',
        'Landing Zone implementation',
        '7×24 monitoring and operations',
        'AI-powered inspection',
        'AI resource optimization',
        'AI compliance assurance',
      ],
      detail_sections: [
        { title: 'Full-Lifecycle Cloud Management', content: 'Flyingnets cloud services cover the entire enterprise cloud journey: from cloud strategy and architecture design to migration and ongoing operations. We support AWS, Azure, Alibaba Cloud, and other major platforms, providing hybrid and multi-cloud unified management to build secure, compliant, and efficient cloud infrastructure.', image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80' },
        { title: 'AI-Powered Operations', content: '7×24 monitoring and AI-powered inspection compress traditional 4-hour manual checks into 10 minutes. Our AI resource optimization engine identifies over-provisioning, reducing cloud costs by an average of 30% and saving tens of thousands to hundreds of thousands annually. AI compliance assurance automatically detects configuration drift to meet MLPS, ISO 27001, and other requirements.', image_url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80' },
        { title: 'Landing Zone and Best Practices', content: 'Based on cloud provider Well-Architected frameworks, Flyingnets helps enterprises build standardized Landing Zones, implementing best practices for network, security, identity, cost, and more — laying a solid foundation for cloud adoption.', image_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80' },
      ],
    },
    {
      title: 'Security Services',
      subtitle: 'Comprehensive, professional security services',
      description: 'Flyingnets focuses on delivering comprehensive, professional security services for enterprises. Leveraging our experienced security team, mature service system, and global operations capability, we address core security pain points — from assessment and hardening, cloud security, endpoint protection to security operations — providing end-to-end, integrated security solutions to help enterprises build robust security defenses, mitigate risks, and ensure stable, compliant business operations.',
      features: [
        'Enterprise security framework assessment and hardening',
        'Cloud security design and implementation',
        'Endpoint security services',
        'Security operations services',
        '7×24 SOC managed services',
      ],
      detail_sections: [
        { title: 'Enterprise Security Framework Assessment and Hardening', content: 'We conduct in-depth security assessments covering network, systems, data, and staff awareness to identify vulnerabilities and compliance risks. We deliver actionable evaluation reports and tailored hardening plans across policies, technology, and management, with ongoing audit and optimization support.', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
        { title: 'Cloud Security Design and Implementation', content: 'We provide professional cloud security architecture design for public, private, and hybrid cloud, covering host, network, data, and access. We deliver host hardening, vulnerability scanning, WAF, DDoS protection, data encryption, and DLP. We build monitoring and response mechanisms to ensure compliant, stable cloud environments.', image_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80' },
        { title: 'Endpoint Security Services', content: 'We recommend suitable EDR, DLP, and zero-trust solutions based on enterprise scale and budget. We design and deploy endpoint security solutions, build management platforms for centralized monitoring, and provide daily operations, vulnerability remediation, threat response, and security training.', image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80' },
        { title: 'Security Operations Services', content: 'We recommend and deploy SIEM platforms, assess and onboard log sources, and develop targeted use cases for precise threat detection. We provide SOC consulting and build support. Leveraging our Chengdu and Tokyo SOC centers, we deliver 7×24 managed services including monitoring, alert triage, response, threat hunting, and regular reports.', image_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80' },
      ],
    },
    {
      title: 'Enterprise AI Services',
      subtitle: 'Synergy AI + ASSA one-stop AI employee services',
      description: 'Flyingnets combines Synergy AI and ASSA to deliver full-lifecycle AI employee services — from consulting and implementation to security management and continuous optimization. We help enterprises safely and efficiently adopt AI capabilities, turning AI into deployable, manageable, and sustainable digital employees.',
      features: [
        'AI employee consulting and scenario analysis',
        'Implementation and efficacy optimization',
        'Security and data protection',
        'Ongoing support and continuous optimization',
      ],
      detail_sections: [
        { title: 'AI Employee Consulting and Scenario Analysis', content: 'We conduct in-depth AI adoption needs assessments and identify suitable departments and processes for AI employees. Based on Synergy AI capabilities, we provide feasibility analysis, scenario selection, ROI evaluation, and phased implementation roadmaps to ensure AI investment aligns with business value.', image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80' },
        { title: 'AI Employee Implementation and Efficacy Optimization', content: 'We deploy and configure Synergy AI, integrate with CRM, ticketing, ERP, and other systems, and build knowledge bases and workflows for AI agents. We monitor performance metrics (response speed, accuracy, satisfaction) and iteratively optimize knowledge bases and prompts to improve AI employee performance.', image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80' },
        { title: 'AI Employee Security and Data Management', content: 'We integrate ASSA security gateway to build end-to-end security for AI applications. We enable automatic data masking and access control before LLM calls, prevent data leakage, and provide LLM audit, token cost control, and compliance policies. We help establish governance, data classification, and access management to meet regulatory requirements.', image_url: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80' },
        { title: 'Ongoing Support and Continuous Optimization', content: 'We provide 7×24 technical support, incident response, and version upgrades. We conduct regular AI employee health checks, knowledge base updates, and new scenario consulting. We continuously optimize agent configuration, workflows, and security policies based on business changes and feedback.', image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80' },
      ],
    },
    {
      title: 'Microsoft Services',
      subtitle: 'Microsoft Global MSSP full-stack security managed services',
      description: 'As a Microsoft Global Certified MSSP partner, Flyingnets leverages its professional security capabilities and deep understanding of the full Microsoft security portfolio to deliver comprehensive, integrated security managed services. Through standardized and customized services, we maximize the value of Microsoft security products, break down product silos, and translate Microsoft\'s technical advantages into actionable security capabilities — helping enterprises strengthen defenses, reduce risk, improve compliance, and safeguard digital transformation.',
      features: [
        'Azure cloud security architecture and governance',
        'M365 Defender full-stack deployment',
        'Microsoft Purview data governance',
        'Sentinel SIEM/SOAR implementation',
        '7×24 MDR & SOC managed services',
      ],
      detail_sections: [
        { title: 'Azure Cloud Security Services', content: 'Flyingnets delivers end-to-end Azure cloud security services. Our expert team designs business-aligned Azure security architectures and deploys them, while providing Azure security governance, compliance management, and security posture optimization — ensuring Azure resources are fully protected from day one and meet industry compliance. Through 7×24 security operations, we provide Azure threat protection, vulnerability scanning, real-time monitoring, and alert management, identifying and remediating cloud risks promptly, with comprehensive hardening and data protection for all Azure resources.', image_url: '/images/microsoft-azure.png' },
        { title: 'M365 Full-Stack Security Services', content: 'With deep expertise in M365 security components, Flyingnets delivers planning, deployment, and customized configuration for M365 security (Microsoft Defender, Microsoft Purview). We provide one-stop deployment, management, and threat response for the full Defender suite, activating threat detection and defense. Through Microsoft Purview, we offer data governance, DLP, compliance auditing, and information protection. We focus on M365 identity and access security (including Entra ID) to implement zero-trust architecture, and conduct regular M365 security assessments and vulnerability remediation.', image_url: '/images/microsoft-m365.png' },
        { title: 'Microsoft Sentinel Services', content: 'Flyingnets has a dedicated Sentinel implementation and operations team, delivering Sentinel SIEM/SOAR deployment, configuration, and optimization. With strong log integration, we consolidate Microsoft and third-party security logs, breaking data silos for unified management and analysis. We provide 7×24 security event monitoring, deep investigation, rapid response, and threat hunting, plus custom Sentinel Use Case development and detection rule optimization for precise threat detection and automated response.', image_url: '/images/microsoft-sentinel.png' },
        { title: '7×24 MDR & SOC Managed Services', content: 'Flyingnets integrates Microsoft Defender for Endpoint (MDE) and Microsoft Sentinel to deliver 7×24 MDR (Managed Detection and Response) and SOC (Security Operations Center) as a unified managed service. Leveraging MDE for precise endpoint threat identification, rapid remediation, and full traceability; and Sentinel for log integration, threat detection, and incident response — we provide one-stop, full-lifecycle security operations. We operate two specialized SOC centers in Chengdu and Tokyo, staffed with Microsoft-certified security engineers, unified standards, and mature incident response. Clients can choose SOC location based on data residency and business geography; we comply with regional data regulations. Services include 7×24 MDE endpoint monitoring and Sentinel platform monitoring, real-time threat alert triage and log analysis, malware removal, event classification and response, custom threat hunting, Sentinel rule optimization, regular security posture reports, compliance audit support, and incident response drills.', image_url: '/images/microsoft-soc.png' },
      ],
    },
  ],
  products: [
    {
      name: 'ALL-SOC Platform',
      tagline: 'AI-powered security operations center platform',
      description: 'Flyingnets\' core proprietary product — compatible with on-premises, cloud, and hybrid cloud for full-scenario security operations. Integrates log collection, UEBA analysis, use case management, incident ticketing, and multi-language support. The AI SOC assistant boosts use case generation efficiency by 300% and incident analysis speed by 4x — freeing security teams from repetitive work to focus on high-value decisions.',
      features: [
        'Log collection and normalization',
        'UEBA user behavior analysis',
        'Use case management and orchestration',
        'Incident ticketing and closure',
        'Multi-language support',
        'AI SecOps intelligent operations',
      ],
      highlights: [
        'AI SOC assistant',
        '300% use case generation efficiency',
        '4x faster incident analysis',
        'AI Operator fully automated SOC',
      ],
      detail_sections: [
        { title: 'Full-Scenario Security Operations', content: 'ALL-SOC supports on-premises, cloud, and hybrid cloud deployment for SIEM, SOAR, XDR, and other security operations. Integrates 100+ data sources, log normalization, and UEBA to help security teams identify real threats from massive alerts.', image_url: '/images/all-soc-scenario.png' },
        { title: 'AI SOC Assistant', content: 'Built-in AI SOC assistant improves use case generation efficiency by 300% and incident analysis speed by 4x. From alert classification and root cause analysis to remediation guidance, AI assists throughout — letting analysts focus on high-value decisions.', image_url: '/images/all-soc-assistant.png' },
        { title: 'Use Case and Ticket Closure', content: 'Visual use case management and orchestration with multi-language support. Full incident ticket and remediation workflow with complete audit trails — meeting MLPS, ISO 27001, and other compliance requirements.', image_url: '/images/all-soc-workflow.png' },
        { title: 'AI SecOps', content: 'An intelligent SOC operations team based on AI Operators, delivering a complete AI SecOps capability for enterprises. Through multi-role AI Operator collaboration (SecOps Master, Situational Awareness, Threat Detection, Detection Rules, etc.), enables 7×24 intelligent monitoring — helping enterprises achieve fully automated SOC operations with higher efficiency and lower cost, without large human investment.', image_url: '/images/all-soc-secops.png' },
      ],
    },
    {
      name: 'Synergy AI Platform',
      tagline: 'Customizable enterprise AI agent platform',
      description: 'An AI agent workflow platform with private deployment — covering security operations, sales support, customer service, travel assistance, and more across 10+ departmental scenarios. Built-in knowledge base and multi-system integration enable quick connection to existing IT systems. Give every department its own "AI employee" — boosting productivity within compliance.',
      features: [
        'AI agent workflow',
        'Knowledge base building',
        'Multi-system integration',
        'Private deployment',
        'AI employee performance management',
      ],
      highlights: [
        'Security operations',
        'Sales support',
        'Customer service',
        'Travel assistant',
        'Performance & log management',
      ],
      detail_sections: [
        { title: 'Customizable AI Agents', content: 'Synergy AI supports dedicated agents for different departments. Each agent has its own knowledge base, workflows, and permissions — integrating with CRM, ticketing, ERP, and other systems for fast migration from proof of concept to production.', image_url: '/images/synergy-agent.png' },
        { title: 'Knowledge Base and Multi-Model', content: 'Built-in RAG knowledge base supports documents, web pages, APIs, and other data sources. Compatible with mainstream LLMs and private model deployment — keeping enterprise data on-premises and compliant.', image_url: '/images/synergy-knowledge.png' },
        { title: 'Multi-Department Coverage', content: 'Security operations, sales support, customer service, travel assistance, and 10+ scenarios out of the box. Customer results: 80% travel booking efficiency, 25% sales conversion lift, 60% faster customer service response.', image_url: '/images/synergy-scenarios.png' },
        { title: 'AI Employee Performance Management', content: 'Simple management of each AI employee\'s work efficiency, busy status, and log records. Real-time monitoring of digital employee dialogues, user count, and workflow execution — with interaction and execution log traceability — helping enterprises grasp AI employee operations and optimize resource allocation.', image_url: '/images/synergy-performance.png' },
      ],
    },
    {
      name: 'ASSA Gateway',
      tagline: 'Enterprise AI security gateway',
      description: 'The security hub connecting enterprise AI applications and external LLMs. Delivers sensitive data masking, data loss prevention, LLM access control, and token cost management. AI-powered masking and efficiency optimization let enterprises enjoy AI benefits while meeting compliance and controlling cost and risk.',
      features: [
        'Intelligent sensitive data masking',
        'Data loss prevention',
        'LLM access control',
        'Token cost management',
        'Enterprise Agent management',
      ],
      highlights: [
        'AI intelligent masking',
        'Efficiency optimization',
        'Compliance management',
        'Agent full lifecycle',
      ],
      detail_sections: [
        { title: 'AI Security Gateway', content: 'ASSA acts as the security hub between enterprise AI applications and external LLMs — auditing and controlling all traffic. Intelligent sensitive data masking ensures PII such as names, IDs, and bank cards are masked before LLM calls, meeting data compliance requirements.', image_url: '/images/assa-llm-security.png' },
        { title: 'Cost and Access Control', content: 'LLM access control and token cost management help enterprises control LLM spending. Quota allocation by department and application prevents abuse. AI caching and prompt optimization can reduce token consumption by 30%+.', image_url: '/images/assa-audit.png' },
        { title: 'Data Loss Prevention', content: 'End-to-end data loss prevention (DLP) detects and blocks sensitive information in outputs. Preferred for finance, healthcare, legal, and other industries with strict data compliance — enabling AI adoption while managing risk.', image_url: '/images/assa-posture.png' },
        { title: 'Enterprise Agent Management', content: 'Comprehensive security management, lifecycle management, and performance management for all enterprise Agents. Full lifecycle control from onboarding approval and security assessment to runtime monitoring and efficiency analysis — helping enterprises build a secure, efficient, and traceable AI Agent management system.', image_url: '/images/assa-agent-mgmt.png' },
      ],
    },
  ],
  certifications: [
    { name: 'Microsoft Global MSSP', description: 'Microsoft Global MSSP certified partner. AI products listed on Microsoft Global Marketplace, serving customers worldwide.' },
    { name: 'AWS Global MSSP', description: 'AWS Global MSSP certified partner. Comprehensive cloud and security services across the full AWS portfolio.' },
    { name: 'Alibaba Cloud MSP', description: 'International MSP and Well-Architected partner.' },
    { name: 'Splunk MSP', description: 'Splunk certified MSP partner. SIEM/SOAR solutions and 7×24 operations.' },
  ],
  success_stories: [
    { client_name: 'Global Top Consulting Firm', industry: 'Consulting', service_type: 'SOC Operations', requirements: 'Automated security log analysis, improved threat detection, reduced manual costs.', solution: 'Deployed ALL-SOC platform with AI threat detection and incident analysis for 7×24 intelligent operations.', results: ['5x threat detection improvement', '75% workload reduction'] },
    { client_name: 'Multinational Manufacturer', industry: 'Manufacturing', service_type: 'M365 Defender + Purview', requirements: 'Microsoft 365 endpoint and office app security, data governance and compliance.', solution: 'Planning, deployment and customized configuration of Microsoft Defender and Microsoft Purview for full M365 security and data governance.', results: ['Full threat detection coverage', '100% data compliance'] },
    { client_name: 'Multinational Tech Company', industry: 'Technology', service_type: 'Sentinel SOC', requirements: 'Multi-source log collection, threat detection and 7×24 SOC operations.', solution: 'Microsoft Sentinel ingesting Defender, AD, Palo Alto, AWS Security Hub logs; custom Use Case design and 7×24 SOC operations.', results: ['3x threat detection efficiency', 'Unified multi-source log analysis'] },
    { client_name: 'Global Pharmaceutical Company', industry: 'Pharmaceutical', service_type: 'Cloud + Security', requirements: 'Unified multi-cloud management, GxP compliance, 7×24 security monitoring.', solution: 'Hybrid cloud architecture with ALL-SOC for unified security operations and AI-powered compliance inspection.', results: ['100% compliance pass', '40% operations cost reduction'] },
    { client_name: 'Leading Consumer Goods Group', industry: 'Consumer Goods', service_type: 'Synergy AI', requirements: 'Sales team needed intelligent script support; customer service needed 7×24 intelligent response.', solution: 'Customized Sales Support and Customer Service agents, integrated with CRM and ticketing.', results: ['25% sales conversion lift', '60% customer service labor savings'] },
    { client_name: 'Financial Institution', industry: 'Finance', service_type: 'ASSA + Security Services', requirements: 'Introducing LLM applications internally; needed to protect sensitive data and meet regulatory requirements.', solution: 'Deployed ASSA gateway for data masking and access control, with SOC security operations.', results: ['Zero data leakage', 'Compliance audit passed'] },
  ],
  partnerships: [
    { title: 'OEM Cooperation', partner_profile: 'Companies with software development capabilities, lacking a proprietary AI platform, and possessing industry client resources.', cooperation_content: 'Flyingnets provides full Synergy AI authorization; partners handle requirements analysis, localization deployment, and customer service.', support: ['Technical deployment', 'Product iteration', '7×24 fault response', 'Training and enablement', 'Use case library support'] },
    { title: 'SIEM Co-Creation', partner_profile: 'Companies with security capabilities but lacking a proprietary SIEM platform and 7×24 SOC operations.', options: [{ name: 'Option A: ALL-SOC OEM', desc: 'Full-feature authorization, partner\'s own branding and pricing' }, { name: 'Option B: Joint Delivery', desc: 'Platform + dual-center 7×24 SOC, joint delivery with revenue sharing' }], support: ['White-label customization', 'AI agent customization', 'Continuous upgrades'] },
  ],
  contact_info: [
    { label: 'Mon–Fri 9:00–18:00' },
    { label: 'Business inquiries' },
    { label: 'Company website' },
  ],
  offices: [
    { city: 'Singapore', country: 'Singapore' },
    { city: 'Tokyo', country: 'Japan' },
    { city: 'Hong Kong', country: 'China' },
    { city: 'Shanghai', country: 'China' },
    { city: 'Chengdu', country: 'China' },
    { city: 'Beijing', country: 'China' },
    { city: 'Guangzhou', country: 'China' },
  ],
  stats: [
    { label: 'Years of industry expertise' },
    { label: 'Enterprise clients' },
    { label: 'Asia-Pacific offices' },
  ],
}

export const contentJa = {
  hero: {
    tagline: 'AIで企業効率を向上 · セキュリティで企業情報を守る',
    cta_text: 'サービスを探る',
  },
  about: {
    title: 'FLYINGNETS株式会社 — 日本・東京拠点のAI × セキュリティ企業ソリューション',
    content: `FLYINGNETS株式会社は日本・東京を拠点とし、Microsoft Securityを基盤としたAI・セキュリティ統合ソリューションを提供しています。
シンガポール本社を中心にアジア太平洋地域へ展開するグローバル企業として、日本企業のDX推進とセキュリティ強化を支援しています。

日本、香港、上海、成都、北京、広州に拠点を展開し、アジア太平洋をカバーするサービスネットワークを構築しています。
日本拠点では、SOC運用、クラウドセキュリティ、AI活用を中心に、企業の運用効率化とセキュリティ高度化を支援しています。

自社開発のSynergyAI、ALL-SOC、ASSAなどを活用し、金融、製造、コンサルティング、小売など多様な業界に対し、実践的なセキュリティソリューションを提供しています。

MicrosoftグローバルMSSP、AWSグローバルMSSP認証パートナーとして、Flyingnetsはアリババクラウド、Splunkなどと戦略的提携を結び、製品はMicrosoftグローバルマーケットプレイスに掲載されています。130名以上の専門チームで、500社以上の企業顧客に7×24のセキュリティ運用とクラウド管理サービスを世界中で提供しています。`,
  },
  services: [
    {
      title: 'クラウドサービス',
      subtitle: 'AI最適化のクラウド管理とコストコントロール',
      description: '企業クラウド構築、ハイブリッド/マルチクラウドアーキテクチャ設計、Landing Zone構築まで、Flyingnetsはライフサイクル全体のクラウド管理を提供。7×24監視とAIインテリジェント点検により、4時間の手作業を10分に圧縮。AIリソース最適化で過剰プロビジョニングを30%削減し、年間数万〜数十万元のコスト削減を実現。AWS、Azure、アリババクラウドなど主要プラットフォームを深くサポートし、企業の安全なクラウド移行、コンプライアントな運用、インテリジェントな管理を支援します。',
      features: [
        'クラウドアーキテクチャ設計・移行',
        'Landing Zone構築',
        '7×24監視運用',
        'AIインテリジェント点検',
        'AIリソース最適化',
        'AIコンプライアンス保証',
      ],
      detail_sections: [
        { title: 'ライフサイクル全体のクラウド管理', content: 'Flyingnetsのクラウドサービスは、クラウド戦略・アーキテクチャ設計から移行・継続運用まで、企業のクラウド導入全プロセスをカバー。AWS、Azure、アリババクラウドなど主要プラットフォームをサポートし、ハイブリッド・マルチクラウドの統一管理で、安全・コンプライアント・高効率なクラウドインフラを構築します。', image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80' },
        { title: 'AI駆動の運用', content: '7×24監視とAIインテリジェント点検により、従来4時間かかった手動点検を10分に圧縮。AIリソース最適化エンジンが過剰プロビジョニングを検出し、クラウドコストを平均30%削減、年間数万〜数十万元の節約を実現。AIコンプライアンス保証で設定のずれを自動検出し、等級保護、ISO 27001などの要件を満たします。', image_url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80' },
        { title: 'Landing Zoneとベストプラクティス', content: 'クラウドベンダーのWell-Architectedフレームワークに基づき、Flyingnetsは企業が標準化されたLanding Zoneを構築し、ネットワーク、セキュリティ、アイデンティティ、コストなどのベストプラクティスを実装。ビジネスのクラウド移行の堅固な基盤を築きます。', image_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80' },
      ],
    },
    {
      title: 'セキュリティサービス',
      subtitle: '全方位・専門的なセキュリティサービス',
      description: 'Flyingnetsは企業向けに全方位・専門的なセキュリティサービスを提供。経験豊富なセキュリティチーム、成熟したサービス体制、グローバル運用能力を活かし、企業のセキュリティ課題に焦点を当て、調査・強化、クラウドセキュリティ、エンドポイント保護、セキュリティ運用まで、全プロセス・統合型のセキュリティソリューションを提供。企業の堅牢なセキュリティ防衛の構築、リスク回避、業務の安定・コンプライアントな運営を支援します。',
      features: [
        '企業セキュリティフレームワーク調査・強化',
        'クラウドセキュリティ設計・構築',
        'エンドポイントセキュリティサービス',
        'セキュリティ運用サービス',
        '7×24 SOCマネージドサービス',
      ],
      detail_sections: [
        { title: '企業セキュリティフレームワーク調査・強化サービス', content: 'ネットワーク、システム、データ、従業員のセキュリティ意識をカバーする徹底的な調査を実施し、脆弱性とコンプライアンスリスクを特定。実行可能な評価レポートとカスタマイズ強化プランを提供し、制度・技術・管理の多面的な強化を実施。定期点検と最適化サポートを継続提供。', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
        { title: 'クラウドセキュリティ設計・構築サービス', content: 'パブリック、プライベート、ハイブリッドクラウド向けの専門的なセキュリティアーキテクチャ設計を提供。ホスト強化、脆弱性スキャン、WAF、DDoS対策、データ暗号化、DLPなどのコンポーネント構築を実施。監視・応答メカニズムを構築し、コンプライアントで安定したクラウド環境を確保。', image_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80' },
        { title: 'エンドポイントセキュリティサービス', content: '企業規模と予算に基づき、EDR、DLP、ゼロトラストなどの適切な製品を推奨。エンドポイントセキュリティソリューションの設計・導入、管理プラットフォームの構築を提供。集中監視を実現し、日常運用、脆弱性修正、脅威対応、セキュリティ研修をサポート。', image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80' },
        { title: 'セキュリティ運用サービス', content: 'SIEMプラットフォームの推奨・導入、ログソースの評価・接続、コア業務リスク向けのUse case開発を提供。SOCコンサルと構築支援を実施。成都・東京の2大SOCセンターを拠点に、7×24監視、アラート研判、迅速対応、脅威ハンティング、定期レポートを含むマネージドサービスを提供。', image_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80' },
      ],
    },
    {
      title: '企業AIサービス',
      subtitle: 'Synergy AI + ASSA ワンストップAI従業員サービス',
      description: 'FlyingnetsはSynergy AIとASSAを組み合わせ、コンサル・導入・セキュリティ管理・継続最適化までのAI従業員ライフサイクルサービスを提供。企業がAIを安全かつ効率的に導入し、展開可能で管理可能、持続的に進化する「デジタル従業員」を実現することを支援します。',
      features: [
        'AI従業員コンサル・シーン分析',
        '導入実施・効能最適化',
        'セキュリティ・データ保護',
        '継続サポート・最適化',
      ],
      detail_sections: [
        { title: '企業AI従業員導入のコンサル・シーン分析サービス', content: 'AI導入ニーズの徹底調査を実施し、AI従業員に適した部門・プロセスを特定。Synergy AIの能力に基づき、実現可能性分析、シーン選定、ROI評価、段階的導入ロードマップを提供し、AI投資とビジネス価値の整合を確保。', image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80' },
        { title: '企業AI従業員の導入実施・効能最適化サービス', content: 'Synergy AIのデプロイ・設定、CRM・チケット・ERPとの連携を実施。シーンに応じたナレッジベース構築、ワークフロー設計、Agent設定でAI従業員を本番稼働。稼働後は応答速度、正確性、満足度などの指標を監視し、ナレッジベースとプロンプトを反復最適化。', image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80' },
        { title: '企業AI従業員のセキュリティ・データ安全管理構築サービス', content: 'ASSAセキュリティゲートウェイを統合し、AIアプリケーションのエンドツーエンドセキュリティを構築。LLM呼び出し前の自動データマスキング・アクセス制御でデータ漏洩を防止。LLM監査、トークンコスト管理、コンプライアンスポリシーを提供。ガバナンス、データ分類、アクセス管理の確立を支援。', image_url: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80' },
        { title: '企業AI従業員の継続サポート・最適化サービス', content: '7×24技術サポート、障害対応、バージョンアップを提供。定期的なAI従業員稼働状況点検、ナレッジベース更新提案、新シーン拡張コンサルを実施。業務変化とフィードバックに基づき、Agent設定、ワークフロー、セキュリティポリシーを継続最適化。', image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80' },
      ],
    },
    {
      title: 'Microsoftサービス',
      subtitle: 'MicrosoftグローバルMSSP フルスタックセキュリティマネージド',
      description: 'FlyingnetsはMicrosoftグローバル認証MSSPパートナーとして、専門的なセキュリティ能力とMicrosoftセキュリティ製品群への深い理解を活かし、企業に包括的・統合型のセキュリティマネージドサービスを提供。標準化・カスタマイズサービスを通じてMicrosoftセキュリティ製品の価値を最大化し、製品間の連携を強化。Microsoftの技術的優位性を企業が実践できるセキュリティ能力に転換し、セキュリティ防衛の強化、リスク低減、コンプライアンス向上、デジタル変革の保護を支援します。',
      features: [
        'Azureクラウドセキュリティアーキテクチャ・ガバナンス',
        'M365 Defenderフルスタック導入',
        'Microsoft Purviewデータガバナンス',
        'Sentinel SIEM/SOAR導入',
        '7×24 MDR & SOCマネージドサービス',
      ],
      detail_sections: [
        { title: 'Azureクラウドセキュリティサービス', content: 'FlyingnetsはAzureクラウドセキュリティの全プロセスサービスを提供。専門チームがビジネスに適合したAzureセキュリティアーキテクチャを設計・導入し、Azureセキュリティガバナンス、コンプライアンス管理、セキュリティ態勢最適化を実施。Azureリソースが構築初期から完全な保護を備え、業界コンプライアンスを満たすことを保証。7×24セキュリティ運用でAzure脅威防御、脆弱性スキャン、リアルタイム監視、アラート管理を提供し、クラウド環境のリスクを迅速に発見・対応。', image_url: '/images/microsoft-azure.png' },
        { title: 'M365フルスタックセキュリティサービス', content: 'M365セキュリティコンポーネント（Microsoft Defender、Microsoft Purview）への深い理解を活かし、FlyingnetsはM365セキュリティの計画・導入・カスタマイズ設定を提供。Defender全シリーズのワンストップ導入・管理・脅威対応で、脅威検知・防御能力を活性化。Microsoft Purviewでデータガバナンス、DLP、コンプライアンス監査、情報保護の全プロセスをサポート。M365アイデンティティ・アクセスセキュリティ（Entra ID含む）でゼロトラストアーキテクチャを実装し、定期的なM365セキュリティ評価と脆弱性是正を実施。', image_url: '/images/microsoft-m365.png' },
        { title: 'Microsoft Sentinelサービス', content: 'Flyingnetsは専門のSentinel導入・運用チームを擁し、Sentinel SIEM/SOARの導入・設定・最適化を提供。強力なログ統合能力でMicrosoft製品およびサードパーティセキュリティ製品のログを統合し、データサイロを解消。7×24セキュリティイベント監視、深度調査、迅速対応、脅威ハンティングを提供。企業の業務シーンに合わせたSentinel Use Caseのカスタム開発と検知ルール最適化で、精密な脅威検知と自動応答を実現。', image_url: '/images/microsoft-sentinel.png' },
        { title: '7×24 MDR & SOCマネージドサービス', content: 'FlyingnetsはMicrosoft Defender for Endpoint（MDE）とMicrosoft Sentinelの2大技術を統合し、7×24 MDR（マネージド検知・対応）とSOC（セキュリティ運用センター）の一体化マネージドサービスを提供。MDEでエンドポイント脅威の精密識別・迅速対応・完全トレーサビリティを実現；Sentinelを中核にログ統合・脅威検知・インシデント対応を統合し、ワンストップ・全プロセスのセキュリティ運用を提供。成都・東京の2大SOCセンターを展開し、Microsoft認証のベテランエンジニア、統一運用基準、成熟したインシデント対応でクロスリージョン・24時間監視を実現。サービス内容：7×24 MDEエンドポイント監視とSentinelプラットフォーム監視、リアルタイム脅威アラート分析・ログ分析、マルウェア除去、イベント分類・対応、カスタム脅威ハンティング、Sentinelルール最適化、定期セキュリティレポート、コンプライアンス監査、インシデント対応訓練。', image_url: '/images/microsoft-soc.png' },
      ],
    },
  ],
  products: [
    {
      name: 'ALL-SOC Platform',
      tagline: 'AI駆動のセキュリティ運用センタープラットフォーム',
      description: 'Flyingnetsの中核自社製品。オンプレ、クラウド、ハイブリッドクラウドに対応し、全シーンのセキュリティ運用をサポート。ログ収集、UEBA分析、ユースケース管理、インシデントチケット、多言語対応を統合。AI SOCアシスタントでユースケース生成効率300%向上、インシデント分析速度4倍向上を実現。セキュリティチームを反復作業から解放し、高付加価値の意思決定に集中させます。',
      features: [
        'ログ収集・正規化',
        'UEBAユーザー行動分析',
        'ユースケース管理・オーケストレーション',
        'インシデントチケット・クローズ',
        '多言語対応',
        'AI SecOpsインテリジェント運用',
      ],
      highlights: [
        'AI SOCアシスタント',
        'ユースケース生成効率300%向上',
        'インシデント分析速度4倍',
        'AI Operator全自動SOC',
      ],
      detail_sections: [
        { title: '全シーンセキュリティ運用', content: 'ALL-SOCはオンプレ、クラウド、ハイブリッドクラウドのデプロイに対応し、SIEM、SOAR、XDRなどのセキュリティ運用をサポート。100以上のデータソースを統合し、ログ正規化とUEBAで、セキュリティチームが大量のアラートから真の脅威を識別することを支援します。', image_url: '/images/all-soc-scenario.png' },
        { title: 'AI SOCアシスタント', content: '組み込みAI SOCアシスタントでユースケース生成効率300%向上、インシデント分析速度4倍向上。アラート分類、根本原因分析から対応ガイダンスまで、AIが全プロセスをサポート。アナリストは高付加価値の意思決定に集中できます。', image_url: '/images/all-soc-assistant.png' },
        { title: 'ユースケース・チケットクローズ', content: 'ビジュアルなユースケース管理とオーケストレーション、多言語対応。インシデントチケットと対応フローの完全なクローズ、完全な監査証跡で、等級保護、ISO 27001などのコンプライアンス要件を満たします。', image_url: '/images/all-soc-workflow.png' },
        { title: 'AI SecOps', content: 'AI OperatorベースのインテリジェントSOC運用チームを提供。SecOps主控、态势感知、脅威検知、検知ルールなどの多役割AI Operator協調により、7×24インテリジェント監視を実現。企業がより効率的かつ低コストで全自動SOC運用を実現し、大規模な人的投資なしでプロフェッショナル級のセキュリティ運用能力を獲得できます。', image_url: '/images/all-soc-secops.png' },
      ],
    },
    {
      name: 'Synergy AI Platform',
      tagline: 'カスタマイズ可能なエンタープライズAIエージェントプラットフォーム',
      description: 'プライベートデプロイ対応のAIエージェントワークフロープラットフォーム。セキュリティ運用、営業支援、カスタマーサービス、出張アシスタントなど10以上の部門シーンをカバー。組み込みナレッジベースとマルチシステム連携で、既存ITシステムと迅速に接続。各部門に専用の「AI従業員」を提供し、コンプライアンスを前提に生産性を解放します。',
      features: [
        'AIエージェントワークフロー',
        'ナレッジベース構築',
        'マルチシステム連携',
        'プライベートデプロイ',
        'AI従業員効能管理',
      ],
      highlights: [
        'セキュリティ運用',
        '営業支援',
        'カスタマーサービス',
        '出張アシスタント',
        '効能・ログ管理',
      ],
      detail_sections: [
        { title: 'カスタマイズ可能なAIエージェント', content: 'Synergy AIは部門ごとに専用エージェントをサポート。各エージェントは独立したナレッジベース、ワークフロー、権限を持ち、CRM、チケット、ERPなどのシステムと連携。概念検証から本番導入への迅速な移行を実現します。', image_url: '/images/synergy-agent.png' },
        { title: 'ナレッジベース・マルチモデル', content: '組み込みRAGナレッジベースはドキュメント、ウェブページ、APIなどのデータソースをサポート。主流LLMとプライベートモデルデプロイに対応し、企業データを社内に保持、コンプライアンスを満たします。', image_url: '/images/synergy-knowledge.png' },
        { title: '多部門シーンカバー', content: 'セキュリティ運用、営業支援、カスタマーサービス、出張アシスタントなど10以上のシーンをすぐに利用可能。お客様の実績：出張予約効率80%向上、営業コンバージョン25%向上、カスタマーサービス応答時間60%短縮。', image_url: '/images/synergy-scenarios.png' },
        { title: 'AI従業員効能管理', content: '各AI従業員の業務効率、繁忙状態、ログ記録をシンプルに管理。デジタル従業員の対話数、利用者数、ワークフロー実行状況をリアルタイム監視し、インタラクションログ・実行ログのトレーサビリティをサポート。企業がAI従業員の稼働状況を把握し、リソース配分と効能向上を最適化することを支援します。', image_url: '/images/synergy-performance.png' },
      ],
    },
    {
      name: 'ASSA Gateway',
      tagline: 'エンタープライズAIセキュリティゲートウェイ',
      description: '企業のAIアプリケーションと外部LLMを接続するセキュリティハブ。機密データマスキング、データ漏洩防止、LLMアクセス制御、トークンコスト管理を提供。AIインテリジェントマスキングと効率最適化で、企業がAIの恩恵を享受しながらコンプライアンスを満たし、コストとリスクを管理できるようにします。',
      features: [
        '機密データインテリジェントマスキング',
        'データ漏洩防止',
        'LLMアクセス制御',
        'トークンコスト管理',
        '企業Agent管理',
      ],
      highlights: [
        'AIインテリジェントマスキング',
        '効率最適化',
        'コンプライアンス管理',
        'Agent全ライフサイクル',
      ],
      detail_sections: [
        { title: 'AIセキュリティゲートウェイ', content: 'ASSAは企業のAIアプリケーションと外部LLMの間のセキュリティハブとして、すべてのトラフィックを監査・制御。機密データのインテリジェントマスキングで、氏名、身分証、銀行カードなどのPIIがLLM呼び出し前に自動マスキングされ、データコンプライアンス要件を満たします。', image_url: '/images/assa-llm-security.png' },
        { title: 'コスト・アクセス制御', content: 'LLMアクセス制御とトークンコスト管理で、企業のLLM呼び出しコストを管理。部門・アプリケーション別のクォータ割り当てで濫用を防止。AIインテリジェントキャッシュとプロンプト最適化で、トークン消費を30%以上削減可能。', image_url: '/images/assa-audit.png' },
        { title: 'データ漏洩防止', content: 'エンドツーエンドのデータ漏洩防止（DLP）で、出力内容の機密情報を検出・ブロック。金融、医療、法務などデータコンプライアンスに厳格な業界の第一選択。AIの恩恵を享受しながらリスクを管理します。', image_url: '/images/assa-posture.png' },
        { title: '企業Agent管理機能モジュール', content: '企業が使用する各種Agentの総合セキュリティ管理、ライフサイクル管理、効能管理を実現。Agentの全ライフサイクル管理をサポートし、接続承認、セキュリティ評価から稼働監視・効能分析まで、安全・高効率・トレーサブルなAI Agent管理体制の構築を支援します。', image_url: '/images/assa-agent-mgmt.png' },
      ],
    },
  ],
  certifications: [
    { name: 'Microsoft Global MSSP', description: 'MicrosoftグローバルMSSP認証パートナー。AI製品はMicrosoftグローバルマーケットプレイスに掲載、世界中のお客様にサービスを提供。' },
    { name: 'AWS Global MSSP', description: 'AWSグローバルMSSP認証パートナー。AWS全製品ラインにわたる包括的なクラウド・セキュリティサービスを提供。' },
    { name: 'Alibaba Cloud MSP', description: '国際MSPおよびWell-Architectedパートナー。' },
    { name: 'Splunk MSP', description: 'Splunk認証MSPパートナー。SIEM/SOARソリューションと7×24運用サービス。' },
  ],
  success_stories: [
    { client_name: '世界トップクラスのコンサルティング企業', industry: 'コンサルティング', service_type: 'SOC運用', requirements: 'セキュリティログの自動分析、脅威検知能力の向上、人件費の削減。', solution: 'ALL-SOCプラットフォームを導入し、AI脅威検知とインシデント分析で7×24インテリジェント運用を実現。', results: ['脅威検知能力5倍向上', '作業量75%削減'] },
    { client_name: '多国籍製造企業', industry: '製造', service_type: 'M365 Defender + Purview', requirements: 'Microsoft 365エンドポイント・オフィスアプリのセキュリティ、データガバナンス・コンプライアンス。', solution: 'Microsoft DefenderとMicrosoft Purviewの計画・導入・カスタマイズ設定で、M365フルスタックセキュリティとデータガバナンスを実現。', results: ['脅威検知フルカバー', 'データコンプライアンス100%'] },
    { client_name: '多国籍テック企業', industry: 'テクノロジー', service_type: 'Sentinel SOC', requirements: 'マルチソースログ収集、脅威検知、7×24 SOC運用。', solution: 'Microsoft SentinelでDefender、AD、Palo Alto、AWS Security Hub等のログを収集し、カスタムUse Case設計と7×24 SOC運用を実施。', results: ['脅威検知効率3倍向上', 'マルチソースログ統合分析'] },
    { client_name: 'グローバル製薬企業', industry: '製薬', service_type: 'クラウド+セキュリティ', requirements: 'マルチクラウド環境の統一管理、GxPコンプライアンス、7×24セキュリティ監視。', solution: 'ハイブリッドクラウドアーキテクチャ、ALL-SOCプラットフォームで統一セキュリティ運用、AIインテリジェント点検でコンプライアンスを保証。', results: ['コンプライアンス100%合格', '運用コスト40%削減'] },
    { client_name: '大手消費財グループ', industry: '消費財', service_type: 'Synergy AI', requirements: '営業チームにインテリジェントトークスクリプト支援、カスタマーサービスに7×24インテリジェント応答が必要。', solution: '営業支援エージェントとカスタマーサービスエージェントをカスタマイズ、CRMとチケットシステムと連携。', results: ['営業コンバージョン25%向上', 'カスタマーサービス人件費60%削減'] },
    { client_name: '金融機関', industry: '金融', service_type: 'ASSA+セキュリティサービス', requirements: '内部でLLMアプリケーションを導入、機密データの漏洩防止と規制要件の満たしが必要。', solution: 'ASSAゲートウェイでデータマスキングとアクセス制御を実装、SOCセキュリティ運用と連携。', results: ['データ漏洩ゼロ', 'コンプライアンス監査合格'] },
  ],
  partnerships: [
    { title: 'OEM提携', partner_profile: 'ソフトウェア開発能力を有し、自社AIプラットフォームがなく、業界顧客リソースを持つ企業。', cooperation_content: 'FlyingnetsはSynergy AIの完全ライセンスを提供。パートナーは要件分析、ローカライズ導入、カスタマーサービスを担当。', support: ['技術導入', '製品イテレーション', '7×24障害対応', 'トレーニング・エンパワーメント', 'ユースケースライブラリサポート'] },
    { title: 'SIEM共創', partner_profile: 'セキュリティ能力はあるが、自社SIEMプラットフォームと7×24 SOC運用能力がない企業。', options: [{ name: 'オプションA：ALL-SOC OEM', desc: '全機能ライセンス、パートナー独自ブランド・価格設定' }, { name: 'オプションB：共同デリバリー', desc: 'プラットフォーム+デュアルセンター7×24 SOC、共同デリバリーと収益分配' }], support: ['ホワイトラベルカスタマイズ', 'AIエージェントカスタマイズ', '継続的アップグレード'] },
  ],
  contact_info: [
    { label: '平日 9:00–18:00' },
    { label: 'ビジネスお問い合わせ' },
    { label: '会社ウェブサイト' },
  ],
  offices: [
    { city: 'シンガポール', country: 'シンガポール' },
    { city: '東京', country: '日本' },
    { city: '香港', country: '中国' },
    { city: '上海', country: '中国' },
    { city: '成都', country: '中国' },
    { city: '北京', country: '中国' },
    { city: '広州', country: '中国' },
  ],
  stats: [
    { label: '年の業界深耕' },
    { label: '企業顧客の信頼' },
    { label: 'アジア太平洋オフィス' },
  ],
}
