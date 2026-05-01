"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

export function ForgotPasswordForm({ locale }: { locale: string }) {
  const t = useTranslations("Auth");
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") router.push(`/${locale}`);
  }, [status, locale, router]);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {
      setError(t("forgotPasswordError"));
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-3 text-center">
        <p className="text-sm text-foreground">{t("forgotPasswordSent")}</p>
        <p className="text-xs text-muted-foreground">{t("forgotPasswordSentDesc")}</p>
        <a
          href={`/${locale}/sign-in`}
          className="mt-2 text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
        >
          {t("backToSignIn")}
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <input
          type="email"
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-xl border border-border bg-background/90 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md transition-opacity hover:opacity-90 disabled:opacity-40 cursor-pointer"
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {loading ? t("sending") : t("sendResetLink")}
        </button>
      </form>

      <p className="text-center text-xs text-muted-foreground mt-1">
        <a href={`/${locale}/sign-in`} className="text-foreground hover:text-primary underline underline-offset-2 transition-colors">
          {t("backToSignIn")}
        </a>
      </p>
    </div>
  );
}
