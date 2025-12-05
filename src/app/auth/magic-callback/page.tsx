// app/auth/magic-callback/page.tsx
import { redirect } from 'next/navigation';

export default function MagicCallback() {
  // 旧链接兜底：直接回首页
  redirect('/');
}
