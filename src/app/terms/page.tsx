export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 px-6 py-16 text-neutral-900 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 dark:text-neutral-100">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Terms of Service
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            服务条款 / Terms of Service
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            最新更新：2025-02-15
          </p>
        </header>

        <section className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-xl font-semibold">1. 服务范围</h2>
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            我们提供账号登录与管理功能，支持邮箱/密码、魔法链接以及第三方社交登录（如 X/Twitter）。本服务不代表用户发布内容，也不访问或操作用户的私信。
          </p>
        </section>

        <section className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-xl font-semibold">2. 数据使用</h2>
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            为了完成注册与登录，我们会使用用户提供的邮箱、昵称等基本资料；在用户授权的情况下，可能从第三方获取公开资料和邮箱。我们不会用于广告或与登录无关的用途。
          </p>
        </section>

        <section className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-xl font-semibold">3. 用户责任</h2>
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            用户应妥善保管账号凭据，不得使用服务从事违法、侵权或违反第三方平台政策的行为。如因用户原因导致的账号风险或损失，由用户自行承担。
          </p>
        </section>

        <section className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-xl font-semibold">4. 免责声明</h2>
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            我们不保证服务的绝对可用性，第三方平台变更、网络或不可抗力导致的服务中断或数据丢失不承担责任。若发现安全风险，我们可能暂停或终止相关账号的使用。
          </p>
        </section>

        <section className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-xl font-semibold">5. 联系方式</h2>
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            如有问题或权利主张，请通过站点底部的联系渠道与我们取得联系。
          </p>
        </section>
      </div>
    </main>
  );
}
