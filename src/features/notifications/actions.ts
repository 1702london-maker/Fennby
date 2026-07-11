"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";
import { getMyNotifications } from "./queries";

export async function fetchMyNotifications(): Promise<ActionResult<Awaited<ReturnType<typeof getMyNotifications>>>> {
  const notifications = await getMyNotifications();
  return { ok: true, data: notifications };
}

export async function markNotificationRead(notificationId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "unauthenticated" };

  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("profile_id", user.id);
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: null };
}
