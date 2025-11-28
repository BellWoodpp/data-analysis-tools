// app/api/send-magic-link/route.ts   ← 必须放在这里！！！

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);   // ← 用环境变量！不是硬编码！

export async function POST(request: Request) {
  const { email, url, locale = "en" } = await request.json();

  // 可选：多语言支持（你之前问的）
  const subject = locale === "zh-CN" 
    ? "您的 Shipbase 免密码登录链接" 
    : "Your Shipbase Magic Login Link";

  const buttonText = locale === "zh-CN" ? "立即登录" : "Log in to Shipbase";

  try {
    await resend.emails.send({
      from: "Shipbase <login@randompokemongenerators.com>",   // ← 生产环境要换成你自己的域名！
      to: email,
      subject: subject,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 40px auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px; text-align: center; background: #fff;">
          <h1 style="font-size: 24px; margin-bottom: 16px; color: #111;">
            ${locale === "zh-CN" ? "欢迎回来！" : "Welcome back!"}
          </h1>
          <p style="color: #666; margin-bottom: 32px; font-size: 16px;">
            ${locale === "zh-CN" ? "点击下方按钮立即登录" : "Click below to log in securely"}
          </p>
          <a href="${url}" style="display: inline-block; background: #000; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            ${buttonText}
          </a>
          <p style="color: #999; font-size: 14px; margin-top: 32px;">
            ${locale === "zh-CN" ? "或直接复制此链接：" : "Or copy this link:"}<br/>
            <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${url}</code>
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">
            ${locale === "zh-CN" ? "此链接将在 15 分钟后失效" : "This link expires in 15 minutes"}
          </p>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("[Resend] 发送失败:", error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}