import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { tutorProfiles } from "@/lib/seed-data";

const me = tutorProfiles[0];

export default function TutorProfilePage() {
  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">My profile</h1>
        <Card>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-3xl" aria-hidden>🎓</div>
            <div>
              <p className="font-display font-bold text-xl">{me.name}</p>
              <p className="text-sm text-charcoal-teal/70">{me.subjects.join(" · ")}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-charcoal-teal/60 text-xs">DBS status</p>
              <p className="font-semibold text-sage-600">✓ {me.dbsStatus}</p>
            </div>
            <div>
              <p className="text-charcoal-teal/60 text-xs">Training</p>
              <p className="font-semibold">{me.trainingCompleted ? "Completed" : "Pending"}</p>
            </div>
            <div>
              <p className="text-charcoal-teal/60 text-xs">Experience</p>
              <p className="font-semibold">{me.experienceYears} years</p>
            </div>
            <div>
              <p className="text-charcoal-teal/60 text-xs">Qualifications</p>
              <p className="font-semibold">{me.qualifications}</p>
            </div>
          </div>
          <p className="text-sm text-charcoal-teal/80 mt-4">{me.bio}</p>
        </Card>
      </main>
    </PageShell>
  );
}
