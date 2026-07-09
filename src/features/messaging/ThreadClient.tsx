"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { VoiceInputButton } from "@/components/VoiceInputButton";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import { SymbolSupportedText } from "@/components/SymbolSupportedText";
import { sendMessage } from "@/features/messaging/actions";

interface DisplayMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
}

export function ThreadClient({
  threadId,
  currentSenderId,
  initialMessages,
  placeholder = "Type a message...",
  symbolSupport = false,
}: {
  threadId: string;
  currentSenderId: string;
  initialMessages: DisplayMessage[];
  placeholder?: string;
  symbolSupport?: boolean;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!draft.trim()) return;
    setSending(true);
    await sendMessage({ threadId, content: draft });
    setDraft("");
    setSending(false);
    router.refresh();
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-3 text-xs font-bold text-coral-600 bg-coral-100 rounded-full px-4 py-2 w-fit">
        <span>🛡️</span>
        <span>Safeguarding status: parent-visible · no private child thread</span>
      </div>
      <Card className="flex flex-col gap-4 max-h-[55vh] overflow-y-auto">
        {initialMessages.length ? (
          initialMessages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                m.senderId === currentSenderId
                  ? "self-end bg-teal-900 text-white"
                  : m.senderRole === "child"
                  ? "self-start bg-coral-100"
                  : "self-start bg-teal-100"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-xs font-semibold opacity-70">
                  {m.senderName} · {new Date(m.timestamp).toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
                </p>
                <ReadAloudButton text={m.content} label="Read aloud" />
              </div>
              {symbolSupport ? <SymbolSupportedText text={m.content} /> : <p>{m.content}</p>}
            </div>
          ))
        ) : (
          <p className="text-sm text-charcoal-teal/60 text-center py-8">No messages yet.</p>
        )}
      </Card>
      <div className="flex items-center gap-2 mt-4">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={placeholder}
          aria-label="Message"
          className="flex-1 rounded-full border-2 border-teal-100 px-5 py-3 min-h-[44px] focus:border-teal-700 outline-none"
        />
        <VoiceInputButton onResult={(text) => setDraft((d) => (d ? `${d} ${text}` : text))} label="Dictate" />
        {draft.trim() && <ReadAloudButton text={draft} label="Hear it back" />}
        <button
          onClick={send}
          disabled={sending}
          className="rounded-full bg-teal-900 text-white px-6 py-3 font-semibold min-h-[44px] hover:bg-teal-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </>
  );
}
