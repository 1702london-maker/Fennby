"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

type Step = "download" | "upload" | "processing";

export default function PrintShadeFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("download");
  const [dragOver, setDragOver] = useState(false);

  const startProcessing = () => {
    setStep("processing");
    setTimeout(() => {
      router.push("/child/mock-exams/results?mode=print-shade&score=74");
    }, 2200);
  };

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
          <Card className="text-center py-12">
            <p className="text-5xl mb-4">📤</p>
            <p className="font-display font-bold text-xl mb-2">Step 2: Upload your completed paper</p>
            <p className="text-charcoal-teal/70 mb-6 max-w-sm mx-auto">
              Ask a grown-up to help you take a clear photo, or drag a file in below.
            </p>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                startProcessing();
              }}
              className={`rounded-2xl border-2 border-dashed p-10 mb-6 transition-colors ${
                dragOver ? "border-teal-700 bg-teal-100" : "border-teal-100"
              }`}
            >
              <p className="text-charcoal-teal/70 text-sm">Drag and drop your photo here</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={startProcessing}>📁 Choose a file</Button>
              <Button variant="secondary" onClick={startProcessing}>📷 Use camera</Button>
            </div>
          </Card>
        )}

        {step === "processing" && (
          <Card className="text-center py-16">
            <motion.p
              className="text-5xl mb-4"
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{ repeat: Infinity, duration: 1.3 }}
              aria-hidden
            >
              🔍
            </motion.p>
            <p className="font-display font-bold text-xl">Reading your answers...</p>
            <p className="text-charcoal-teal/70 mt-1">Hang tight, this only takes a moment.</p>
          </Card>
        )}
      </main>
    </PageShell>
  );
}
