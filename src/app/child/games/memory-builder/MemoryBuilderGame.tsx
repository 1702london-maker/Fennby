"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const EMOJI_SET = ["🦊", "🐢", "🦉", "🐝", "🐬", "🦋", "🐙", "🦔"];

function shuffledDeck() {
  const pairs = [...EMOJI_SET, ...EMOJI_SET].map((emoji, i) => ({ id: i, emoji, matched: false }));
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs;
}

export function MemoryBuilderGame() {
  const [deck, setDeck] = useState(shuffledDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const allMatched = useMemo(() => deck.every((c) => c.matched), [deck]);

  const onFlip = (id: number) => {
    if (locked || flipped.includes(id) || deck.find((c) => c.id === id)?.matched) return;
    const next = [...flipped, id];
    setFlipped(next);

    if (next.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const [a, b] = next;
      const cardA = deck.find((c) => c.id === a)!;
      const cardB = deck.find((c) => c.id === b)!;
      if (cardA.emoji === cardB.emoji) {
        setTimeout(() => {
          setDeck((d) => d.map((c) => (c.id === a || c.id === b ? { ...c, matched: true } : c)));
          setFlipped([]);
          setLocked(false);
        }, 500);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  const restart = () => {
    setDeck(shuffledDeck());
    setFlipped([]);
    setMoves(0);
    setLocked(false);
  };

  if (allMatched) {
    return (
      <Card tint="teal" className="text-center">
        <span className="text-5xl" aria-hidden>🎉</span>
        <p className="font-display font-bold text-2xl mt-3 mb-1">All matched!</p>
        <p className="text-charcoal-teal/80 mb-6">You did it in {moves} moves.</p>
        <Button variant="primary" onClick={restart}>Play again</Button>
      </Card>
    );
  }

  return (
    <>
      <p className="text-sm font-semibold text-charcoal-teal/60 mb-4">Moves: {moves}</p>
      <div className="grid grid-cols-4 gap-3">
        {deck.map((card) => {
          const isVisible = card.matched || flipped.includes(card.id);
          return (
            <button
              key={card.id}
              onClick={() => onFlip(card.id)}
              aria-label={isVisible ? card.emoji : "Face-down card"}
              className={`aspect-square rounded-2xl text-3xl flex items-center justify-center transition-colors min-h-[44px] ${
                isVisible ? "bg-teal-100" : "bg-charcoal-teal hover:bg-charcoal-teal/90"
              }`}
            >
              {isVisible ? card.emoji : ""}
            </button>
          );
        })}
      </div>
    </>
  );
}
