"use client";

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SectionHeading } from "@/components/shared/section-heading";
import { TourCard } from "@/components/shared/tour-card";

interface Package {
  id: string;
  title: string;
  slug: string;
  images: string[];
  price: number;
  duration: string;
  groupSize: string;
  destination: { name: string };
}

interface PackagesSectionProps {
  packages: Package[];
}

export function PackagesSection({ packages }: PackagesSectionProps) {
  return (
    <section className="py-24 px-4 sm:px-6 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <SectionHeading
            title="Featured Packages"
            subtitle="Handpicked tours for unforgettable experiences — expertly curated with everything you need"
            align="center"
          />
        </div>

        {packages.length > 0 ? (
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {packages.map((pkg) => (
                  <CarouselItem
                    key={pkg.id}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <TourCard
                      title={pkg.title}
                      slug={pkg.slug}
                      image={pkg.images[0] ?? "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&auto=format&fit=crop"}
                      badge={pkg.destination.name}
                      href={`/packages/${pkg.slug}`}
                      price={pkg.price}
                      duration={pkg.duration}
                      groupSize={parseInt(pkg.groupSize, 10) || undefined}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation Buttons */}
              <CarouselPrevious className="-left-4 sm:-left-6 size-10 shadow-md border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors" />
              <CarouselNext className="-right-4 sm:-right-6 size-10 shadow-md border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors" />
            </Carousel>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="flex items-center justify-center size-24 rounded-3xl bg-primary/10 mb-6">
              <Compass className="size-12 text-primary/60" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Packages Coming Soon</h3>
            <p className="text-muted-foreground text-center max-w-sm leading-relaxed">
              Our travel experts are crafting handpicked tour packages. Amazing adventures await — stay tuned!
            </p>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Button nativeButton={false} render={<Link href="/packages" />} variant="default" size="lg" className="group gap-2 font-semibold">
            Browse All Packages
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
