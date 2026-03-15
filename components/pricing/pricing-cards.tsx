"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { useState } from "react";
export function PricingCards({
  locale,
  isPremium,
}: {
  locale: string;
  isPremium: boolean;
}) {
  const t = useTranslations("Pricing");
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
    if (!priceId) return;

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, locale }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  };

  const handlePortal = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  };

  const freeFeatures = [
    t("free.feature1"),
    t("free.feature2"),
    t("free.feature3"),
  ];

  const premiumFeatures = [
    t("premium.feature1"),
    t("premium.feature2"),
    t("premium.feature3"),
    t("premium.feature4"),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
      {/* Free */}
      <div
        className="opacity-0 flex flex-col rounded-2xl border border-border bg-background/90 backdrop-blur-md px-8 py-8 gap-6"
        style={{ animation: "fade-up 0.6s ease-out 0.2s both" }}
      >
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("free.badge")}
          </span>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-4xl font-bold text-foreground">$0</span>
            <span className="text-muted-foreground mb-1">{t("perMonth")}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{t("free.description")}</p>
        </div>

        <ul className="flex flex-col gap-2 flex-1">
          {freeFeatures.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
              <Check className="w-4 h-4 text-primary shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <button
          disabled
          className="w-full rounded-full border border-border px-4 py-2 text-sm text-muted-foreground cursor-default"
        >
          {t("free.cta")}
        </button>
      </div>

      {/* Premium */}
      <div
        className="opacity-0 flex flex-col rounded-2xl border border-primary/40 bg-primary/5 backdrop-blur-md px-8 py-8 gap-6 relative overflow-hidden"
        style={{ animation: "fade-up 0.6s ease-out 0.3s both" }}
      >
        <div className="absolute top-4 right-4">
          <span className="rounded-full bg-gradient-to-r from-primary to-secondary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
            {t("premium.badge")}
          </span>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Premium
          </span>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-4xl font-bold text-foreground">
              {t("premium.price")}
            </span>
            <span className="text-muted-foreground mb-1">{t("perMonth")}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{t("premium.description")}</p>
        </div>

        <ul className="flex flex-col gap-2 flex-1">
          {premiumFeatures.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
              <Check className="w-4 h-4 text-primary shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        {isPremium ? (
          <button
            onClick={handlePortal}
            disabled={loading}
            className="w-full rounded-full border border-primary/60 px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-colors disabled:opacity-60"
          >
            {loading ? t("loading") : t("premium.manage")}
          </button>
        ) : (
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? t("loading") : t("premium.cta")}
          </button>
        )}
      </div>
    </div>
  );
}
