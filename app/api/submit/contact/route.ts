import { NextRequest, NextResponse } from 'next/server'
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
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { company, contact, phone, email, product_interest, message, locale } = body
    if (!company || !contact || !phone || !email) {
      return NextResponse.json({ error: '请填写必填项：公司名称、联系人、电话、邮箱' }, { status: 400 })
    }

    const submission = {
      type: 'contact',
      company,
      contact,
      phone,
      email,
      product_interest: product_interest || '',
      message: message || '',
      created_at: new Date().toISOString(),
    }

    const submissions = loadSubmissions()
    submissions.push(submission)
    saveSubmissions(submissions)

    // 统一发送到 AI 助手：分析、汇总、由 AI 邮箱统一回复（不再使用各表单独立邮箱）
    const aiWebhook = process.env.AI_ASSISTANT_WEBHOOK
    if (aiWebhook) {
      fetch(aiWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          company,
          contact,
          phone,
          email,
          product_interest: product_interest || '',
          message: message || '',
          coop_type: '',
          region: '',
          locale: locale || 'zh',
        }),
      }).catch(() => {})
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '提交失败' }, { status: 500 })
  }
}
