"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { VoiceInputButton } from "@/components/VoiceInputButton";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import { startAiTutorConversation, sendAiTutorMessage, endAiTutorConversation } from "@/features/ai-tutor/actions";

interface DisplayMessage {
  role: "user" | "assistant";
  content: string;
}

export function AiTutorClient() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ended, setEnded] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startAiTutorConversation(undefined).then((r) => {
      if (r.ok) setConversationId(r.data.conversationId);
    });
    return () => {
      if (conversationId) endAiTutorConversation(conversationId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = async () => {
    if (!draft.trim() || !conversationId) return;
    setError(null);
    const userMessage = draft;
    setMessages((m) => [...m, { role: "user", content: userMessage }]);
    setDraft("");
    setSending(true);
    const result = await sendAiTutorMessage({ conversationId, content: userMessage });
    setSending(false);
    if (!result.ok) {
      if (result.error === "ai_tutor_not_configured") {
        setError("The AI Tutor isn't switched on for this environment yet — an OPENAI_API_KEY needs adding to Vercel's environment variables first.");
      } else {
        setError(result.error);
      }
      return;
    }
    setMessages((m) => [...m, { role: "assistant", content: result.data.reply }]);
  };

  return (
    <>
      <Card className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto mb-4">
        {messages.length ? (
          messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                m.role === "user" ? "self-end bg-teal-900 text-white" : "self-start bg-teal-100"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-xs font-semibold opacity-70">{m.role === "user" ? "You" : "AI Tutor"}</p>
                <ReadAloudButton text={m.content} label="Read aloud" />
              </div>
              <p>{m.content}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-charcoal-teal/60 text-center py-8">
            Ask a question to get started — try &quot;Can you explain fractions a different way?&quot;
          </p>
        )}
      </Card>
      {error && <p className="text-sm text-brick-600 font-semibold mb-3">{error}</p>}
      <div className="sticky bottom-24 sm:bottom-20 flex items-center gap-2 bg-mist-50/95 backdrop-blur rounded-full py-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask the AI Tutor something..."
          aria-label="Message"
          className="flex-1 rounded-full border-2 border-teal-100 px-5 py-3 min-h-[44px] focus:border-teal-700 outline-none"
        />
        <VoiceInputButton onResult={(text) => setDraft((d) => (d ? `${d} ${text}` : text))} />
        <Button variant="primary" disabled={sending || !conversationId} onClick={send}>
          {sending ? "…" : "Send"}
        </Button>
      </div>

      {messages.length > 0 && !ended && (
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            onClick={() => {
              if (conversationId) endAiTutorConversation(conversationId);
              setEnded(true);
            }}
          >
            End session &amp; do a Wrap-Up
          </Button>
        </div>
      )}
      {ended && (
        <Card tint="coral" className="mt-4 text-center">
          <p className="font-display font-bold mb-2">Session ended — nice work!</p>
          <p className="text-sm text-charcoal-teal/80 mb-4">
            Head to The Workshop for a quick Wrap-Up check on what you just covered.
          </p>
          <Button href="/child/workshop" variant="primary">Go to The Workshop</Button>
        </Card>
      )}
    </>
  );
}
