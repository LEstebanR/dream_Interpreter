import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal" });
  return { title: `${t("privacyLink")} — OniricApp` };
}

export default async function PrivacyPage() {
  const t = await getTranslations("Legal");
  const p = t.raw("privacy") as Record<string, string>;

  const sections = [
    { title: p.s1Title, body: p.s1Body },
    { title: p.s2Title, body: p.s2Body },
    { title: p.s3Title, body: p.s3Body },
    { title: p.s4Title, body: p.s4Body },
    { title: p.s5Title, body: p.s5Body },
    { title: p.s6Title, body: p.s6Body },
  ];

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-16">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{p.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{p.updated}</p>
        </div>

        <p className="text-foreground/80 leading-relaxed">{p.intro}</p>

        <div className="flex flex-col gap-6">
          {sections.map((s) => (
            <section key={s.title} className="flex flex-col gap-2">
              <h2 className="text-base font-semibold text-foreground">{s.title}</h2>
              <p className="text-sm text-foreground/70 leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
