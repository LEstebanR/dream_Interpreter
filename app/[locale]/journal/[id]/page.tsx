import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DreamDetail } from "@/components/journal/dream-detail";

export default async function JournalEntryPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await auth();

  if (!session?.user?.id) redirect(`/${locale}/sign-in`);
  if (!session.user.isPremium) redirect(`/${locale}/journal`);

  const entry = await prisma.dreamEntry.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      dreamText: true,
      interpretation: true,
      mood: true,
      tags: true,
      createdAt: true,
      userId: true,
    },
  });

  if (!entry || entry.userId !== session.user.id) notFound();

  const serialized = {
    id: entry.id,
    title: entry.title,
    dreamText: entry.dreamText,
    interpretation: entry.interpretation,
    mood: entry.mood,
    tags: entry.tags,
    createdAt: entry.createdAt.toISOString(),
  };

  return <DreamDetail entry={serialized} />;
}
