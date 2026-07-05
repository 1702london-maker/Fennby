import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { getMySchool } from "@/features/schools/queries";

export default async function SchoolSettingsPage() {
  const school = await getMySchool();
  if (!school) {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-10">
          <EmptyState emoji="🏫" title="No school account found" description="" />
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Settings</h1>
        <Card>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">School name</label>
              <input defaultValue={school.name} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">URN</label>
              <input defaultValue={school.urn ?? ""} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Safeguarding lead contact</label>
              <input defaultValue={school.safeguarding_lead_contact ?? ""} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Data protection contact</label>
              <input defaultValue={school.data_protection_contact ?? ""} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
            </div>
          </div>
        </Card>
      </main>
    </PageShell>
  );
}
