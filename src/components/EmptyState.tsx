export function EmptyState({
  emoji = "🌱",
  title,
  description,
}: {
  emoji?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <span className="text-5xl mb-3" aria-hidden>
        {emoji}
      </span>
      <p className="font-display font-bold text-lg">{title}</p>
      {description && (
        <p className="text-charcoal-teal/70 mt-1 max-w-sm">{description}</p>
      )}
    </div>
  );
}
