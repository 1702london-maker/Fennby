"use server";

import { z } from "zod";
import Stripe from "stripe";
import { withRole } from "@/lib/auth/withRole";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

export async function getOpenSittings() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("mock_exam_sittings")
    .select("*")
    .eq("status", "open")
    .order("sitting_date", { ascending: true });
  return data ?? [];
}

export async function getMySittingPurchases(learnerIds: string[]) {
  const supabase = await createClient();
  if (!learnerIds.length) return [];
  const { data } = await supabase.from("mock_exam_purchases").select("*").in("learner_id", learnerIds);
  return data ?? [];
}

// Part 1.4/7.6: gated per-sitting, not a subscription flag — this purchase
// record is the only thing that unlocks that one specific exam date.
const registerSchema = z.object({
  sittingId: z.string().uuid(),
  learnerId: z.string().uuid(),
});

export const registerForSitting = withRole(
  ["parent"],
  async (session, input: z.infer<typeof registerSchema>): Promise<ActionResult<{ checkoutUrl: string | null }>> => {
    const parsed = registerSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "validation_failed" };

    const supabase = await createClient();
    const { data: sitting } = await supabase.from("mock_exam_sittings").select("*").eq("id", parsed.data.sittingId).maybeSingle();
    if (!sitting) return { ok: false, error: "not_found" };

    const { data: existing } = await supabase
      .from("mock_exam_purchases")
      .select("id")
      .eq("sitting_id", parsed.data.sittingId)
      .eq("learner_id", parsed.data.learnerId)
      .maybeSingle();
    if (existing) return { ok: true, data: { checkoutUrl: null } };

    const { data: purchase, error } = await supabase
      .from("mock_exam_purchases")
      .insert({
        sitting_id: parsed.data.sittingId,
        learner_id: parsed.data.learnerId,
        parent_id: session.id,
        amount: sitting.price,
      })
      .select("id")
      .single();
    if (error || !purchase) return { ok: false, error: error?.message ?? "register_failed" };

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      // Honest partial state: registered, payment collection genuinely
      // isn't switched on in this environment yet.
      return { ok: false, error: "billing_not_configured" };
    }

    const stripe = new Stripe(secretKey);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: { name: sitting.title },
            unit_amount: Math.round(Number(sitting.price) * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/parent/exams?sitting=success`,
      cancel_url: `${appUrl}/parent/exams?sitting=cancelled`,
      metadata: { purchase_id: purchase.id },
    });

    return { ok: true, data: { checkoutUrl: checkoutSession.url } };
  }
);
