// 服务端

import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db/client";
import { Resend } from "resend";
import { genericOAuth } from "better-auth/plugins/generic-oauth";

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
const magicLinkFrom = process.env.MAGIC_LINK_FROM_EMAIL;
const resetPasswordFrom = process.env.RESET_PASSWORD_FROM_EMAIL ?? magicLinkFrom;

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const xClientId = process.env.X_CLIENT_ID;
const xClientSecret = process.env.X_CLIENT_SECRET;

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
  ...(xClientId && xClientSecret
    ? {
        x: genericOAuth({
          config: [
            {
              providerId: "x",
              authorizationUrl: "https://twitter.com/i/oauth2/authorize",
              tokenUrl: "https://api.twitter.com/2/oauth2/token",
              userInfoUrl: "https://api.twitter.com/2/users/me",
              clientId: xClientId,
              clientSecret: xClientSecret,
              scopes: ["tweet.read", "users.read", "offline.access", "email"],
              mapProfileToUser: (raw) => ({
                id: raw?.data?.id,
                name: raw?.data?.name ?? "",
                email: raw?.data?.email,
                image: raw?.data?.profile_image_url,
              }),
            },
          ],
        }),
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
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      // 使用 Resend 发送重置密码邮件；如果未配置则仅打印链接
      if (!resend || !resetPasswordFrom) {
        console.info(`[Better Auth] Password reset link for ${user.email}: ${url}`);
        return;
      }
      const subject = "重置您的密码";
      const buttonText = "重置密码";
      await resend.emails.send({
        from: resetPasswordFrom,
        to: user.email,
        subject,
        html: `
          <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 32px auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px; text-align: center; background: #fff;">
            <h1 style="font-size: 22px; margin-bottom: 12px; color: #111;">重置密码</h1>
            <p style="color: #555; margin-bottom: 24px; font-size: 15px;">
              点击下方按钮设置一个新的密码。
            </p>
            <a href="${url}" style="display: inline-block; background: #111; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px;">
              ${buttonText}
            </a>
            <p style="color: #999; font-size: 12px; margin-top: 24px;">
              链接 1 小时内有效。如非本人操作请忽略此邮件。
            </p>
          </div>
        `,
      });
    },
  },
  socialProviders,
  plugins: [
    nextCookies(),
    magicLink({
      sendMagicLink: async ({ email, url, token }, ctx) => {
        const webhookUrl = process.env.MAGIC_LINK_WEBHOOK_URL;

        // 1) 可选 webhook：成功与否都记录，但不再阻断 Resend
        if (webhookUrl) {
          try {
            await fetch(webhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, url, token }),
            });
            console.info(`[Better Auth] Magic link webhook sent for ${email}`);
          } catch (error) {
            console.error(
              "[Better Auth] Failed to send magic link webhook:",
              error,
            );
          }
        }

        // 2) Resend 邮件发送
        if (resend) {
          if (!magicLinkFrom) {
            console.error("[Better Auth] MAGIC_LINK_FROM_EMAIL 未配置，无法通过 Resend 发送魔法链接");
            throw new Error("MAGIC_LINK_FROM_EMAIL is required to send magic link via Resend");
          }
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
                  <p style="color: #999; font-size: 12px; margin-top: 24px;">
                    该链接 15 分钟内有效
                  </p>
                </div>
              `,
            });
            console.info(`[Better Auth] Magic link sent via Resend for ${email}`);
            return;
          } catch (error) {
            console.error("[Better Auth] Failed to send magic link email:", error);
            throw error;
          }
        }

        // 3) Fallback：没有 Resend，用控制台输出
        console.info(`[Better Auth] Magic link for ${email}: ${url}`);
      },
    }),
  ],
});
