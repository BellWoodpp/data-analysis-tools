// app/api/send-magic-link/route.ts   ← 必须放在这里！！！

export const runtime = 'nodejs'; // 确保是 nodejs 环境
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-server/auth';

const COOLDOWN = 60;
const GLOBAL_COOLDOWN_KEY = 'cooldown_any';

const getSecondsLeft = (value?: string) => {
  if (!value) return 0;
  const last = Number(value);
  if (Number.isNaN(last)) return 0;
  return Math.max(0, COOLDOWN - Math.floor((Date.now() - last) / 1000));
};

const setCooldownCookie = (response: NextResponse, key: string) => {
  response.cookies.set(key, String(Date.now()), {
    httpOnly: true,
    path: '/',
    maxAge: COOLDOWN,
  });
};

export async function HEAD(request: NextRequest) {
  // 优先检查全局冷却（无论邮箱），以便刷新后仍受限
  const globalCooldown = request.cookies.get(GLOBAL_COOLDOWN_KEY);
  const globalSecondsLeft = getSecondsLeft(globalCooldown?.value);
  if (globalSecondsLeft > 0) {
    return new NextResponse(null, {
      status: 429,
      headers: { 'Retry-After': String(globalSecondsLeft), 'Cache-Control': 'no-store' },
    });
  }

  // 若传了邮箱，按邮箱维度检查
  const email = request.nextUrl.searchParams.get('email');
  if (email) {
    const key = `cooldown_${email.toLowerCase()}`;
    const lastSent = request.cookies.get(key);
    const secondsLeft = getSecondsLeft(lastSent?.value);
    if (secondsLeft > 0) {
      return new NextResponse(null, {
        status: 429,
        headers: { 'Retry-After': String(secondsLeft), 'Cache-Control': 'no-store' },
      });
    }
  }

  return new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const key = `cooldown_${email.toLowerCase()}`;
  const lastSent = request.cookies.get(key);
  const secondsLeft = getSecondsLeft(lastSent?.value);

  if (secondsLeft > 0) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: secondsLeft },
      {
        status: 429,
        headers: { 'Retry-After': String(secondsLeft) },
      }
    );
  }

  try {
    await auth.api.signInMagicLink({
      body: {
        email,
        callbackURL: '/',
        errorCallbackURL: '/',
        newUserCallbackURL: '/',
      },
      headers: request.headers,
    });

    const response = NextResponse.json({ success: true });
    
    // 发送成功后写入冷却时间 cookie
    setCooldownCookie(response, key);
    setCooldownCookie(response, GLOBAL_COOLDOWN_KEY);

    return response;
  } catch (error) {
    console.error("[Magic Link] 发送失败:", error);
    const response = NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    setCooldownCookie(response, key);
    setCooldownCookie(response, GLOBAL_COOLDOWN_KEY);
    return response;
  }
}
