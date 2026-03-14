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
    <div className="flex items-center gap-3">
      <Link
        href={`/${locale}/sign-in`}
        className="text-sm text-white/60 hover:text-white/90 transition-colors"
      >
        {t("signInLink")}
      </Link>
      <Link
        href={`/${locale}/sign-up`}
        className="text-sm bg-white/10 hover:bg-white/15 text-white px-3 py-1.5 rounded-lg transition-colors"
      >
        {t("signUpLink")}
      </Link>
    </div>
  );
}
