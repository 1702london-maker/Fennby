import { EmptyState } from "@/components/EmptyState";
import { getPublishedAssessment } from "@/features/assessments/queries";
import { SimulationClient } from "./SimulationClient";

export default async function FullSimulation() {
  const data = await getPublishedAssessment();

  if (!data || !data.questions.length) {
    return (
      <div className="min-h-screen bg-mist-50 flex items-center justify-center px-6">
        <EmptyState emoji="📝" title="No mock exam available yet" description="Check back soon — new mocks are added regularly." />
      </div>
    );
  }

  return (
    <SimulationClient
      assessmentId={data.assessment.id}
      questions={data.questions.map((q) => ({
        id: q.id,
        topic: q.topic_key ?? "General",
        text: q.text,
        options: q.options,
      }))}
    />
  );
}
