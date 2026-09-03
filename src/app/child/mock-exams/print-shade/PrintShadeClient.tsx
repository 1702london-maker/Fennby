"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { PhotoUploadFlow } from "@/components/PhotoUploadFlow";
import { submitPrintShadeUpload } from "@/features/assessments/actions";

type PrintableQuestion = {
  id: string;
  number: number;
  topic: string;
  text: string;
  options: string[];
};

type Step = "download" | "upload" | "submitted";

export function PrintShadeClient({
  assessmentTitle,
  durationMinutes,
  questions,
}: {
  assessmentTitle: string;
  durationMinutes: number | null;
  questions: PrintableQuestion[];
}) {
  const [step, setStep] = useState<Step>("download");

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <style jsx global>{`
          @media print {
            header,
            footer,
            nav,
            .no-print {
              display: none !important;
            }

            body {
              background: white !important;
            }

            .print-paper {
              box-shadow: none !important;
              border: 0 !important;
              padding: 0 !important;
            }

            .print-break-before {
              break-before: page;
            }
          }
        `}</style>

        <h1 className="font-display font-bold text-3xl mb-6 no-print">Print &amp; Shade mock exam</h1>

        {step === "download" && (
          <div className="space-y-6">
            <Card className="text-center py-10 no-print">
              <p className="text-5xl mb-4">🖨️</p>
              <p className="font-display font-bold text-xl mb-2">Step 1: Print your paper</p>
              <p className="text-charcoal-teal/70 mb-6 max-w-xl mx-auto">
                This paper uses the same published mock bank as the digital exam. Print it, answer
                on the shade grid, then upload a clear photo for human marking.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => window.print()}>Print paper</Button>
                <Button variant="secondary" onClick={() => setStep("upload")}>
                  I&apos;ve completed my paper →
                </Button>
              </div>
            </Card>

            <Card className="print-paper">
              <div className="border-b-2 border-charcoal-teal pb-5 mb-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-charcoal-teal/70">Fennby Print &amp; Shade</p>
                <h2 className="font-display font-bold text-3xl mt-1">{assessmentTitle}</h2>
                <div className="grid sm:grid-cols-3 gap-3 mt-5 text-sm">
                  <div className="border border-charcoal-teal/30 rounded-lg p-3">Name:</div>
                  <div className="border border-charcoal-teal/30 rounded-lg p-3">Date:</div>
                  <div className="border border-charcoal-teal/30 rounded-lg p-3">
                    Time: {durationMinutes ? `${durationMinutes} minutes` : "Untimed"}
                  </div>
                </div>
              </div>

              <section className="mb-8">
                <h3 className="font-display font-bold text-xl mb-3">Answer grid</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {questions.map((question) => (
                    <div key={question.id} className="flex items-center gap-2 border border-charcoal-teal/20 rounded-md px-2 py-1">
                      <span className="w-6 font-bold">{question.number}</span>
                      {["A", "B", "C", "D"].map((letter) => (
                        <span key={letter} className="inline-flex items-center gap-1">
                          <span className="inline-block w-4 h-4 rounded-full border border-charcoal-teal" />
                          {letter}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </section>

              <section className="print-break-before">
                <h3 className="font-display font-bold text-xl mb-4">Questions</h3>
                <div className="space-y-5">
                  {questions.map((question) => (
                    <article key={question.id} className="break-inside-avoid">
                      <div className="flex items-start gap-3">
                        <p className="font-bold text-lg w-8 shrink-0">{question.number}.</p>
                        <div>
                          <p className="text-xs font-semibold uppercase text-charcoal-teal/60 mb-1">{question.topic}</p>
                          <p className="font-semibold">{question.text}</p>
                          <ol className="grid sm:grid-cols-2 gap-2 mt-3 text-sm" type="A">
                            {question.options.map((option) => (
                              <li key={option} className="ml-5 pl-1">{option}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </Card>
          </div>
        )}

        {step === "upload" && (
          <PhotoUploadFlow
            uploadTitle="Step 2: Upload your completed paper"
            uploadBody="Ask a grown-up to help you take a clear photo, or drag a file in below."
            processingTitle="Sending it off..."
            processingBody="Hang tight, this only takes a moment."
            onComplete={async (uploadedPath) => {
              const result = await submitPrintShadeUpload(uploadedPath);
              if (!result.ok) throw new Error(result.error);
              setTimeout(() => setStep("submitted"), 1200);
            }}
          />
        )}

        {step === "submitted" && (
          <Card className="text-center py-12">
            <p className="text-5xl mb-4">✅</p>
            <p className="font-display font-bold text-xl mb-2">Your paper&apos;s been sent off</p>
            <p className="text-charcoal-teal/70 mb-6 max-w-sm mx-auto">
              A real person marks Print &amp; Shade papers by hand, not a computer guess, so your
              score won&apos;t show up instantly. Your parent will see it in your Mock Exam
              history as soon as it&apos;s marked.
            </p>
            <Button href="/child/mock-exams" variant="primary">Back to Mock Exams</Button>
          </Card>
        )}
      </main>
    </PageShell>
  );
}
