import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const options = [
  { role: "Parent", href: "/register/parent", desc: "Create child profiles and see everything about their learning.", emoji: "👪" },
  { role: "Tutor", href: "/apply-tutor", desc: "Apply to join our vetted tutor network.", emoji: "🎓" },
  { role: "School", href: "/register/school", desc: "Register your school for cohort dashboards and reporting.", emoji: "🏫" },
];

export default function RegisterPage() {
  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display font-bold text-4xl mb-2 text-center">Join Fennby</h1>
        <p className="text-charcoal-teal/70 text-center mb-10">How would you like to register?</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {options.map((o) => (
            <Card key={o.role} className="text-center flex flex-col items-center">
              <span className="text-4xl mb-2" aria-hidden>{o.emoji}</span>
              <p className="font-display font-bold text-lg">{o.role}</p>
              <p className="text-sm text-charcoal-teal/70 mt-1 mb-4">{o.desc}</p>
              <Button href={o.href} variant="primary" className="mt-auto">Register as {o.role.toLowerCase()}</Button>
            </Card>
          ))}
        </div>
        <p className="text-center text-sm text-charcoal-teal/60 mt-8">
          Admin accounts are invite-only and created by the Fennby platform team.
        </p>
      </main>
    </PageShell>
  );
}
