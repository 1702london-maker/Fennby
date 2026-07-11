import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const included = [
  { emoji: "🎨", title: "Your own brand, properly", body: "Your name, your colours, your logo, on your own domain. Families never see the word Fennby unless you want them to." },
  { emoji: "🧩", title: "The whole platform underneath", body: "Mock exams, vetted tutor matching, parent dashboards, messaging, the AI Tutor, safeguarding tooling, all of it, built once and proven, not rebuilt from nothing." },
  { emoji: "🛡️", title: "The same safeguarding standard", body: "KCSIE-aligned vetting, DBS tracking, an immutable audit trail, and a named safeguarding contact, inherited from day one, not bolted on later." },
  { emoji: "📊", title: "Reporting your governors expect", body: "Pupil Premium impact evidence, cohort dashboards, and progress reporting, ready out of the box." },
];

const sequence = [
  { num: "01", title: "A proper conversation first", body: "We talk through your setting, your families, and what you actually need before anything is quoted or built." },
  { num: "02", title: "Brand & scope agreed", body: "Your colours, your name, your domain, and exactly which parts of the platform you want live from day one." },
  { num: "03", title: "Built and configured", body: "Your own branded instance, set up on your domain, your staff and tutor accounts created, your subjects and levels configured." },
  { num: "04", title: "Training for your team", body: "A real walkthrough for teaching staff and administrators, not a PDF left to gather dust." },
  { num: "05", title: "Go live, supported", body: "Your families start using it, with your platform live and your monthly plan covering upkeep, hosting, and improvements." },
  { num: "06", title: "Grow it over time", body: "Want a new feature that isn't in the base build? It's quoted and built as its own one-off addition, never a surprise on your invoice." },
];

const pricing = [
  { label: "One-off build fee", value: "£2,500", body: "Covers your branded setup: your domain, your colours and logo applied throughout, your accounts created, your subjects configured." },
  { label: "Monthly subscription", value: "£599", body: "Hosting, security updates, safeguarding framework upkeep, and ongoing platform improvements, for as long as you run it." },
  { label: "New features", value: "Quoted per feature", body: "Anything beyond the base platform, a bespoke integration, a new reporting view, is scoped and priced as its own one-off addition." },
];

export default function FoundryPage() {
  return (
    <PageShell>
      <main>
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-14 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-plum-700/10 text-plum-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
              THE FENNBY FOUNDRY
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl leading-tight text-charcoal-teal text-balance">
              Your own tutoring platform, built on everything we&apos;ve already proven works.
            </h1>
            <p className="mt-6 text-lg text-charcoal-teal/80 leading-relaxed max-w-lg">
              For schools, trusts, and education providers who want a platform like Fennby under
              their own name, not a licence to use ours. Your brand, your domain, the same
              safeguarding standard, built and supported by us.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/contact" variant="primary">Start a conversation</Button>
              <Button href="/for-schools" variant="outline">See the standard Fennby offer</Button>
            </div>
          </div>
          <div className="flex justify-center">
            <Card tint="plum" className="w-full max-w-sm">
              <p className="font-display font-bold text-sm text-plum-700 mb-3">Straightforward, from day one</p>
              <ul className="space-y-2 text-sm text-charcoal-teal/85">
                <li>✓ £2,500 one-off build, fully branded</li>
                <li>✓ £599 a month, upkeep &amp; improvements</li>
                <li>✓ New features quoted and built as needed</li>
                <li>✓ No surprise line items, ever</li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-8">
          <h2 className="font-display font-bold text-2xl mb-6">What comes with it</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {included.map((i) => (
              <Card key={i.title}>
                <span className="text-3xl" aria-hidden>{i.emoji}</span>
                <p className="font-display font-bold text-lg mt-2 mb-1">{i.title}</p>
                <p className="text-sm text-charcoal-teal/80 leading-relaxed">{i.body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-plum-700/10">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h2 className="font-display font-bold text-2xl mb-8 text-plum-700">How it comes together</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sequence.map((s) => (
                <div key={s.num}>
                  <span className="font-display font-bold text-3xl text-plum-700/40">{s.num}</span>
                  <p className="font-display font-bold mt-2 mb-1">{s.title}</p>
                  <p className="text-sm text-charcoal-teal/75">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="font-display font-bold text-2xl mb-6">Straightforward pricing</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {pricing.map((p) => (
              <Card key={p.label} tint="teal">
                <p className="text-xs font-bold text-teal-900 uppercase tracking-wide mb-1">{p.label}</p>
                <p className="font-display font-bold text-3xl mb-2 text-teal-900">{p.value}</p>
                <p className="text-sm text-charcoal-teal/80 leading-relaxed">{p.body}</p>
              </Card>
            ))}
          </div>
          <Card tint="coral" className="mt-6">
            <p className="text-charcoal-teal/85 leading-relaxed">
              This is built for real planning, not a sales tactic: budget £2,500 once to get
              live, £599 every month after that to keep it running and improving, and treat any
              genuinely new feature as its own scoped, quoted addition. Tutors and teaching staff
              get a platform that behaves exactly like Fennby underneath, so there&apos;s nothing new
              for them to relearn.
            </p>
          </Card>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display font-bold text-3xl mb-4">Thinking about it for your setting?</h2>
          <p className="text-charcoal-teal/80 mb-8">
            Tell us a bit about your school, trust, or provision, and we&apos;ll talk through what a
            branded build would actually look like for you, no obligation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/contact" variant="primary">Start a conversation</Button>
            <Button href="/trust" variant="outline">Read our safeguarding framework</Button>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
