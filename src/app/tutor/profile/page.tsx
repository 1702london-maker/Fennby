import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { getMyTutorProfile } from "@/features/tutors/queries";
import { createClient } from "@/lib/supabase/server";

export default async function TutorProfilePage() {
  const tutorProfile = await getMyTutorProfile();
  if (!tutorProfile) {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-16">
          <EmptyState emoji="🎓" title="No tutor profile found" description="" />
        </main>
      </PageShell>
    );
  }

  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("full_name, email").eq("id", tutorProfile.id).single();

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">My profile</h1>
        <Card>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-3xl" aria-hidden>🎓</div>
            <div>
              <p className="font-display font-bold text-xl">{profile?.full_name}</p>
              <p className="text-sm text-charcoal-teal/70">{tutorProfile.subjects.join(" · ") || "No subjects listed"}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-charcoal-teal/60 text-xs">DBS status</p>
              <p className="font-semibold text-sage-600">{tutorProfile.dbs_status}</p>
            </div>
            <div>
              <p className="text-charcoal-teal/60 text-xs">Training</p>
              <p className="font-semibold">{tutorProfile.training_completed ? "Completed" : "In progress"}</p>
            </div>
            <div>
              <p className="text-charcoal-teal/60 text-xs">Experience</p>
              <p className="font-semibold">{tutorProfile.experience_years ?? "—"} years</p>
            </div>
            <div>
              <p className="text-charcoal-teal/60 text-xs">Qualifications</p>
              <p className="font-semibold">{tutorProfile.qualifications ?? "—"}</p>
            </div>
          </div>
          {tutorProfile.bio && <p className="text-sm text-charcoal-teal/80 mt-4">{tutorProfile.bio}</p>}
        </Card>
      </main>
    </PageShell>
  );
}
