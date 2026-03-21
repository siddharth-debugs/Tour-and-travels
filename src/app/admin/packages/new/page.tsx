import { db } from "@/lib/db";
import { PackageForm } from "../_components/package-form";

export const dynamic = "force-dynamic";

export default async function NewPackagePage() {
  const destinations = await db.destination.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Package</h1>
        <p className="text-sm text-muted-foreground">
          Create a new tour package
        </p>
      </div>
      <PackageForm mode="create" destinations={destinations} />
    </div>
  );
}
