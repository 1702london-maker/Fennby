"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

const contactSchema = z.object({
  name: z.string().min(1, "Please tell us your name"),
  email: z.string().email("Please enter a valid email"),
  topic: z.enum(["general", "parent", "tutor", "school", "press", "safeguarding"]),
  message: z.string().min(10, "Please write a little more so we can help"),
});
export type ContactInput = z.infer<typeof contactSchema>;

// Intentionally not role-restricted — reachable by signed-out visitors,
// same as the public marketing site around it.
export async function submitContactMessage(input: ContactInput): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "validation_failed", fields: parsed.error.flatten().fieldErrors };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert(parsed.data);
  if (error) return { ok: false, error: "submit_failed" };
  return { ok: true, data: null };
}
