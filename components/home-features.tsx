import { getTranslations } from "next-intl/server";
import { Pencil, Cpu, Lightbulb, Infinity, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";

export async function HomeFeatures({ locale }: { locale: string }) {
  const t = await getTranslations("HomeFeatures");

  const steps = [
    { icon: Pencil, title: t("step1Title"), desc: t("step1Desc") },
    { icon: Cpu,    title: t("step2Title"), desc: t("step2Desc") },
    { icon: Lightbulb, title: t("step3Title"), desc: t("step3Desc") },
  ];

  const premiumCards = [
    { icon: Infinity,  title: t("premium1Title"), desc: t("premium1Desc") },
    { icon: Sparkles,  title: t("premium2Title"), desc: t("premium2Desc") },
    { icon: BookOpen,  title: t("premium3Title"), desc: t("premium3Desc") },
  ];

  return (
    <section className="w-full max-w-3xl mx-auto px-4 pt-20 pb-24 flex flex-col gap-24">

      {/* How it works */}
      <div
        className="opacity-0"
        style={{ animation: "fade-up 0.6s ease-out 0.9s both" }}
      >
        <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground/50 mb-8">
          {t("howItWorksHeading")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium features */}
      <div
        className="opacity-0"
        style={{ animation: "fade-up 0.6s ease-out 1.1s both" }}
      >
        <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground/50 mb-8">
          {t("premiumHeading")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {premiumCards.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card/50 p-5"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 self-start">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Closing CTA */}
        <div className="flex justify-center">
          <Link
            href={`/${locale}/sign-up`}
            className="flex items-center rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-md shadow-primary/20 transition-opacity hover:opacity-90"
          >
            {t("cta")}
          </Link>
        </div>
      </div>

    </section>
  );
}
