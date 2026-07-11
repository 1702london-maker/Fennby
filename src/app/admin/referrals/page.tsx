import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/EmptyState";

async function getAllReferrals() {
  const supabase = await createClient();
  const { data } = await supabase.from("referrals").select("*, referred_by_profile:profiles!referred_by(full_name)").order("created_at", { ascending: false });
  return data ?? [];
}

export default async function AdminReferralsPage() {
  const referrals = await getAllReferrals();

  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Council referrals</h1>
        <p className="text-charcoal-teal/70 mb-8">
          Every school and family referral submitted from a council&apos;s dashboard.
        </p>
        {referrals.length ? (
          <div className="space-y-3">
            {referrals.map((r) => (
              <Card key={r.id}>
                <div className="flex items-center justify-between gap-4 mb-1">
                  <p className="font-semibold">
                    {r.referral_type === "school" ? "🏫 School" : "👪 Family"}: {r.contact_name}
                  </p>
                  <span className="text-xs font-bold bg-teal-100 text-teal-900 px-3 py-1 rounded-full shrink-0">
                    {r.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-sm text-charcoal-teal/70 mb-1">{r.description}</p>
                <p className="text-xs text-charcoal-teal/50">
                  Referred by {r.referred_by_profile?.full_name ?? "a council contact"} · {new Date(r.created_at).toLocaleDateString("en-GB")}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState emoji="📋" title="No referrals yet" description="School and family referrals from local authorities will appear here." />
          </Card>
        )}
      </main>
    </PageShell>
  );
}
