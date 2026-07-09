import { toSymbolSupported } from "@/lib/symbolSupport";

// Renders text with a small symbol above any recognised word, for children
// who benefit from symbol-supported communication. Falls back to plain text
// for unrecognised words rather than leaving gaps.
export function SymbolSupportedText({ text, className = "" }: { text: string; className?: string }) {
  const parts = toSymbolSupported(text);
  return (
    <span className={`inline-flex flex-wrap items-end gap-x-1.5 gap-y-1 ${className}`}>
      {parts.map((p, i) => (
        <span key={i} className="inline-flex flex-col items-center text-center">
          {p.symbol && <span aria-hidden className="text-base leading-none mb-0.5">{p.symbol}</span>}
          <span>{p.word}</span>
        </span>
      ))}
    </span>
  );
}
