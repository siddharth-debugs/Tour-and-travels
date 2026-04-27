import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { PackageForm } from "../../_components/package-form";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

function parseItinerary(raw: unknown): ItineraryDay[] {
  if (!Array.isArray(raw)) return [];
  return (raw as unknown[]).filter(
    (item): item is ItineraryDay =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as ItineraryDay).day === "number" &&
      typeof (item as ItineraryDay).title === "string" &&
      typeof (item as ItineraryDay).description === "string"
  );
}

export default async function EditPackagePage({ params }: Props) {
  const { id } = await params;

  const [pkg, destinations] = await Promise.all([
    db.package.findUnique({ where: { id } }),
    db.destination.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!pkg) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <AdminPageHeader
        title={`Edit · ${pkg.title}`}
        description="Update content, SEO, and visibility for this package."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Packages", href: "/admin/packages" },
          { label: pkg.title },
        ]}
      />
      <PackageForm
        mode="edit"
        packageId={id}
        destinations={destinations}
        defaultValues={{
          title: pkg.title,
          destinationId: pkg.destinationId,
          price: pkg.price,
          duration: pkg.duration,
          groupSize: pkg.groupSize,
          category: pkg.category,
          itinerary: parseItinerary(pkg.itinerary),
          inclusions: pkg.inclusions,
          exclusions: pkg.exclusions,
          images: pkg.images,
          featured: pkg.featured,
          metaTitle: pkg.metaTitle ?? undefined,
          metaDescription: pkg.metaDescription ?? undefined,
          metaKeywords: pkg.metaKeywords ?? undefined,
          ogImage: pkg.ogImage ?? undefined,
        }}
      />
    </div>
  );
}
