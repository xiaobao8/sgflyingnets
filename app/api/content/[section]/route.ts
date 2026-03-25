import { NextRequest, NextResponse } from 'next/server'
import { readStore, writeStore } from '@/lib/store'
import { getAuthFromCookies } from '@/lib/auth'

const SECTIONS = ['hero_section', 'stats', 'about_section', 'services', 'products', 'certifications', 'success_stories', 'partnerships', 'offices', 'contact_info', 'site_config'] as const

function processRow(row: Record<string, unknown>, key: string) {
  const r = { ...row }
  if (key === 'services' && typeof r.features === 'string') {
    r.features = (r.features as string).split('\n').filter(Boolean)
  }
  if (key === 'products') {
    if (typeof r.features === 'string') r.features = (r.features as string).split('\n').filter(Boolean)
    if (typeof r.highlights === 'string') r.highlights = (r.highlights as string).split('\n').filter(Boolean)
  }
  if (key === 'success_stories' && typeof r.results === 'string') {
    r.results = (r.results as string).split('\n').filter(Boolean)
  }
  if ((key === 'partnerships') && typeof r.support === 'string') {
    r.support = (r.support as string).split('\n').filter(Boolean)
  }
  return r
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params
  if (!SECTIONS.includes(section as typeof SECTIONS[number])) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
  }
  try {
    const store = readStore()
    if (section === 'site_config') {
      return NextResponse.json(store.site_config)
    }
    const key = section as keyof typeof store
    const data = (store as Record<string, unknown>)[key]
    if (Array.isArray(data)) {
      return NextResponse.json([...data].sort((a: { sort_order?: number }, b: { sort_order?: number }) => (a.sort_order ?? 0) - (b.sort_order ?? 0)))
    }
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const auth = await getAuthFromCookies()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { section } = await params
  if (!SECTIONS.includes(section as typeof SECTIONS[number])) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const store = readStore()

    if (section === 'site_config') {
      writeStore({ site_config: { ...store.site_config, ...body } })
      return NextResponse.json({ ok: true })
    }

    const key = section as keyof typeof store
    const arr = (store as Record<string, unknown>)[key]
    if (!Array.isArray(arr)) return NextResponse.json({ error: 'Invalid section' }, { status: 400 })

    const rows = Array.isArray(body) ? body : [body]
    let nextId = arr.length ? Math.max(...arr.map((x: { id?: number }) => x.id || 0)) + 1 : 1
    const updated = rows.map((row: Record<string, unknown>, i: number) => {
      const processed = processRow(row, section)
      return {
        ...processed,
        id: processed.id ?? nextId++,
        sort_order: processed.sort_order ?? i,
      }
    })

    writeStore({ [key]: updated })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const auth = await getAuthFromCookies()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { section } = await params
  if (!SECTIONS.includes(section as typeof SECTIONS[number]) || section === 'site_config') {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = parseInt(searchParams.get('id') || '', 10)
    if (isNaN(id)) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const store = readStore()
    const key = section as keyof typeof store
    const arr = (store as Record<string, unknown>)[key]
    if (!Array.isArray(arr)) return NextResponse.json({ error: 'Invalid section' }, { status: 400 })

    const filtered = arr.filter((r: { id?: number }) => r.id !== id)
    writeStore({ [key]: filtered })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
