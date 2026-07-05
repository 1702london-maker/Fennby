import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";

export function SimplePage({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-16">
        {eyebrow && (
          <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
            {eyebrow}
          </span>
        )}
        <h1 className="font-display font-bold text-4xl mb-4">{title}</h1>
        <p className="text-charcoal-teal/80 leading-relaxed mb-8 max-w-2xl">{body}</p>
        {children ?? (
          <Card tint="teal">
            <p className="text-charcoal-teal/80">
              This section is coming soon. In the meantime, sample data across the rest of
              Fennby shows exactly what a real family, tutor, or school would see.
            </p>
          </Card>
        )}
      </main>
    </PageShell>
  );
}
