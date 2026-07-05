import { createClient } from "@/lib/supabase/server";

export async function getAllCases() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("safeguarding_cases")
    .select("*, learners(preferred_name)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getCase(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("safeguarding_cases")
    .select("*, learners(preferred_name)")
    .eq("id", id)
    .maybeSingle();
  return data;
}

export async function getFlaggedMessages() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("*, message_threads(learner_id, learners(preferred_name)), profiles(full_name)")
    .eq("flagged", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}
