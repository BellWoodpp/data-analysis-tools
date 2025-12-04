// app/auth/magic-callback/page.tsx   ← 路径随便，但要和下面 url 一致
import { redirect } from 'next/navigation';
import { authClient } from "@/lib/auth-server/client";

export default async function MagicCallback({
  searchParams,
}: {
  searchParams: { email?: string; token?: string };
}) {
  const { email, token } = searchParams

  // 只要有邮箱就直接登录（自动注册）
  if (!email || !token) {
    return <div style={{ padding: 100, textAlign: 'center' }}>
      <h1>无效的登录链接</h1>
      <a href="/login">返回登录</a>
    </div>;
    
  }
  
  try {
    await authClient.signIn.magicLink({
      email,
      callbackURL: '/'
    });
  } catch (err) {
    console.error('Magic link login failed:', err);
  }
    redirect('/');   
  }


