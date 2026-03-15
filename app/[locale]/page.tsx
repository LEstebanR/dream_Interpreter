import { getTranslations } from "next-intl/server";
import { Sparkles, BookOpen } from "lucide-react";
import { DreamSection } from "@/components/dream-section";
import { HomeAnimations } from "@/components/home-animations";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, session] = await Promise.all([getTranslations("Home"), auth()]);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-between w-full">
      <div className="relative z-10 flex-1 flex items-center w-full">
        <div className="flex flex-col items-center gap-3 w-full px-4">

          <HomeAnimations>
            {/* icon */}
            <div>
              <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl mb-1">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-sm" />
                <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_24px_oklch(var(--tw-shadow-color)/0.15)] shadow-primary">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>

            {/* title */}
            <h1
              className="text-5xl md:text-6xl font-bold tracking-tight text-center bg-gradient-to-br from-primary via-primary/85 to-secondary bg-clip-text text-transparent leading-tight pb-1"
            >
              {t("title")}
            </h1>
          </HomeAnimations>

          {/* client island */}
          <DreamSection subtitle={t("subtitle")} />

          {/* auth CTA — solo cuando no hay sesión */}
          {!session?.user ? (
            <div
              className="flex items-center gap-2 opacity-0"
              style={{ animation: "fade-up 0.6s ease-out 0.6s both" }}
            >
              <Link
                href={`/${locale}/sign-up`}
                className="flex items-center rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-xs font-medium text-primary-foreground shadow-md shadow-primary/20 transition-opacity hover:opacity-90"
              >
                {t("createAccount")}
              </Link>
              <Link
                href={`/${locale}/sign-in`}
                className="flex items-center rounded-full border border-border px-3.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors duration-200"
              >
                {t("signIn")}
              </Link>
            </div>
          ) : (
            <div
              className="opacity-0"
              style={{ animation: "fade-up 0.6s ease-out 0.6s both" }}
            >
              <Link
                href={`/${locale}/journal`}
                className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors duration-200"
              >
                <BookOpen className="w-3.5 h-3.5" />
                {t("viewJournal")}
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
