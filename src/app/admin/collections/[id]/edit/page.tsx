import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/page-header";
import { CollectionForm } from "../../_components/collection-form";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCollectionPage({ params }: Props) {
  const { id } = await params;

  const [collection, packages, destinations] = await Promise.all([
    db.collection.findUnique({
      where: { id },
      include: {
        packages: { select: { id: true } },
        destinations: { select: { id: true } },
      },
    }),
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

  if (!collection) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <AdminPageHeader
        title={`Edit · ${collection.name}`}
        description="Update copy, items, SEO, and visibility for this collection."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Collections", href: "/admin/collections" },
          { label: collection.name },
        ]}
      />
      <CollectionForm
        mode="edit"
        id={collection.id}
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
        defaults={{
          type: collection.type,
          name: collection.name,
          tagline: collection.tagline ?? undefined,
          description: collection.description ?? undefined,
          content: collection.content ?? undefined,
          image: collection.image ?? undefined,
          showInNav: collection.showInNav,
          featured: collection.featured,
          order: collection.order,
          metaTitle: collection.metaTitle ?? undefined,
          metaDescription: collection.metaDescription ?? undefined,
          metaKeywords: collection.metaKeywords ?? undefined,
          ogImage: collection.ogImage ?? undefined,
          packageIds: collection.packages.map((p) => p.id),
          destinationIds: collection.destinations.map((d) => d.id),
        }}
      />
    </div>
  );
}
