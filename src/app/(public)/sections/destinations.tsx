import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { TourCard } from "@/components/shared/tour-card";

interface Destination {
  id: string;
  name: string;
  slug: string;
  image: string;
  region: string;
  _count: { packages: number };
}

interface DestinationsSectionProps {
  destinations: Destination[];
}

export function DestinationsSection({ destinations }: DestinationsSectionProps) {
  return (
    <section className="py-24 px-4 sm:px-6 bg-muted/30">
      {/* Extra top padding to account for hero search bar overlap */}
      <div className="max-w-7xl mx-auto pt-10">
        <div className="mb-12">
          <SectionHeading
            title="Popular Destinations"
            subtitle="Explore the most beautiful and sought-after places across the length and breadth of India"
            align="center"
          />
        </div>

        {destinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
          <div className="text-center py-16 text-muted-foreground">
            <p>No destinations available yet. Check back soon!</p>
          </div>
        )}

        {/* View All CTA */}
        <div className="mt-12 flex justify-center">
          <Button render={<Link href="/destinations" />} variant="outline" size="lg" className="group gap-2 font-semibold">
            View All Destinations
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
