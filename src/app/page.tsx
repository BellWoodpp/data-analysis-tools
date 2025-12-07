import { HomeFeed } from "@/components/home/home-feed";
import { getDictionary, defaultLocale } from "@/i18n";
import type { Metadata } from "next";

export default function RootPage() {
  const dictionary = getDictionary(defaultLocale);
  return <HomeFeed content={dictionary.homeFeed} />;
}

export const metadata: Metadata = {
  title: "Data Analysis Tools – 今日精选导航",
  description:
    "Discover trending data analysis tools: BI, ETL, AI 助手、自托管与云端解决方案的每日精选导航。",
};
