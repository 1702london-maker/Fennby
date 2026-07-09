"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { signTutorAgreement } from "@/features/tutors/applicationActions";

const points = [
  "I will never have unsupervised, unlogged contact with a child outside the Fennby platform.",
  "I understand every message I send involving a child is visible to that child's parent, always.",
  "I will complete Fennby's safeguarding and platform-conduct training before my first session.",
  "I will keep my DBS check current and notify Fennby immediately of any change in my status.",
  "I understand that breach of this agreement may result in immediate suspension and referral to the relevant authorities.",
];

export function AgreementForm() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [signed, setSigned] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);

  const sign = async () => {
    setSigning(true);
    setError(null);
    const result = await signTutorAgreement({ fullName: name });
    setSigning(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSigned(true);
    router.refresh();
  };

  if (signed) {
    return (
      <Card tint="coral">
        <span className="text-5xl" aria-hidden>✅</span>
        <h1 className="font-display font-bold text-2xl mt-4 mb-2">Agreement signed</h1>
        <p className="text-charcoal-teal/80 leading-relaxed">
          Thank you, {name}. Your safeguarding and platform training now unlocks — training only
          ever becomes available after this step is complete.
        </p>
        <Button href="/tutor/training" variant="primary" className="mt-6">
          Start training
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <ul className="space-y-3 text-charcoal-teal/85 leading-relaxed mb-6">
        {points.map((p) => (
          <li key={p}>✓ {p}</li>
        ))}
      </ul>
      <label className="flex items-start gap-3 mb-5 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-1 w-5 h-5 accent-teal-900"
        />
        <span className="text-sm text-charcoal-teal/85">I have read and agree to every point above.</span>
      </label>
      <label htmlFor="sig-name" className="block text-sm font-semibold mb-1">Type your full name to sign</label>
      <input
        id="sig-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none mb-5"
        placeholder="Full legal name"
      />
      {error && <p className="text-sm text-brick-600 font-semibold mb-3">{error}</p>}
      <Button
        variant="primary"
        disabled={!checked || !name.trim() || signing}
        onClick={sign}
        className="w-full justify-center"
      >
        {signing ? "Signing…" : "Sign agreement"}
      </Button>
    </Card>
  );
}
