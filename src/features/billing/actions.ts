"use server";

import Stripe from "stripe";
import { withRole } from "@/lib/auth/withRole";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

// Part 7.2: checkout only ever collects payment and starts the Stripe
// subscription — it never flips subscription_status itself. Only the
// webhook (see /api/webhooks/stripe) does that, once Stripe actually
// confirms payment succeeded.
export const startSubscriptionCheckout = withRole(
  ["parent"],
  async (session): Promise<ActionResult<{ url: string }>> => {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRICE_ID_FAMILY_SUBSCRIPTION;
    if (!secretKey || !priceId) {
      // Real, honest failure — Stripe genuinely isn't configured in this
      // environment yet, not a fabricated checkout link.
      return { ok: false, error: "billing_not_configured" };
    }

    const stripe = new Stripe(secretKey);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/parent/billing?checkout=success`,
      cancel_url: `${appUrl}/parent/billing?checkout=cancelled`,
      client_reference_id: session.id,
      customer_email: session.email,
      metadata: { profile_id: session.id },
    });

    if (!checkoutSession.url) return { ok: false, error: "checkout_failed" };
    return { ok: true, data: { url: checkoutSession.url } };
  }
);

export async function getMySubscriptionStatus() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("profiles").select("subscription_status").eq("id", user.id).maybeSingle();
  return data?.subscription_status ?? null;
}
