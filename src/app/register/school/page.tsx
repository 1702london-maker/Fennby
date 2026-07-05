"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function RegisterSchoolPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <PageShell>
        <main className="max-w-xl mx-auto px-6 py-20 text-center">
          <Card tint="teal">
            <span className="text-5xl" aria-hidden>📨</span>
            <h1 className="font-display font-bold text-2xl mt-4 mb-2">Registration received</h1>
            <p className="text-charcoal-teal/80 leading-relaxed">
              Your school won&apos;t have live product access until a Fennby platform admin
              reviews and approves your registration. We&apos;ll be in touch shortly.
            </p>
          </Card>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-14">
        <h1 className="font-display font-bold text-3xl mb-2">Register your school</h1>
        <p className="text-charcoal-teal/70 mb-8">
          Your school will not have live access until a Fennby admin reviews this registration.
        </p>
        <Card>
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">School name</label>
                <input required className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">URN</label>
                <input required className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Local authority</label>
                <input className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">School type</label>
                <input className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="State Grammar" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Address</label>
              <input className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Contact person</label>
                <input required className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Number of pupils</label>
                <input type="number" className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Safeguarding lead contact</label>
                <input required className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Data protection contact</label>
                <input required className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Interest areas</label>
              <input className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="Pupil Premium reporting, cohort dashboards..." />
            </div>
            <Button type="submit" variant="primary" className="justify-center mt-2">Submit registration</Button>
          </form>
        </Card>
      </main>
    </PageShell>
  );
}
