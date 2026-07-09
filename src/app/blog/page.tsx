import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";

const categories = [
  { icon: "📝", title: "11+ preparation guidance", body: "Plain, practical advice on mock exam strategy, the three ways to sit a mock, and how to read a topic-level breakdown without panicking about a single number." },
  { icon: "💚", title: "Child wellbeing", body: "Notes on exam stress, mood tracking, and why we built a mandatory brain warm-up before every mock rather than dropping a child straight into timed conditions." },
  { icon: "🧠", title: "SEND & accessibility resources", body: "Practical accommodation guidance for families and tutors — extra time, read-aloud, dyslexia-friendly fonts, and what \"no diagnosis required\" actually means in practice." },
  { icon: "🛡️", title: "Safeguarding transparency updates", body: "Honest updates on how our vetting, DBS checks, and message-visibility architecture actually work — and where we're still improving it." },
];

export default function BlogPage() {
  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
          Company
        </span>
        <h1 className="font-display font-bold text-4xl mb-6">Fennby Blog</h1>

        <p className="text-charcoal-teal/85 leading-relaxed mb-10 text-lg">
          There&apos;s nothing published here yet — we&apos;d rather launch this once we have
          something genuinely useful to say than fill it with placeholder posts. Here&apos;s what
          you can expect once we do:
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          {categories.map((c) => (
            <Card key={c.title}>
              <span className="text-3xl" aria-hidden>{c.icon}</span>
              <h2 className="font-display font-bold text-lg mt-3 mb-2">{c.title}</h2>
              <p className="text-sm text-charcoal-teal/80 leading-relaxed">{c.body}</p>
            </Card>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
