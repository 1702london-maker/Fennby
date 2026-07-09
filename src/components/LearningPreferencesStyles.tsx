import type { Database } from "@/types/database";

type LearningPreferences = {
  dyslexia_font?: boolean;
  text_size?: "default" | "large" | "extra-large";
  colour_overlay?: "cream" | "blue" | "green" | "rose" | null;
  low_stimulation_mode?: boolean;
};

const overlayColours: Record<string, string> = {
  cream: "#FFF8E7",
  blue: "#E8F1FB",
  green: "#EAF6EC",
  rose: "#FCEEF1",
};

const textSizeClass: Record<string, string> = {
  default: "",
  large: "text-[112%]",
  "extra-large": "text-[128%]",
};

// Applies a learner's Learning Preferences to their own view. Wraps
// children rather than mutating global CSS, so it only ever affects the
// signed-in learner it's rendered for.
export function LearningPreferencesStyles({
  preferences,
  children,
}: {
  preferences: Database["public"]["Tables"]["learners"]["Row"]["learning_preferences"];
  children: React.ReactNode;
}) {
  const prefs = (preferences as LearningPreferences | null) ?? {};

  return (
    <div
      className={`${textSizeClass[prefs.text_size ?? "default"]} ${prefs.dyslexia_font ? "font-dyslexia" : ""} ${
        prefs.low_stimulation_mode ? "reduce-motion" : ""
      }`}
      style={prefs.colour_overlay ? { backgroundColor: overlayColours[prefs.colour_overlay] } : undefined}
    >
      {children}
    </div>
  );
}
