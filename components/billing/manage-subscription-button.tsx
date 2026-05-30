"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Step = "idle" | "confirm" | "loading" | "done" | "error";

export function ManageSubscriptionButton() {
  const t = useTranslations("Billing");
  const [step, setStep] = useState<Step>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCancel = async () => {
    setStep("loading");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/stripe/cancel", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setStep("done");
      } else {
        setErrorMsg(data.error ?? null);
        setStep("error");
      }
    } catch {
      setStep("error");
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <AnimatePresence mode="wait">
        {step === "idle" && (
          <motion.button
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setStep("confirm")}
            className="w-full rounded-full border border-primary/60 px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          >
            {t("manageSubscription")}
          </motion.button>
        )}

        {step === "confirm" && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 flex flex-col gap-2.5"
          >
            <p className="text-sm font-medium text-foreground">{t("cancelConfirmTitle")}</p>
            <p className="text-xs text-muted-foreground">{t("cancelConfirmDesc")}</p>
            <div className="flex gap-2 mt-0.5">
              <button
                onClick={handleCancel}
                className="flex-1 rounded-full border border-destructive/40 bg-destructive/8 px-3 py-1.5 text-xs font-medium text-destructive/80 hover:bg-destructive/15 hover:text-destructive transition-colors cursor-pointer"
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
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-1 text-center"
          >
            <p className="text-xs text-destructive">{t("cancelError")}</p>
            {errorMsg && (
              <p className="text-[11px] text-muted-foreground/60 font-mono">{errorMsg}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
