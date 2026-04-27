import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/page-header";
import { CollectionForm } from "../_components/collection-form";

export const dynamic = "force-dynamic";

export default async function NewCollectionPage() {
  const [packages, destinations] = await Promise.all([
    db.package.findMany({
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        images: true,
        destination: { select: { name: true } },
      },
    }),
    db.destination.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, region: true, image: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <AdminPageHeader
        title="New Collection"
        description="Create a curated grouping that will optionally show in the navbar."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Collections", href: "/admin/collections" },
          { label: "New" },
        ]}
      />
      <CollectionForm
        mode="create"
        packages={packages.map((p) => ({
          id: p.id,
          title: p.title,
          destinationName: p.destination.name,
          image: p.images[0],
        }))}
        destinations={destinations.map((d) => ({
          id: d.id,
          name: d.name,
          region: d.region,
          image: d.image,
        }))}
      />
    </div>
  );
}
