import { db } from "@/lib/db";
import { notFound } from "next/navigation";
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
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Package</h1>
        <p className="text-sm text-muted-foreground">
          Update details for <span className="font-medium">{pkg.title}</span>
        </p>
      </div>
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
        }}
      />
    </div>
  );
}
