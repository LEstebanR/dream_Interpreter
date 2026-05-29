"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

export function AuthButtons({
  showGuestLinks = true,
  signUpLabel,
  signInLabel,
}: {
  showGuestLinks?: boolean;
  signUpLabel?: string;
  signInLabel?: string;
} = {}) {
  const { status } = useSession();
  const t = useTranslations("Auth");
  const params = useParams();
  const locale = (params.locale as string) ?? "es";

  if (status === "authenticated") return null;

  if (!showGuestLinks) return null;

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/${locale}/sign-in`}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
      >
        {signInLabel ?? t("signInLink")}
      </Link>
      <Link
        href={`/${locale}/sign-up`}
        className="flex items-center rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-md transition-opacity hover:opacity-90"
      >
        {signUpLabel ?? t("signUpLink")}
      </Link>
    </div>
  );
}
