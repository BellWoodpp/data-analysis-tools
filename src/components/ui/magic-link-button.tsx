'use client'

import { useState, useRef, useEffect, useCallback } from "react";


interface MagicLinkButtonProps {
  dictionary: {
    magicLinkButton: {
      default: string;
      loading: string;
      resend?: string; // 比如 "重新发送"
    };
  };
  magicEmail: string; // 邮箱输入框的值（由父组件传进来）
  setMagicStatus?: (status: "idle" | "sending" | "success" | "error") => void;
  setMagicMessage?: (msg: string) => void;
  userId?: number | bigint; // 关键：加上 userId（登录后才有，未登录可以传 undefined）
}

export default function MagicLinkButton({ 
  dictionary,
  magicEmail,
  setMagicStatus,
  setMagicMessage,
}: MagicLinkButtonProps ) {

  const [countdown, setCountdown] = useState(0); // 倒计时秒数，0 表示可点击
  const [isPending, setIsPending] = useState(false); // 真正请求中的 loading
  const timerRef = useRef<NodeJS.Timeout | null>(null);


  // 开始倒计时
  const startCountdown = useCallback((seconds = 60) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(seconds);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  },[])

    // 页面加载即问后端，这个倒计时是否在冷却？
  useEffect(() => {
    const checkCooldown = async () => {
      const email = magicEmail?.trim();
      const search = email ? `?email=${encodeURIComponent(email)}` : "";
      try {
        const res = await fetch(`/api/send-magic-link${search}`, {
          method: "HEAD",
          headers: { "X-Check-Cooldown": "true" },
          cache: "no-store",
        });
        if (res.status === 429) {
          const retryAfter = Number(res.headers.get("Retry-After") || "60");
          const seconds = Math.max(1, retryAfter);
          setCountdown(seconds);
          startCountdown(seconds);
          setMagicStatus?.("idle");
          setMagicMessage?.(`请 ${seconds} 秒后重试`);
        }
      } catch {
      }
    };
    checkCooldown();
  }, [magicEmail, setMagicMessage, setMagicStatus, startCountdown]);


  // 清理定时器，防止内存泄漏
  useEffect(() => {
    return () => 
      timerRef.current && clearInterval(timerRef.current);
  }, []);

  // 处理发送魔法链接
  const handleSendMagicLink = async () => {
    // 1. 关键校验：没填邮箱或格式不对 → 直接红提示，不倒计时！
    if (!magicEmail || magicEmail.trim() === "") {
      setMagicStatus?.("error");
      setMagicMessage?.("请输入邮箱地址");
      return;
    }
    // 简单邮箱格式校验（正则）
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(magicEmail)) {
      setMagicStatus?.("error");
      setMagicMessage?.("请输入有效的邮箱地址");
      return;
    }

    if (countdown > 0) return; // 防止重复点击

    // 3. 开始正式发送
    setIsPending(true);
    setMagicStatus?.("sending");


  try {
    const res = await fetch("/api/send-magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: magicEmail.trim() }),
    });
    
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      // 429 是后端返回的“冷却中”
      if (res.status === 429 && data.retryAfter) {
        setCountdown(data.retryAfter);
        startCountdown(data.retryAfter);
        setMagicStatus?.("idle");
        setMagicMessage?.(`请 ${data.retryAfter} 秒后重试`);
        return;
      }
      throw new Error(data.message || "发送失败");
    }
    
    // 成功
    setMagicStatus?.("success");
    setMagicMessage?.("魔法链接已发送，请查收邮件！");
    // 可选：成功提示
    // toast.success("魔法链接已发送！");
  } catch (err: any) {
    setMagicStatus?.("error");
    setMagicMessage?.(err.message || "发送失败，请稍后重试");
    console.error(err);
  } finally {
    setIsPending(false);
    // 成功 or 失败都开始倒计时，防止刷接口
    startCountdown();
  }
};

  // 按钮文字逻辑
  const buttonText = countdown > 0 
    ? `${dictionary.magicLinkButton.resend || "重新发送"} (${countdown}s)`
    : dictionary.magicLinkButton.default;

  return (
    <button
      type="button"
      onClick={handleSendMagicLink}
      disabled={countdown > 0 || isPending} // 倒计时中或正在发请求都禁用
      className={`
        inline-flex w-full items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white
        transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-neutral-500 disabled:cursor-not-allowed disabled:opacity-60
        ${
          countdown > 0
            ? "bg-neutral-500 dark:bg-neutral-600" // 倒计时中用灰色
            : "bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        }
      `}
    >
      {isPending ? (
        <>
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          {dictionary.magicLinkButton.loading}
        </>
      ) : (
        buttonText
      )}
    </button>
  );
}
