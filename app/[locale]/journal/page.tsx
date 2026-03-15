import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { JournalList } from "@/components/journal/journal-list";
import { JournalUpgradeCta } from "@/components/journal/journal-upgrade-cta";

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
        <div>
          <h1 className="text-xl font-semibold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
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
