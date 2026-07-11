"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { submitReferral, type ReferralInput } from "@/features/referrals/actions";

export function ReferralForm() {
  const router = useRouter();
  const [form, setForm] = useState<ReferralInput>({
    referralType: "family",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await submitReferral(form);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setForm({ referralType: "family", contactName: "", contactEmail: "", contactPhone: "", description: "" });
    router.refresh();
  };

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div>
        <label className="block text-sm font-semibold mb-1">Referral type</label>
        <div className="flex gap-3">
          {(["family", "school"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm((f) => ({ ...f, referralType: t }))}
              className={`px-4 py-2 rounded-full text-sm font-semibold min-h-[44px] ${
                form.referralType === t ? "bg-teal-900 text-white" : "bg-teal-100 text-teal-900"
              }`}
            >
              {t === "family" ? "👪 Vulnerable child/family" : "🏫 School"}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Contact name</label>
        <input required value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Contact email</label>
          <input type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Contact phone</label>
          <input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Description</label>
        <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 p-4 focus:border-teal-700 outline-none" />
      </div>
      {error && <p className="text-sm text-brick-600 font-semibold">{error}</p>}
      <Button type="submit" variant="primary" className="justify-center" disabled={loading}>
        {loading ? "Submitting…" : "Submit referral"}
      </Button>
    </form>
  );
}
