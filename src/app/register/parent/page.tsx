"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { signUp, login } from "@/features/auth/actions";
import { createLearner } from "@/features/learners/actions";
import { VoiceInputButton } from "@/components/VoiceInputButton";

export default function RegisterParentPage() {
  const router = useRouter();
  const [step, setStep] = useState<"parent" | "child">("parent");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [account, setAccount] = useState({ fullName: "", email: "", password: "" });
  const [child, setChild] = useState({
    firstName: "",
    preferredName: "",
    dateOfBirth: "",
    yearGroup: "",
    currentSchool: "",
    targetExam: "",
    targetSchool: "",
    examBoard: "",
    learningGoals: "",
    hasSend: false,
    sendNotes: "",
    accessibilityNeeds: "",
    consent: false,
  });

  const onAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const signUpResult = await signUp({
      email: account.email,
      password: account.password,
      fullName: account.fullName,
      intendedRole: "parent",
    });
    if (!signUpResult.ok) {
      setLoading(false);
      const fieldMessages = signUpResult.fields
        ? Object.values(signUpResult.fields).flat().join(" ")
        : null;
      setError(fieldMessages || signUpResult.error);
      return;
    }
    // The account is now email-confirmed server-side, so this sign-in
    // establishes a real session immediately — its result must be checked,
    // otherwise a failure here silently leaves the next step without a
    // session and every subsequent action fails.
    const loginResult = await login({ email: account.email, password: account.password });
    setLoading(false);
    if (!loginResult.ok) {
      setError(loginResult.error);
      return;
    }
    setStep("child");
  };

  const onChildSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!child.consent) {
      setError("Please confirm consent to continue.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await createLearner({
        firstName: child.firstName,
        preferredName: child.preferredName || child.firstName,
        dateOfBirth: child.dateOfBirth,
        yearGroup: child.yearGroup,
        currentSchool: child.currentSchool || undefined,
        targetExam: child.targetExam || undefined,
        targetSchool: child.targetSchool || undefined,
        examBoard: child.examBoard || undefined,
        learningGoals: child.learningGoals || undefined,
        sendNotes: child.sendNotes || (child.hasSend ? "Marked at registration" : undefined),
        accessibilityNeeds: child.accessibilityNeeds || undefined,
        consent: true,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/parent/billing");
      router.refresh();
    } catch {
      // withRole() throws (rather than returning an ActionResult) when
      // there's no session at all — catch it here so the button never gets
      // stuck on "Saving..." forever.
      setError("Your session expired — please log in again.");
    } finally {
      setLoading(false);
    }
  };

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
            <form className="grid gap-4" onSubmit={onAccountSubmit}>
              <div>
                <label className="block text-sm font-semibold mb-1">Full name</label>
                <input required value={account.fullName} onChange={(e) => setAccount({ ...account, fullName: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="Ade Okafor" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input type="email" required value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Password</label>
                <input type="password" required minLength={12} value={account.password} onChange={(e) => setAccount({ ...account, password: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
                <p className="text-xs text-charcoal-teal/60 mt-1">At least 12 characters.</p>
              </div>
              {error && <p className="text-sm text-brick-600 font-semibold">{error}</p>}
              <Button type="submit" variant="primary" className="justify-center mt-2" disabled={loading}>
                {loading ? "Creating account…" : "Continue"}
              </Button>
            </form>
          </Card>
        ) : (
          <Card>
            <form className="grid gap-4" onSubmit={onChildSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">First name</label>
                  <input required value={child.firstName} onChange={(e) => setChild({ ...child, firstName: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Preferred name</label>
                  <input value={child.preferredName} onChange={(e) => setChild({ ...child, preferredName: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Date of birth</label>
                  <input type="date" required value={child.dateOfBirth} onChange={(e) => setChild({ ...child, dateOfBirth: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">School year</label>
                  <input required value={child.yearGroup} onChange={(e) => setChild({ ...child, yearGroup: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="Year 5" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Current school</label>
                <input value={child.currentSchool} onChange={(e) => setChild({ ...child, currentSchool: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Target exam</label>
                  <input value={child.targetExam} onChange={(e) => setChild({ ...child, targetExam: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="11+ Grammar Entrance" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Target school</label>
                  <input value={child.targetSchool} onChange={(e) => setChild({ ...child, targetSchool: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Exam board</label>
                <input value={child.examBoard} onChange={(e) => setChild({ ...child, examBoard: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="GL Assessment" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-semibold">Learning goals</label>
                  <VoiceInputButton onResult={(text) => setChild((c) => ({ ...c, learningGoals: c.learningGoals ? `${c.learningGoals} ${text}` : text }))} />
                </div>
                <textarea rows={2} value={child.learningGoals} onChange={(e) => setChild({ ...child, learningGoals: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 p-4 focus:border-teal-700 outline-none" />
              </div>
              <div className="rounded-2xl border-2 border-teal-100 p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={child.hasSend}
                    onChange={(e) => setChild({ ...child, hasSend: e.target.checked })}
                    className="mt-1 w-5 h-5 accent-teal-900"
                  />
                  <span className="text-sm">
                    My child has a diagnosed or suspected special educational need or disability
                    (SEND), such as dyslexia, autism, ADHD, or a speech and language need. No
                    diagnosis or EHCP is required to say yes here, this never costs extra, and it
                    only unlocks extra support, never a different price for the same features.
                  </span>
                </label>
                {child.hasSend && (
                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-semibold">Tell us a bit more (optional)</label>
                        <VoiceInputButton onResult={(text) => setChild((c) => ({ ...c, sendNotes: c.sendNotes ? `${c.sendNotes} ${text}` : text }))} />
                      </div>
                      <textarea rows={2} value={child.sendNotes} onChange={(e) => setChild({ ...child, sendNotes: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 p-4 focus:border-teal-700 outline-none" placeholder="e.g. dyslexia, autism, ADHD" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-semibold">Accessibility needs</label>
                        <VoiceInputButton onResult={(text) => setChild((c) => ({ ...c, accessibilityNeeds: c.accessibilityNeeds ? `${c.accessibilityNeeds} ${text}` : text }))} />
                      </div>
                      <textarea rows={2} value={child.accessibilityNeeds} onChange={(e) => setChild({ ...child, accessibilityNeeds: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 p-4 focus:border-teal-700 outline-none" placeholder="e.g. extra time, larger text" />
                    </div>
                  </div>
                )}
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" required checked={child.consent} onChange={(e) => setChild({ ...child, consent: e.target.checked })} className="mt-1 w-5 h-5 accent-teal-900" />
                <span className="text-sm">I confirm I am this child&apos;s parent or legal guardian and consent to Fennby&apos;s data handling as described in the Trust &amp; Safeguarding framework.</span>
              </label>
              {error && <p className="text-sm text-brick-600 font-semibold">{error}</p>}
              <Button type="submit" variant="primary" className="justify-center mt-2" disabled={loading}>
                {loading ? "Saving…" : "Create child profile & go to dashboard"}
              </Button>
            </form>
          </Card>
        )}
      </main>
    </PageShell>
  );
}
