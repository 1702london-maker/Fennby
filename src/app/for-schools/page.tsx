import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const features = [
  { title: "Cohort dashboards", body: "Class and year-group progress at a glance, updated in real time as pupils complete mocks and homework.", href: "/school/cohorts" },
  { title: "Pupil Premium impact reports", body: "Plain-language reports linking Fennby usage to progress, ready for your statutory Pupil Premium strategy statement.", href: "/school/reports" },
  { title: "Inter-school network", body: "Friendly, anonymised competitions and leaderboards across partner schools.", href: "/school/network" },
  { title: "Homework & assignments", body: "Set homework, topic quizzes, and mocks at pupil, class, or year-group level in a few clicks.", href: "/school/assignments" },
  { title: "Intervention flagging", body: "High-priority revision needs surfaced automatically across your whole cohort, not just the pupils you happen to check on.", href: "/school/interventions" },
  { title: "Safeguarding you can verify", body: "Every tutor DBS-checked and trained before ever meeting a pupil — see exactly how, not just take our word for it.", href: "/trust" },
];

export default function ForSchoolsPage() {
  return (
    <PageShell>
      <main className="max-w-7xl mx-auto px-6 py-16">
        <section className="grid md:grid-cols-2 gap-12 items-center mb-14">
          <div>
            <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
              FOR EDUCATION PROVIDERS
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl leading-tight text-charcoal-teal text-balance">
              A genuine institutional reporting layer, not a bolt-on tutoring widget.
            </h1>
            <p className="mt-6 text-lg text-charcoal-teal/80 leading-relaxed max-w-lg">
              Fennby gives your setting a live view of pupil progress alongside evidence you can
              actually use in statutory reporting. Built for mainstream schools, alternative
              provision, and EOTAS settings alike.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/school/demo" variant="primary">Book a demo</Button>
              <Button href="/register/school" variant="outline">Register your school</Button>
            </div>
          </div>
          <div className="flex justify-center">
            <Card tint="teal" className="w-full max-w-sm">
              <p className="font-display font-bold text-sm text-teal-900 mb-3">Ready for statutory reporting</p>
              <ul className="space-y-2 text-sm text-charcoal-teal/85">
                <li>✓ Pupil Premium strategy statement evidence</li>
                <li>✓ SEND progress tracking, built in</li>
                <li>✓ Safeguarding a governor can follow</li>
                <li>✓ School-scoped staff accounts only</li>
              </ul>
            </Card>
          </div>
        </section>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {features.map((f) => (
            <Card key={f.title}>
              <p className="font-display font-bold text-lg">{f.title}</p>
              <p className="text-sm text-charcoal-teal/80 mt-1 mb-4">{f.body}</p>
              <Button href={f.href} variant="outline">Explore</Button>
            </Card>
          ))}
        </div>

        <Card tint="teal" className="mb-10">
          <h2 className="font-display font-bold text-lg mb-2">How registration works</h2>
          <ol className="space-y-2 text-charcoal-teal/80 list-decimal list-inside">
            <li>Register your school with your URN, local authority, and safeguarding lead contact</li>
            <li>A Fennby platform admin reviews and approves your registration</li>
            <li>Invite your teaching staff — each gets a school-scoped account, never platform-wide access</li>
            <li>Link enrolled pupils and start setting homework and viewing cohort progress</li>
          </ol>
        </Card>

        <div className="flex flex-wrap gap-4">
          <Button href="/school/demo" variant="primary">Book a demo</Button>
          <Button href="/register/school" variant="secondary">Register your school</Button>
          <Button href="/trust" variant="outline">Read our safeguarding framework</Button>
        </div>
      </main>
    </PageShell>
  );
}
