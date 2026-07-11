import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { getMyReferrals } from "@/features/referrals/actions";
import { ReferralForm } from "./ReferralForm";

export default async function AuthorityReferralsPage() {
  const referrals = await getMyReferrals();

  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Referrals</h1>
        <p className="text-charcoal-teal/70 mb-8">
          Refer a school considering Fennby, or refer an individual vulnerable child or family to
          our support directly.
        </p>

        <Card className="mb-10">
          <ReferralForm />
        </Card>

        <h2 className="font-display font-bold text-lg mb-4">Your referrals</h2>
        {referrals.length ? (
          <div className="space-y-3">
            {referrals.map((r) => (
              <Card key={r.id} className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    {r.referral_type === "school" ? "🏫 School referral" : "👪 Family referral"}: {r.contact_name}
                  </p>
                  <p className="text-sm text-charcoal-teal/70 mt-1">{r.description}</p>
                </div>
                <span className="text-xs font-bold bg-teal-100 text-teal-900 px-3 py-1 rounded-full shrink-0">
                  {r.status.replace("_", " ")}
                </span>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-charcoal-teal/60">No referrals submitted yet.</p>
        )}
      </main>
    </PageShell>
  );
}
