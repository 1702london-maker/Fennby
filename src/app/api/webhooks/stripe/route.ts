import Stripe from "stripe";
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Part 7.3: the ONLY place subscription_status flips to "active" — never on
// client-side checkout confirmation. Stripe's signed webhook payload is the
// sole source of truth for whether payment actually succeeded.
export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: "billing_not_configured" }, { status: 503 });
  }

  const stripe = new Stripe(secretKey);
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "missing_signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const profileId = session.client_reference_id ?? session.metadata?.profile_id;
      if (profileId) {
        await supabase.from("profiles").update({ subscription_status: "active" }).eq("id", profileId);
        const { data: existing } = await supabase.from("subscriptions").select("id").eq("parent_id", profileId).maybeSingle();
        if (existing) {
          await supabase.from("subscriptions").update({ status: "active" }).eq("id", existing.id);
        } else {
          await supabase.from("subscriptions").insert({ parent_id: profileId, plan_name: "Family subscription", status: "active" });
        }
      }
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerEmail = invoice.customer_email;
      if (customerEmail) {
        const { data: profile } = await supabase.from("profiles").select("id").eq("email", customerEmail).maybeSingle();
        if (profile) {
          await supabase.from("profiles").update({ subscription_status: "grace_period" }).eq("id", profile.id);
        }
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customer = await stripe.customers.retrieve(sub.customer as string);
      const email = "email" in customer ? customer.email : null;
      if (email) {
        const { data: profile } = await supabase.from("profiles").select("id").eq("email", email).maybeSingle();
        if (profile) {
          await supabase.from("profiles").update({ subscription_status: "suspended" }).eq("id", profile.id);
        }
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
