"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { motion } from "framer-motion";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (lang: "es" | "en") => {
    const next = lang === locale ? (locale === "es" ? "en" : "es") : lang;
    router.replace(pathname, { locale: next });
  };

  return (
    <div className="relative flex items-center rounded-full border border-border bg-muted/50 p-0.5 text-xs font-medium">
      {(["es", "en"] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => switchTo(lang)}
          className="relative z-10 w-10 py-1 cursor-pointer rounded-full"
        >
          {locale === lang && (
            <motion.div
              layoutId="locale-pill"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary shadow-sm"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <motion.span
            className="relative z-10 block text-center"
            animate={{
              color: locale === lang ? "var(--primary-foreground)" : "var(--muted-foreground)",
            }}
            transition={{ duration: 0.2 }}
          >
            {lang.toUpperCase()}
          </motion.span>
        </button>
      ))}
    </div>
  );
}
