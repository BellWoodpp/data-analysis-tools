'use client';

import type { HomeFeedDictionary } from "@/i18n/types";
import { ToolCard } from "@/components/ui/tool-card";
import Search from "@/components/ui/search";
import { CategoryFilter } from "@/components/home/category-filter";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";


const normalize = (value: string) => value.toLowerCase();
const PAGE_SIZE = 5;

type HomeFeedContent = HomeFeedDictionary;
export function HomeFeed({ content }: { content: HomeFeedContent }) {
  const data = content;
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const query = (searchParams.get("query") ?? "").toLowerCase().trim();

  const categoryIndex = useMemo(() => {
    const map = new Map<string, Set<string>>();
    data.categories?.forEach((cat) => {
      map.set(cat.title, new Set(cat.items));
    });
    return map;
  }, [data.categories]);

  // 将分类条目展开成工具卡片数据
  const combinedTools = useMemo(() => {
    const list = [...data.tools];
    const existing = new Set(list.map((t) => t.name));

    data.categories?.forEach((cat) => {
      cat.items.forEach((item) => {
        if (existing.has(item)) return;
        list.push({
          name: item,
          summary: `${cat.title} · 推荐工具`,
          tags: [cat.title],
          pricing: "未提供",
          deployment: "未提供",
          link: "#",
          votes: 0,
          comments: 0,
        });
      });
    });

    return list;
  }, [data.categories, data.tools]);

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category);
    // 切换分类时清空搜索词并回到第一页，避免 query + page 残留导致列表为空
    const params = new URLSearchParams(searchParams);
    if (params.has("query")) params.delete("query");
    params.delete("page");
    const next = params.toString();
    replace(next ? `${pathname}?${next}` : pathname);
  };

  // 这段 useMemo 用来按当前分类 activeCategory 生成一个派生的工具列表 filteredByCategory
  const filteredByCategory = useMemo(() => {
    // 没有选中分类时，直接返回全部 combinedTools
    if (!activeCategory) return combinedTools;
    // 有分类时，先规范化分类名 term，再从 categoryIndex 取出该分类下的工具名集合 nameSet。
    const term = normalize(activeCategory);
    const nameSet = categoryIndex.get(activeCategory);
    // 最终返回满足条件的工具：要么工具名在 nameSet 里，要么工具的标签 tags 中有规范化后包含 term 的项。
    return combinedTools.filter((tool) =>
      (nameSet?.has(tool.name) ?? false) ||
      tool.tags.some((tag) => normalize(tag).includes(term)),
    );
  }, [combinedTools, activeCategory, categoryIndex]);

  // 这段 useMemo 定义并缓存按搜索词 query 过滤后的工具列表 filteredTools
  const filteredTools = useMemo(() => {
    // 如果没有搜索词（!query），直接用上一步按分类得到的 filteredByCategory。
    if (!query) return filteredByCategory;
    return filteredByCategory.filter((tool) =>
      `${tool.name} ${tool.summary} ${tool.tags.join(" ")}`.toLowerCase().includes(query),
    );
  }, [filteredByCategory, query]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredTools.length / PAGE_SIZE)), [filteredTools]);
  const pageParam = Number(searchParams.get("page") ?? "1");
  const parsedPage = Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1;
  const currentPage = Math.min(parsedPage, totalPages);

  const paginatedTools = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTools.slice(start, start + PAGE_SIZE);
  }, [filteredTools, currentPage]);

  const makePageHref = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const next = params.toString();
    return next ? `${pathname}?${next}` : pathname;
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    replace(makePageHref(page));
  };

  return (
    <main className="bg-gradient-to-b from-[#0a0f1f] via-[#0c1e3c] to-[#0a0f1f]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 lg:flex-row lg:gap-10">
        {/* 左侧：工具列表 */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                {data.subheading}
              </p>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                {data.heading}
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-[#1e5bff]/30 bg-[#0f172a]/80 p-4 shadow-[0_15px_40px_-20px_rgba(18,194,233,0.55)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <Search placeholder="搜索数据分析工具工具…" />
            </div>
            <p className="text-xs text-slate-300">
              支持按名称、标签、价格和部署方式快速筛选。
            </p>
            {data.categories?.length ? (
              <CategoryFilter
                categories={data.categories}
                active={activeCategory}
                onChange={handleCategoryChange}
              />
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {paginatedTools.map((tool) => (
              <ToolCard
                key={tool.name}
                tool={tool}
                viewDetailsLabel={data.viewDetailsLabel}
                visitSiteLabel={data.visitSiteLabel}
                highlightTerm={query}
              />
            ))}
          </div>
          {totalPages > 1 ? (
            <Pagination className="pt-2">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={makePageHref(Math.max(1, currentPage - 1))}
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    aria-disabled={currentPage === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNumber = idx + 1;
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href={makePageHref(pageNumber)}
                        isActive={pageNumber === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          goToPage(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    href={makePageHref(Math.min(totalPages, currentPage + 1))}
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    aria-disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </div>
      </div>
    </main>
  );
}
