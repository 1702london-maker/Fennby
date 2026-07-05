"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { login } from "@/features/auth/actions";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await login({ email, password });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(searchParams.get("next") ?? "/");
    router.refresh();
  };

  return (
    <Card>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <div>
          <label htmlFor="login-email" className="block text-sm font-semibold mb-1">Email</label>
          <input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm font-semibold mb-1">Password</label>
          <input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
          />
        </div>
        {error && <p className="text-sm text-brick-600 font-semibold">{error}</p>}
        <Button type="submit" variant="primary" className="justify-center mt-2" disabled={loading}>
          {loading ? "Signing in…" : "Log in"}
        </Button>
      </form>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <PageShell>
      <main className="max-w-md mx-auto px-6 py-20">
        <h1 className="font-display font-bold text-3xl mb-2 text-center">Log in to Fennby</h1>
        <p className="text-charcoal-teal/70 text-center mb-8">
          Parents, tutors, teachers, school admins, and staff sign in here.
        </p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
        <p className="text-center text-sm text-charcoal-teal/60 mt-6">
          Don&apos;t have an account? <a href="/register" className="text-teal-900 font-semibold hover:underline">Register</a>
        </p>
        <p className="text-center text-sm text-charcoal-teal/60 mt-2">
          Signing in as a child? <a href="/child-login" className="text-teal-900 font-semibold hover:underline">Child login</a>
        </p>
      </main>
    </PageShell>
  );
}
