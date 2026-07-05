"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { chatThread as initialThread } from "@/lib/mock-data";

export default function ParentChat() {
  const [draft, setDraft] = useState("");
  const [thread, setThread] = useState(initialThread);

  const send = () => {
    if (!draft.trim()) return;
    setThread((t) => [
      ...t,
      { id: `m${t.length + 1}`, sender: "parent", senderName: "You", content: draft, time: "now" },
    ]);
    setDraft("");
  };

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Ms. Reece &amp; Amara</h1>
        <p className="text-charcoal-teal/70 mb-6">
          This thread includes Amara. Everything here is visible to you, in full, in real time.
        </p>
        <Card className="flex flex-col gap-4 max-h-[55vh] overflow-y-auto">
          {thread.map((m) => (
            <div
              key={m.id}
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                m.sender === "parent"
                  ? "self-end bg-teal-900 text-white"
                  : m.sender === "child"
                  ? "self-start bg-coral-100"
                  : "self-start bg-teal-100"
              }`}
            >
              <p className="text-xs font-semibold opacity-70 mb-1">{m.senderName} · {m.time}</p>
              <p>{m.content}</p>
            </div>
          ))}
        </Card>
        <div className="flex gap-2 mt-4">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Message Ms. Reece..."
            aria-label="Message Ms. Reece"
            className="flex-1 rounded-full border-2 border-teal-100 px-5 py-3 min-h-[44px] focus:border-teal-700 outline-none"
          />
          <button
            onClick={send}
            className="rounded-full bg-teal-900 text-white px-6 py-3 font-semibold min-h-[44px] hover:bg-teal-700"
          >
            Send
          </button>
        </div>
      </main>
    </PageShell>
  );
}
