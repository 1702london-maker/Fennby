"use server";

import { z } from "zod";
import { withRole } from "@/lib/auth/withRole";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

const createSittingSchema = z.object({
  title: z.string().min(1),
  subjectKey: z.string().optional(),
  examBoard: z.string().optional(),
  sittingDate: z.string().min(1),
  price: z.coerce.number().positive(),
  capacity: z.coerce.number().int().positive().optional(),
});
export type CreateSittingInput = z.input<typeof createSittingSchema>;

export const createSitting = withRole(
  ["admin"],
  async (session, input: CreateSittingInput): Promise<ActionResult> => {
    void session;
    const parsed = createSittingSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "validation_failed" };

    const supabase = await createClient();
    const { error } = await supabase.from("mock_exam_sittings").insert({
      title: parsed.data.title,
      subject_key: parsed.data.subjectKey || null,
      exam_board: parsed.data.examBoard || null,
      sitting_date: new Date(parsed.data.sittingDate).toISOString(),
      price: parsed.data.price,
      capacity: parsed.data.capacity ?? null,
      status: "open",
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: null };
  }
);

export async function getAllSittings() {
  const supabase = await createClient();
  const { data } = await supabase.from("mock_exam_sittings").select("*").order("sitting_date", { ascending: false });
  return data ?? [];
}

export const closeSitting = withRole(["admin"], async (session, sittingId: string): Promise<ActionResult> => {
  void session;
  const supabase = await createClient();
  const { error } = await supabase.from("mock_exam_sittings").update({ status: "closed" }).eq("id", sittingId);
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: null };
});
