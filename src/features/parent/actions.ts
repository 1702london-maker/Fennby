"use server";

import { z } from "zod";
import { withRole } from "@/lib/auth/withRole";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

const learningPreferencesSchema = z.object({
  learnerId: z.string().uuid(),
  dyslexia_font: z.boolean(),
  text_size: z.enum(["default", "large", "extra-large"]),
  colour_overlay: z.enum(["none", "cream", "blue", "green", "rose"]).nullable(),
  chunked_content: z.boolean(),
  extra_time_percent: z.union([z.literal(0), z.literal(25), z.literal(50)]),
  low_stimulation_mode: z.boolean(),
  symbol_support: z.boolean(),
  sensory_break_reminders: z.boolean(),
  read_aloud_default: z.boolean(),
  ehcp: z.boolean(),
  diagnosis_shared: z.string().nullable(),
  notes: z.string().nullable(),
});
export type LearningPreferencesInput = z.infer<typeof learningPreferencesSchema>;

// These accommodations are never gated behind proof of diagnosis — a parent
// can set any of them at any time. This action only checks that the learner
// belongs to the signed-in parent, not that any need has been "proven."
export const updateLearningPreferences = withRole(
  ["parent"],
  async (session, input: LearningPreferencesInput): Promise<ActionResult> => {
    const parsed = learningPreferencesSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "validation_failed", fields: parsed.error.flatten().fieldErrors };
    }
    const supabase = await createClient();
    const { learnerId, ...prefs } = parsed.data;

    const { data: learner } = await supabase
      .from("learners")
      .select("id, parent_id")
      .eq("id", learnerId)
      .maybeSingle();

    if (!learner || learner.parent_id !== session.id) {
      return { ok: false, error: "forbidden" };
    }

    const { error } = await supabase
      .from("learners")
      .update({ learning_preferences: prefs })
      .eq("id", learnerId);

    if (error) return { ok: false, error: "update_failed" };

    await supabase.from("audit_logs").insert({
      actor_id: session.id,
      action: "learning_preferences_updated",
      entity: "learners",
      entity_id: learnerId,
    });

    return { ok: true, data: null };
  }
);
