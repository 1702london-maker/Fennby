import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { getAllSittings } from "@/features/mockExamSittings/adminActions";
import { getPrintShadeMarkingQueue } from "@/features/assessments/adminActions";
import { CreateSittingForm } from "./CreateSittingForm";
import { CloseSittingButton } from "./CloseSittingButton";
import { MarkPrintShadeForm } from "./MarkPrintShadeForm";

export const dynamic = "force-dynamic";

const STATUS_TINT: Record<string, string> = {
  open: "bg-sage-600/15 text-sage-600",
  closed: "bg-coral-100 text-brick-600",
  completed: "bg-teal-100 text-teal-900",
};

export default async function AdminMockExamsPage() {
  const [sittings, markingQueue] = await Promise.all([getAllSittings(), getPrintShadeMarkingQueue()]);

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

        <h2 className="font-display font-bold text-lg mb-4">Print &amp; Shade marking queue</h2>
        {markingQueue.length ? (
          <div className="space-y-3 mb-10">
            {markingQueue.map((item) => (
              <Card key={item.id}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-semibold">{item.learnerName} · {item.assessmentTitle}</p>
                    <p className="text-sm text-charcoal-teal/70">
                      Uploaded {new Date(item.startedAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} · {item.markingStatus.replace("_", " ")}
                    </p>
                    <p className="text-xs text-charcoal-teal/50 mt-1 break-all">{item.uploadedImageUrl}</p>
                  </div>
                  {item.signedUrl ? (
                    <Button href={item.signedUrl} variant="outline" className="px-4 py-2 text-sm">
                      Review upload
                    </Button>
                  ) : (
                    <span className="text-sm font-semibold text-brick-600">Upload unavailable</span>
                  )}
                </div>
                <MarkPrintShadeForm attemptId={item.id} />
              </Card>
            ))}
          </div>
        ) : (
          <Card className="mb-10">
            <p className="text-sm text-charcoal-teal/70">No Print &amp; Shade papers waiting for marking.</p>
          </Card>
        )}

        <h2 className="font-display font-bold text-lg mb-4">All sittings</h2>
        {sittings.length ? (
          <div className="space-y-3">
            {sittings.map((s) => (
              <Card key={s.id} className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{s.title}</p>
                    {s.exam_board && (
                      <span className="text-xs font-bold bg-plum-700/10 text-plum-700 px-2 py-0.5 rounded-full">
                        {s.exam_board}
                      </span>
                    )}
                  </div>
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
