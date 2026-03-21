import { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { SITE_CONFIG, REGIONS, ITEMS_PER_PAGE } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/section-heading";
import { TourCard } from "@/components/shared/tour-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Explore Destinations — ${SITE_CONFIG.name}`,
  description:
    "Browse all travel destinations across India — North, South, East, and West. Find the perfect place for your next adventure with WanderQuest Travels.",
  openGraph: {
    title: `Explore Destinations — ${SITE_CONFIG.name}`,
    description:
      "Browse all travel destinations across India — curated for every traveler.",
    siteName: SITE_CONFIG.name,
  },
};

interface DestinationsPageProps {
  searchParams: Promise<{ region?: string; page?: string }>;
}

export default async function DestinationsPage({
  searchParams,
}: DestinationsPageProps) {
  const params = await searchParams;
  const region = params.region ?? null;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const perPage = ITEMS_PER_PAGE.public;
  const skip = (page - 1) * perPage;

  const where = region ? { region } : {};

  const [destinations, total] = await Promise.all([
    db.destination.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
      include: { _count: { select: { packages: true } } },
    }),
    db.destination.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  const buildUrl = (newPage: number, newRegion?: string | null) => {
    const p = new URLSearchParams();
    const r = newRegion !== undefined ? newRegion : region;
    if (r) p.set("region", r);
    if (newPage > 1) p.set("page", String(newPage));
    const qs = p.toString();
    return `/destinations${qs ? `?${qs}` : ""}`;
  };

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
            <span className="text-foreground font-medium">Destinations</span>
          </div>
          <SectionHeading
            title="Explore Destinations"
            subtitle="Discover breathtaking places across the length and breadth of India — each destination a story waiting to be lived."
            align="left"
          />
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 py-3 px-4 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <MapPin className="size-4" />
            Filter by Region:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href={buildUrl(1, null)}>
              <Button
                variant={!region ? "default" : "outline"}
                size="sm"
                className="text-xs h-8"
              >
                All Regions
              </Button>
            </Link>
            {REGIONS.map((r) => (
              <Link key={r} href={buildUrl(1, r)}>
                <Button
                  variant={region === r ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-8"
                >
                  {r}
                </Button>
              </Link>
            ))}
          </div>
          {region && (
            <Link href={buildUrl(1, null)} className="ml-auto">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                Clear Filter
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {region && (
            <p className="text-sm text-muted-foreground mb-6">
              Showing {total} destination{total !== 1 ? "s" : ""} in{" "}
              <span className="font-medium text-foreground">{region}</span>
            </p>
          )}

          {destinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {destinations.map((destination) => (
                <TourCard
                  key={destination.id}
                  title={destination.name}
                  slug={destination.slug}
                  image={destination.image}
                  badge={destination.region}
                  href={`/destinations/${destination.slug}`}
                  packageCount={destination._count.packages}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
                <MapPin className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No destinations found
              </h3>
              <p className="text-muted-foreground mb-6">
                {region
                  ? `No destinations available in ${region} yet.`
                  : "No destinations available yet. Check back soon!"}
              </p>
              {region && (
                <Link href="/destinations">
                  <Button variant="outline">View All Destinations</Button>
                </Link>
              )}
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

          {destinations.length > 0 && (
            <p className="text-center text-xs text-muted-foreground mt-4">
              Showing {skip + 1}–{Math.min(skip + perPage, total)} of {total}{" "}
              destination{total !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
