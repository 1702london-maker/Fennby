"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { usePreviewRole } from "@/lib/role-context";

export default function RegisterParentPage() {
  const router = useRouter();
  const { setRole } = usePreviewRole();
  const [step, setStep] = useState<"parent" | "child">("parent");

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-14">
        <h1 className="font-display font-bold text-3xl mb-2">
          {step === "parent" ? "Create your parent account" : "Add your child's profile"}
        </h1>
        <p className="text-charcoal-teal/70 mb-8">
          {step === "parent"
            ? "You'll be able to add one or more children after this step."
            : "This information helps us tailor your child's learning — you can add more children later."}
        </p>

        {step === "parent" ? (
          <Card>
            <form
              className="grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setStep("child");
              }}
            >
              <div>
                <label className="block text-sm font-semibold mb-1">Full name</label>
                <input required className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="Ade Okafor" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input type="email" required className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Password</label>
                <input type="password" required className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
              </div>
              <Button type="submit" variant="primary" className="justify-center mt-2">Continue</Button>
            </form>
          </Card>
        ) : (
          <Card>
            <form
              className="grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setRole("parent");
                router.push("/parent");
              }}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">First name</label>
                  <input required className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Preferred name</label>
                  <input className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Date of birth</label>
                  <input type="date" required className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">School year</label>
                  <input className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="Year 5" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Current school</label>
                <input className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Target exam</label>
                  <input className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="11+ Grammar Entrance" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Target school</label>
                  <input className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Exam board</label>
                <input className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="GL Assessment" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Learning goals</label>
                <textarea rows={2} className="w-full rounded-2xl border-2 border-teal-100 p-4 focus:border-teal-700 outline-none" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">SEND notes</label>
                  <textarea rows={2} className="w-full rounded-2xl border-2 border-teal-100 p-4 focus:border-teal-700 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Accessibility needs</label>
                  <textarea rows={2} className="w-full rounded-2xl border-2 border-teal-100 p-4 focus:border-teal-700 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Emergency contact</label>
                <input className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" required className="mt-1 w-5 h-5 accent-teal-900" />
                <span className="text-sm">I confirm I am this child&apos;s parent or legal guardian and consent to Fennby&apos;s data handling as described in the Trust &amp; Safeguarding framework.</span>
              </label>
              <Button type="submit" variant="primary" className="justify-center mt-2">Create child profile &amp; go to dashboard</Button>
            </form>
          </Card>
        )}
      </main>
    </PageShell>
  );
}
