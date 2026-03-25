import { NextRequest, NextResponse } from 'next/server'
import { getAuthFromCookies } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data')
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json')

function loadSubmissions() {
  if (!fs.existsSync(SUBMISSIONS_FILE)) return []
  try {
    return JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function saveSubmissions(data: unknown[]) {
  const dir = path.dirname(SUBMISSIONS_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET() {
  const auth = await getAuthFromCookies()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = loadSubmissions()
    return NextResponse.json(Array.isArray(data) ? [...data].reverse() : [])
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await getAuthFromCookies()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const index = parseInt(searchParams.get('index') || '', 10)
    if (isNaN(index) || index < 0) return NextResponse.json({ error: 'Invalid index' }, { status: 400 })

    const list = loadSubmissions()
    if (!Array.isArray(list) || index >= list.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const next = list.filter((_, i) => i !== list.length - 1 - index)
    saveSubmissions(next)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
