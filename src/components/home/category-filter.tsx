'use client';

import { Button } from "@/components/ui/button";
import type { HomeFeedDictionary } from "@/i18n/types";

type Category = NonNullable<HomeFeedDictionary["categories"]>[number];

interface CategoryFilterProps {
  categories: Category[];
  active: string | null;
  onChange: (title: string | null) => void;
}

export function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  const current = active ?? "";

  if (!categories.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <Button
          key={cat.title}
          variant={cat.title === current ? "default" : "outline"}
          size="sm"
          className="w-28 whitespace-normal text-center leading-tight h-auto min-h-[48px]"
          onClick={() => onChange(cat.title === current ? null : cat.title)}
        >
          {cat.title}
        </Button>
      ))}
    </div>
  );
}
