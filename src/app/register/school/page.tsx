"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { submitContactMessage } from "@/features/contact/actions";

export default function RegisterSchoolPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    schoolName: "",
    urn: "",
    localAuthority: "",
    schoolType: "",
    address: "",
    contactPerson: "",
    contactEmail: "",
    pupilCount: "",
    safeguardingLead: "",
    dataProtectionContact: "",
    interestAreas: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const message = [
      `School: ${form.schoolName}`,
      `URN: ${form.urn}`,
      form.localAuthority && `Local authority: ${form.localAuthority}`,
      form.schoolType && `School type: ${form.schoolType}`,
      form.address && `Address: ${form.address}`,
      `Number of pupils: ${form.pupilCount || "not given"}`,
      `Safeguarding lead: ${form.safeguardingLead}`,
      `Data protection contact: ${form.dataProtectionContact}`,
      form.interestAreas && `Interest areas: ${form.interestAreas}`,
    ]
      .filter(Boolean)
      .join("\n");

    const result = await submitContactMessage({
      name: form.contactPerson,
      email: form.contactEmail,
      topic: "school",
      message,
    });
    setLoading(false);
    if (!result.ok) {
      const fieldMessages = result.fields ? Object.values(result.fields).flat().join(" ") : null;
      setError(fieldMessages || result.error);
      return;
    }
    setSubmitted(true);
  };

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
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">School name</label>
                <input required value={form.schoolName} onChange={(e) => setForm({ ...form, schoolName: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">URN</label>
                <input required value={form.urn} onChange={(e) => setForm({ ...form, urn: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Local authority</label>
                <input value={form.localAuthority} onChange={(e) => setForm({ ...form, localAuthority: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">School type</label>
                <input value={form.schoolType} onChange={(e) => setForm({ ...form, schoolType: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="State Grammar" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Address</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Contact person</label>
                <input required value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Contact email</label>
                <input type="email" required value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="you@school.org.uk" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Number of pupils</label>
              <input type="number" value={form.pupilCount} onChange={(e) => setForm({ ...form, pupilCount: e.target.value })} className="w-full sm:w-1/2 rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Safeguarding lead contact</label>
                <input required value={form.safeguardingLead} onChange={(e) => setForm({ ...form, safeguardingLead: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Data protection contact</label>
                <input required value={form.dataProtectionContact} onChange={(e) => setForm({ ...form, dataProtectionContact: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Interest areas</label>
              <input value={form.interestAreas} onChange={(e) => setForm({ ...form, interestAreas: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="Pupil Premium reporting, cohort dashboards..." />
            </div>
            {error && <p className="text-sm text-brick-600 font-semibold">{error}</p>}
            <Button type="submit" variant="primary" className="justify-center mt-2" disabled={loading}>
              {loading ? "Submitting…" : "Submit registration"}
            </Button>
          </form>
        </Card>
      </main>
    </PageShell>
  );
}
