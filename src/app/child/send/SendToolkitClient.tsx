"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import { SymbolSupportedText } from "@/components/SymbolSupportedText";
import { VoiceInputButton } from "@/components/VoiceInputButton";

const sampleText =
  "Take your time. Read the question, choose one answer, and ask for help if you feel stuck.";

export function SendToolkitClient() {
  const [draft, setDraft] = useState("");

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-bold text-teal-900 mb-1">READ-ALOUD</p>
            <h2 className="font-display font-bold text-xl">Hear instructions before you start</h2>
          </div>
          <ReadAloudButton text={sampleText} label="Read aloud" />
        </div>
        <p className="text-charcoal-teal/80 leading-relaxed">{sampleText}</p>
        <div className="mt-5 rounded-2xl bg-mist-50 border border-teal-100 p-4">
          <p className="text-xs font-bold text-charcoal-teal/60 mb-2">SYMBOL SUPPORT</p>
          <SymbolSupportedText text={sampleText} className="text-sm text-charcoal-teal" />
        </div>
      </Card>

      <Card>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-bold text-teal-900 mb-1">DICTATION</p>
            <h2 className="font-display font-bold text-xl">Say your idea, then edit it</h2>
          </div>
          <VoiceInputButton onResult={(text) => setDraft((current) => (current ? `${current} ${text}` : text))} />
        </div>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={6}
          className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 focus:border-teal-700 outline-none"
          placeholder="Try dictating a message or answer here."
        />
        <div className="mt-4 flex flex-wrap gap-3">
          {draft.trim() && <ReadAloudButton text={draft} label="Hear it back" />}
          <Button href="/child/messages" variant="outline" className="px-4 py-2 text-sm">
            Open messages
          </Button>
        </div>
      </Card>
    </div>
  );
}
