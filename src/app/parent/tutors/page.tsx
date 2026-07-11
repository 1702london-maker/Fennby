import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { getApprovedTutors, getMyLearners } from "@/features/parent/queries";
import { hasSendProfile } from "@/lib/send";

export default async function BrowseTutorsPage({ searchParams }: { searchParams: { all?: string } }) {
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

  // Any SEND child in the family defaults this view to SEND-accredited
  // tutors only — a real filter, not just a badge — with an explicit way
  // to see everyone if a parent wants to.
  const familyHasSend = myLearners.some(hasSendProfile);
  const showAll = searchParams?.all === "1";
  const sendOnly = familyHasSend && !showAll;

  const tutors = await getApprovedTutors(sendHints, sendOnly);

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Browse tutors</h1>
        <p className="text-charcoal-teal/70 mb-2">
          Every tutor shown here has completed Fennby&apos;s full vetting pipeline before ever meeting a child.
        </p>
        {familyHasSend && (
          <p className="text-sm text-charcoal-teal/70 mb-8">
            {sendOnly
              ? "Showing SEND-accredited and trained tutors only, since a SEND profile is set for your family. "
              : "Showing every approved tutor. "}
            <a href={sendOnly ? "?all=1" : "?"} className="font-semibold text-teal-900 hover:underline">
              {sendOnly ? "Show all approved tutors instead" : "Show SEND-accredited tutors only"}
            </a>
          </p>
        )}
        {!familyHasSend && <div className="mb-8" />}
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
            <EmptyState
              emoji="🎓"
              title={sendOnly ? "No SEND-accredited tutors approved yet" : "No approved tutors yet"}
              description={sendOnly ? "Try showing all approved tutors while we grow our SEND-accredited network." : "Approved tutors will appear here for families to browse."}
            />
            {sendOnly && <Button href="?all=1" variant="outline" className="mt-4">Show all approved tutors</Button>}
          </Card>
        )}
      </main>
    </PageShell>
  );
}
