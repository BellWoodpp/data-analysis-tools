"use client";

import Link from "next/link";
import { useState } from "react";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeSwitcher } from "./theme-switcher";
import { UserMenu } from "./user-menu";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useLocale } from "@/hooks";
import { authClient } from "@/lib/auth/client";
import { siGithub } from "simple-icons";

// role="img" aria-label="GitHub" —— 无障碍访问（Accessibility）
// viewBox="0 0 24 24" —— 图标的“画布大小”（最最最核心！）
// fill="currentColor" —— 让图标随主题变色（神级属性！）
// dangerouslySetInnerHTML={{ __html: siGithub.svg }} —— 把图标“路径”塞进去
// xmlns = XML Namespace 的缩写,它的作用就是告诉浏览器：“我这里面写的不是普通 HTML，而是 SVG（或其他语言），请用对应的规则来解析我！”
function GithubIcon() {
  return (
    <svg
      role="img"
      aria-label="GitHub"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className="h-5 w-5"
      dangerouslySetInnerHTML={{ __html: siGithub.svg }}
    />
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { locale, dictionary } = useLocale();
  const session = authClient.useSession();
  const isAuthenticated = Boolean(session.data?.user);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 首页图标 */}
        <div className="flex items-center flex-1">
          <Link href={locale === 'en' ? '/' : `/${locale}/`} className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              ShipBase
            </span>
          </Link>
        </div>

        {/* 功能特征，价格方案，blog， 文档 */}
        <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
          {/* 功能特征 */}
          <Link
            href={locale === 'en' ? '/features' : `/${locale}/features`}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors"
          >
            {dictionary.header.features}
          </Link>
          {/* 价格方案 */}
          <Link
            href={locale === 'en' ? '/pricing' : `/${locale}/pricing`}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors"
          >
            {dictionary.header.pricing}
          </Link>
          {/* blog */}
          <Link
            href={locale === 'en' ? '/blogs' : `/${locale}/blogs`}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors"
          >
            Blog
          </Link>
          {/* 文档 */}
          <Link
            href={locale === 'en' ? '/docs' : `/${locale}/docs`}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors"
          >
            {dictionary.header.docs}
          </Link>
        </nav>

        {/* Github 语言选择 明亮选择 登陆 免费试用 */}
        <div className="hidden md:flex items-center space-x-2 flex-1 justify-end">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            aria-label="GitHub"
          >
            <GithubIcon />
          </a>
          {/* 语言切换器 currentLocale={locale}：给LanguageSwitcher传递一个props(属性)，名字叫LanguageSwitcher，值是locale*/}
          <LanguageSwitcher currentLocale={locale} />
          {/* 主题切换器 */}
          <ThemeSwitcher dictionary={dictionary.header} />
          {isAuthenticated ? (
            <UserMenu dictionary={dictionary.header} locale={locale} />
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href={locale === 'en' ? '/login' : `/${locale}/login`}>
                  {dictionary.header.login}
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild >
                <Link href={locale === 'en' ? '/signup' : `/${locale}/signup`}>
                  {dictionary.header.signup}
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* 移动端菜单按钮，应该是右上那三个横杠 */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* 移动端导航 */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
          <div className="px-4 py-6 space-y-4">
            {/* 功能特性 */}
            <Link
              href={locale === 'en' ? '/features' : `/${locale}/features`}
              className="block text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {dictionary.header.features}
            </Link>
            {/* 价格方案 */}
            <Link
              href={locale === 'en' ? '/pricing' : `/${locale}/pricing`}
              className="block text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {dictionary.header.pricing}
            </Link>
            {/* blog */}
            <Link
              href={locale === 'en' ? '/blogs' : `/${locale}/blogs`}
              className="block text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            {/* 文档 */}
            <Link
              href={locale === 'en' ? '/docs' : `/${locale}/docs`}
              className="block text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {dictionary.header.docs}
            </Link>
            
            {/* 移动端切换按钮 */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 flex-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <GithubIcon />
                  <span>GitHub</span>
                </a>
                <LanguageSwitcher currentLocale={locale} />
                <ThemeSwitcher dictionary={dictionary.header} />
              </div>
            </div>
            
            {/* 移动端用户菜单 */}
            <div className="pt-4 space-y-3">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                    <UserMenu dictionary={dictionary.header} locale={locale} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {session.data?.user?.name || "用户"}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {session.data?.user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" asChild className="flex-1">
                    <Link
                      href={locale === 'en' ? '/login' : `/${locale}/login`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {dictionary.header.login}
                    </Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link
                      href={locale === 'en' ? '/signup' : `/${locale}/signup`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {dictionary.header.signup}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
