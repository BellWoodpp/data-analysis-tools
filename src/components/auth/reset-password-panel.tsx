"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ResetPasswordPanelProps {
  locale?: string;
  initialToken?: string;
}

export function ResetPasswordPanel({
  locale = "en",
  initialToken = "",
}: ResetPasswordPanelProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [pendingSend, setPendingSend] = useState(false);
  const [pendingReset, setPendingReset] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sendCooldown, setSendCooldown] = useState(0);

  const resetHref = useMemo(
    () => (locale === "en" ? "/reset-password" : `/${locale}/reset-password`),
    [locale],
  );
  const loginHref = useMemo(
    () => (locale === "en" ? "/login" : `/${locale}/login`),
    [locale],
  );

  const validateEmail = (value: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value.trim());
  };

  const validatePassword = (value: string) => {
    const hasLetter = /[A-Za-z]/.test(value);
    const hasNumber = /\d/.test(value);
    return value.length >= 8 && hasLetter && hasNumber;
  };

  // 读取并维护 60s 冷却（刷新仍生效）
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `resetCooldownUntil_${locale}`;
    const restore = () => {
      const stored = window.localStorage.getItem(key);
      if (!stored) {
        setSendCooldown(0);
        return;
      }
      const expiresAt = Number(stored);
      const now = Date.now();
      const seconds = Math.max(0, Math.ceil((expiresAt - now) / 1000));
      setSendCooldown(seconds);
    };
    restore();
    const timer = window.setInterval(() => {
      setSendCooldown((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [locale]);

  const startSendCooldown = () => {
    if (typeof window === "undefined") return;
    const key = `resetCooldownUntil_${locale}`;
    const expiresAt = Date.now() + 60_000;
    window.localStorage.setItem(key, String(expiresAt));
    setSendCooldown(60);
  };

  const handleRequestLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pendingSend) return;
    if (sendCooldown > 0) {
      setError(`请 ${sendCooldown} 秒后再试。`);
      return;
    }
    setMessage(null);
    setError(null);

    if (!validateEmail(email)) {
      setError("请输入有效的邮箱地址。");
      return;
    }

    setPendingSend(true);
    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}${resetHref}`
          : resetHref;
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), redirectTo }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "发送重置邮件失败，请稍后重试。");
      }
      setMessage("重置邮件已发送，请前往邮箱点击链接设置新密码。");
      startSendCooldown();
    } catch (err) {
      setError((err as Error)?.message ?? "发送失败，请稍后再试。");
    } finally {
      setPendingSend(false);
    }
  };

  const handleResetPassword = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (pendingReset) return;
    setMessage(null);
    setError(null);

    const trimmedToken = token.trim();
    const trimmedPassword = newPassword.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedToken) {
      setError("链接无效或已过期，请重新请求重置邮件。");
      return;
    }
    if (!validatePassword(trimmedPassword)) {
      setError("新密码至少 8 位，需包含字母和数字。");
      return;
    }
    if (trimmedPassword !== trimmedConfirm) {
      setError("两次输入的密码不一致。");
      return;
    }

    setPendingReset(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: trimmedPassword, token: trimmedToken }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "重置失败，请重新请求重置邮件。");
      }
      setMessage("密码重置成功，请使用新密码登录。");
      setTimeout(() => router.push(loginHref), 1200);
    } catch (err) {
      setError((err as Error)?.message ?? "重置失败，请稍后再试。");
    } finally {
      setPendingReset(false);
    }
  };

  const isResetFlow = Boolean(token);

  return (
    <Card className="w-full max-w-md rounded-xl border border-black/10 bg-white px-6 py-6 shadow-lg shadow-black/5 dark:border-white/10 dark:bg-black dark:shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          {isResetFlow ? "重置密码" : "找回密码"}
        </CardTitle>
        <CardDescription className="text-sm text-neutral-500 dark:text-neutral-400">
          {isResetFlow
            ? "请输入新密码完成重置。"
            : "输入邮箱，我们会发送重置链接到你的邮箱。"}
        </CardDescription>
      </CardHeader>

      {isResetFlow ? (
        <form onSubmit={handleResetPassword}>
          <CardContent className="space-y-4 px-0">
            <div className="space-y-2">
              <Label
                htmlFor="new-password"
                className="text-neutral-700 dark:text-neutral-300"
              >
                新密码
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="至少 8 位，包含字母和数字"
                required
                className="border-neutral-300 bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="confirm-password"
                className="text-neutral-700 dark:text-neutral-300"
              >
                确认新密码
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="再次输入新密码"
                required
                className="border-neutral-300 bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </div>
            <Input
              id="token"
              type="hidden"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            {message ? (
              <p className="text-sm text-emerald-600 dark:text-emerald-300">
                {message}
              </p>
            ) : null}
            {error ? (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            ) : null}
          </CardContent>
          <CardFooter className="flex-col gap-2 px-0">
            <Button
              type="submit"
              disabled={pendingReset}
              className="w-full bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-70 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              {pendingReset ? "重置中..." : "重置密码"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-sm text-neutral-700 underline-offset-4 hover:underline dark:text-neutral-200"
              onClick={() => router.push(loginHref)}
            >
              返回登录
            </Button>
          </CardFooter>
        </form>
      ) : (
        <form onSubmit={handleRequestLink}>
          <CardContent className="space-y-4 px-0">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-neutral-700 dark:text-neutral-300"
              >
                邮箱
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="border-neutral-300 bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </div>
            {message ? (
              <p className="text-sm text-emerald-600 dark:text-emerald-300">
                {message}
              </p>
            ) : null}
            {error ? (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            ) : null}
          </CardContent>
          <CardFooter className="flex-col gap-2 px-0">
            <Button
              type="submit"
              disabled={pendingSend || sendCooldown > 0}
              className="w-full bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-70 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              {pendingSend
                ? "发送中..."
                : sendCooldown > 0
                  ? `请 ${sendCooldown}s 后重试`
                  : "发送重置链接"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-sm text-neutral-700 underline-offset-4 hover:underline dark:text-neutral-200"
              onClick={() => router.push(loginHref)}
            >
              返回登录
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
