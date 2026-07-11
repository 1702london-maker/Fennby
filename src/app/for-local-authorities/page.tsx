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
        <section className="grid md:grid-cols-2 gap-12 items-center mb-14">
          <div>
            <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
              FOR LOCAL AUTHORITIES
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl leading-tight text-charcoal-teal text-balance">
              Regional visibility, without exposing individual pupil data.
            </h1>
            <p className="mt-6 text-lg text-charcoal-teal/80 leading-relaxed max-w-lg">
              Built for safeguarding officers and Virtual School Heads who need a genuine,
              verifiable view of engagement and progress across schools, alternative provision,
              and EOTAS settings in your area, not a slide deck update once a term.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/contact" variant="primary">Get in touch</Button>
              <Button href="/trust" variant="outline">Read our safeguarding framework</Button>
            </div>
          </div>
          <div className="flex justify-center">
            <Card tint="teal" className="w-full max-w-sm">
              <p className="font-display font-bold text-sm text-teal-900 mb-3">Aggregated, never individual</p>
              <ul className="space-y-2 text-sm text-charcoal-teal/85">
                <li>✓ School and cohort-level dashboards</li>
                <li>✓ Anonymised at this level of access</li>
                <li>✓ Auditable safeguarding vetting</li>
                <li>✓ Mainstream, AP &amp; EOTAS covered</li>
              </ul>
            </Card>
          </div>
        </section>

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
