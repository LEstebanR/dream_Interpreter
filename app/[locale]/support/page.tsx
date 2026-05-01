import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Mail } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal" });
  return { title: `${t("supportLink")} — OniricApp` };
}

export default async function SupportPage() {
  const t = await getTranslations("Support");

  const faqs = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
  ];

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-16">
      <div className="w-full max-w-2xl flex flex-col gap-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="flex flex-col divide-y divide-border/60">
          {faqs.map(({ q, a }, i) => (
            <div key={i} className="flex flex-col gap-2 py-5 first:pt-0">
              <h2 className="text-sm font-semibold text-foreground">{q}</h2>
              <p className="text-sm text-foreground/70 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-background/60 px-6 py-6 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-foreground">{t("contactTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("contactDesc")}</p>
          <a
            href="mailto:leramirezca@gmail.com"
            className="flex items-center gap-2 w-fit rounded-full border border-border px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            {t("contactCta")}
          </a>
        </div>
      </div>
    </div>
  );
}
