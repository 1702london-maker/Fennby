"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { updateChildLearningPreferences, type ChildLearningPreferencesInput } from "@/features/child/actions";

const overlays: { value: ChildLearningPreferencesInput["colour_overlay"]; label: string; colour: string }[] = [
  { value: null, label: "None", colour: "#ffffff" },
  { value: "cream", label: "Cream", colour: "#FFF6D8" },
  { value: "blue", label: "Blue", colour: "#E8F4FF" },
  { value: "green", label: "Green", colour: "#E9F8EE" },
  { value: "rose", label: "Rose", colour: "#FFECEF" },
];

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-teal-100 bg-white px-4 py-3">
      <span className="text-sm font-semibold text-charcoal-teal">{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} className="h-5 w-5 accent-teal-900" />
    </label>
  );
}

export function ChildPreferencesForm({ initial }: { initial: Partial<ChildLearningPreferencesInput> }) {
  const router = useRouter();
  const [prefs, setPrefs] = useState<ChildLearningPreferencesInput>({
    dyslexia_font: initial.dyslexia_font ?? false,
    text_size: initial.text_size ?? "default",
    colour_overlay: initial.colour_overlay ?? null,
    chunked_content: initial.chunked_content ?? false,
    extra_time_percent: initial.extra_time_percent ?? 0,
    low_stimulation_mode: initial.low_stimulation_mode ?? false,
    symbol_support: initial.symbol_support ?? false,
    sensory_break_reminders: initial.sensory_break_reminders ?? false,
    read_aloud_default: initial.read_aloud_default ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    const result = await updateChildLearningPreferences(prefs);
    setSaving(false);
    if (!result.ok) {
      setError("I couldn't save that just now. Please try again.");
      return;
    }
    setSaved(true);
    router.refresh();
  };

  const toggle = (key: keyof ChildLearningPreferencesInput) => {
    setPrefs((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-sm font-bold text-teal-900 mb-3">Colour overlay</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {overlays.map((overlay) => {
            const selected = prefs.colour_overlay === overlay.value;
            return (
              <button
                key={overlay.label}
                type="button"
                onClick={() => setPrefs((current) => ({ ...current, colour_overlay: overlay.value }))}
                className={`rounded-2xl border-2 px-3 py-3 text-sm font-semibold ${
                  selected ? "border-teal-900" : "border-teal-100"
                }`}
                style={{ backgroundColor: overlay.colour }}
                aria-pressed={selected}
              >
                {overlay.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="child-text-size" className="block text-sm font-semibold mb-1">Text size</label>
          <select
            id="child-text-size"
            value={prefs.text_size}
            onChange={(event) => setPrefs((current) => ({ ...current, text_size: event.target.value as ChildLearningPreferencesInput["text_size"] }))}
            className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
          >
            <option value="default">Default</option>
            <option value="large">Large</option>
            <option value="extra-large">Extra large</option>
          </select>
        </div>
        <div>
          <label htmlFor="child-extra-time" className="block text-sm font-semibold mb-1">Extra time</label>
          <select
            id="child-extra-time"
            value={prefs.extra_time_percent}
            onChange={(event) => setPrefs((current) => ({ ...current, extra_time_percent: Number(event.target.value) as ChildLearningPreferencesInput["extra_time_percent"] }))}
            className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
          >
            <option value={0}>No extra time</option>
            <option value={25}>25% extra time</option>
            <option value={50}>50% extra time</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Toggle label="Read aloud by default" checked={prefs.read_aloud_default} onChange={() => toggle("read_aloud_default")} />
        <Toggle label="Dyslexia-friendly font" checked={prefs.dyslexia_font} onChange={() => toggle("dyslexia_font")} />
        <Toggle label="Smaller chunks" checked={prefs.chunked_content} onChange={() => toggle("chunked_content")} />
        <Toggle label="Low stimulation" checked={prefs.low_stimulation_mode} onChange={() => toggle("low_stimulation_mode")} />
        <Toggle label="Symbol support" checked={prefs.symbol_support} onChange={() => toggle("symbol_support")} />
        <Toggle label="Break reminders" checked={prefs.sensory_break_reminders} onChange={() => toggle("sensory_break_reminders")} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={save} disabled={saving} variant="primary">
          {saving ? "Saving..." : "Save my settings"}
        </Button>
        {saved && <span className="text-sm font-semibold text-sage-600">Saved</span>}
        {error && <span className="text-sm font-semibold text-brick-600">{error}</span>}
      </div>
    </div>
  );
}
