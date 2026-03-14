import Stripe from "stripe";

const globalForStripe = globalThis as unknown as { stripe: Stripe };

export function getStripe(): Stripe {
  if (globalForStripe.stripe) return globalForStripe.stripe;

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  const client = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-02-25.clover",
  });

  if (process.env.NODE_ENV !== "production") globalForStripe.stripe = client;

  return client;
}
