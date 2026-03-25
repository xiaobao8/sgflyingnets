/** 发送邮件。config 来自 site_config，环境变量 SMTP_* 优先于 config */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  config?: Record<string, string>
): Promise<boolean> {
  try {
    const nodemailer = require('nodemailer')
    const host = process.env.SMTP_HOST || config?.smtp_host
    const port = process.env.SMTP_PORT || config?.smtp_port
    const user = process.env.SMTP_USER || config?.smtp_user
    const pass = process.env.SMTP_PASS || config?.smtp_pass

    if (!host || !user || !pass) return false

    const transporter = nodemailer.createTransport({
      host,
      port: port ? parseInt(String(port), 10) : 587,
      secure: String(port) === '465',
      auth: { user, pass },
    })

    const fromName = config?.smtp_from_name || config?.company_name || 'Flyingnets'
    const from = fromName ? `"${fromName}" <${user}>` : user

    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    })
    return true
  } catch {
    return false
  }
}
