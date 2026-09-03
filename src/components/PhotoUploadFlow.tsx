"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { createClient } from "@/lib/supabase/client";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

function friendlyUploadError(message?: string) {
  if (!message) return "We couldn't save that upload. Please try again.";
  const lower = message.toLowerCase();
  if (lower.includes("bucket") || lower.includes("storage")) {
    return "Uploads are not quite ready here. Please try again shortly.";
  }
  if (lower.includes("row-level security") || lower.includes("permission") || lower.includes("unauthorized")) {
    return "We couldn't attach that upload to your account. Please sign in again and retry.";
  }
  if (lower.includes("payload") || lower.includes("too large") || lower.includes("size")) {
    return "That file is too large. Please use a clearer, smaller photo or PDF.";
  }
  return "We couldn't save that upload. Please try again.";
}

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
  onComplete: (uploadedPath: string) => void | Promise<void>;
}) {
  const [step, setStep] = useState<"upload" | "processing">("upload");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);

    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setError("Please upload a photo or PDF.");
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      setError("That file is too large. Please use a photo or PDF under 10 MB.");
      return;
    }

    setStep("processing");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStep("upload");
      setError("Please sign in again before uploading.");
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("learner-submissions").upload(path, file, {
      cacheControl: "3600",
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

    if (uploadError) {
      setStep("upload");
      setError(friendlyUploadError(uploadError.message));
      return;
    }

    try {
      await onComplete(path);
    } catch (err) {
      setStep("upload");
      setError(friendlyUploadError(err instanceof Error ? err.message : undefined));
    }
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
          uploadFile(e.dataTransfer.files[0]);
        }}
        className={`rounded-2xl border-2 border-dashed p-10 mb-6 transition-colors ${
          dragOver ? "border-teal-700 bg-teal-100" : "border-teal-100"
        }`}
      >
        <p className="text-charcoal-teal/70 text-sm">Drag and drop your photo here</p>
      </div>
      {error && <p className="text-sm font-semibold text-brick-600 mb-4">{error}</p>}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => uploadFile(e.target.files?.[0])}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => uploadFile(e.target.files?.[0])}
      />
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>📁 Choose a file</Button>
        <Button variant="secondary" onClick={() => cameraInputRef.current?.click()}>📷 Use camera</Button>
      </div>
    </Card>
  );
}
