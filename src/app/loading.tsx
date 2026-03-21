import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="size-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium text-lg tracking-wide">
          WanderQuest Travels
        </p>
      </div>
    </div>
  );
}
