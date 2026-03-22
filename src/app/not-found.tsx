import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPinOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 rounded-full p-6">
            <MapPinOff className="size-12 text-primary" />
          </div>
        </div>
        <h1 className="text-8xl font-extrabold text-primary mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button nativeButton={false} render={<Link href="/" />} size="lg">
          Go Home
        </Button>
      </div>
    </div>
  );
}
