import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DestinationForm } from "../../_components/destination-form";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditDestinationPage({ params }: Props) {
  const { id } = await params;

  const destination = await db.destination.findUnique({ where: { id } });
  if (!destination) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <AdminPageHeader
        title={`Edit · ${destination.name}`}
        description="Update content, SEO, and visibility for this destination."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Destinations", href: "/admin/destinations" },
          { label: destination.name },
        ]}
      />
      <DestinationForm
        mode="edit"
        destinationId={id}
        defaultValues={{
          name: destination.name,
          description: destination.description,
          region: destination.region as
            | "North India"
            | "South India"
            | "East India"
            | "West India",
          image: destination.image,
          featured: destination.featured,
          metaTitle: destination.metaTitle ?? undefined,
          metaDescription: destination.metaDescription ?? undefined,
          metaKeywords: destination.metaKeywords ?? undefined,
          ogImage: destination.ogImage ?? undefined,
        }}
      />
    </div>
  );
}
