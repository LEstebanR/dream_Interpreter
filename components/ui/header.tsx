import { LocaleSwitcher } from "./locale-switcher";
import { UserMenu } from "./user-menu";
import { auth } from "@/lib/auth";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Header() {
  const [session, locale, t] = await Promise.all([
    auth(),
    getLocale(),
    getTranslations("Auth"),
  ]);

  return (
    <header className="flex justify-between items-center w-full px-4 py-3 sticky top-0 z-10 backdrop-blur-sm">
      <Link href={`/${locale}`} className="text-sm font-medium text-white/70 hover:text-white transition-colors">
        Oniric
      </Link>

      <div className="flex items-center gap-3">
        {session?.user ? (
          <UserMenu name={session.user.name ?? session.user.email ?? ""} locale={locale} />
        ) : (
          <>
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
          </>
        )}
        <LocaleSwitcher />
      </div>
    </header>
  );
}
