import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { games, gameChallenges, type GameKey } from "../gameData";
import { BrainGameClient } from "./BrainGameClient";

function isGameKey(value: string): value is GameKey {
  return games.some((game) => game.key === value);
}

export default async function BrainGamePage({ params }: { params: Promise<{ gameKey: string }> }) {
  const { gameKey } = await params;

  if (gameKey === "memory-builder") redirect("/child/games/memory-builder");
  if (!isGameKey(gameKey)) notFound();

  const game = games.find((item) => item.key === gameKey);
  if (!game || game.key === "memory-builder") notFound();
  const challenges = gameChallenges[game.key] ?? [];
  if (!challenges.length) notFound();

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">
          <span aria-hidden>{game.emoji}</span> {game.name}
        </h1>
        <p className="text-charcoal-teal/70 mb-8">
          {game.minutes} minute drill for {game.skill.toLowerCase()}.
        </p>
        <BrainGameClient gameName={game.name} challenges={challenges} />
      </main>
    </PageShell>
  );
}
