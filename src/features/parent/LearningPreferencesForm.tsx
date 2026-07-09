"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { updateLearningPreferences, type LearningPreferencesInput } from "@/features/parent/actions";

type Prefs = Omit<LearningPreferencesInput, "learnerId">;

export function LearningPreferencesForm({
  learnerId,
  learnerName,
  initial,
}: {
  learnerId: string;
  learnerName: string;
  initial: Partial<Prefs>;
}) {
  const router = useRouter();
  const [prefs, setPrefs] = useState<Prefs>({
    dyslexia_font: initial.dyslexia_font ?? false,
    text_size: initial.text_size ?? "default",
    colour_overlay: initial.colour_overlay ?? null,
    chunked_content: initial.chunked_content ?? false,
    extra_time_percent: initial.extra_time_percent ?? 0,
    low_stimulation_mode: initial.low_stimulation_mode ?? false,
    symbol_support: initial.symbol_support ?? false,
    sensory_break_reminders: initial.sensory_break_reminders ?? false,
    read_aloud_default: initial.read_aloud_default ?? false,
    ehcp: initial.ehcp ?? false,
    diagnosis_shared: initial.diagnosis_shared ?? null,
    notes: initial.notes ?? null,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    const result = await updateLearningPreferences({ learnerId, ...prefs });
    setSaving(false);
    if (result.ok) {
      setSaved(true);
      router.refresh();
    }
  };

  const toggle = (key: keyof Prefs) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="grid gap-5">
      <p className="text-sm text-charcoal-teal/70">
        These accommodations are available to every family, always — nothing here requires a
        diagnosis or an EHCP to switch on. This profile is visible to {learnerName}&apos;s assigned
        tutor so real sessions can be adapted, not just the software.
      </p>

      <label className="flex items-center justify-between gap-3 cursor-pointer">
        <span className="text-sm font-semibold">Dyslexia-friendly font</span>
        <input type="checkbox" checked={prefs.dyslexia_font} onChange={() => toggle("dyslexia_font")} className="w-5 h-5 accent-teal-900" />
      </label>

      <div>
        <label htmlFor="text-size" className="block text-sm font-semibold mb-1">Text size</label>
        <select
          id="text-size"
          value={prefs.text_size}
          onChange={(e) => setPrefs((p) => ({ ...p, text_size: e.target.value as Prefs["text_size"] }))}
          className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
        >
          <option value="default">Default</option>
          <option value="large">Large</option>
          <option value="extra-large">Extra large</option>
        </select>
      </div>

      <div>
        <label htmlFor="overlay" className="block text-sm font-semibold mb-1">Colour overlay (for visual stress / Irlen-type sensitivity)</label>
        <select
          id="overlay"
          value={prefs.colour_overlay ?? "none"}
          onChange={(e) => setPrefs((p) => ({ ...p, colour_overlay: e.target.value === "none" ? null : (e.target.value as Prefs["colour_overlay"]) }))}
          className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
        >
          <option value="none">None</option>
          <option value="cream">Soft cream</option>
          <option value="blue">Soft blue</option>
          <option value="green">Soft green</option>
          <option value="rose">Soft rose</option>
        </select>
      </div>

      <label className="flex items-center justify-between gap-3 cursor-pointer">
        <span className="text-sm font-semibold">Show content in smaller pieces</span>
        <input type="checkbox" checked={prefs.chunked_content} onChange={() => toggle("chunked_content")} className="w-5 h-5 accent-teal-900" />
      </label>

      <div>
        <label htmlFor="extra-time" className="block text-sm font-semibold mb-1">Extra time on mock exams</label>
        <select
          id="extra-time"
          value={prefs.extra_time_percent}
          onChange={(e) => setPrefs((p) => ({ ...p, extra_time_percent: Number(e.target.value) as Prefs["extra_time_percent"] }))}
          className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
        >
          <option value={0}>No extra time</option>
          <option value={25}>25% extra time</option>
          <option value={50}>50% extra time</option>
        </select>
        <p className="text-xs text-charcoal-teal/60 mt-1">Applies automatically across digital, print-and-shade, and simulation modes.</p>
      </div>

      <label className="flex items-center justify-between gap-3 cursor-pointer">
        <span className="text-sm font-semibold">Low stimulation mode (less animation, quieter celebrations)</span>
        <input type="checkbox" checked={prefs.low_stimulation_mode} onChange={() => toggle("low_stimulation_mode")} className="w-5 h-5 accent-teal-900" />
      </label>

      <label className="flex items-center justify-between gap-3 cursor-pointer">
        <span className="text-sm font-semibold">Symbol-supported instructions and messages</span>
        <input type="checkbox" checked={prefs.symbol_support} onChange={() => toggle("symbol_support")} className="w-5 h-5 accent-teal-900" />
      </label>

      <label className="flex items-center justify-between gap-3 cursor-pointer">
        <span className="text-sm font-semibold">Gentle sensory break reminders during longer sessions</span>
        <input type="checkbox" checked={prefs.sensory_break_reminders} onChange={() => toggle("sensory_break_reminders")} className="w-5 h-5 accent-teal-900" />
      </label>

      <label className="flex items-center justify-between gap-3 cursor-pointer">
        <span className="text-sm font-semibold">Read questions and messages aloud by default</span>
        <input type="checkbox" checked={prefs.read_aloud_default} onChange={() => toggle("read_aloud_default")} className="w-5 h-5 accent-teal-900" />
      </label>

      <hr className="border-teal-100" />

      <p className="text-xs text-charcoal-teal/60">
        Anything below is entirely optional. Fennby never asks for proof, and nothing here unlocks
        or restricts any feature above — it only helps a tutor understand your child better.
      </p>

      <label className="flex items-center justify-between gap-3 cursor-pointer">
        <span className="text-sm font-semibold">This child has an EHCP</span>
        <input type="checkbox" checked={prefs.ehcp} onChange={() => toggle("ehcp")} className="w-5 h-5 accent-teal-900" />
      </label>

      <div>
        <label htmlFor="diagnosis" className="block text-sm font-semibold mb-1">Diagnosis or condition you&apos;d like to share (optional)</label>
        <input
          id="diagnosis"
          value={prefs.diagnosis_shared ?? ""}
          onChange={(e) => setPrefs((p) => ({ ...p, diagnosis_shared: e.target.value || null }))}
          className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
          placeholder="e.g. Dyslexia, ADHD — entirely optional"
        />
      </div>

      <div>
        <label htmlFor="prefs-notes" className="block text-sm font-semibold mb-1">Anything else a tutor should know (optional)</label>
        <textarea
          id="prefs-notes"
          value={prefs.notes ?? ""}
          onChange={(e) => setPrefs((p) => ({ ...p, notes: e.target.value || null }))}
          rows={3}
          className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 focus:border-teal-700 outline-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving} variant="primary">
          {saving ? "Saving…" : "Save learning preferences"}
        </Button>
        {saved && <span className="text-sm text-sage-600 font-semibold">Saved ✓</span>}
      </div>
    </div>
  );
}
