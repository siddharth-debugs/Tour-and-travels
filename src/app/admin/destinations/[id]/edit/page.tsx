import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { DestinationForm } from "../../_components/destination-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditDestinationPage({ params }: Props) {
  const { id } = await params;

  const destination = await db.destination.findUnique({ where: { id } });
  if (!destination) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Destination</h1>
        <p className="text-sm text-muted-foreground">
          Update details for{" "}
          <span className="font-medium">{destination.name}</span>
        </p>
      </div>
      <DestinationForm
        mode="edit"
        destinationId={id}
        defaultValues={{
          name: destination.name,
          description: destination.description,
          region: destination.region as "North India" | "South India" | "East India" | "West India",
          image: destination.image,
          featured: destination.featured,
        }}
      />
    </div>
  );
}
