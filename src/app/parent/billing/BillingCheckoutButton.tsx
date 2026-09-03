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
          ? "Online subscription checkout is unavailable right now. Please contact Fennby support and we can finish setup for you."
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
