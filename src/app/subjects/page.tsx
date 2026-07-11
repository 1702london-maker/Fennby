import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { createClient } from "@/lib/supabase/server";

const subjectIcons: Record<string, string> = {
  maths: "🔢",
  english: "📖",
  biology: "🧬",
  chemistry: "🧪",
  physics: "⚛️",
  french: "🇫🇷",
  spanish: "🇪🇸",
  german: "🇩🇪",
};

const categoryLabel: Record<string, string> = {
  core: "Core subjects",
  language: "Languages",
  eleven_plus: "11+ / Entrance exam",
};

export default async function SubjectsPage() {
  const supabase = await createClient();
  const [{ data: subjects }, { data: levels }] = await Promise.all([
    supabase.from("subjects").select("*").order("category"),
    supabase.from("education_levels").select("*").order("sort_order"),
  ]);

  const grouped = new Map<string, typeof subjects>();
  for (const s of subjects ?? []) {
    const list = grouped.get(s.category) ?? [];
    list.push(s);
    grouped.set(s.category, list);
  }

  return (
    <PageShell>
      <main className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="font-display font-bold text-4xl mb-4">Every subject, every level</h1>
        <p className="text-charcoal-teal/80 max-w-2xl mb-10">
          11+ is our anchor, not our ceiling. Fennby covers the full range — pick a subject to
          see what&apos;s available at your child&apos;s stage.
        </p>

        {Array.from(grouped.entries()).map(([category, list]) => (
          <section key={category} className="mb-12">
            <h2 className="font-display font-bold text-xl mb-4">{categoryLabel[category] ?? category}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {list!.map((s) => (
                <Card key={s.key} className="text-center">
                  <span className="text-3xl" aria-hidden>{subjectIcons[s.key] ?? "📚"}</span>
                  <p className="font-display font-bold mt-2">{s.name}</p>
                </Card>
              ))}
            </div>
          </section>
        ))}

        <section className="mb-10">
          <h2 className="font-display font-bold text-xl mb-4">Every level</h2>
          <div className="flex flex-wrap gap-2">
            {(levels ?? []).map((l) => (
              <span key={l.key} className="text-sm font-semibold bg-teal-100 text-teal-900 px-4 py-2 rounded-full">
                {l.name}
              </span>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-4">
          <Button href="/register/parent" variant="primary">Create a parent account</Button>
          <Button href="/for-families" variant="outline">Explore For Families</Button>
        </div>
      </main>
    </PageShell>
  );
}
