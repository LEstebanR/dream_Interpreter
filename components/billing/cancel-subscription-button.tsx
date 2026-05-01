"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CancelSubscriptionButton() {
  const t = useTranslations("Billing");
  const [step, setStep] = useState<"idle" | "confirm" | "loading" | "done" | "error">("idle");

  const handleCancel = async () => {
    setStep("loading");
    try {
      const res = await fetch("/api/stripe/cancel", { method: "POST" });
      if (res.ok) {
        setStep("done");
      } else {
        setStep("error");
      }
    } catch {
      setStep("error");
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <AnimatePresence mode="wait">
        {step === "idle" && (
          <motion.button
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setStep("confirm")}
            className="text-xs text-muted-foreground/60 hover:text-destructive transition-colors cursor-pointer underline underline-offset-2"
          >
            {t("cancelSubscription")}
          </motion.button>
        )}

        {step === "confirm" && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="w-full rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 flex flex-col gap-2.5"
          >
            <p className="text-sm font-medium text-foreground">{t("cancelConfirmTitle")}</p>
            <p className="text-xs text-muted-foreground">{t("cancelConfirmDesc")}</p>
            <div className="flex gap-2 mt-0.5">
              <button
                onClick={handleCancel}
                className="flex-1 rounded-full bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:opacity-90 transition-opacity cursor-pointer"
              >
                {t("cancelConfirmYes")}
              </button>
              <button
                onClick={() => setStep("idle")}
                className="flex-1 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors cursor-pointer"
              >
                {t("cancelConfirmNo")}
              </button>
            </div>
          </motion.div>
        )}

        {step === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            {t("loading")}
          </motion.div>
        )}

        {step === "done" && (
          <motion.p
            key="done"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-muted-foreground text-center"
          >
            {t("cancelSuccess")}
          </motion.p>
        )}

        {step === "error" && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-destructive text-center"
          >
            {t("cancelError")}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
