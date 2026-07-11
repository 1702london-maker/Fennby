import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const stakeholders = [
  {
    emoji: "👪",
    title: "I'm a parent",
    body: "Register your family, add your children, and see everything as it happens.",
    primary: { href: "/register/parent", label: "Create a parent account" },
    secondary: { href: "/login?as=parent", label: "Log in" },
  },
  {
    emoji: "🧒",
    title: "I'm a young learner",
    body: "See what's waiting for you on Fennby, then log in with your grown-up.",
    primary: { href: "/for-kids", label: "See what I get" },
    secondary: { href: "/child-login", label: "Log in to Kids Portal" },
  },
  {
    emoji: "🎓",
    title: "I want to tutor",
    body: "Keep 100% of what you earn. DBS-checked, trained, and properly supported.",
    primary: { href: "/apply-tutor", label: "Apply to tutor" },
    secondary: { href: "/login?as=tutor", label: "Log in" },
  },
  {
    emoji: "🏫",
    title: "I'm an education provider",
    body: "Cohort dashboards, Pupil Premium reporting, and homework in one place.",
    primary: { href: "/register/school", label: "Register your school" },
    secondary: { href: "/login?as=school_admin", label: "Log in" },
  },
  {
    emoji: "🏛️",
    title: "I'm a local authority",
    body: "Anonymised regional visibility for pupils in your care, without exposing individual data.",
    primary: { href: "/for-local-authorities", label: "Learn more" },
    secondary: { href: "/login?as=authority", label: "Log in" },
  },
];

export default function GetStartedPage() {
  return (
    <PageShell>
      <main className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="font-display font-bold text-4xl mb-3 text-center">Who&apos;s getting started?</h1>
        <p className="text-charcoal-teal/80 text-center max-w-xl mx-auto mb-12">
          Fennby works differently depending on who you are. Pick the option that&apos;s you, and
          we&apos;ll take you straight there.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stakeholders.map((s) => (
            <Card key={s.title} className="flex flex-col">
              <span className="text-3xl" aria-hidden>{s.emoji}</span>
              <h2 className="font-display font-bold text-lg mt-3 mb-2">{s.title}</h2>
              <p className="text-sm text-charcoal-teal/80 leading-relaxed mb-5 flex-1">{s.body}</p>
              <div className="flex flex-col gap-2">
                <Button href={s.primary.href} variant="primary" className="justify-center">{s.primary.label}</Button>
                <Button href={s.secondary.href} variant="outline" className="justify-center">{s.secondary.label}</Button>
              </div>
            </Card>
          ))}
        </div>
        <p className="text-center text-sm text-charcoal-teal/60 mt-10">
          Every family gets our SEND accommodations built in at no extra cost, and 20% off for any
          child with a SEND profile. See{" "}
          <a href="/send-accessibility" className="font-semibold text-teal-900 hover:underline">SEND &amp; Accessibility</a>.
        </p>
      </main>
    </PageShell>
  );
}
