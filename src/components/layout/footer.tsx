import Link from "next/link";
import { FooterDictionary, type Locale, locales } from "@/i18n/types";
import { Button } from "@/components/ui/button";

interface FooterProps {
  dictionary: FooterDictionary;
  currentLocale: string;
}

export function Footer({ dictionary, currentLocale }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const getLanguageLabel = (locale: Locale) => {
    switch (locale) {
      case 'en':
        return 'English';
      case 'zh':
        return '中文';
      case 'es':
        return 'Español';
      case 'ar':
        return 'العربية';
      case 'id':
        return 'Bahasa Indonesia';
      case 'pt':
        return 'Português';
      case 'fr':
        return 'Français';
      case 'ja':
        return '日本語';
      case 'ru':
        return 'Русский';
      case 'de':
        return 'Deutsch';
      default:
        return locale;
    }
  };

  
  return (
    <footer className="bg-gradient-to-b from-[#0a0f1f] via-[#0c1e3c] to-[#0a0f1f] border-t border-[#0f1f3f] shadow-[0_-10px_30px_-18px_rgba(18,194,233,0.4)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-slate-200">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* 公司信息 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src="https://datools.org/data-a-tools.webp"
                alt="DaTools"
                className="h-10 w-10 rounded-lg object-cover"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-[#12c2e9] via-[#1e5bff] to-[#f8a13c] bg-clip-text text-transparent">
                DaTools
              </span>
            </div>
            <p className="text-sm text-slate-300 max-w-xs">
              {/* 现代化的SaaS平台，帮助您快速构建和部署应用程序。 */}
              {dictionary.description}
            </p>
            <div className="flex space-x-4">
              {["twitter", "github", "linkedin"].map((network) => (
                <a
                  key={network}
                  href="#"
                  className="text-slate-400 hover:text-[#12c2e9] transition-colors"
                  aria-label={network}
                >
                  <span className="text-xs uppercase tracking-wide">{network}</span>
                </a>
              ))}
            </div>
          </div>

          {/* 产品 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-100">
              {/* 产品 */}
              {dictionary.product}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={currentLocale === 'en' ? '/features' : `/${currentLocale}/features`}
                  className="text-sm text-slate-300 hover:text-[#12c2e9] transition-colors"
                >
                  {/* 功能特性 */}
                  {dictionary.features}
                </Link>
              </li>
              <li>
                <Link
                  href={currentLocale === 'en' ? '/pricing' : `/${currentLocale}/pricing`}
                  className="text-sm text-slate-300 hover:text-[#12c2e9] transition-colors"
                >
                  {/* 价格方案 */}
                  {dictionary.pricing}
                </Link>
              </li>
              <li>
                <Link
                  href={currentLocale === 'en' ? '/integrations' : `/${currentLocale}/integrations`}
                  className="text-sm text-slate-300 hover:text-[#12c2e9] transition-colors"
                >
                  {/* 集成 */}
                  {dictionary.integrations}
                </Link>
              </li>
            </ul>
          </div>

          {/* 支持 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-100">
              {dictionary.support}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={currentLocale === 'en' ? '/docs' : `/${currentLocale}/docs`}
                  className="text-sm text-slate-300 hover:text-[#12c2e9] transition-colors"
                >
                  {dictionary.docs}
                </Link>
              </li>
              <li>
                <Link
                  href={currentLocale === 'en' ? '/help' : `/${currentLocale}/help`}
                  className="text-sm text-slate-300 hover:text-[#12c2e9] transition-colors"
                >
                  {dictionary.helpCenter}
                </Link>
              </li>
              <li>
                <Link
                  href={currentLocale === 'en' ? '/contact' : `/${currentLocale}/contact`}
                  className="text-sm text-slate-300 hover:text-[#12c2e9] transition-colors"
                >
                  {dictionary.contactUs}
                </Link>
              </li>
              <li>
                <Link
                  href={currentLocale === 'en' ? '/status' : `/${currentLocale}/status`}
                  className="text-sm text-slate-300 hover:text-[#12c2e9] transition-colors"
                >
                  {dictionary.serviceStatus}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-100">
              {dictionary.legal}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={currentLocale === 'en' ? '/privacy' : `/${currentLocale}/privacy`}
                  className="text-sm text-slate-300 hover:text-[#12c2e9] transition-colors"
                >
                  {dictionary.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link
                  href={currentLocale === 'en' ? '/terms' : `/${currentLocale}/terms`}
                  className="text-sm text-slate-300 hover:text-[#12c2e9] transition-colors"
                >
                  {dictionary.termsOfService}
                </Link>
              </li>
              <li>
                <Link
                  href={currentLocale === 'en' ? '/cookies' : `/${currentLocale}/cookies`}
                  className="text-sm text-slate-300 hover:text-[#12c2e9] transition-colors"
                >
                  {dictionary.cookiePolicy}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-[#0f1f3f] pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-slate-300">
              {dictionary.copyright.replace('2024', currentYear.toString())}
            </p>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-slate-300">
                {dictionary.madeWithLove}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-[#0f1f3f] pt-8">
          <div className="flex flex-col items-center justify-center gap-2 space-y-4 md:flex-row md:space-y-0">
            {locales.map((locale) => (
              <Link
                  key={locale}
                  href={locale === 'en' ? '/' : `/${locale}/`}
                  className="cursor-pointer"
              >
                <Button variant="outline" className="cursor-pointer border-[#1e5bff]/40 text-slate-100 hover:border-[#12c2e9] hover:text-[#12c2e9]">
                  {getLanguageLabel(locale)}
                </Button>
              </Link>
            ))}
          </div>

        </div>
      </div>

    </footer>
  );
}
