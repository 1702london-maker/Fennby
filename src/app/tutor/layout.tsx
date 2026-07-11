import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Part 8.1/8.2: a genuine stored state gates every tutor route — a tutor
// cannot skip password reset or agreement signing just by navigating
// straight to a dashboard URL.
export default async function TutorLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return children;

  const { data: application } = await supabase
    .from("tutor_applications")
    .select("onboarding_state")
    .eq("profile_id", user.id)
    .maybeSingle();

  const state = application?.onboarding_state;

  if (state === "password_reset_required") redirect("/apply-tutor/reset-password");
  if (state === "agreement_pending") redirect("/apply-tutor/agreement");
  if (state && !["verified"].includes(state)) redirect("/apply-tutor/confirmation");

  return children;
}
