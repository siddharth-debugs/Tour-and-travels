import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { SITE_CONFIG } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/section-heading";
import { TourCard } from "@/components/shared/tour-card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Package } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCollection(slug: string) {
  return db.collection.findFirst({
    where: { slug, type: "PACKAGE" },
    include: {
      packages: {
        include: { destination: { select: { name: true, slug: true } } },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCollection(slug);
  if (!c) return { title: "Not Found" };
  const title =
    c.metaTitle ?? `${c.name} — ${SITE_CONFIG.name}`;
  const description =
    c.metaDescription ?? c.description ?? c.tagline ?? undefined;
  const ogImage = c.ogImage ?? c.image ?? undefined;
  return {
    title,
    description: description ?? undefined,
    keywords: c.metaKeywords ?? undefined,
    openGraph: {
      title,
      description: description ?? undefined,
      siteName: SITE_CONFIG.name,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function PackageCollectionPage({ params }: Props) {
  const { slug } = await params;
  const c = await getCollection(slug);
  if (!c) notFound();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative px-4 sm:px-6 py-24 border-b border-border/50 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <Link
              href="/packages"
              className="hover:text-foreground transition-colors"
            >
              Packages
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-medium">{c.name}</span>
          </div>
          <SectionHeading
            title={c.name}
            subtitle={c.tagline ?? c.description ?? undefined}
            align="left"
          />
        </div>
      </section>

      {/* Long-form content */}
      {c.content && (
        <section className="px-4 sm:px-6 py-10 border-b border-border/50">
          <div className="max-w-3xl mx-auto prose prose-sm sm:prose-base">
            {c.content.split("\n").map((p, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Packages */}
      <section className="px-4 sm:px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-muted-foreground mb-6">
            {c.packages.length === 0
              ? "No packages in this collection yet."
              : `${c.packages.length} package${
                  c.packages.length === 1 ? "" : "s"
                } in this collection`}
          </p>
          {c.packages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {c.packages.map((pkg) => (
                <TourCard
                  key={pkg.id}
                  title={pkg.title}
                  slug={pkg.slug}
                  image={
                    pkg.images[0] ??
                    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80"
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
                Nothing here yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Check back soon — we&rsquo;re adding new tours every week.
              </p>
              <Link href="/packages">
                <Button variant="outline">Browse all packages</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
