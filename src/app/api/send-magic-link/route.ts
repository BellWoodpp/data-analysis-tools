// app/api/send-magic-link/route.ts   ← 必须放在这里！！！

import { Resend } from "resend";
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; // ← 你模板自带的 db
import { verificationCooldown } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const resend = new Resend(process.env.RESEND_API_KEY);   // ← 用环境变量！不是硬编码！

export async function POST(request: NextRequest) {
  const { email, locale = "en", userId } = await request.json();
  const baseUrl = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000' 
  : 'https://randompokemongenerators.com';

const params = new URLSearchParams();
params.set('email', email);
const loginUrl = `${baseUrl}/auth/magic-callback?${params.toString()}`;

  // 可选：多语言支持（你之前问的）
  const subject = locale === "zh-CN" 
    ? "您的 Shipbase 免密码登录链接" 
    : "Your Shipbase Magic Login Link";

  const buttonText = locale === "zh-CN" ? "立即登录" : "Log in to Shipbase";

 if (userId) {
    // 已登录用户：用数据库冷却表
    const existing = await db
      .select()
      .from(verificationCooldown)
      .where(eq(verificationCooldown.userId, BigInt(userId)))
      .limit(1);

    if (existing.length > 0) {
      const expiresAt = new Date(existing[0].expiresAt);
      const now = new Date();
      const leftSeconds = Math.ceil((expiresAt.getTime() - now.getTime()) / 1000);

      if (leftSeconds > 0) {
        return NextResponse.json(
          { error: "请稍后再试", retryAfter: leftSeconds },
          {
            status: 429,
             // Too Many Requests
            headers: { "Retry-After": leftSeconds.toString() }
          }
        );
      }
    }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Pokemon <no-reply@randompokemongenerators.com>",   // ← 生产环境要换成你自己的域名！
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
          <a href="${loginUrl}" style="display: inline-block; background: #000; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            ${buttonText}
          </a>
          <p style="color: #999; font-size: 14px; margin-top: 32px;">
            ${locale === "zh-CN" ? "或直接复制此链接：" : "Or copy this link:"}<br/>
            <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${loginUrl}</code>
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">
            ${locale === "zh-CN" ? "此链接将在 15 分钟后失效" : "This link expires in 15 minutes"}
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: '发送失败' }, { status: 500 });
    }

    if (userId) {
      const expiresAt = new Date(Date.now() + 60_000); // 60 秒后过期

      await db
        .insert(verificationCooldown)
        .values({
          userId: BigInt(userId),
          expiresAt,
        })
        .onConflictDoUpdate({
          target: verificationCooldown.userId,
          set: { expiresAt },
        });
    }

    console.log('【调试】收到的 userId:', userId, typeof userId);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[Resend] 发送失败:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

