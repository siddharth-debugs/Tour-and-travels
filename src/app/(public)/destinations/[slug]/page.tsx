import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin, Package } from "lucide-react";
import { db } from "@/lib/db";
import { SITE_CONFIG } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/section-heading";
import { TourCard } from "@/components/shared/tour-card";
import { Badge } from "@/components/ui/badge";

interface DestinationDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: DestinationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = await db.destination.findUnique({
    where: { slug },
    select: {
      name: true,
      description: true,
      image: true,
      region: true,
      metaTitle: true,
      metaDescription: true,
      metaKeywords: true,
      ogImage: true,
    },
  });

  if (!destination) {
    return { title: "Destination Not Found" };
  }

  const title =
    destination.metaTitle ?? `${destination.name} — ${SITE_CONFIG.name}`;
  const description =
    destination.metaDescription ?? destination.description.slice(0, 160);
  const ogImage = destination.ogImage ?? destination.image;

  return {
    title,
    description,
    keywords: destination.metaKeywords ?? undefined,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, alt: destination.name }],
      siteName: SITE_CONFIG.name,
    },
  };
}

export default async function DestinationDetailPage({
  params,
}: DestinationDetailPageProps) {
  const { slug } = await params;

  const destination = await db.destination.findUnique({
    where: { slug },
    include: {
      packages: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!destination) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.name,
    description: destination.description,
    image: destination.image,
    containedInPlace: {
      "@type": "Country",
      name: "India",
    },
    touristType: destination.region,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[55vh] min-h-[400px] flex items-end overflow-hidden">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

          {/* Breadcrumb */}
          <div className="absolute top-6 left-0 right-0 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-white/70">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="size-3.5" />
              <Link
                href="/destinations"
                className="hover:text-white transition-colors"
              >
                Destinations
              </Link>
              <ChevronRight className="size-3.5" />
              <span className="text-white font-medium">{destination.name}</span>
            </div>
          </div>

          {/* Hero content */}
          <div className="relative z-10 w-full px-4 sm:px-6 pb-12">
            <div className="max-w-7xl mx-auto">
              <Badge className="bg-primary text-primary-foreground mb-3 text-xs px-3 py-1">
                <MapPin className="size-3 mr-1" />
                {destination.region}
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                {destination.name}
              </h1>
              <p className="mt-2 text-white/70 flex items-center gap-1.5 text-sm">
                <Package className="size-4" />
                {destination.packages.length} package
                {destination.packages.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="py-16 px-4 sm:px-6 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {destination.description}
              </p>
            </div>
          </div>
        </section>

        {/* Packages in this destination */}
        {destination.packages.length > 0 && (
          <section className="py-16 px-4 sm:px-6 bg-muted/30 border-t border-border/50">
            <div className="max-w-7xl mx-auto">
              <div className="mb-10">
                <SectionHeading
                  title={`Packages in ${destination.name}`}
                  subtitle={`Explore ${destination.packages.length} curated tour package${destination.packages.length !== 1 ? "s" : ""} in ${destination.name}`}
                  align="left"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {destination.packages.map((pkg) => (
                  <TourCard
                    key={pkg.id}
                    title={pkg.title}
                    slug={pkg.slug}
                    image={
                      pkg.images[0] ??
                      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&auto=format&fit=crop"
                    }
                    badge={pkg.category}
                    href={`/packages/${pkg.slug}`}
                    price={pkg.price}
                    duration={pkg.duration}
                    groupSize={parseInt(pkg.groupSize, 10) || undefined}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA if no packages */}
        {destination.packages.length === 0 && (
          <section className="py-16 px-4 sm:px-6 bg-muted/30 border-t border-border/50">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-muted-foreground mb-4">
                No packages available for this destination yet. Check back soon!
              </p>
              <Link href="/packages">
                <button className="text-primary font-medium hover:underline text-sm">
                  Browse all packages →
                </button>
              </Link>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
