import Link from "next/link";
import { Card } from "@/components/Card";
import { Learner, AssessmentResult, LessonSession } from "@/lib/types";

export function LearnerCard({
  learner,
  latestResult,
  nextSession,
  href,
}: {
  learner: Learner;
  latestResult?: AssessmentResult;
  nextSession?: LessonSession;
  href?: string;
}) {
  const content = (
    <Card className="hover:ring-2 hover:ring-teal-700 transition-shadow">
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden>{learner.avatarEmoji}</span>
        <div>
          <p className="font-display font-bold">{learner.preferredName}</p>
          <p className="text-xs text-charcoal-teal/60">{learner.yearGroup} · {learner.currentSchool}</p>
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
            {nextSession ? new Date(nextSession.scheduledAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—"}
          </p>
        </div>
      </div>
    </Card>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}
