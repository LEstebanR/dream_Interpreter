import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 10;

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!session.user.isPremium) {
    return NextResponse.json({ error: "Premium required" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const skip = (page - 1) * PAGE_SIZE;

  const [entries, total] = await Promise.all([
    prisma.dreamEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      skip,
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

  return NextResponse.json({
    entries: entries.map((e) => ({ ...e, createdAt: e.createdAt.toISOString() })),
    total,
    hasMore: skip + entries.length < total,
    page,
  });
}

const postSchema = z.object({
  dreamText: z.string().min(1).max(5000),
  interpretation: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!session.user.isPremium) {
    return NextResponse.json({ error: "Premium required" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const entry = await prisma.dreamEntry.create({
    data: {
      userId: session.user.id,
      dreamText: parsed.data.dreamText,
      interpretation: parsed.data.interpretation,
    },
  });

  return NextResponse.json(
    { entry: { ...entry, createdAt: entry.createdAt.toISOString() } },
    { status: 201 }
  );
}
