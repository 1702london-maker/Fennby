import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { games, gameChallenges, type GameKey } from "../gameData";
import { BrainGameClient } from "./BrainGameClient";

function isGameKey(value: string): value is GameKey {
  return games.some((game) => game.key === value);
}

export default function BrainGamePage({ params }: { params: { gameKey: string } }) {
  if (params.gameKey === "memory-builder") redirect("/child/games/memory-builder");
  if (!isGameKey(params.gameKey)) notFound();

  const game = games.find((item) => item.key === params.gameKey);
  if (!game || game.key === "memory-builder") notFound();

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">
          <span aria-hidden>{game.emoji}</span> {game.name}
        </h1>
        <p className="text-charcoal-teal/70 mb-8">
          {game.minutes} minute drill for {game.skill.toLowerCase()}.
        </p>
        <BrainGameClient gameName={game.name} challenges={gameChallenges[game.key]} />
      </main>
    </PageShell>
  );
}
