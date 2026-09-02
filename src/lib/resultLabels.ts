type AssessmentAttemptSource = {
  source_type?: string | null;
  mode?: string | null;
} | null;

const sourceTypeLabels: Record<string, string> = {
  mock: "Mock exam",
  wrap_up_cradle: "Cradle Wrap-Up",
  wrap_up_workshop: "Workshop Wrap-Up",
  wrap_up_ai_tutor: "AI Tutor Wrap-Up",
};

const modeLabels: Record<string, string> = {
  digital: "Digital mock",
  "print-shade": "Print & Shade",
  simulation: "Full Exam Simulation",
};

export function getAssessmentResultLabel(attempt: AssessmentAttemptSource, fallbackMode?: string | null) {
  const sourceType = attempt?.source_type ?? null;
  if (sourceType && sourceTypeLabels[sourceType]) return sourceTypeLabels[sourceType];

  const mode = attempt?.mode ?? fallbackMode ?? null;
  if (mode && modeLabels[mode]) return modeLabels[mode];

  return "Learning check";
}

export function getAssessmentResultNoun(attempt: AssessmentAttemptSource, fallbackMode?: string | null) {
  const label = getAssessmentResultLabel(attempt, fallbackMode);
  return label.toLowerCase();
}
