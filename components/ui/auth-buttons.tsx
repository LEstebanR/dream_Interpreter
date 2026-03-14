"use client";

import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

export function AuthButtons() {
  const { data: session, status } = useSession();
  const t = useTranslations("Auth");
  const params = useParams();
  const locale = (params.locale as string) ?? "es";

  if (status === "authenticated" && session?.user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-white/60 hidden sm:block">
          {session.user.name ?? session.user.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: `/${locale}` })}
          className="text-sm text-white/50 hover:text-white/80 transition-colors"
        >
          {t("signOut")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/${locale}/sign-in`}
        className="text-sm text-foreground/70 hover:text-foreground transition-colors px-3 py-1.5"
      >
        {t("signInLink")}
      </Link>
      <Link
        href={`/${locale}/sign-up`}
        className="text-sm border border-border hover:bg-accent text-foreground px-3 py-1.5 rounded-lg transition-colors"
      >
        {t("signUpLink")}
      </Link>
    </div>
  );
}
