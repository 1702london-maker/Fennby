"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { submitContactMessage } from "@/features/contact/actions";

export function SchoolDemoForm() {
  const [name, setName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="text-center py-4">
        <span className="text-4xl" aria-hidden>✅</span>
        <p className="font-display font-bold text-lg mt-3 mb-1">Request sent</p>
        <p className="text-sm text-charcoal-teal/70">We&apos;ll be in touch to arrange a time.</p>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await submitContactMessage({
      name,
      email,
      topic: "school",
      message: `Demo request from ${schoolName || "a school"}, contact: ${name}.`,
    });
    setLoading(false);
    if (!result.ok) {
      setError(result.error === "validation_failed" ? "Please check your details and try again." : result.error);
      return;
    }
    setSubmitted(true);
  };

  return (
    <form className="grid gap-4 max-w-md" onSubmit={onSubmit}>
      <div>
        <label className="text-sm font-semibold block mb-1" htmlFor="school-contact-name">Your name</label>
        <input
          id="school-contact-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
        />
      </div>
      <div>
        <label className="text-sm font-semibold block mb-1" htmlFor="school-name">School name</label>
        <input
          id="school-name"
          required
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
          placeholder="e.g. Trafford Grammar Prep"
        />
      </div>
      <div>
        <label className="text-sm font-semibold block mb-1" htmlFor="school-email">Email</label>
        <input
          id="school-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
          placeholder="you@school.org.uk"
        />
      </div>
      {error && <p className="text-sm text-brick-600 font-semibold">{error}</p>}
      <Button type="submit" variant="primary" className="mt-2 justify-center" disabled={loading}>
        {loading ? "Sending…" : "Request a demo"}
      </Button>
    </form>
  );
}
