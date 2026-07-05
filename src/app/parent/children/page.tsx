import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { getMyLearners, getLatestResult, getUpcomingSessions } from "@/features/parent/queries";

export default async function ParentChildrenPage() {
  const learners = await getMyLearners();

  const withDetails = await Promise.all(
    learners.map(async (l) => ({
      learner: l,
      latestResult: await getLatestResult(l.id),
      nextSession: (await getUpcomingSessions(l.id))[0],
    }))
  );

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-bold text-3xl">Children</h1>
          <Button href="/register/parent" variant="primary">Add a child</Button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {withDetails.map(({ learner, latestResult, nextSession }) => (
            <Link key={learner.id} href={`/parent/passport/${learner.id}`}>
              <Card className="hover:ring-2 hover:ring-teal-700 transition-shadow">
                <div className="flex items-center gap-3">
                  <span className="text-3xl" aria-hidden>{learner.avatar_emoji}</span>
                  <div>
                    <p className="font-display font-bold">{learner.preferred_name}</p>
                    <p className="text-xs text-charcoal-teal/60">{learner.year_group} · {learner.current_school ?? "No school recorded"}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-charcoal-teal/60 text-xs">Last score</p>
                    <p className="font-semibold">{latestResult ? `${latestResult.score}%` : "—"}</p>
                  </div>
                  <div>
                    <p className="text-charcoal-teal/60 text-xs">Next session</p>
                    <p className="font-semibold">
                      {nextSession ? new Date(nextSession.scheduled_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—"}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
