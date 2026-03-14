"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

export function UserMenu({ name, locale }: { name: string; locale: string }) {
  const t = useTranslations("Auth");

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-white/60 hidden sm:block">{name}</span>
      <button
        onClick={() => signOut({ callbackUrl: `/${locale}` })}
        className="text-sm text-white/50 hover:text-white/80 transition-colors"
      >
        {t("signOut")}
      </button>
    </div>
  );
}
