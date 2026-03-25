import { NextRequest, NextResponse } from 'next/server'
import { getAuthFromCookies } from '@/lib/auth'
import { readStore } from '@/lib/store'

async function sendTestEmail(config: Record<string, string>, to: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const nodemailer = require('nodemailer')
    const host = process.env.SMTP_HOST || config.smtp_host
    const port = process.env.SMTP_PORT || config.smtp_port
    const user = process.env.SMTP_USER || config.smtp_user
    const pass = process.env.SMTP_PASS || config.smtp_pass

    if (!host || !user) {
      return { ok: false, error: '请填写 SMTP 服务器和发件邮箱' }
    }
    if (!pass) {
      return { ok: false, error: '请填写 SMTP 密码（或配置环境变量 SMTP_PASS）' }
    }
    if (!to || !to.includes('@')) {
      return { ok: false, error: '请填写有效的测试收件邮箱' }
    }

    const transporter = nodemailer.createTransport({
      host,
      port: port ? parseInt(String(port), 10) : 587,
      secure: String(port) === '465',
      auth: { user, pass },
    })

    const fromName = config.smtp_from_name || config.company_name || 'Flyingnets'
    const from = fromName ? `"${fromName}" <${user}>` : user

    await transporter.sendMail({
      from,
      to,
      subject: '[Flyingnets] SMTP 测试邮件',
      html: `
        <h2>SMTP 配置测试成功</h2>
        <p>这是一封来自 Flyingnets 官网管理后台的测试邮件。</p>
        <p>如果您收到此邮件，说明 SMTP 配置正确，表单提交将能正常发送通知邮件。</p>
        <hr>
        <p style="color:#888;font-size:12px">发送时间：${new Date().toISOString()}</p>
      `,
    })
    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, error: msg }
  }
}

export async function POST(req: NextRequest) {
  const auth = await getAuthFromCookies()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const to = body?.to || ''
    const store = readStore()
    const config = { ...store.site_config, ...(body?.config || {}) }
    const testTo = to || config.contact_email || config.partnership_email || ''
    const result = await sendTestEmail(config, testTo)
    if (result.ok) return NextResponse.json({ ok: true })
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '测试失败' }, { status: 500 })
  }
}
