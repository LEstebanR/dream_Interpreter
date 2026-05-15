"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("ErrorPage");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl mb-1">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/10 blur-sm" />
        <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 shadow-[0_0_24px_oklch(var(--tw-shadow-color)/0.15)] shadow-destructive">
          <AlertCircle className="w-6 h-6 text-destructive" />
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
        <p className="text-sm text-muted-foreground max-w-xs">{t("description")}</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2 text-sm font-medium text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90 transition-opacity cursor-pointer"
        >
          {t("retry")}
        </button>
        <Link
          href="/"
          className="rounded-full border border-border px-5 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors"
        >
          {t("back")}
        </Link>
      </div>
    </div>
  );
}
