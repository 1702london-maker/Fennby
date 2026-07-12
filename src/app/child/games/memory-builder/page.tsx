import { PageShell } from "@/components/PageShell";
import { MemoryBuilderGame } from "./MemoryBuilderGame";

export default function MemoryBuilderPage() {
  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">🧠 Memory Builder</h1>
        <p className="text-charcoal-teal/70 mb-8">Flip two cards at a time and find every matching pair.</p>
        <MemoryBuilderGame />
      </main>
    </PageShell>
  );
}
