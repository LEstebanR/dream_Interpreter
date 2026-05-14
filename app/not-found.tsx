import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8 text-center font-sans antialiased">
        <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl mb-1">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-sm" />
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_24px_oklch(var(--tw-shadow-color)/0.15)] shadow-primary">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-br from-primary via-primary/85 to-secondary bg-clip-text text-transparent leading-tight pb-1">
            404
          </h1>
          <p className="text-lg font-semibold text-foreground">Page not found</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2 text-sm font-medium text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90 transition-opacity"
        >
          Go home
        </Link>
      </body>
    </html>
  );
}
