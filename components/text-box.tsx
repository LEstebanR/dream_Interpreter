"use client";

import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Trash2, BookOpen, Check, Zap } from "lucide-react";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TextBox({
  interpretation,
  setInterpretation,
  setIsPremiumModel,
}: {
  interpretation: string;
  setInterpretation: (interpretation: string) => void;
  setIsPremiumModel?: (v: boolean) => void;
}) {
  const [dream, setDream] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [savedEntryId, setSavedEntryId] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [dailyLimit, setDailyLimit] = useState<number | null>(null);
  const t = useTranslations("TextBox");
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const isPremium = session?.user?.isPremium ?? false;
  const isLoggedIn = !!session?.user;

  const handleInterpret = async () => {
    if (!dream.trim()) return;
    setIsLoading(true);
    setRateLimited(false);
    try {
      const response = await fetch("/api/interpret", {
        method: "POST",
        body: JSON.stringify({ dream, locale }),
      });
      const data = await response.json();
      if (response.status === 429) {
        setRateLimited(true);
        if (data.limit != null) setDailyLimit(data.limit);
        return;
      }
      if (data.interpretation) {
        setInterpretation(data.interpretation);
        setIsPremiumModel?.(data.isPremium ?? false);
        if (data.remaining != null) setRemaining(data.remaining);
        if (data.limit != null) setDailyLimit(data.limit);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const canSend = !isLoading && !!dream.trim() && !interpretation;

  const handleSaveToJournal = async () => {
    if (!isLoggedIn || !isPremium) {
      router.push(`/${locale}/pricing`);
      return;
    }
    setSaveState("saving");
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dreamText: dream, interpretation }),
      });
      const data = await res.json();
      if (res.ok) {
        setSavedEntryId(data.entry.id);
        setSaveState("saved");
      } else {
        setSaveState("idle");
      }
    } catch {
      setSaveState("idle");
    }
  };

  return (
    <div className="w-full max-w-3xl px-4 pb-6">
      {/* glow border wrapper */}
      <div className="relative rounded-2xl p-px">
        {/* animated gradient border */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            opacity: isFocused ? 1 : 0,
            background: isFocused
              ? "linear-gradient(135deg, var(--primary), var(--secondary), var(--primary))"
              : "none",
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {/* static fallback border */}
        <div className="absolute inset-0 rounded-2xl border border-border" />

        {/* inner card */}
        <div className="relative rounded-2xl bg-background/90 backdrop-blur-md overflow-hidden">
          <AnimatePresence mode="wait">
            {rateLimited ? (
              <motion.div
                key="ratelimit-cta"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col items-center justify-center gap-3 px-6 py-8 text-center min-h-[8rem]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{t("rateLimitTitle")}</p>
                  <p className="text-xs text-muted-foreground max-w-xs">{t("rateLimitDesc")}</p>
                </div>
                <button
                  onClick={() => router.push(`/${locale}/pricing`)}
                  className="mt-1 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2 text-xs font-medium text-primary-foreground shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {t("rateLimitCta")}
                </button>
                <button
                  onClick={() => setRateLimited(false)}
                  className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer"
                >
                  {t("rateLimitDismiss")}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="textarea-area"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* loading pulse overlay */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.06, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 z-10 pointer-events-none bg-primary rounded-2xl"
                    />
                  )}
                </AnimatePresence>

                <Textarea
                  placeholder={t("placeholder")}
                  className="w-full min-h-[8rem] max-h-[14rem] resize-none border-0 bg-transparent focus-visible:ring-0 shadow-none px-5 pt-5 pb-2 text-base leading-relaxed placeholder:text-muted-foreground/40"
                  value={dream}
                  onChange={(e) => setDream(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleInterpret();
                    }
                  }}
                  readOnly={!!interpretation}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* footer row — hidden when rate limit CTA is shown */}
          <AnimatePresence>
            {!rateLimited && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between px-5 pb-4 pt-1"
              >
            <AnimatePresence mode="wait">
              {interpretation ? (
                <motion.button
                  key="save"
                  initial={{ opacity: 0, y: 4, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 4, filter: "blur(4px)" }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onClick={saveState === "saved" ? () => router.push(`/${locale}/journal/${savedEntryId}`) : handleSaveToJournal}
                  disabled={saveState === "saving"}
                  className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition-colors duration-200 cursor-pointer disabled:opacity-50 ${
                    saveState === "saved"
                      ? "border-primary/40 text-primary hover:border-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-primary/60"
                  }`}
                >
                  {saveState === "saving" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {saveState === "saved" && <Check className="w-3.5 h-3.5" />}
                  {saveState === "idle" && <BookOpen className="w-3.5 h-3.5" />}
                  {saveState === "saved" ? t("viewInJournal") : saveState === "saving" ? t("saving") : t("saveToJournal")}
                </motion.button>
              ) : !isPremium && remaining !== null && dailyLimit !== null ? (
                <motion.span
                  key="remaining"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs text-muted-foreground/40 tabular-nums select-none"
                >
                  {t("remaining", { remaining, limit: dailyLimit })}
                </motion.span>
              ) : (
                dream.length > 0 && (
                  <motion.span
                    key="count"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs text-muted-foreground/40 tabular-nums select-none"
                  >
                    {dream.length}
                  </motion.span>
                )
              )}
            </AnimatePresence>

            <div className="ml-auto">
              <AnimatePresence mode="wait">
                {interpretation ? (
                  <motion.button
                    key="clear"
                    initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setInterpretation(""); setDream(""); setSaveState("idle"); setSavedEntryId(null); setRateLimited(false); }}
                    className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors duration-200 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t("clearDream")}
                  </motion.button>
                ) : (
                  <motion.button
                    key="send"
                    initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    whileHover={canSend ? { scale: 1.08 } : {}}
                    whileTap={canSend ? { scale: 0.93 } : {}}
                    onClick={handleInterpret}
                    disabled={!canSend}
                    className="relative flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-md transition-opacity duration-200 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer overflow-hidden"
                  >
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-1.5"
                        >
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          {t("interpreting")}
                        </motion.span>
                      ) : (
                        <motion.span
                          key="send"
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
