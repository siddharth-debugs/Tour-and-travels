import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/page-header";
import { PackageForm } from "../_components/package-form";

export const dynamic = "force-dynamic";

export default async function NewPackagePage() {
  const destinations = await db.destination.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <AdminPageHeader
        title="New Package"
        description="Create a new tour package."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Packages", href: "/admin/packages" },
          { label: "New" },
        ]}
      />
      <PackageForm mode="create" destinations={destinations} />
    </div>
  );
}
