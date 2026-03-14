import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { ManageSubscriptionButton } from "@/components/billing/manage-subscription-button";

export default async function BillingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const { locale } = await params;
  const { success, canceled } = await searchParams;
  const [t, session] = await Promise.all([getTranslations("Billing"), auth()]);

  if (!session?.user) redirect(`/${locale}/sign-in`);

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-16">
      <div className="w-full max-w-md flex flex-col gap-6">

        {success && (
          <div className="flex items-center gap-3 rounded-xl bg-primary/10 border border-primary/20 px-4 py-3">
            <CheckCircle className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm text-foreground">{t("successMessage")}</p>
          </div>
        )}

        {canceled && (
          <div className="flex items-center gap-3 rounded-xl bg-muted border border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">{t("canceledMessage")}</p>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-background/90 backdrop-blur-md px-8 py-8 flex flex-col gap-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">{t("title")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t("currentPlan")}</span>
            <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
              session.user.isPremium
                ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                : "bg-muted text-muted-foreground border border-border"
            }`}>
              {session.user.isPremium ? "Premium" : t("freePlan")}
            </span>
          </div>

          {session.user.isPremium ? (
            <ManageSubscriptionButton locale={locale} />
          ) : (
            <Link
              href={`/${locale}/pricing`}
              className="w-full text-center rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 transition-opacity"
            >
              {t("upgradeToPremium")}
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
