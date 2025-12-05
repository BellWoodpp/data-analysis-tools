"use client";

// 认证控制板
import { useState } from "react";
import { authClient } from "@/lib/auth-server/client";
import { RichTextContent } from "@/components/i18n/rich-text";
import type { AuthPanelDictionary } from "@/i18n";
import MagicLinkButton from "@/components/ui/magic-link-button"



type OAuthProvider = "google" | "github";

interface AuthPanelProps {
  dictionary: AuthPanelDictionary;
}

export function AuthPanel({ dictionary }: AuthPanelProps) {
  const session = authClient.useSession();
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(
    null,
  );
  const [magicEmail, setMagicEmail] = useState("");
  const [magicStatus, setMagicStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [magicMessage, setMagicMessage] = useState<string | null>(null);

  const isAuthenticated = Boolean(session.data?.user);

  // 认证处理
  const handleOAuth = (provider: OAuthProvider) => {
    setPendingProvider(provider);
    void authClient
      .signIn.social({
        provider,
        callbackURL:
          typeof window !== "undefined" ? window.location.origin : undefined,
      })
      .catch((error) => {
        console.error(`[Better Auth] ${provider} sign-in failed`, error);
      })
      .finally(() => {
        setPendingProvider(null);
      });
  };
  
  // 处理登出
  const handleSignOut = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error("[Better Auth] Sign out failed", error);
    }
  };

  return (
    <section className="w-full max-w-md rounded-xl border border-black/10 bg-white p-6 shadow-lg shadow-black/5 dark:border-white/10 dark:bg-black dark:shadow-none">
      <header className="mb-6 space-y-1">
        {/* 登录 Shipbase */}
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          {dictionary.title}
        </h1>
        {/* 使用 Better Auth 提供的 Google、GitHub 或 Magic Link 完成身份认证。 */}
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {dictionary.description}
        </p>
      </header>

      <div className="space-y-6">
        {isAuthenticated ? (
          // 如果isAuthenticated是True则显示以下
          <div className="space-y-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-950/30 dark:text-emerald-100">
            <p className="font-medium">
              {dictionary.signedInAs.replace(
                "{name}",
                session.data?.user?.name ??
                  session.data?.user?.email ??
                  "",
              )}
            </p>
            <p className="text-xs text-emerald-800 dark:text-emerald-200/80">
              {dictionary.sessionLabel.replace(
                "{id}",
                session.data?.session?.id ?? "",
              )}
            </p>
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-2 inline-flex items-center justify-center rounded-md border border-emerald-600 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-600 hover:text-white dark:border-emerald-400 dark:text-emerald-200 dark:hover:bg-emerald-400 dark:hover:text-emerald-950"
            >
              {dictionary.signOut}
            </button>
          </div>
        ) : (
          // 如果isAunthenticated是false则显示以下
          <>
            <div className="grid gap-3">
              {/* google登陆按钮 */}
              <button
                type="button"
                onClick={() => handleOAuth("google")}
                disabled={pendingProvider !== null}
                className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
              >
                {pendingProvider === "google"
                  ? dictionary.googleButton.loading
                  : dictionary.googleButton.default}
              </button>
              {/* Github登陆按钮 */}
              <button
                type="button"
                onClick={() => handleOAuth("github")}
                disabled={pendingProvider !== null}
                className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-neutral-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-950 dark:hover:bg-neutral-900"
              >
                {pendingProvider === "github"
                  ? dictionary.githubButton.loading
                  : dictionary.githubButton.default}
              </button>
            </div>

            <div className="space-y-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
              {/* 或发送 Magic Link */}
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                {dictionary.magicLinkHeading}
              </p>
              {/* 带提交按钮的<form> */}
              <form className="space-y-3">
                {/* 输入邮箱地址 */}
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {dictionary.emailLabel}
                  <input
                    type="email"
                    value={magicEmail}
                    onChange={(event) => setMagicEmail(event.target.value)}
                    // 占位符
                    placeholder={dictionary.emailPlaceholder}
                    className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-400 dark:focus:ring-neutral-100/10"
                    required
                  />
                </label>
                {/* Magic Link提交按钮：发送登录链接 */}
                <MagicLinkButton
                  dictionary={dictionary}
                  magicEmail={magicEmail}
                  setMagicMessage={setMagicMessage}
                />
              </form>
              {magicMessage ? (
                <p
                  className={`text-sm ${magicStatus === "error" ? "text-red-600 dark:text-red-400" : "text-neutral-600 dark:text-neutral-300"}`}
                >
                  {magicMessage}
                </p>
              ) : null}
            </div>
          </>
        )}
      </div>

      <footer className="mt-6 border-t border-neutral-200 pt-4 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <p>
          <RichTextContent segments={dictionary.footer} />
        </p>
      </footer>
    </section>
  );
}