"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { PhotoUploadFlow } from "@/components/PhotoUploadFlow";
import { submitHomeworkHelp } from "@/features/workshop/actions";

export default function HomeworkHelpPage() {
  const [done, setDone] = useState(false);

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-6">Homework help</h1>
        {done ? (
          <Card className="text-center py-12">
            <p className="text-5xl mb-4">✅</p>
            <p className="font-display font-bold text-xl mb-2">Got it!</p>
            <p className="text-charcoal-teal/70 mb-6 max-w-sm mx-auto">
              We&apos;re looking at your question now. This shows up on your parent&apos;s
              dashboard too, same as everything else here.
            </p>
            <Button href="/child/workshop" variant="outline">Back to The Workshop</Button>
          </Card>
        ) : (
          <PhotoUploadFlow
            uploadTitle="Photograph your homework question"
            uploadBody="Same as uploading a print-and-shade mock exam — ask a grown-up to help you take a clear photo, or drag a file in below."
            processingTitle="Looking at your question..."
            processingBody="Hang tight, this only takes a moment."
            onComplete={async () => {
              await submitHomeworkHelp();
              setTimeout(() => setDone(true), 2200);
            }}
          />
        )}
      </main>
    </PageShell>
  );
}
