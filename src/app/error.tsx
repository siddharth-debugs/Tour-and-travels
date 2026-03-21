"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-destructive/10 rounded-full p-6">
            <AlertTriangle className="size-12 text-destructive" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-3">Something went wrong</h1>
        <p className="text-muted-foreground mb-8">
          An unexpected error occurred. Please try again or return to the home page.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="text-xs text-destructive bg-destructive/10 rounded p-3 mb-6 font-mono text-left break-all">
            {error.message}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} size="lg">
            Try Again
          </Button>
          <Button render={<Link href="/" />} variant="outline" size="lg">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
