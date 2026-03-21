"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Filter, SortAsc } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  value: string;
  label: string;
}

interface Destination {
  id: string;
  name: string;
  slug: string;
}

interface PackagesFilterBarProps {
  categories: readonly Category[];
  destinations: Destination[];
  currentCategory: string | null;
  currentDestination: string | null;
  currentSort: string;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function PackagesFilterBar({
  categories,
  destinations,
  currentCategory,
  currentDestination,
  currentSort,
}: PackagesFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page"); // reset page on filter change
      if (value && value !== "__all__") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const qs = params.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 py-3 px-4 sm:px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Filter className="size-4" />
          <span className="hidden sm:inline">Filters:</span>
        </div>

        {/* Category Filter */}
        <Select
          value={currentCategory ?? "__all__"}
          onValueChange={(val) => updateFilter("category", val)}
        >
          <SelectTrigger className="h-8 text-xs w-44">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Destination Filter */}
        <Select
          value={currentDestination ?? "__all__"}
          onValueChange={(val) => updateFilter("destination", val)}
        >
          <SelectTrigger className="h-8 text-xs w-44">
            <SelectValue placeholder="All Destinations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Destinations</SelectItem>
            {destinations.map((dest) => (
              <SelectItem key={dest.id} value={dest.slug}>
                {dest.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <SortAsc className="size-4 text-muted-foreground hidden sm:block" />
          <Select
            value={currentSort}
            onValueChange={(val) => updateFilter("sort", val)}
          >
            <SelectTrigger className="h-8 text-xs w-44">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
