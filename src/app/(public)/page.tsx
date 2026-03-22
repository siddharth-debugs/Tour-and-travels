import { Metadata } from "next";
import { db } from "@/lib/db";
import { SITE_CONFIG } from "@/lib/constants";
import { HeroSection } from "@/app/(public)/sections/hero";
import { DestinationsSection } from "@/app/(public)/sections/destinations";
import { PackagesSection } from "@/app/(public)/sections/packages";
import { WhyChooseUs } from "@/app/(public)/sections/why-choose-us";
import { TestimonialsSection } from "@/app/(public)/sections/testimonials";
import { CabsCTA } from "@/app/(public)/sections/cabs-cta";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
};

export const dynamic = "force-dynamic";

type DestinationWithCount = Awaited<ReturnType<typeof db.destination.findMany<{ include: { _count: { select: { packages: true } } } }>>>;
type PackageWithDestination = Awaited<ReturnType<typeof db.package.findMany<{ include: { destination: { select: { name: true } } } }>>>;
type TestimonialItem = Awaited<ReturnType<typeof db.testimonial.findMany>>;

export default async function HomePage() {
  let destinations: DestinationWithCount = [];
  let packages: PackageWithDestination = [];
  let testimonials: TestimonialItem = [];

  try {
    [destinations, packages, testimonials] = await Promise.all([
      db.destination.findMany({
        where: { featured: true },
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { packages: true } } },
      }),
      db.package.findMany({
        where: { featured: true },
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { destination: { select: { name: true } } },
      }),
      db.testimonial.findMany({
        where: { featured: true },
        take: 6,
        orderBy: { createdAt: "desc" },
      }),
    ]);
  } catch {
    // Database not connected yet — render with empty data
  }

  return (
    <>
      <HeroSection destinations={destinations} />
      <DestinationsSection destinations={destinations} />
      <PackagesSection packages={packages} />
      <WhyChooseUs />
      <TestimonialsSection testimonials={testimonials} />
      <CabsCTA />
    </>
  );
}
