import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const categories = [
  { icon: "📝", title: "11+ preparation guidance", body: "Plain, practical advice on mock exam strategy, the three ways to sit a mock, and how to read a topic-level breakdown without panicking about a single number." },
  { icon: "💚", title: "Child wellbeing", body: "Notes on exam stress, mood tracking, and why we built a mandatory brain warm-up before every mock rather than dropping a child straight into timed conditions." },
  { icon: "🧠", title: "SEND & accessibility resources", body: "Practical accommodation guidance for families and tutors — extra time, read-aloud, dyslexia-friendly fonts, and what \"no diagnosis required\" actually means in practice." },
  { icon: "🛡️", title: "Safeguarding transparency updates", body: "Honest updates on how our vetting, DBS checks, and message-visibility architecture actually work — and where we're still improving it." },
];

const posts = [
  {
    slug: "trafford-11-plus-changes-2028",
    category: "11+ preparation guidance",
    date: "14 July 2026",
    title: "Trafford grammar schools are changing the 11+ from 2028. Here's what it actually means.",
    excerpt: "GL Assessment is out, a curriculum-based test from FSCE is in, and the whole timeline moves a year earlier. If your child is in Year 3 or 4, here's what actually changes for you.",
  },
];

export default function BlogPage() {
  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
          Company
        </span>
        <h1 className="font-display font-bold text-4xl mb-10">Fennby Blog</h1>

        <div className="space-y-6 mb-14">
          {posts.map((p) => (
            <Card key={p.slug}>
              <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
                {p.category}
              </span>
              <p className="text-xs text-charcoal-teal/60 mb-2">{p.date}</p>
              <h2 className="font-display font-bold text-xl mb-2">{p.title}</h2>
              <p className="text-sm text-charcoal-teal/80 leading-relaxed mb-4">{p.excerpt}</p>
              <Button href={`/blog/${p.slug}`} variant="outline">Read the full post</Button>
            </Card>
          ))}
        </div>

        <p className="text-charcoal-teal/70 leading-relaxed mb-10">
          More on the way, but here&apos;s what to expect from this blog going forward:
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
