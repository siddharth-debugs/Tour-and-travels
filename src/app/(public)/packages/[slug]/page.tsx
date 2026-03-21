import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, CheckCircle2, XCircle, Clock, Users, Tag, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { SITE_CONFIG, CATEGORIES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { ImageGallery } from "@/components/shared/image-gallery";
import { SectionHeading } from "@/components/shared/section-heading";
import { TourCard } from "@/components/shared/tour-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface PackageDetailPageProps {
  params: Promise<{ slug: string }>;
}

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export async function generateStaticParams() {
  const packages = await db.package.findMany({
    select: { slug: true },
  });
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PackageDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await db.package.findUnique({
    where: { slug },
    select: {
      title: true,
      price: true,
      duration: true,
      images: true,
      destination: { select: { name: true } },
    },
  });

  if (!pkg) return { title: "Package Not Found" };

  return {
    title: `${pkg.title} — ${SITE_CONFIG.name}`,
    description: `${pkg.title} in ${pkg.destination.name}. ${pkg.duration} tour package starting from ${formatPrice(pkg.price)} per person.`,
    openGraph: {
      title: `${pkg.title} — ${SITE_CONFIG.name}`,
      description: `Explore ${pkg.title} — ${pkg.duration} in ${pkg.destination.name} from ${formatPrice(pkg.price)}/person.`,
      images: pkg.images[0]
        ? [{ url: pkg.images[0], alt: pkg.title }]
        : [],
      siteName: SITE_CONFIG.name,
    },
  };
}

export default async function PackageDetailPage({
  params,
}: PackageDetailPageProps) {
  const { slug } = await params;

  const pkg = await db.package.findUnique({
    where: { slug },
    include: { destination: true },
  });

  if (!pkg) notFound();

  // Related packages (same destination, exclude current)
  const relatedPackages = await db.package.findMany({
    where: {
      destinationId: pkg.destinationId,
      id: { not: pkg.id },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: { destination: { select: { name: true } } },
  });

  const categoryLabel =
    CATEGORIES.find((c) => c.value === pkg.category)?.label ?? pkg.category;

  const itinerary = Array.isArray(pkg.itinerary)
    ? (pkg.itinerary as unknown as ItineraryDay[])
    : [];

  const galleryImages = pkg.images.map((src, i) => ({
    src,
    alt: `${pkg.title} — photo ${i + 1}`,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.title,
    description: `${pkg.title} — ${pkg.duration} tour in ${pkg.destination.name}`,
    image: pkg.images,
    offers: {
      "@type": "Offer",
      price: pkg.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    touristType: categoryLabel,
    itinerary: itinerary.map((day) => ({
      "@type": "TouristAttraction",
      name: `Day ${day.day}: ${day.title}`,
      description: day.description,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen pb-32 lg:pb-0">
        {/* Breadcrumb */}
        <div className="border-b border-border/50 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
              <span className="text-foreground font-medium line-clamp-1">
                {pkg.title}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Gallery */}
              {galleryImages.length > 0 ? (
                <ImageGallery images={galleryImages} />
              ) : (
                <div className="h-64 bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                  No images available
                </div>
              )}

              {/* Title & badges */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                    {categoryLabel}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {pkg.destination.name}
                  </Badge>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                  {pkg.title}
                </h1>
              </div>

              {/* Info Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 rounded-xl bg-muted/50 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
                    <Clock className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm font-semibold">{pkg.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
                    <Users className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Group Size</p>
                    <p className="text-sm font-semibold">Up to {pkg.groupSize}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
                    <Tag className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="text-sm font-semibold">{categoryLabel}</p>
                  </div>
                </div>
              </div>

              {/* Itinerary */}
              {itinerary.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-5">
                    Day-by-Day Itinerary
                  </h2>
                  <Accordion>
                    {itinerary.map((day) => (
                      <AccordionItem key={day.day} value={`day-${day.day}`}>
                        <AccordionTrigger className="text-sm font-semibold py-4 hover:no-underline">
                          <span className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center size-7 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                              {day.day}
                            </span>
                            {day.title}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-10 text-muted-foreground leading-relaxed">
                            {day.description}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

              {/* Inclusions & Exclusions */}
              {(pkg.inclusions.length > 0 || pkg.exclusions.length > 0) && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-5">
                    What's Included
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Inclusions */}
                    {pkg.inclusions.length > 0 && (
                      <div className="p-5 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40">
                        <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
                          <CheckCircle2 className="size-4" />
                          Inclusions
                        </h3>
                        <ul className="space-y-2.5">
                          {pkg.inclusions.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 text-sm text-green-800 dark:text-green-200"
                            >
                              <CheckCircle2 className="size-4 text-green-500 shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Exclusions */}
                    {pkg.exclusions.length > 0 && (
                      <div className="p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40">
                        <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
                          <XCircle className="size-4" />
                          Exclusions
                        </h3>
                        <ul className="space-y-2.5">
                          {pkg.exclusions.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 text-sm text-red-800 dark:text-red-200"
                            >
                              <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Sticky Price Card */}
              <div className="sticky top-24 rounded-2xl border border-border/60 bg-card shadow-lg overflow-hidden">
                <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
                  <p className="text-sm font-medium opacity-80 mb-1">Starting from</p>
                  <p className="text-4xl font-extrabold tracking-tight">
                    {formatPrice(pkg.price)}
                  </p>
                  <p className="text-sm opacity-70 mt-0.5">per person</p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Clock className="size-4" /> Duration
                      </span>
                      <span className="font-medium">{pkg.duration}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Users className="size-4" /> Group Size
                      </span>
                      <span className="font-medium">Up to {pkg.groupSize}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Tag className="size-4" /> Category
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {categoryLabel}
                      </Badge>
                    </div>
                  </div>

                  <Link
                    href={`/book/${pkg.id}`}
                    className="block w-full"
                  >
                    <Button
                      size="lg"
                      className="w-full font-semibold gap-2 group shadow-md shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Book This Package
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>

                  <p className="text-xs text-center text-muted-foreground">
                    Free cancellation up to 7 days before departure
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Packages */}
          {relatedPackages.length > 0 && (
            <div className="mt-20">
              <Separator className="mb-12" />
              <SectionHeading
                title="More Packages in This Destination"
                subtitle={`Explore other tours in ${pkg.destination.name}`}
                align="left"
              />
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {relatedPackages.map((related) => (
                  <TourCard
                    key={related.id}
                    title={related.title}
                    slug={related.slug}
                    image={
                      related.images[0] ??
                      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&auto=format&fit=crop"
                    }
                    badge={related.destination.name}
                    href={`/packages/${related.slug}`}
                    price={related.price}
                    duration={related.duration}
                    groupSize={parseInt(related.groupSize, 10) || undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Sticky Book Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-sm border-t border-border/60 p-4 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Starting from</p>
              <p className="text-xl font-extrabold text-primary">
                {formatPrice(pkg.price)}
              </p>
            </div>
            <Link href={`/book/${pkg.id}`} className="flex-1 max-w-[200px]">
              <Button
                size="lg"
                className="w-full font-semibold gap-2 group"
              >
                Book Now
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
