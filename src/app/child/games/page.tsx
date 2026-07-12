import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

// Only Memory Builder is a real, playable game right now — the rest are
// honestly labelled "Coming soon" rather than a button that looks
// clickable but silently does nothing.
const games = [
  { name: "Memory Builder", skill: "Working memory", minutes: 5, difficulty: "Easy", emoji: "🧠", live: true },
  { name: "Pattern Recognition", skill: "Non-Verbal Reasoning", minutes: 5, difficulty: "Medium", emoji: "🔷", live: false },
  { name: "Logic Puzzle", skill: "Verbal Reasoning", minutes: 7, difficulty: "Medium", emoji: "🧩", live: false },
  { name: "Number Recall", skill: "Maths", minutes: 5, difficulty: "Easy", emoji: "🔢", live: false },
  { name: "Reading Focus", skill: "English", minutes: 6, difficulty: "Medium", emoji: "📖", live: false },
  { name: "Attention Switch", skill: "Concentration", minutes: 5, difficulty: "Hard", emoji: "🔀", live: false },
  { name: "Reasoning Challenge", skill: "Verbal Reasoning", minutes: 8, difficulty: "Hard", emoji: "💡", live: false },
];

export default function ChildGamesPage() {
  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Brain games</h1>
        <p className="text-charcoal-teal/70 mb-8">Quick, fun games that train the skills behind every mock exam.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((g) => (
            <Card key={g.name} tint="coral">
              <span className="text-4xl" aria-hidden>{g.emoji}</span>
              <p className="font-display font-bold text-lg mt-2">{g.name}</p>
              <p className="text-sm text-charcoal-teal/70">Trains: {g.skill}</p>
              <p className="text-xs text-charcoal-teal/60 mt-1">{g.minutes} mins · {g.difficulty}</p>
              {g.live ? (
                <Button href="/child/games/memory-builder" variant="secondary" className="mt-4">Start</Button>
              ) : (
                <span className="inline-block mt-4 text-xs font-bold bg-white/70 text-charcoal-teal/60 px-3 py-2 rounded-full">
                  Coming soon
                </span>
              )}
            </Card>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
