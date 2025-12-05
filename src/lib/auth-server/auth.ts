// 服务端

import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db/client";
import { Resend } from "resend";

// 声明常量appBaseURL
const appBaseURL =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_BASE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000";

const resendApiKey = process.env.RESEND_API_KEY;
const resend =
  resendApiKey && resendApiKey.trim().length > 0
    ? new Resend(resendApiKey)
    : null;
const magicLinkFrom =
  process.env.MAGIC_LINK_FROM_EMAIL ?? "Magic Links <no-reply@example.com>";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

const socialProviders = {
  ...(googleClientId && googleClientSecret
    ? {
        google: {
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        },
      }
    : {}),
  ...(githubClientId && githubClientSecret
    ? {
        github: {
          clientId: githubClientId,
          clientSecret: githubClientSecret,
          scope: ["read:user", "user:email"],
        },
      }
    : {}),
} satisfies NonNullable<
  NonNullable<Parameters<typeof betterAuth>[0]>["socialProviders"]
>;

if (Object.keys(socialProviders).length === 0) {
  console.warn(
    "[Better Auth] No social providers configured. Set GOOGLE_CLIENT_ID/SECRET or GITHUB_CLIENT_ID/SECRET to enable OAuth sign-in.",
  );
}

export const auth = betterAuth({
  appName: "宝可梦",
  baseURL: appBaseURL,
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  email: {
    magicLink: true,
  },
  socialProviders,
  plugins: [
    nextCookies(),
    magicLink({
      sendMagicLink: async ({ email, url, token }, ctx) => {
        
        if (process.env.MAGIC_LINK_WEBHOOK_URL) {
          try {
            await fetch(process.env.MAGIC_LINK_WEBHOOK_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, url, token }),
            });
            return;
          } catch (error) {
            console.error(
              "[Better Auth] Failed to send magic link webhook:",
              error,
            );
            throw error;
          }
        }

        if (resend) {
          try {
            const subject = "您的登录魔法链接";
            const buttonText = "点击登录";
            await resend.emails.send({
              from: magicLinkFrom,
              to: email,
              subject,
              html: `
                <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 32px auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px; text-align: center; background: #fff;">
                  <h1 style="font-size: 22px; margin-bottom: 12px; color: #111;">
                    欢迎回来
                  </h1>
                  <p style="color: #555; margin-bottom: 24px; font-size: 15px;">
                    点击下方按钮完成登录
                  </p>
                  <a href="${url}" style="display: inline-block; background: #111; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px;">
                    ${buttonText}
                  </a>
                  <p style="color: #777; font-size: 13px; margin-top: 24px;">
                    或复制此链接：<br/>
                    <span style="word-break: break-all; color: #111;">${url}</span>
                  </p>
                  <p style="color: #999; font-size: 12px; margin-top: 24px;">
                    该链接 15 分钟内有效
                  </p>
                </div>
              `,
            });
            return;
          } catch (error) {
            console.error("[Better Auth] Failed to send magic link email:", error);
            throw error;
          }
        }

        console.info(`[Better Auth] Magic link for ${email}: ${url}`);
      },
    }),
  ],
});
