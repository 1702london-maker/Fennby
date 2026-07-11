// A learner is treated as having a SEND profile if either free-text field
// was filled in at registration or later in Settings — there's no separate
// boolean column, so this is the one place that decides what counts.
export function hasSendProfile(learner: { send_notes?: string | null; accessibility_needs?: string | null } | null | undefined): boolean {
  return Boolean(learner?.send_notes?.trim() || learner?.accessibility_needs?.trim());
}
