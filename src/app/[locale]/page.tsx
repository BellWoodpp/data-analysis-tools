import { notFound } from "next/navigation";
import { HomeFeed } from "@/components/home/home-feed";
import { getDictionary, locales } from "@/i18n";

interface LocalePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function LocaleHome({ params }: LocalePageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  const normalizedLocale = locales.find((l) => l === locale);

  if (!normalizedLocale) {
    notFound();
  }

  const dictionary = getDictionary(normalizedLocale);

  return <HomeFeed content={dictionary.homeFeed} />;
}

export function generateStaticParams() {
  // 为支持的语言生成静态参数
  return locales.map((locale) => ({ locale }));
}

// 生成元数据
export async function generateMetadata({ params }: LocalePageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const normalizedLocale = locales.find((l) => l === locale);

  if (!normalizedLocale) {
    return {
      title: "Data Analysis Tools – 每日导航",
      description: "精选数据分析工具导航，覆盖 BI、ETL、AI 助手与自托管方案。",
    };
  }

  return {
    title: "Data Analysis Tools – 每日导航",
    description: "精选数据分析工具导航，覆盖 BI、ETL、AI 助手与自托管方案。",
  };
}
