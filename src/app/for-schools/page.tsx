import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const features = [
  { title: "Cohort dashboards", body: "Class and year-group progress at a glance." },
  { title: "Pupil Premium impact reports", body: "Plain-language reports ready for your statutory strategy statement." },
  { title: "Inter-school network", body: "Friendly, anonymised competitions across partner schools." },
  { title: "Homework & assignments", body: "Set homework, quizzes, and mocks at pupil, class, or year-group level." },
];

export default function ForSchoolsPage() {
  return (
    <PageShell>
      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="font-display font-bold text-4xl mb-4">For schools</h1>
        <p className="text-charcoal-teal/80 max-w-2xl mb-10">
          A genuine institutional reporting layer — not just a bolt-on tutoring widget.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {features.map((f) => (
            <Card key={f.title}>
              <p className="font-display font-bold text-lg">{f.title}</p>
              <p className="text-sm text-charcoal-teal/80 mt-1">{f.body}</p>
            </Card>
          ))}
        </div>
        <Button href="/school/demo" variant="primary">Book a demo</Button>
      </main>
    </PageShell>
  );
}
