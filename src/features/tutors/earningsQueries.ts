import { createClient } from "@/lib/supabase/server";

// Part 1.2/5.1: flat 12.9% commission, no sliding scale — every session
// carries its own rate at the time it happened, so a later change to the
// platform rate never rewrites history.
export async function getMyEarnings() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { sessions: [], totalGross: 0, totalCommission: 0, totalNet: 0, unpaidNet: 0 };

  const { data } = await supabase
    .from("lesson_sessions")
    .select("*, learners(preferred_name)")
    .eq("tutor_id", user.id)
    .eq("status", "completed")
    .order("scheduled_at", { ascending: false });

  const sessions = (data ?? []).map((s) => {
    const rate = s.hourly_rate ?? 0;
    const commissionRate = s.commission_rate ?? 0.129;
    const commission = rate * commissionRate;
    const net = rate - commission;
    return { ...s, commission, net };
  });

  const totalGross = sessions.reduce((sum, s) => sum + (s.hourly_rate ?? 0), 0);
  const totalCommission = sessions.reduce((sum, s) => sum + s.commission, 0);
  const totalNet = sessions.reduce((sum, s) => sum + s.net, 0);
  const unpaidNet = sessions.filter((s) => s.payment_status !== "paid").reduce((sum, s) => sum + s.net, 0);

  return { sessions, totalGross, totalCommission, totalNet, unpaidNet };
}
