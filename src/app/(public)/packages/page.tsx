import { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { SITE_CONFIG, CATEGORIES, ITEMS_PER_PAGE } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/section-heading";
import { TourCard } from "@/components/shared/tour-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Package, SlidersHorizontal } from "lucide-react";
import { PackagesFilterBar } from "./packages-filter-bar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Tour Packages — ${SITE_CONFIG.name}`,
  description:
    "Browse hundreds of curated tour packages across India — adventure, honeymoon, family, religious, wildlife, and beach. Find your perfect trip with WanderQuest.",
  openGraph: {
    title: `Tour Packages — ${SITE_CONFIG.name}`,
    description:
      "Handpicked tour packages for every traveler across India.",
    siteName: SITE_CONFIG.name,
  },
};

interface PackagesPageProps {
  searchParams: Promise<{
    category?: string;
    destination?: string;
    sort?: string;
    page?: string;
  }>;
}

type SortOption = "price-asc" | "price-desc" | "newest";

export default async function PackagesPage({
  searchParams,
}: PackagesPageProps) {
  const params = await searchParams;
  const category = params.category ?? null;
  const destinationSlug = params.destination ?? null;
  const sort: SortOption =
    (params.sort as SortOption) ?? "newest";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const perPage = ITEMS_PER_PAGE.public;
  const skip = (page - 1) * perPage;

  // Fetch all destinations for the filter bar
  const allDestinations = await db.destination.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (destinationSlug) {
    const dest = allDestinations.find((d) => d.slug === destinationSlug);
    if (dest) where.destinationId = dest.id;
  }

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
      ? { price: "desc" as const }
      : { createdAt: "desc" as const };

  const [packages, total] = await Promise.all([
    db.package.findMany({
      where,
      orderBy,
      skip,
      take: perPage,
      include: { destination: { select: { name: true, slug: true } } },
    }),
    db.package.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  const buildUrl = (
    newPage: number,
    overrides?: {
      category?: string | null;
      destination?: string | null;
      sort?: string | null;
    }
  ) => {
    const p = new URLSearchParams();
    const cat = overrides?.category !== undefined ? overrides.category : category;
    const dest =
      overrides?.destination !== undefined ? overrides.destination : destinationSlug;
    const s = overrides?.sort !== undefined ? overrides.sort : sort;
    if (cat) p.set("category", cat);
    if (dest) p.set("destination", dest);
    if (s && s !== "newest") p.set("sort", s);
    if (newPage > 1) p.set("page", String(newPage));
    const qs = p.toString();
    return `/packages${qs ? `?${qs}` : ""}`;
  };

  const activeFiltersCount =
    (category ? 1 : 0) + (destinationSlug ? 1 : 0) + (sort !== "newest" ? 1 : 0);

  return (
    <div className="min-h-screen">
      {/* Page Hero */}
      <section className="relative py-24 px-4 sm:px-6 bg-gradient-to-br from-primary/10 via-background to-background border-b border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-medium">Packages</span>
          </div>
          <SectionHeading
            title="All Tour Packages"
            subtitle="Handcrafted itineraries across India — from mountain adventures to coastal escapes. Something for every kind of traveler."
            align="left"
          />
        </div>
      </section>

      {/* Filter Bar (client component) */}
      <PackagesFilterBar
        categories={CATEGORIES}
        destinations={allDestinations}
        currentCategory={category}
        currentDestination={destinationSlug}
        currentSort={sort}
      />

      {/* Results */}
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {total === 0 ? (
                "No packages found"
              ) : (
                <>
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {skip + 1}–{Math.min(skip + perPage, total)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-foreground">{total}</span>{" "}
                  package{total !== 1 ? "s" : ""}
                </>
              )}
            </p>
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""} active
                </span>
                <Link href="/packages">
                  <Button variant="ghost" size="sm" className="text-xs h-7">
                    Clear all
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {packages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {packages.map((pkg) => (
                <TourCard
                  key={pkg.id}
                  title={pkg.title}
                  slug={pkg.slug}
                  image={
                    pkg.images[0] ??
                    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&auto=format&fit=crop"
                  }
                  badge={pkg.destination.name}
                  href={`/packages/${pkg.slug}`}
                  price={pkg.price}
                  duration={pkg.duration}
                  groupSize={parseInt(pkg.groupSize, 10) || undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
                <Package className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No packages found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters to discover more packages.
              </p>
              <Link href="/packages">
                <Button variant="outline">Reset Filters</Button>
              </Link>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <Link
                href={buildUrl(page - 1)}
                aria-disabled={page <= 1}
                className={page <= 1 ? "pointer-events-none opacity-40" : ""}
              >
                <Button variant="outline" size="icon" className="size-9">
                  <ChevronLeft className="size-4" />
                </Button>
              </Link>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - page) <= 1
                  )
                  .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                      acc.push("...");
                    }
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, idx) =>
                    p === "..." ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 text-sm text-muted-foreground"
                      >
                        …
                      </span>
                    ) : (
                      <Link key={p} href={buildUrl(p as number)}>
                        <Button
                          variant={page === p ? "default" : "outline"}
                          size="icon"
                          className="size-9 text-sm"
                        >
                          {p}
                        </Button>
                      </Link>
                    )
                  )}
              </div>

              <Link
                href={buildUrl(page + 1)}
                aria-disabled={page >= totalPages}
                className={
                  page >= totalPages ? "pointer-events-none opacity-40" : ""
                }
              >
                <Button variant="outline" size="icon" className="size-9">
                  <ChevronRight className="size-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
