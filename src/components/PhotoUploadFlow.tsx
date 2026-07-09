"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

// The one photo-upload interaction pattern used everywhere a child submits
// a photo of written work — print-and-shade mock exams (Master Build
// Specification 5.1) and Workshop homework help (Part 4.3). Same drag/drop,
// same "processing" step, same feel, so it's never a second tool bolted on.
export function PhotoUploadFlow({
  uploadTitle,
  uploadBody,
  processingTitle,
  processingBody,
  onComplete,
}: {
  uploadTitle: string;
  uploadBody: string;
  processingTitle: string;
  processingBody: string;
  onComplete: () => void | Promise<void>;
}) {
  const [step, setStep] = useState<"upload" | "processing">("upload");
  const [dragOver, setDragOver] = useState(false);

  const startProcessing = () => {
    setStep("processing");
    Promise.resolve(onComplete());
  };

  if (step === "processing") {
    return (
      <Card className="text-center py-16">
        <motion.p
          className="text-5xl mb-4"
          animate={{ rotate: [0, 12, -12, 0] }}
          transition={{ repeat: Infinity, duration: 1.3 }}
          aria-hidden
        >
          🔍
        </motion.p>
        <p className="font-display font-bold text-xl">{processingTitle}</p>
        <p className="text-charcoal-teal/70 mt-1">{processingBody}</p>
      </Card>
    );
  }

  return (
    <Card className="text-center py-12">
      <p className="text-5xl mb-4">📤</p>
      <p className="font-display font-bold text-xl mb-2">{uploadTitle}</p>
      <p className="text-charcoal-teal/70 mb-6 max-w-sm mx-auto">{uploadBody}</p>
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
  );
}
