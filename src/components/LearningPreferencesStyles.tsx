import type { Database } from "@/types/database";

type LearningPreferences = {
  dyslexia_font?: boolean;
  text_size?: "default" | "large" | "extra-large";
  colour_overlay?: "cream" | "blue" | "green" | "rose" | null;
  low_stimulation_mode?: boolean;
  chunked_content?: boolean;
};

const overlayColours: Record<string, { background: string; overlay: string; border: string }> = {
  cream: { background: "#FFF8E7", overlay: "rgba(255, 248, 231, 0.42)", border: "#EBD8A5" },
  blue: { background: "#E8F1FB", overlay: "rgba(232, 241, 251, 0.46)", border: "#A8CAE8" },
  green: { background: "#EAF6EC", overlay: "rgba(234, 246, 236, 0.46)", border: "#A9D6B2" },
  rose: { background: "#FCEEF1", overlay: "rgba(252, 238, 241, 0.46)", border: "#E8B5C0" },
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
  const overlay = prefs.colour_overlay ? overlayColours[prefs.colour_overlay] : null;

  return (
    <div
      className={`learning-preferences min-h-screen ${textSizeClass[prefs.text_size ?? "default"]} ${
        prefs.dyslexia_font ? "font-dyslexia" : ""
      } ${prefs.chunked_content ? "chunked-content" : ""} ${
        prefs.low_stimulation_mode ? "reduce-motion" : ""
      }`}
      style={
        overlay
          ? ({
              backgroundColor: overlay.background,
              "--learning-overlay-colour": overlay.overlay,
              "--learning-overlay-border": overlay.border,
            } as React.CSSProperties)
          : undefined
      }
      data-colour-overlay={prefs.colour_overlay ?? "none"}
    >
      {overlay && <div className="learning-colour-overlay" aria-hidden />}
      {children}
    </div>
  );
}
