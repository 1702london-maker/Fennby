"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth/session";
import type { ActionResult } from "@/lib/action-result";

const sendMessageSchema = z.object({
  threadId: z.string().uuid(),
  content: z.string().min(1).max(4000),
});

export async function sendMessage(input: { threadId: string; content: string }): Promise<ActionResult> {
  const session = await getSessionProfile();
  if (!session) return { ok: false, error: "unauthenticated" };

  const parsed = sendMessageSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "validation_failed" };

  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert({
    thread_id: parsed.data.threadId,
    sender_id: session.id,
    content: parsed.data.content,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: null };
}
