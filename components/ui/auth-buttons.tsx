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
        <span className="text-xs text-muted-foreground hidden sm:block">
          {session.user.name ?? session.user.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: `/${locale}` })}
          className="flex items-center rounded-full border border-border px-3.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors duration-200 cursor-pointer"
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
        className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
      >
        {t("signInLink")}
      </Link>
      <Link
        href={`/${locale}/sign-up`}
        className="flex items-center rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-md transition-opacity hover:opacity-90"
      >
        {t("signUpLink")}
      </Link>
    </div>
  );
}
