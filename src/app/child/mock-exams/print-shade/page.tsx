"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { PhotoUploadFlow } from "@/components/PhotoUploadFlow";

type Step = "download" | "upload";

export default function PrintShadeFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("download");

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-6">Print &amp; Shade mock exam</h1>

        {step === "download" && (
          <Card className="text-center py-12">
            <p className="text-5xl mb-4">🖨️</p>
            <p className="font-display font-bold text-xl mb-2">Step 1: Download your paper</p>
            <p className="text-charcoal-teal/70 mb-6 max-w-sm mx-auto">
              Print this mock exam and complete it with a pencil, just like the real thing.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline">Download paper (PDF)</Button>
              <Button variant="secondary" onClick={() => setStep("upload")}>
                I&apos;ve completed my paper →
              </Button>
            </div>
          </Card>
        )}

        {step === "upload" && (
          <PhotoUploadFlow
            uploadTitle="Step 2: Upload your completed paper"
            uploadBody="Ask a grown-up to help you take a clear photo, or drag a file in below."
            processingTitle="Reading your answers..."
            processingBody="Hang tight, this only takes a moment."
            onComplete={() => {
              setTimeout(() => {
                router.push("/child/mock-exams/results?mode=print-shade&score=74");
              }, 2200);
            }}
          />
        )}
      </main>
    </PageShell>
  );
}
