import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, Users, MapPin } from "lucide-react";
import { db } from "@/lib/db";
import { SITE_CONFIG } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookingForm } from "./booking-form";

interface BookingPageProps {
  params: Promise<{ packageId: string }>;
}

export async function generateMetadata({
  params,
}: BookingPageProps): Promise<Metadata> {
  const { packageId } = await params;
  const pkg = await db.package.findUnique({
    where: { id: packageId },
    select: { title: true },
  });

  if (!pkg) return { title: "Package Not Found" };

  return {
    title: `Book ${pkg.title} — ${SITE_CONFIG.name}`,
    description: `Complete your booking for ${pkg.title} with WanderQuest Travels. Secure your spot today.`,
    robots: { index: false },
  };
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { packageId } = await params;

  const pkg = await db.package.findUnique({
    where: { id: packageId },
    include: { destination: { select: { name: true } } },
  });

  if (!pkg) notFound();

  const heroImage =
    pkg.images[0] ??
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border/50 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5 shrink-0" />
            <Link
              href="/packages"
              className="hover:text-foreground transition-colors"
            >
              Packages
            </Link>
            <ChevronRight className="size-3.5 shrink-0" />
            <Link
              href={`/packages/${pkg.slug}`}
              className="hover:text-foreground transition-colors line-clamp-1 max-w-[160px]"
            >
              {pkg.title}
            </Link>
            <ChevronRight className="size-3.5 shrink-0" />
            <span className="text-foreground font-medium">Book</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Complete Your Booking
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Fill in your details below and we'll confirm your reservation within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Package Summary — top on mobile, right column on desktop */}
          <div className="order-first lg:order-last lg:col-span-2">
            <div className="rounded-2xl border border-border/60 bg-card shadow-md overflow-hidden lg:sticky lg:top-24">
              {/* Package Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={heroImage}
                  alt={pkg.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-bold text-lg leading-tight line-clamp-2">
                    {pkg.title}
                  </p>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Destination */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4 text-primary shrink-0" />
                  <span>{pkg.destination.name}</span>
                </div>

                <Separator />

                {/* Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock className="size-4" /> Duration
                    </span>
                    <span className="font-medium">{pkg.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Users className="size-4" /> Group Size
                    </span>
                    <span className="font-medium">Up to {pkg.groupSize}</span>
                  </div>
                </div>

                <Separator />

                {/* Price */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Price per person</p>
                    <p className="text-2xl font-extrabold text-primary">
                      {formatPrice(pkg.price)}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs capitalize bg-primary/5 border-primary/20 text-primary"
                  >
                    {pkg.category}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground text-center pt-1">
                  Free cancellation up to 7 days before departure
                </p>
              </div>
            </div>
          </div>

          {/* Booking Form — left column on desktop, below summary on mobile */}
          <div className="order-last lg:order-first lg:col-span-3">
            <div className="rounded-2xl border border-border/60 bg-card shadow-md p-6 sm:p-8">
              <h2 className="text-lg font-bold text-foreground mb-6">
                Your Details
              </h2>
              <BookingForm packageId={pkg.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
