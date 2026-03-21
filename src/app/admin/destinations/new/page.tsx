import { DestinationForm } from "../_components/destination-form";

export default function NewDestinationPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Destination</h1>
        <p className="text-sm text-muted-foreground">
          Create a new travel destination
        </p>
      </div>
      <DestinationForm mode="create" />
    </div>
  );
}
