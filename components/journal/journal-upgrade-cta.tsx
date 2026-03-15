"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Sparkles, BookOpen, Infinity } from "lucide-react";

export function JournalUpgradeCta() {
  const t = useTranslations("Journal");

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <span className="text-4xl">🌙</span>
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold text-foreground">
            {t("upgrade.title")}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("upgrade.description")}
          </p>
        </div>

        <div className="w-full flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary shrink-0" />
            <span>{t("upgrade.feature1")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Infinity className="w-4 h-4 text-primary shrink-0" />
            <span>{t("upgrade.feature2")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span>{t("upgrade.feature3")}</span>
          </div>
        </div>

        <Link
          href="/pricing"
          className="w-full text-center rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 transition-opacity"
        >
          {t("upgrade.cta")}
        </Link>
      </div>
    </div>
  );
}
