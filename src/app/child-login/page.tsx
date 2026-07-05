"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { childLogin } from "@/features/auth/actions";

export default function ChildLoginPage() {
  const router = useRouter();
  const [learnerUsername, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await childLogin({ learnerUsername, pin });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/child/today");
    router.refresh();
  };

  return (
    <PageShell>
      <main className="max-w-sm mx-auto px-6 py-20 text-center">
        <span className="text-5xl" aria-hidden>🦊</span>
        <h1 className="font-display font-bold text-3xl mt-4 mb-2">Hiya! Ready to log in?</h1>
        <p className="text-charcoal-teal/70 mb-8">Ask a grown-up if you&apos;ve forgotten your username or PIN.</p>
        <Card>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="text-left">
              <label htmlFor="child-username" className="block text-sm font-semibold mb-1">Your username</label>
              <input
                id="child-username"
                required
                value={learnerUsername}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
              />
            </div>
            <div className="text-left">
              <label htmlFor="child-pin" className="block text-sm font-semibold mb-1">Your 6-digit PIN</label>
              <input
                id="child-pin"
                type="password"
                inputMode="numeric"
                maxLength={6}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none tracking-[0.5em] text-center"
              />
            </div>
            {error && <p className="text-sm text-brick-600 font-semibold">{error}</p>}
            <Button type="submit" variant="secondary" className="justify-center mt-2" disabled={loading}>
              {loading ? "Logging in…" : "Let's go!"}
            </Button>
          </form>
        </Card>
      </main>
    </PageShell>
  );
}
