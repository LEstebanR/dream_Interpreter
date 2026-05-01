import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { JournalList } from "@/components/journal/journal-list";
import { JournalUpgradeCta } from "@/components/journal/journal-upgrade-cta";
import Link from "next/link";
import { Plus } from "lucide-react";

const PAGE_SIZE = 10;

export default async function JournalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, session] = await Promise.all([getTranslations("Journal"), auth()]);

  if (!session?.user?.id) redirect(`/${locale}/sign-in`);

  if (!session.user.isPremium) {
    return <JournalUpgradeCta />;
  }

  const [entries, total] = await Promise.all([
    prisma.dreamEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      select: {
        id: true,
        title: true,
        dreamText: true,
        interpretation: true,
        mood: true,
        tags: true,
        createdAt: true,
      },
    }),
    prisma.dreamEntry.count({ where: { userId: session.user.id } }),
  ]);

  const serialized = entries.map((e) => ({
    ...e,
    createdAt: e.createdAt.toISOString(),
  }));

  return (
    <div className="flex flex-1 flex-col px-4 py-10">
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">{t("title")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
          </div>
          <Link
            href={`/${locale}`}
            className="shrink-0 flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {t("emptyCta")}
          </Link>
        </div>

        <JournalList
          initialEntries={serialized}
          initialHasMore={total > PAGE_SIZE}
          initialPage={1}
        />
      </div>
    </div>
  );
}
