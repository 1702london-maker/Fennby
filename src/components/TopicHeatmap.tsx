export function TopicHeatmap({ topics }: { topics: { topic: string; score: number }[] }) {
  const colorFor = (score: number) => {
    if (score >= 75) return "bg-sage-600/20 text-sage-600";
    if (score >= 55) return "bg-coral-100 text-coral-600";
    return "bg-brick-600/10 text-brick-600";
  };
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {topics.map((t) => (
        <div key={t.topic} className={`rounded-2xl px-4 py-3 text-sm ${colorFor(t.score)}`}>
          <p className="font-semibold">{t.topic}</p>
          <p className="text-xs mt-1">{t.score}%</p>
        </div>
      ))}
    </div>
  );
}
