import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { questions, subjects, topics } from "@/lib/seed-data";

export default function AdminQuestionsPage() {
  const subjectName = (key: string) => subjects.find((s) => s.key === key)?.name ?? key;
  const topicName = (key: string) => topics.find((t) => t.key === key)?.name ?? key;

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-bold text-3xl">Question bank</h1>
          <Button variant="primary">Add question</Button>
        </div>
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-charcoal-teal/60">
                <th className="py-2 pr-4">Question</th>
                <th className="py-2 pr-4">Subject</th>
                <th className="py-2 pr-4">Topic</th>
                <th className="py-2 pr-4">Difficulty</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q.id} className="border-t border-teal-100">
                  <td className="py-2 pr-4 max-w-xs truncate">{q.text}</td>
                  <td className="py-2 pr-4">{subjectName(q.subjectKey)}</td>
                  <td className="py-2 pr-4">{topicName(q.topicKey)}</td>
                  <td className="py-2 pr-4 capitalize">{q.difficulty}</td>
                  <td className="py-2 capitalize">{q.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </PageShell>
  );
}
