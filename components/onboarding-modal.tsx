"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Sparkles, BookOpen, Zap, Star } from "lucide-react";

const STORAGE_KEY = "oniric-onboarding-seen";

export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Onboarding");
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      // Small delay so the page renders first
      const timer = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  const handleRegister = () => {
    dismiss();
    router.push(`/${locale}/sign-up`);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2 rounded-2xl border border-border bg-background/95 backdrop-blur-md p-6 shadow-xl"
          >
            {/* Header */}
            <div className="flex flex-col items-center gap-2 mb-5">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-center text-foreground">{t("title")}</h2>
              <p className="text-xs text-muted-foreground text-center">{t("subtitle")}</p>
            </div>

            {/* How it works */}
            <div className="space-y-2.5 mb-4">
              <div className="flex items-start gap-3 rounded-xl bg-muted/40 px-3.5 py-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{t("step1Title")}</p>
                  <p className="text-xs text-muted-foreground">{t("step1Desc")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-muted/40 px-3.5 py-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary/20">
                  <Zap className="w-3.5 h-3.5 text-secondary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{t("step2Title")}</p>
                  <p className="text-xs text-muted-foreground">{t("step2Desc")}</p>
                </div>
              </div>
            </div>

            {/* Premium features */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-3 mb-5">
              <div className="flex items-center gap-1.5 mb-2">
                <Star className="w-3.5 h-3.5 text-primary" />
                <p className="text-xs font-semibold text-primary">{t("premiumTitle")}</p>
              </div>
              <ul className="space-y-1">
                {(["premiumFeature1", "premiumFeature2", "premiumFeature3"] as const).map((key) => (
                  <li key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="text-primary">✓</span>
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleRegister}
                className="w-full rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md hover:opacity-90 transition-opacity cursor-pointer"
              >
                {t("ctaRegister")}
              </button>
              <button
                onClick={dismiss}
                className="w-full rounded-full border border-border px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors cursor-pointer"
              >
                {t("ctaGuest")}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
