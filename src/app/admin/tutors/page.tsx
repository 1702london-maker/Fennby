import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { getAllTutorApplications } from "@/features/admin/queries";
import { TutorActions } from "./TutorActions";

const statusColor: Record<string, string> = {
  submitted: "bg-teal-100 text-teal-900",
  under_review: "bg-teal-100 text-teal-900",
  dbs_pending: "bg-coral-100 text-coral-600",
  contract_pending: "bg-coral-100 text-coral-600",
  training_pending: "bg-coral-100 text-coral-600",
  approved: "bg-sage-600/15 text-sage-600",
  rejected: "bg-brick-600/10 text-brick-600",
  suspended: "bg-brick-600/10 text-brick-600",
};

export default async function AdminTutorsPage() {
  const applications = await getAllTutorApplications();

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Tutor applications</h1>
        {applications.length ? (
          <div className="space-y-4">
            {applications.map((t) => (
              <Card key={t.id}>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <p className="font-display font-bold text-lg">{t.profiles?.full_name ?? "Unknown"}</p>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor[t.status]}`}>
                    {t.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-charcoal-teal/70">{t.profiles?.email}</p>
                <div className="grid sm:grid-cols-3 gap-3 mt-3 text-sm">
                  <div>
                    <p className="text-charcoal-teal/60 text-xs">DBS status</p>
                    <p className="font-semibold">{t.dbs_status}</p>
                  </div>
                  <div>
                    <p className="text-charcoal-teal/60 text-xs">Experience</p>
                    <p className="font-semibold">{t.experience_years ?? "—"} years</p>
                  </div>
                  <div>
                    <p className="text-charcoal-teal/60 text-xs">Subjects</p>
                    <p className="font-semibold">{t.subjects?.length ?? 0}</p>
                  </div>
                </div>
                {t.examiner_claim && (
                  <p className="text-xs text-plum-700 bg-plum-700/10 inline-block px-3 py-1 rounded-full mt-3">
                    Claims examiner history (unverified): {t.examiner_claim}
                  </p>
                )}
                {t.status !== "approved" && t.status !== "rejected" && <TutorActions applicationId={t.id} />}
                {t.status === "approved" && t.examiner_claim && !t.tutor_profiles?.[0]?.examiner_verified && (
                  <TutorActions applicationId={t.id} tutorProfileId={t.profile_id} examinerClaim={t.examiner_claim} />
                )}
                {t.tutor_profiles?.[0]?.examiner_verified && (
                  <p className="text-xs font-bold text-sage-600 bg-sage-600/15 inline-block px-3 py-1 rounded-full mt-3">
                    ✓ Verified examiner history
                  </p>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState emoji="🎓" title="No tutor applications yet" description="Applications submitted via /apply-tutor will appear here." />
          </Card>
        )}
      </main>
    </PageShell>
  );
}
