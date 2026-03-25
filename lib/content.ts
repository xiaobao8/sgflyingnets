export type LayoutSection = { id: string; label: string; visible: boolean; sort_order: number }

export type Content = {
  config: Record<string, string>
  layoutConfig: LayoutSection[]
  hero: HeroSection | null
  stats: Stat[]
  about: AboutSection[]
  services: Service[]
  products: Product[]
  certifications: Certification[]
  successStories: SuccessStory[]
  partnerships: Partnership[]
  offices: Office[]
  contactInfo: ContactInfo[]
}

export type HeroSection = {
  id?: number
  title: string
  subtitle: string
  tagline: string
  cta_text?: string
  cta_link?: string
  background_image?: string
}

export type Stat = {
  id?: number
  label: string
  value: string
  suffix?: string
  section?: string
}

export type AboutSection = {
  id?: number
  title: string
  content: string
  image_url?: string
}

export type Service = {
  id?: number
  title: string
  subtitle: string
  description: string
  features: string[] | string
  icon?: string
}

export type Product = {
  id?: number
  name: string
  tagline: string
  description: string
  features: string[] | string
  highlights: string[] | string
  image_url?: string
}

export type Certification = {
  id?: number
  name: string
  description: string
  badge_text?: string
  logo_url?: string
  image_url?: string
}

export type SuccessStory = {
  id?: number
  client_name: string
  industry: string
  service_type: string
  requirements: string
  solution: string
  results: string[] | string
  image_url?: string
}

export type Partnership = {
  id?: number
  title: string
  partner_profile: string
  cooperation_content?: string | null
  options?: { name: string; desc: string }[] | null
  support: string[] | string
}

export type Office = {
  id?: number
  city: string
  country: string
  is_24_7: number
}

export type ContactInfo = {
  id?: number
  type: string
  label: string
  value: string
}
