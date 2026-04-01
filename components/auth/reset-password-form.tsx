"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function ResetPasswordForm({
  locale,
  token,
  email,
}: {
  locale: string;
  token: string;
  email: string;
}) {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);

  const passwordTooShort = passwordTouched && password.length > 0 && password.length < 6;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error === "Invalid or expired token" ? t("resetTokenExpired") : t("resetPasswordError"));
        return;
      }

      router.push(`/${locale}/sign-in?reset=1`);
    } catch {
      setError(t("resetPasswordError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-1">
          <input
            type="password"
            placeholder={t("newPassword")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setPasswordTouched(true)}
            required
            className="w-full rounded-xl border border-border bg-background/90 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors"
          />
          {!passwordTouched && (
            <p className="text-xs text-muted-foreground/60 px-1">{t("passwordMinLength")}</p>
          )}
          {passwordTooShort && (
            <p className="text-xs text-destructive px-1">{t("passwordTooShort")}</p>
          )}
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={loading || password.length < 6}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md transition-opacity hover:opacity-90 disabled:opacity-40 cursor-pointer"
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {loading ? t("saving") : t("resetPassword")}
        </button>
      </form>
    </div>
  );
}
