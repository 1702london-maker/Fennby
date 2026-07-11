import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const features = [
  { title: "Anonymised regional dashboards", body: "School and cohort-level progress across your area, aggregated — never individual pupil data at this level of access." },
  { title: "Virtual School oversight", body: "A live, verifiable view of engagement and progress for children in your care, without chasing individual settings for updates." },
  { title: "Safeguarding you can audit", body: "Every tutor DBS-checked, trained, and signed before ever meeting a child — see exactly how, not just take our word for it." },
  { title: "EOTAS & alternative provision coverage", body: "The same reporting layer works whether a child is in mainstream school, alternative provision, or home educated." },
];

export default function ForLocalAuthoritiesPage() {
  return (
    <PageShell>
      <main className="max-w-7xl mx-auto px-6 py-16">
        <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
          FOR LOCAL AUTHORITIES
        </span>
        <h1 className="font-display font-bold text-4xl mb-4 max-w-2xl">
          Regional visibility, without exposing individual pupil data.
        </h1>
        <p className="text-charcoal-teal/80 max-w-2xl mb-10">
          Built for safeguarding officers and Virtual School Heads who need a genuine, verifiable
          view of engagement and progress across schools, alternative provision, and EOTAS
          settings in your area — not a slide deck update once a term.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {features.map((f) => (
            <Card key={f.title}>
              <p className="font-display font-bold text-lg">{f.title}</p>
              <p className="text-sm text-charcoal-teal/80 mt-1">{f.body}</p>
            </Card>
          ))}
        </div>

        <Card tint="teal" className="mb-10">
          <p className="text-charcoal-teal/85 leading-relaxed">
            All data shown to local authority viewers is anonymised and aggregated at
            school/cohort level. Individual pupil data is never exposed at this level of access
            — full detail lives in our{" "}
            <a href="/trust" className="font-semibold text-teal-900 hover:underline">Trust &amp; Safeguarding framework</a>.
          </p>
        </Card>

        <div className="flex flex-wrap gap-4">
          <Button href="/contact" variant="primary">Get in touch</Button>
          <Button href="/trust" variant="outline">Read our Trust &amp; Safeguarding framework</Button>
        </div>
      </main>
    </PageShell>
  );
}
