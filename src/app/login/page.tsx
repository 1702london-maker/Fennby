"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { login } from "@/features/auth/actions";

type RoleTab = "parent" | "tutor" | "school_admin" | "authority";

const roleTabs: { key: RoleTab; label: string; emoji: string; blurb: string }[] = [
  { key: "parent", label: "Parent", emoji: "👪", blurb: "See your child's progress, messages, and sessions." },
  { key: "tutor", label: "Tutor", emoji: "🎓", blurb: "Your students, schedule, and lesson notes." },
  { key: "school_admin", label: "School", emoji: "🏫", blurb: "Cohort dashboards and Pupil Premium reporting." },
  { key: "authority", label: "Council", emoji: "🏛️", blurb: "Anonymised regional impact dashboards." },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("as") as RoleTab) ?? null;
  const [tab, setTab] = useState<RoleTab | null>(
    roleTabs.some((r) => r.key === initialTab) ? initialTab : null
  );
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
    // The signed-in account's own role decides where it lands — middleware
    // redirects to the right dashboard automatically, regardless of which
    // tab was selected here. The tab is just a friendlier starting point.
    router.push(searchParams.get("next") ?? "/");
    router.refresh();
  };

  if (!tab) {
    return (
      <div className="grid sm:grid-cols-2 gap-4">
        {roleTabs.map((r) => (
          <button
            key={r.key}
            onClick={() => setTab(r.key)}
            className="text-left"
          >
            <Card className="hover:ring-2 hover:ring-teal-700 transition-shadow h-full">
              <span className="text-3xl" aria-hidden>{r.emoji}</span>
              <p className="font-display font-bold text-lg mt-2">{r.label} login</p>
              <p className="text-sm text-charcoal-teal/70 mt-1">{r.blurb}</p>
            </Card>
          </button>
        ))}
      </div>
    );
  }

  const activeTab = roleTabs.find((r) => r.key === tab)!;

  return (
    <Card>
      <button
        onClick={() => setTab(null)}
        className="text-sm font-semibold text-teal-900 hover:underline mb-4 flex items-center gap-1"
      >
        ← Not {activeTab.label.toLowerCase()}? Choose again
      </button>
      <p className="text-sm font-semibold text-charcoal-teal/70 mb-4">
        {activeTab.emoji} Signing in as {activeTab.label.toLowerCase()}
      </p>
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
          Choose how you&apos;re signing in.
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
