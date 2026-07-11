"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { startSubscriptionCheckout } from "@/features/billing/actions";

export function BillingCheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    setLoading(true);
    setError(null);
    const result = await startSubscriptionCheckout();
    setLoading(false);
    if (!result.ok) {
      setError(
        result.error === "billing_not_configured"
          ? "Subscriptions aren't switched on for this environment yet — STRIPE_SECRET_KEY and STRIPE_PRICE_ID_FAMILY_SUBSCRIPTION need adding to Vercel's environment variables first."
          : result.error
      );
      return;
    }
    window.location.href = result.data.url;
  };

  return (
    <div>
      <Button variant="primary" onClick={onClick} disabled={loading}>
        {loading ? "Redirecting…" : "Set up subscription"}
      </Button>
      {error && <p className="text-sm text-brick-600 font-semibold mt-3">{error}</p>}
    </div>
  );
}
