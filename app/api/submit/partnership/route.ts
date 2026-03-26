import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { AzureSdk } from '@/lib/azure-sdk'

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

function buildNotificationHtml(fields: Record<string, string>) {
  const rows = Object.entries(fields)
    .map(([label, value]) =>
      `<tr><td style="padding:8px 12px;font-weight:600;color:#333;white-space:nowrap;border-bottom:1px solid #eee">${label}</td><td style="padding:8px 12px;color:#555;border-bottom:1px solid #eee">${value || '-'}</td></tr>`,
    )
    .join('')

  return `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <h2 style="color:#1a1a2e;border-bottom:2px solid #c9a96e;padding-bottom:8px">🤝 新的合作伙伴咨询</h2>
  <table style="width:100%;border-collapse:collapse;margin-top:16px">${rows}</table>
  <p style="margin-top:24px;font-size:12px;color:#999">此邮件由 Flyingnets 官网自动发送</p>
</div>`
}

async function sendAzureNotification(fields: Record<string, string>) {
  const clientId = process.env.AZURE_APP_CLIENT_ID
  const clientSecret = process.env.AZURE_APP_CLIENT_SECRET
  const tenantId = process.env.AZURE_APP_TENANT_ID
  const mailbox = process.env.AZURE_MAILBOX
  const notifyEmail = process.env.NOTIFY_EMAIL

  if (!clientId || !clientSecret || !tenantId || !mailbox || !notifyEmail) {
    console.warn('Azure 邮件配置不完整，跳过邮件通知')
    return
  }

  try {
    const sdk = new AzureSdk(tenantId, clientId)
    await sdk.appAuth(mailbox, clientId, clientSecret, tenantId)

    const result = await sdk.sendEmail({
      toRecipients: notifyEmail.split(',').map(e => e.trim()),
      subject: `[合作咨询] ${fields['公司名称']} - ${fields['联系人']}`,
      htmlContent: buildNotificationHtml(fields),
    })
    console.log('邮件通知:', result)
  } catch (err) {
    console.error('Azure 邮件发送失败:', err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { company, contact, phone, email, product_interest, region, coop_type, message, locale } = body
    if (!company || !contact || !phone || !email) {
      return NextResponse.json({ error: '请填写必填项：公司名称、联系人、电话、邮箱' }, { status: 400 })
    }

    const submission = {
      type: 'partnership',
      company,
      contact,
      phone,
      email,
      product_interest: product_interest || '',
      coop_type: coop_type || '',
      region: region || '',
      message: message || '',
      created_at: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
    }

    const submissions = loadSubmissions()
    submissions.push(submission)
    saveSubmissions(submissions)

    sendAzureNotification({
      '公司名称': company,
      '联系人': contact,
      '电话': phone,
      '邮箱': email,
      '感兴趣的产品': product_interest || '',
      '合作类型': coop_type || '',
      '区域': region || '',
      '留言': message || '',
      '提交时间': submission.created_at,
    })

    const aiWebhook = process.env.AI_ASSISTANT_WEBHOOK
    if (aiWebhook) {
      fetch(aiWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'partnership',
          company,
          contact,
          phone,
          email,
          product_interest: product_interest || '',
          coop_type: coop_type || '',
          region: region || '',
          message: message || '',
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
