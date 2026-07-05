import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { getAllQuestions } from "@/features/admin/queries";

export default async function AdminQuestionsPage() {
  const questions = await getAllQuestions();

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Question bank</h1>
        {questions.length ? (
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-charcoal-teal/60">
                  <th className="py-2 pr-4">Question</th>
                  <th className="py-2 pr-4">Subject</th>
                  <th className="py-2 pr-4">Difficulty</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id} className="border-t border-teal-100">
                    <td className="py-2 pr-4 max-w-xs truncate">{q.text}</td>
                    <td className="py-2 pr-4">{q.subject_key ?? "—"}</td>
                    <td className="py-2 pr-4 capitalize">{q.difficulty}</td>
                    <td className="py-2 capitalize">{q.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : (
          <Card>
            <EmptyState emoji="❓" title="No questions in the bank yet" description="Questions are authored directly against the database for now." />
          </Card>
        )}
      </main>
    </PageShell>
  );
}
