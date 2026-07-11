import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { getAllSittings } from "@/features/mockExamSittings/adminActions";
import { CreateSittingForm } from "./CreateSittingForm";
import { CloseSittingButton } from "./CloseSittingButton";

const STATUS_TINT: Record<string, string> = {
  open: "bg-sage-600/15 text-sage-600",
  closed: "bg-coral-100 text-brick-600",
  completed: "bg-teal-100 text-teal-900",
};

export default async function AdminMockExamsPage() {
  const sittings = await getAllSittings();

  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Mock exam simulations</h1>
        <p className="text-charcoal-teal/70 mb-8">
          Announce a sitting date, parents register and pay per sitting, billed separately from
          the core subscription.
        </p>

        <Card className="mb-10">
          <CreateSittingForm />
        </Card>

        <h2 className="font-display font-bold text-lg mb-4">All sittings</h2>
        {sittings.length ? (
          <div className="space-y-3">
            {sittings.map((s) => (
              <Card key={s.id} className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-sm text-charcoal-teal/70">
                    {new Date(s.sitting_date).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} · £{Number(s.price).toFixed(2)}
                    {s.capacity ? ` · capacity ${s.capacity}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_TINT[s.status]}`}>{s.status}</span>
                  {s.status === "open" && <CloseSittingButton sittingId={s.id} />}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-charcoal-teal/60">No sittings created yet.</p>
        )}
      </main>
    </PageShell>
  );
}
