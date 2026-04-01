"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getMoodEmoji } from "@/lib/moods";
import type { JournalEntry } from "@/types/journal";

function formatTime(iso: string, locale: string) {
  return new Date(iso).toLocaleTimeString(locale === "es" ? "es-ES" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DreamCard({
  entry,
  locale,
}: {
  entry: JournalEntry;
  locale: string;
}) {
  const t = useTranslations("Journal");
  const emoji = getMoodEmoji(entry.mood);
  const title = entry.title ?? t("noTitle");
  const snippet = entry.interpretation ?? entry.dreamText;

  return (
    <Link
      href={`/journal/${entry.id}`}
      className="group flex flex-col gap-3 rounded-2xl border border-border bg-background/90 backdrop-blur-md px-5 py-4 hover:border-primary/40 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h2>
        {emoji && (
          <span className="shrink-0 text-base leading-none mt-0.5">{emoji}</span>
        )}
      </div>

      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
        {snippet}
      </p>

      <p className="text-xs text-muted-foreground/40 mt-auto tabular-nums">
        {formatTime(entry.createdAt, locale)}
      </p>
    </Link>
  );
}
