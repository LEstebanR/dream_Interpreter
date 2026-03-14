import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { PricingCards } from "@/components/pricing/pricing-cards";

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, session] = await Promise.all([
    getTranslations("Pricing"),
    auth(),
  ]);

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-16">
      <div
        className="opacity-0 flex flex-col items-center gap-2 mb-12"
        style={{ animation: "fade-up 0.6s ease-out 0.1s both" }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-br from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-center max-w-md">
          {t("subtitle")}
        </p>
      </div>

      <PricingCards locale={locale} isPremium={session?.user?.isPremium ?? false} />
    </div>
  );
}
