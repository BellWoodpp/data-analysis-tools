"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-server/client";

interface UserSignFormProps {
  locale?: string;
}

export default function UserSignForm({ locale = "en" }: UserSignFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const loginHref = useMemo(
    () => (locale === "en" ? "/login" : `/${locale}/login`),
    [locale],
  );

  // 读取并维护 60s 冷却（刷新后仍有效）
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `signupCooldownUntil_${locale}`;
    const restore = () => {
      const stored = window.localStorage.getItem(key);
      if (!stored) {
        setCooldown(0);
        return;
      }
      const expiresAt = Number(stored);
      const now = Date.now();
      const seconds = Math.max(0, Math.ceil((expiresAt - now) / 1000));
      setCooldown(seconds);
    };
    restore();
    const timer = window.setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [locale]);

  const startCooldown = () => {
    if (typeof window === "undefined") return;
    const key = `signupCooldownUntil_${locale}`;
    const expiresAt = Date.now() + 60_000;
    window.localStorage.setItem(key, String(expiresAt));
    setCooldown(60);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    if (cooldown > 0) {
      setError(`请 ${cooldown} 秒后再试。`);
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasLetter = /[A-Za-z]/.test(trimmedPassword);
    const hasNumber = /\d/.test(trimmedPassword);

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      setError("请填写用户名、邮箱和密码。");
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setError("邮箱格式不合法。");
      return;
    }

    if (trimmedPassword.length < 8 || !hasLetter || !hasNumber) {
      setError("密码至少 8 位，需包含字母和数字。");
      return;
    }

    setPending(true);
    setMessage(null);
    setError(null);

    try {
      const result = await authClient.signUp.email({
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
        callbackURL:
          typeof window !== "undefined" ? window.location.origin : undefined,
      });

      if ((result as { error?: { message?: string } })?.error) {
        setError(result.error.message ?? "注册失败，请检查输入后重试。");
        return;
      }

      // 注册成功后发送验证/登录魔法链接，要求用户去邮箱点击
      try {
        const res = await fetch("/api/send-magic-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmedEmail }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "验证邮件发送失败，请稍后重试。");
        }
        setMessage("注册成功，验证邮件已发送到您的邮箱，请打开邮件中的链接完成登录。");
      } catch (mailErr) {
        setMessage(
          "注册成功，但发送验证邮件失败，请稍后在登录页使用邮箱获取魔法链接。",
        );
      }
      startCooldown();
    } catch (err) {
      const msg = (err as Error)?.message ?? "注册失败，请稍后重试。";
      setError(msg);
    } finally {
      setPending(false);
    }
  };

  return (
    <Card className="w-full max-w-md rounded-xl border border-black/10 bg-white px-6 py-6 shadow-lg shadow-black/5 dark:border-white/10 dark:bg-black dark:shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          创建账号
        </CardTitle>
        <CardDescription className="text-sm text-neutral-500 dark:text-neutral-400">
          输入用户名、邮箱和密码完成注册。
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 px-0">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-neutral-700 dark:text-neutral-300"
            >
              用户名
            </Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="输入用户名"
              required
              className="border-neutral-300 bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-neutral-700 dark:text-neutral-300"
            >
              邮箱
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              className="border-neutral-300 bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-neutral-700 dark:text-neutral-300"
            >
              密码
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="至少 8 位，包含字母与数字"
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
        <CardFooter className="flex flex-col gap-3 px-0">
            <Button
              type="submit"
              disabled={pending || cooldown > 0}
              className="w-full bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-70 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              {pending
                ? "注册中..."
                : cooldown > 0
                  ? `请 ${cooldown}s 后再试`
                  : "注册"}
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
    </Card>
  );
}
