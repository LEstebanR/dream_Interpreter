import { getTranslations } from "next-intl/server";
import { Sparkles, BookOpen, ChevronDown } from "lucide-react";
import { DreamSection } from "@/components/dream-section";
import { HomeAnimations } from "@/components/home-animations";
import { HomeFeatures } from "@/components/home-features";
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
    <div className="relative flex flex-1 flex-col items-center w-full">

      {/* Hero — fills the full viewport below the header */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-[calc(100vh-3rem)] px-4 py-16">
        <div className="flex flex-col items-center gap-10 w-full">

          <HomeAnimations>
            {/* icon */}
            <div>
              <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-sm" />
                <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_24px_oklch(var(--tw-shadow-color)/0.15)] shadow-primary">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>

            {/* title */}
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-center bg-gradient-to-br from-primary via-primary/85 to-secondary bg-clip-text text-transparent leading-tight pb-1">
              {t("title")}
            </h1>
          </HomeAnimations>

          {/* client island */}
          <DreamSection subtitle={t("subtitle")} />

          {/* auth CTA — solo cuando no hay sesión */}
          {!session?.user ? (
            <div
              className="flex items-center gap-3 opacity-0"
              style={{ animation: "fade-up 0.6s ease-out 0.6s both" }}
            >
              <Link
                href={`/${locale}/sign-up`}
                className="flex items-center rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-md shadow-primary/20 transition-opacity hover:opacity-90"
              >
                {t("createAccount")}
              </Link>
              <Link
                href={`/${locale}/sign-in`}
                className="flex items-center rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors duration-200"
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
                className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors duration-200"
              >
                <BookOpen className="w-3.5 h-3.5" />
                {t("viewJournal")}
              </Link>
            </div>
          )}

        </div>

        {/* Scroll indicator — visible only when there's content below */}
        {!session?.user && (
          <div
            className="absolute bottom-8 opacity-0"
            style={{ animation: "fade-up 0.6s ease-out 1.4s both" }}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground/30 animate-bounce" />
          </div>
        )}
      </div>

      {/* Features section — solo para usuarios anónimos */}
      {!session?.user && <HomeFeatures locale={locale} />}

    </div>
  );
}
