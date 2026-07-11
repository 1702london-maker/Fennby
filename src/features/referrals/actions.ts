"use server";

import { z } from "zod";
import { withRole } from "@/lib/auth/withRole";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

// Part 6.2: one entity, two referral types — a council referring a school
// to join Fennby, or referring a vulnerable child/family to Fennby's
// support — so a future third type never needs a schema rework.
const referralSchema = z.object({
  referralType: z.enum(["school", "family"]),
  contactName: z.string().min(1),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  description: z.string().min(1),
});
export type ReferralInput = z.infer<typeof referralSchema>;

export const submitReferral = withRole(
  ["authority"],
  async (session, input: ReferralInput): Promise<ActionResult> => {
    const parsed = referralSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "validation_failed", fields: parsed.error.flatten().fieldErrors };

    const supabase = await createClient();
    const { error } = await supabase.from("referrals").insert({
      referred_by: session.id,
      referral_type: parsed.data.referralType,
      contact_name: parsed.data.contactName,
      contact_email: parsed.data.contactEmail || null,
      contact_phone: parsed.data.contactPhone || null,
      description: parsed.data.description,
      status: "new",
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: null };
  }
);

export async function getMyReferrals() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase.from("referrals").select("*").eq("referred_by", user.id).order("created_at", { ascending: false });
  return data ?? [];
}
