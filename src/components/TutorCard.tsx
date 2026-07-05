import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { TutorProfile } from "@/lib/types";

export function TutorCard({ tutor }: { tutor: TutorProfile }) {
  return (
    <Card className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
      <div className="flex gap-4 items-start">
        <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-2xl shrink-0" aria-hidden>
          🎓
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display font-bold text-lg">{tutor.name}</p>
            {tutor.dbsStatus === "verified" && (
              <span className="bg-sage-600/15 text-sage-600 text-xs font-bold px-2 py-0.5 rounded-full">
                ✓ DBS Verified
              </span>
            )}
          </div>
          <p className="text-sm text-charcoal-teal/70">{tutor.subjects.join(" · ")}</p>
          <p className="text-sm text-charcoal-teal/80 mt-2 max-w-md">{tutor.bio}</p>
          {tutor.reviewCount > 0 && (
            <p className="text-xs text-charcoal-teal/60 mt-2">
              ⭐ {tutor.rating.toFixed(1)} ({tutor.reviewCount} reviews) · {tutor.experienceYears} years&apos; experience
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2 sm:flex-col shrink-0">
        <Button variant="outline">View profile</Button>
        <Button href="/parent/chat" variant="primary">Message</Button>
      </div>
    </Card>
  );
}
