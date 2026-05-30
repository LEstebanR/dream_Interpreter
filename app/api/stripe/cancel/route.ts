import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeSubscriptionId: true },
  });

  if (!user?.stripeSubscriptionId) {
    return NextResponse.json({ error: "No active subscription" }, { status: 400 });
  }

  try {
    await getStripe().subscriptions.cancel(user.stripeSubscriptionId);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    console.error("[stripe/cancel]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      isPremium: false,
      stripeSubscriptionId: null,
    },
  });

  return NextResponse.json({ success: true });
}
