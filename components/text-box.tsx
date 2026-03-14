"use client";

import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

export default function TextBox({
  interpretation,
  setInterpretation,
}: {
  interpretation: string;
  setInterpretation: (interpretation: string) => void;
}) {
  const [dream, setDream] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const t = useTranslations("TextBox");
  const locale = useLocale();

  const handleInterpret = async () => {
    if (!dream.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/interpret", {
        method: "POST",
        body: JSON.stringify({ dream, locale }),
      });
      const data = await response.json();
      setInterpretation(data.interpretation);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const canSend = !isLoading && !!dream.trim() && !interpretation;

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

          {/* footer row */}
          <div className="flex items-center justify-between px-5 pb-4 pt-1">
            <AnimatePresence>
              {dream.length > 0 && !interpretation && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs text-muted-foreground/40 tabular-nums select-none"
                >
                  {dream.length}
                </motion.span>
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
                    onClick={() => { setInterpretation(""); setDream(""); }}
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
          </div>
        </div>
      </div>
    </div>
  );
}
