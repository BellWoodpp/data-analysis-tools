export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 px-6 py-16 text-neutral-900 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 dark:text-neutral-100">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Privacy Policy
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            隐私政策 / Privacy Policy
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            最新更新：2025-02-15
          </p>
        </header>

        <section className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-xl font-semibold">1. 收集的信息</h2>
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            我们在注册/登录时收集用户提供的邮箱、昵称等基本资料；在用户授权的情况下，可能从第三方（如 X/Twitter）获取公开资料和邮箱。
          </p>
        </section>

        <section className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-xl font-semibold">2. 使用目的</h2>
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            所有信息仅用于账号创建、身份验证与安全风控，不会用于广告投放或与登录无关的用途。
          </p>
        </section>

        <section className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-xl font-semibold">3. 数据存储与安全</h2>
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            我们采取合理的安全措施保护数据，包括凭证哈希存储、最小权限访问控制等。如发现异常行为，我们可能暂时限制访问以保障安全。
          </p>
        </section>

        <section className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-xl font-semibold">4. 共享与第三方</h2>
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            除法律要求或获得用户同意外，我们不会出售或共享用户数据给第三方。集成的第三方登录仅在授权范围内获取信息。
          </p>
        </section>

        <section className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-xl font-semibold">5. 你的权利</h2>
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            你可以随时请求更新或删除账号信息；如需注销或数据导出，请通过站点联系渠道提出。
          </p>
        </section>

        <section className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-xl font-semibold">6. 联系方式</h2>
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            如对隐私有任何疑问，请使用站点底部提供的联系方式与我们联络。
          </p>
        </section>
      </div>
    </main>
  );
}
