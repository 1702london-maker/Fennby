export function LegalDraftBanner() {
  return (
    <div className="rounded-2xl bg-coral-100 border-2 border-coral-600/30 px-5 py-4 mb-8">
      <p className="text-sm font-bold text-brick-600 mb-1">⚠️ Draft, pending legal review</p>
      <p className="text-sm text-charcoal-teal/80">
        This is a plain-English working draft written by the Fennby team, not a final document
        signed off by a qualified solicitor. We&apos;re publishing it now for transparency ahead of
        public launch, and will update this page once formal legal review is complete.
      </p>
    </div>
  );
}
