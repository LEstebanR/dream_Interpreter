"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function GlobalError({
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
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8 text-center font-sans antialiased">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20">
          <AlertCircle className="w-6 h-6 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            An unexpected error occurred. Please try again.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2 text-sm font-medium text-primary-foreground shadow-md hover:opacity-90 transition-opacity cursor-pointer"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-border px-5 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors"
          >
            Go home
          </a>
        </div>
      </body>
    </html>
  );
}
