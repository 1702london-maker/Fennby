import { SimplePage } from "@/components/SimplePage";
import { Card } from "@/components/Card";
import { getPlatformSettingsSnapshot } from "@/features/admin/queries";

function StatusRow({ label, ready }: { label: string; ready: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-teal-100 py-3 last:border-0">
      <span className="font-semibold">{label}</span>
      <span className={`text-xs font-bold px-3 py-1 rounded-full ${ready ? "bg-sage-100 text-sage-600" : "bg-coral-100 text-brick-600"}`}>
        {ready ? "Ready" : "Needs setup"}
      </span>
    </div>
  );
}

export default async function AdminSettingsPage() {
  const settings = await getPlatformSettingsSnapshot();

  return (
    <SimplePage eyebrow="Admin" title="Platform settings" body="Live readiness snapshot for production configuration and core platform content.">
      <div className="grid gap-4">
        <Card>
          <h2 className="font-display font-bold text-lg mb-3">Environment</h2>
          <p className="text-sm text-charcoal-teal/70 mb-3">Public app URL: <span className="font-semibold">{settings.appUrl}</span></p>
          <div className="text-sm">
            <StatusRow label="Supabase URL" ready={settings.publicSupabaseUrl} />
            <StatusRow label="Supabase anon key" ready={settings.publicSupabaseAnon} />
            <StatusRow label="Supabase service role" ready={settings.serviceRole} />
          </div>
        </Card>

        <Card>
          <h2 className="font-display font-bold text-lg mb-3">Integrations</h2>
          <div className="text-sm">
            <StatusRow label={`AI Tutor provider (${settings.aiTutorModel})`} ready={settings.aiTutorProvider} />
            <StatusRow label="Stripe checkout" ready={settings.stripeCheckout} />
            <StatusRow label="Stripe subscriptions" ready={settings.stripeSubscriptions} />
            <StatusRow label="Stripe webhook" ready={settings.stripeWebhook} />
            <StatusRow label="Resend email delivery" ready={settings.emailDelivery} />
            <StatusRow label="Cradle video" ready={settings.cradleVideo} />
          </div>
        </Card>

        <Card>
          <h2 className="font-display font-bold text-lg mb-3">Content & operations</h2>
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div className="bg-teal-100 rounded-2xl p-4"><p className="font-bold text-2xl">{settings.publishedAssessments}</p><p>Published assessments</p></div>
            <div className="bg-teal-100 rounded-2xl p-4"><p className="font-bold text-2xl">{settings.warmupQuestions}</p><p>Warm-up V2 questions</p></div>
            <div className="bg-teal-100 rounded-2xl p-4"><p className="font-bold text-2xl">{settings.openSittings}</p><p>Open exam sittings</p></div>
            <div className="bg-teal-100 rounded-2xl p-4"><p className="font-bold text-2xl">{settings.activeSubscriptions}</p><p>Active subscriptions</p></div>
            <div className="bg-teal-100 rounded-2xl p-4"><p className="font-bold text-2xl">{settings.uploadRecords}</p><p>Upload records</p></div>
            <div className="bg-teal-100 rounded-2xl p-4"><p className="font-bold text-2xl">{settings.cradleSessions}</p><p>Cradle sessions</p></div>
          </div>
        </Card>
      </div>
    </SimplePage>
  );
}
