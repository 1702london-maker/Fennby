"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { usePreviewRole } from "@/lib/role-context";
import { Role } from "@/lib/types";

const roleRedirect: Record<Role, string> = {
  parent: "/parent",
  child: "/child/today",
  tutor: "/tutor",
  school_admin: "/school",
  teacher: "/teacher/dashboard",
  admin: "/admin/dashboard",
  safeguarding: "/safeguarding/dashboard",
  authority: "/authority/dashboard",
};

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = usePreviewRole();
  const [role, setLocalRole] = useState<Role>("parent");

  return (
    <PageShell>
      <main className="max-w-md mx-auto px-6 py-20">
        <h1 className="font-display font-bold text-3xl mb-2 text-center">Log in to Fennby</h1>
        <p className="text-charcoal-teal/70 text-center mb-8">
          Local preview only — no real authentication yet. Choose a role to simulate the sign-in redirect.
        </p>
        <Card>
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setRole(role);
              router.push(roleRedirect[role]);
            }}
          >
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input type="email" className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Password</label>
              <input type="password" className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Sign in as</label>
              <select
                value={role}
                onChange={(e) => setLocalRole(e.target.value as Role)}
                className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
              >
                <option value="parent">Parent</option>
                <option value="child">Child</option>
                <option value="tutor">Tutor</option>
                <option value="school_admin">School Admin</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Platform Admin</option>
                <option value="safeguarding">Designated Safeguarding Lead</option>
                <option value="authority">Local Authority Viewer</option>
              </select>
            </div>
            <Button type="submit" variant="primary" className="justify-center mt-2">Log in</Button>
          </form>
        </Card>
        <p className="text-center text-sm text-charcoal-teal/60 mt-6">
          Don&apos;t have an account? <a href="/register" className="text-teal-900 font-semibold hover:underline">Register</a>
        </p>
      </main>
    </PageShell>
  );
}
