import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { schools } from "@/lib/seed-data";

const school = schools[0];

export default function SchoolSettingsPage() {
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
              <input defaultValue={school.urn} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Safeguarding lead contact</label>
              <input defaultValue={school.safeguardingLeadContact} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Data protection contact</label>
              <input defaultValue={school.dataProtectionContact} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
            </div>
          </div>
        </Card>
      </main>
    </PageShell>
  );
}
