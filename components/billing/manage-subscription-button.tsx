"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export function ManageSubscriptionButton({ locale }: { locale: string }) {
  const t = useTranslations("Billing");
  const [loading, setLoading] = useState(false);

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

  return (
    <button
      onClick={handlePortal}
      disabled={loading}
      className="w-full rounded-full border border-primary/60 px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-colors disabled:opacity-60"
    >
      {loading ? t("loading") : t("manageSubscription")}
    </button>
  );
}
