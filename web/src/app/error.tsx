"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 text-center">
      <h2 className="mb-4 text-2xl font-bold text-slate-900">Something went wrong!</h2>
      <p className="mb-8 text-slate-600">
        We apologize for the inconvenience. An unexpected error occurred.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="outline">
          Try again
        </Button>
        <Button onClick={() => (window.location.href = "/")}>Go Home</Button>
      </div>
    </div>
  );
}
