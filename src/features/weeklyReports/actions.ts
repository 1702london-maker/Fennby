"use server";

import { withRole } from "@/lib/auth/withRole";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Part 3.3: a genuine synthesis of three real sources, generated on demand
// from actual platform data — never a templated or fabricated summary.
export const generateWeeklyReport = withRole(
  ["parent"],
  async (session, learnerId: string): Promise<ActionResult> => {
    const supabase = await createClient();
    const { data: learner } = await supabase.from("learners").select("id, parent_id, preferred_name").eq("id", learnerId).maybeSingle();
    if (!learner || learner.parent_id !== session.id) return { ok: false, error: "forbidden" };

    const weekStart = startOfWeek(new Date());
    const weekStartIso = weekStart.toISOString().slice(0, 10);
    const sinceIso = weekStart.toISOString();

    const [{ data: results }, { data: notes }, { data: aiConvos }] = await Promise.all([
      supabase.from("assessment_results").select("*, topic_performance(*)").eq("learner_id", learnerId).gte("created_at", sinceIso),
      supabase.from("lesson_notes").select("*").eq("learner_id", learnerId).gte("created_at", sinceIso),
      supabase
        .from("ai_tutor_conversations")
        .select("*, ai_tutor_messages(content, role)")
        .eq("learner_id", learnerId)
        .gte("started_at", sinceIso),
    ]);

    const aiPlatformSummary = results?.length
      ? `${results.length} mock exam${results.length > 1 ? "s" : ""} completed this week, average score ${Math.round(
          results.reduce((sum, r) => sum + (r.score ?? 0), 0) / results.length
        )}%.`
      : null;

    const tutorNotesSummary = notes?.length
      ? notes.map((n) => n.parent_summary || `Covered ${n.topic ?? n.subject}.`).join(" ")
      : null;

    const aiTutorMessageCount = (aiConvos ?? []).reduce((sum, c) => sum + (c.ai_tutor_messages?.length ?? 0), 0);
    const aiTutorSummary = aiConvos?.length
      ? `${aiConvos.length} AI Tutor session${aiConvos.length > 1 ? "s" : ""} this week, ${aiTutorMessageCount} messages exchanged. Full conversations are visible in Messages.`
      : null;

    const { error } = await supabase.from("weekly_reports").upsert(
      {
        learner_id: learnerId,
        week_start: weekStartIso,
        ai_platform_summary: aiPlatformSummary,
        tutor_notes_summary: tutorNotesSummary,
        ai_tutor_summary: aiTutorSummary,
        generated_at: new Date().toISOString(),
      },
      { onConflict: "learner_id,week_start" }
    );
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: null };
  }
);
