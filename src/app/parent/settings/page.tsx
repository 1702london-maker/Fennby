import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { getMyLearners } from "@/features/parent/queries";
import { getSessionProfile } from "@/lib/auth/session";
import { LearningPreferencesForm } from "@/features/parent/LearningPreferencesForm";
import type { LearningPreferencesInput } from "@/features/parent/actions";

export default async function ParentSettingsPage() {
  const [myLearners, session] = await Promise.all([getMyLearners(), getSessionProfile()]);

  return (
    <PageShell>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Settings</h1>

        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <Card>
            <h2 className="font-display font-bold text-lg mb-4">Family details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Full name</label>
                <input defaultValue={session?.fullName ?? ""} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input defaultValue={session?.email ?? ""} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-lg mb-4">Child login management</h2>
            {myLearners.length ? (
              <div className="space-y-3">
                {myLearners.map((l) => (
                  <div key={l.id} className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{l.preferred_name} · {l.year_group}</span>
                    <Button variant="outline" className="px-4 py-2 text-sm">Reset child login</Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-charcoal-teal/60">No children added yet.</p>
            )}
          </Card>

          <Card>
            <h2 className="font-display font-bold text-lg mb-4">Guardian access</h2>
            <p className="text-sm text-charcoal-teal/70 mb-4">
              Invite a co-parent or grandparent with view-only access to your children&apos;s learning.
            </p>
            <Button variant="outline">Invite a guardian</Button>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-lg mb-4">Notification preferences</h2>
            <label className="flex items-center gap-3 mb-2">
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-teal-900" />
              <span className="text-sm">Email me when a tutor sends a session note</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-teal-900" />
              <span className="text-sm">Email me a weekly progress summary</span>
            </label>
          </Card>
        </div>

        <h2 className="font-display font-bold text-2xl mb-2">Learning Preferences</h2>
        <p className="text-charcoal-teal/70 mb-6">
          Font, text size, extra time, and other accommodations — available to every family, on
          every plan, never gated behind a diagnosis.
        </p>
        <div className="grid lg:grid-cols-2 gap-6">
          {myLearners.map((l) => (
            <Card key={l.id}>
              <h3 className="font-display font-bold text-lg mb-4">{l.preferred_name}</h3>
              <LearningPreferencesForm
                learnerId={l.id}
                learnerName={l.preferred_name}
                initial={(l.learning_preferences as unknown as Partial<Omit<LearningPreferencesInput, "learnerId">>) ?? {}}
              />
            </Card>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
