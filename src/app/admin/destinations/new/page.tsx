import { AdminPageHeader } from "@/components/admin/page-header";
import { DestinationForm } from "../_components/destination-form";

export default function NewDestinationPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <AdminPageHeader
        title="New Destination"
        description="Add a new travel destination."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Destinations", href: "/admin/destinations" },
          { label: "New" },
        ]}
      />
      <DestinationForm mode="create" />
    </div>
  );
}
