import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const features = [
  { title: "Mock exams", body: "Digital, print-and-shade, and full timed simulation modes, all auto-marked.", href: "/child/mock-exams" },
  { title: "Vetted tutors", body: "Every tutor DBS-checked, trained, and signed before ever meeting your child.", href: "/parent/tutors" },
  { title: "Parent dashboard", body: "Real-time visibility into every score, message, and session.", href: "/parent" },
  { title: "Vocational & craft track", body: "Bag making, shoemaking, and sewing — supervised, structured mastery.", href: "/vocational" },
  { title: "Summer camps", body: "A summer that builds confidence, not just fills time.", href: "/summer-camps" },
];

export default function ForFamiliesPage() {
  return (
    <PageShell>
      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="font-display font-bold text-4xl mb-4">For families</h1>
        <p className="text-charcoal-teal/80 max-w-2xl mb-10">
          Everything your child needs to prepare — and everything you need to see it happening.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <Card key={f.title}>
              <p className="font-display font-bold text-lg">{f.title}</p>
              <p className="text-sm text-charcoal-teal/80 mt-1 mb-4">{f.body}</p>
              <Button href={f.href} variant="outline">Explore</Button>
            </Card>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
