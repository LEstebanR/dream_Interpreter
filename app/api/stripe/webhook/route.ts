import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

// Necesario para leer el raw body y verificar la firma de Stripe
export const config = { api: { bodyParser: false } };

async function getUserByCustomerId(customerId: string) {
  return prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });
}

async function setUserPremium(userId: string, isPremium: boolean, subscriptionId?: string | null) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      isPremium,
      stripeSubscriptionId: subscriptionId ?? undefined,
    },
  });
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const userId = session.metadata?.userId;

        // Guardar stripeCustomerId si no está guardado aún (caso edge)
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { stripeCustomerId: customerId },
          });
        }

        const user = userId
          ? await prisma.user.findUnique({ where: { id: userId } })
          : await getUserByCustomerId(customerId);

        if (user) {
          await setUserPremium(user.id, true, subscriptionId);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const user = await getUserByCustomerId(customerId);
        if (!user) break;

        const isActive =
          subscription.status === "active" || subscription.status === "trialing";
        await setUserPremium(user.id, isActive, subscription.id);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const user = await getUserByCustomerId(customerId);
        if (!user) break;

        await setUserPremium(user.id, false, null);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const user = await getUserByCustomerId(customerId);
        if (!user) break;

        // No revocar acceso de inmediato — Stripe reintentará
        // Solo revocar si la suscripción ya está en estado past_due/unpaid
        const subId = typeof invoice.subscription === "string"
          ? invoice.subscription
          : invoice.subscription?.id;

        if (subId) {
          const subscription = await stripe.subscriptions.retrieve(subId);
          if (subscription.status === "past_due" || subscription.status === "unpaid") {
            await setUserPremium(user.id, false, subId);
          }
        }
        break;
      }

      default:
        // Ignorar eventos no manejados
        break;
    }
  } catch (err) {
    console.error(`[webhook] Error handling ${event.type}:`, err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
