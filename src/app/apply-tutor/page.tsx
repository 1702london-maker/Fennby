"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { signUp, login } from "@/features/auth/actions";
import { submitTutorApplication } from "@/features/tutors/applicationActions";

const sendOptions = ["Dyslexia", "Autism", "ADHD", "Speech and language needs"];
const examBoardOptions = ["GL Assessment", "CEM", "FSCE", "AQA", "Edexcel", "OCR", "WJEC"];

export default function ApplyTutorPage() {
  const router = useRouter();
  const [account, setAccount] = useState({ fullName: "", email: "", password: "" });
  const [form, setForm] = useState({ experienceYears: "", subjects: "", dbsReference: "", examinerClaim: "" });
  const [sendExperience, setSendExperience] = useState<string[]>([]);
  const [examBoards, setExamBoards] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleSend = (opt: string) =>
    setSendExperience((s) => (s.includes(opt) ? s.filter((x) => x !== opt) : [...s, opt]));
  const toggleExamBoard = (opt: string) =>
    setExamBoards((s) => (s.includes(opt) ? s.filter((x) => x !== opt) : [...s, opt]));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const signUpResult = await signUp({
      email: account.email,
      password: account.password,
      fullName: account.fullName,
      intendedRole: "tutor",
    });
    if (!signUpResult.ok) {
      setLoading(false);
      const fieldMessages = signUpResult.fields ? Object.values(signUpResult.fields).flat().join(" ") : null;
      setError(fieldMessages || signUpResult.error);
      return;
    }

    // Real session must exist before submitTutorApplication (a role-gated
    // action) can succeed — checked, not assumed.
    const loginResult = await login({ email: account.email, password: account.password });
    if (!loginResult.ok) {
      setLoading(false);
      setError(loginResult.error);
      return;
    }

    const appResult = await submitTutorApplication({
      experienceYears: Number(form.experienceYears),
      subjects: form.subjects,
      dbsReference: form.dbsReference,
      sendExperience,
      examBoards,
      examinerClaim: form.examinerClaim || undefined,
    });
    setLoading(false);
    if (!appResult.ok) {
      const fieldMessages = appResult.fields ? Object.values(appResult.fields).flat().join(" ") : null;
      setError(fieldMessages || appResult.error);
      return;
    }
    router.push("/apply-tutor/confirmation");
    router.refresh();
  };

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-14">
        <h1 className="font-display font-bold text-4xl mb-2">Apply to become a Fennby tutor</h1>
        <p className="text-charcoal-teal/80 leading-relaxed mb-8">
          Every applicant completes identity verification, an enhanced DBS check, and signs our
          conduct agreement before ever meeting a child.
        </p>
        <Card>
          <form className="grid gap-5" onSubmit={onSubmit}>
            <div>
              <label htmlFor="full-name" className="block text-sm font-semibold mb-1">Full name</label>
              <input
                id="full-name"
                required
                value={account.fullName}
                onChange={(e) => setAccount({ ...account, fullName: e.target.value })}
                className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
                placeholder="Jane Reece"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="apply-email" className="block text-sm font-semibold mb-1">Email</label>
                <input
                  id="apply-email"
                  type="email"
                  required
                  value={account.email}
                  onChange={(e) => setAccount({ ...account, email: e.target.value })}
                  className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="apply-password" className="block text-sm font-semibold mb-1">Password</label>
                <input
                  id="apply-password"
                  type="password"
                  required
                  minLength={12}
                  value={account.password}
                  onChange={(e) => setAccount({ ...account, password: e.target.value })}
                  className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
                />
                <p className="text-xs text-charcoal-teal/60 mt-1">At least 12 characters</p>
              </div>
            </div>
            <div>
              <label htmlFor="experience" className="block text-sm font-semibold mb-1">Years of tutoring / teaching experience</label>
              <input
                id="experience"
                type="number"
                min={0}
                required
                value={form.experienceYears}
                onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
                placeholder="e.g. 6"
              />
            </div>
            <div>
              <label htmlFor="subjects" className="block text-sm font-semibold mb-1">Subjects / specialisms</label>
              <input
                id="subjects"
                required
                value={form.subjects}
                onChange={(e) => setForm({ ...form, subjects: e.target.value })}
                className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
                placeholder="e.g. Verbal Reasoning, Maths"
              />
            </div>
            <div>
              <p className="block text-sm font-semibold mb-2">Exam boards / test providers you&apos;re experienced with (optional)</p>
              <div className="flex flex-wrap gap-2">
                {examBoardOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => toggleExamBoard(opt)}
                    className={`text-sm font-semibold px-3 py-2 min-h-[36px] rounded-full transition-colors ${
                      examBoards.includes(opt) ? "bg-teal-900 text-white" : "bg-teal-100 text-teal-900"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <p className="text-xs text-charcoal-teal/60 mt-2">
                Families searching for tutors experienced with a specific test (e.g. FSCE&apos;s
                new curriculum-based 11+) can filter by this.
              </p>
            </div>
            <div>
              <p className="block text-sm font-semibold mb-2">SEND experience or specialisms (optional)</p>
              <div className="flex flex-wrap gap-2">
                {sendOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => toggleSend(opt)}
                    className={`text-sm font-semibold px-3 py-2 min-h-[36px] rounded-full transition-colors ${
                      sendExperience.includes(opt) ? "bg-teal-900 text-white" : "bg-teal-100 text-teal-900"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <p className="text-xs text-charcoal-teal/60 mt-2">
                Verified where possible during vetting, alongside your DBS and reference checks.
              </p>
            </div>
            <div>
              <label htmlFor="examiner-claim" className="block text-sm font-semibold mb-1">Exam board examiner or marker experience (optional)</label>
              <input
                id="examiner-claim"
                value={form.examinerClaim}
                onChange={(e) => setForm({ ...form, examinerClaim: e.target.value })}
                className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
                placeholder="e.g. AQA GCSE Maths marker, 2021-2024"
              />
              <p className="text-xs text-charcoal-teal/60 mt-1">
                We&apos;ll verify this during vetting. Until verified, it&apos;s shown to families as an unverified claim, never with the same weight as confirmed history.
              </p>
            </div>
            <div>
              <label htmlFor="dbs-ref" className="block text-sm font-semibold mb-1">Enhanced DBS certificate reference number</label>
              <input
                id="dbs-ref"
                required
                value={form.dbsReference}
                onChange={(e) => setForm({ ...form, dbsReference: e.target.value })}
                className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
                placeholder="e.g. 001234567890"
              />
            </div>
            {error && <p className="text-sm text-brick-600 font-semibold">{error}</p>}
            <Button type="submit" variant="primary" disabled={loading} className="justify-center mt-2">
              {loading ? "Submitting…" : "Submit application"}
            </Button>
          </form>
        </Card>
      </main>
    </PageShell>
  );
}
