"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Loader2 } from "lucide-react";
import { DreamCard } from "./dream-card";
import type { JournalEntry } from "@/types/journal";

export function JournalList({
  initialEntries,
  initialHasMore,
  initialPage,
}: {
  initialEntries: JournalEntry[];
  initialHasMore: boolean;
  initialPage: number;
}) {
  const t = useTranslations("Journal");
  const locale = useLocale();
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    setLoading(true);
    try {
      const res = await fetch(`/api/journal?page=${page + 1}`);
      const data = await res.json();
      setEntries((prev) => [...prev, ...data.entries]);
      setPage(data.page);
      setHasMore(data.hasMore);
    } finally {
      setLoading(false);
    }
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <span className="text-5xl">🌙</span>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">{t("emptyTitle")}</p>
          <p className="text-xs text-muted-foreground">{t("emptyDescription")}</p>
        </div>
        <Link
          href="/"
          className="rounded-full border border-border px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors"
        >
          {t("emptyCta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {entries.map((entry) => (
          <DreamCard key={entry.id} entry={entry} locale={locale} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {loading ? t("loading") : t("loadMore")}
          </button>
        </div>
      )}
    </div>
  );
}
