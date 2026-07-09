import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { getApprovedTutors, getMyLearners } from "@/features/parent/queries";

export default async function BrowseTutorsPage() {
  // Soft SEND-experience weighting: any learner's shared diagnosis or EHCP
  // note nudges matching tutors toward the top of the list, without hiding
  // anyone else.
  const myLearners = await getMyLearners();
  const sendHints = myLearners
    .flatMap((l) => {
      const prefs = l.learning_preferences as { diagnosis_shared?: string | null; ehcp?: boolean } | null;
      return prefs?.diagnosis_shared ? [prefs.diagnosis_shared] : [];
    })
    .filter(Boolean);

  const tutors = await getApprovedTutors(sendHints);

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Browse tutors</h1>
        <p className="text-charcoal-teal/70 mb-8">
          Every tutor shown here has completed Fennby&apos;s full vetting pipeline before ever meeting a child.
        </p>
        {tutors.length ? (
          <div className="grid gap-4">
            {tutors.map((t) => (
              <Card key={t.id} className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <div className="flex gap-4 items-start">
                  <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-2xl shrink-0" aria-hidden>
                    🎓
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display font-bold text-lg">{t.profiles?.full_name ?? "Tutor"}</p>
                      <span className="bg-sage-600/15 text-sage-600 text-xs font-bold px-2 py-0.5 rounded-full">
                        ✓ DBS Verified
                      </span>
                      {t.send_experience && t.send_experience.length > 0 && (
                        <span className="bg-plum-700/10 text-plum-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          SEND-experienced: {t.send_experience.join(", ")}
                        </span>
                      )}
                      {t.examiner_verified && t.examiner_boards_verified?.length > 0 && (
                        <span className="bg-sage-600/15 text-sage-600 text-xs font-bold px-2 py-0.5 rounded-full">
                          ✓ Verified examiner: {t.examiner_boards_verified.join(", ")}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-charcoal-teal/70">{t.subjects?.join(" · ") || "No subjects listed"}</p>
                    {t.bio && <p className="text-sm text-charcoal-teal/80 mt-2 max-w-md">{t.bio}</p>}
                    {t.review_count! > 0 && (
                      <p className="text-xs text-charcoal-teal/60 mt-2">
                        ⭐ {t.rating?.toFixed(1)} ({t.review_count} reviews) · {t.experience_years ?? "—"} years&apos; experience
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 sm:flex-col shrink-0">
                  <Button href="/parent/chat" variant="primary">Message</Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState emoji="🎓" title="No approved tutors yet" description="Approved tutors will appear here for families to browse." />
          </Card>
        )}
      </main>
    </PageShell>
  );
}
