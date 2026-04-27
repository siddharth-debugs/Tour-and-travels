import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { SITE_CONFIG } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { ChevronRight, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCollection(slug: string) {
  return db.collection.findFirst({
    where: { slug, type: "DESTINATION" },
    include: {
      destinations: {
        include: { _count: { select: { packages: true } } },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCollection(slug);
  if (!c) return { title: "Not Found" };
  const title = c.metaTitle ?? `${c.name} — ${SITE_CONFIG.name}`;
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

export default async function DestinationCollectionPage({ params }: Props) {
  const { slug } = await params;
  const c = await getCollection(slug);
  if (!c) notFound();

  return (
    <div className="min-h-screen">
      <section className="relative px-4 sm:px-6 py-24 border-b border-border/50 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <Link
              href="/destinations"
              className="hover:text-foreground transition-colors"
            >
              Destinations
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

      {c.content && (
        <section className="px-4 sm:px-6 py-10 border-b border-border/50">
          <div className="max-w-3xl mx-auto">
            {c.content.split("\n").map((p, i) => (
              <p
                key={i}
                className="text-muted-foreground leading-relaxed mb-3"
              >
                {p}
              </p>
            ))}
          </div>
        </section>
      )}

      <section className="px-4 sm:px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-muted-foreground mb-6">
            {c.destinations.length === 0
              ? "No destinations in this collection yet."
              : `${c.destinations.length} destination${
                  c.destinations.length === 1 ? "" : "s"
                }`}
          </p>
          {c.destinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {c.destinations.map((d) => (
                <Link
                  key={d.id}
                  href={`/destinations/${d.slug}`}
                  className="group rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-[16/10] bg-muted">
                    {d.image && (
                      <Image
                        src={d.image}
                        alt={d.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                      <MapPin className="size-3" />
                      {d.region}
                    </div>
                    <h3 className="text-base font-semibold mb-1">{d.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {d._count.packages} package
                      {d._count.packages === 1 ? "" : "s"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
                <MapPin className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Nothing here yet</h3>
              <Link href="/destinations">
                <Button variant="outline">Browse all destinations</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
