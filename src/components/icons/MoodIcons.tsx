import { Mood } from "@/lib/mock-data";

// Flat, matte, rounded mood icons in the Fennby visual language — no gradients, no glossy effects.
function Face({
  bg,
  children,
}: {
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <svg viewBox="0 0 48 48" width="32" height="32" aria-hidden focusable="false">
      <circle cx="24" cy="24" r="22" fill={bg} />
      {children}
    </svg>
  );
}

export const MoodIcon: Record<Mood, () => React.ReactElement> = {
  great: () => (
    <Face bg="#FBE3DB">
      <circle cx="16" cy="20" r="2.4" fill="#1F3B3B" />
      <circle cx="32" cy="20" r="2.4" fill="#1F3B3B" />
      <path
        d="M14 28c3 5 8 7 10 7s7-2 10-7"
        stroke="#F2896B"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </Face>
  ),
  good: () => (
    <Face bg="#DCEFEF">
      <circle cx="16" cy="20" r="2.2" fill="#1F3B3B" />
      <circle cx="32" cy="20" r="2.2" fill="#1F3B3B" />
      <path
        d="M15 29c3 3 6 4 9 4s6-1 9-4"
        stroke="#146B6B"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </Face>
  ),
  okay: () => (
    <Face bg="#F4FAFA">
      <circle cx="16" cy="20" r="2.2" fill="#1F3B3B" />
      <circle cx="32" cy="20" r="2.2" fill="#1F3B3B" />
      <line x1="16" y1="30" x2="32" y2="30" stroke="#5B4B8A" strokeWidth="3" strokeLinecap="round" />
    </Face>
  ),
  low: () => (
    <Face bg="#DCEFEF">
      <circle cx="16" cy="21" r="2.2" fill="#1F3B3B" />
      <circle cx="32" cy="21" r="2.2" fill="#1F3B3B" />
      <path
        d="M15 32c3-3 6-4 9-4s6 1 9 4"
        stroke="#1D8484"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </Face>
  ),
  tough: () => (
    <Face bg="#FBE3DB">
      <path d="M13 19l6 2M35 19l-6 2" stroke="#1F3B3B" strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M15 33c3-4 6-5 9-5s6 1 9 5"
        stroke="#C0503A"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </Face>
  ),
};
