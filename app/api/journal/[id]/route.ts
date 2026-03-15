import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const patchSchema = z.object({
  title: z.string().max(200).optional(),
  dreamText: z.string().min(1).max(5000).optional(),
  mood: z.string().max(50).nullable().optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.isPremium)
    return NextResponse.json({ error: "Premium required" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const entry = await prisma.dreamEntry.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!entry || entry.userId !== session.user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.dreamEntry.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({
    entry: { ...updated, createdAt: updated.createdAt.toISOString() },
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.isPremium)
    return NextResponse.json({ error: "Premium required" }, { status: 403 });

  const { id } = await params;
  const entry = await prisma.dreamEntry.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!entry || entry.userId !== session.user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.dreamEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
