"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { VoiceInputButton } from "@/components/VoiceInputButton";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import { startAiTutorConversation, sendAiTutorMessage, endAiTutorConversation } from "@/features/ai-tutor/actions";
import { submitAssessmentAttempt } from "@/features/assessments/actions";

interface DisplayMessage {
  role: "user" | "assistant";
  content: string;
}

interface WrapUpQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export function AiTutorClient({ wrapUpQuestions }: { wrapUpQuestions: WrapUpQuestion[] }) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ended, setEnded] = useState(false);
  const [wrapUpStarted, setWrapUpStarted] = useState(false);
  const [wrapUpIndex, setWrapUpIndex] = useState(0);
  const [wrapUpAnswers, setWrapUpAnswers] = useState<{ questionId: string; choiceIndex: number }[]>([]);
  const [wrapUpScore, setWrapUpScore] = useState<number | null>(null);
  const [wrapUpError, setWrapUpError] = useState<string | null>(null);
  const startedRef = useRef(false);
  // The cleanup closure below only ever sees the conversationId that was in
  // scope when the effect first ran (null, since the id arrives async) —
  // a ref always reads the current value instead of a stale one.
  const conversationIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startAiTutorConversation(undefined).then((r) => {
      if (r.ok) {
        setConversationId(r.data.conversationId);
        conversationIdRef.current = r.data.conversationId;
      }
    });
    return () => {
      if (conversationIdRef.current) endAiTutorConversation(conversationIdRef.current);
    };
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

  const startWrapUp = async () => {
    if (conversationId) await endAiTutorConversation(conversationId);
    setEnded(true);
    if (!wrapUpQuestions.length) {
      setWrapUpError("No Wrap-Up questions are available yet.");
      return;
    }
    setWrapUpStarted(true);
  };

  const answerWrapUp = async (choiceIndex: number) => {
    if (!conversationId) return;
    const question = wrapUpQuestions[wrapUpIndex];
    const next = [...wrapUpAnswers, { questionId: question.id, choiceIndex }];
    setWrapUpAnswers(next);

    if (wrapUpIndex + 1 < wrapUpQuestions.length) {
      setWrapUpIndex((i) => i + 1);
      return;
    }

    const result = await submitAssessmentAttempt({
      mode: "practice",
      answers: next,
      sourceType: "wrap_up_ai_tutor",
      sourceId: conversationId,
    });
    if (result.ok) {
      setWrapUpScore(result.data.score);
      setWrapUpStarted(false);
    } else {
      setWrapUpError(result.error);
    }
  };

  if (wrapUpStarted && wrapUpScore === null) {
    const question = wrapUpQuestions[wrapUpIndex];
    return (
      <Card>
        <p className="text-xs font-bold text-charcoal-teal/60 mb-2">AI TUTOR WRAP-UP · QUESTION {wrapUpIndex + 1} OF {wrapUpQuestions.length}</p>
        <p className="font-display font-bold text-xl mb-6">{question.text}</p>
        <div className="grid gap-3">
          {question.options.map((option, index) => (
            <button
              key={option}
              onClick={() => answerWrapUp(index)}
              className="text-left px-5 py-4 rounded-2xl bg-teal-100 hover:bg-teal-100/70 font-semibold min-h-[44px] transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
        {wrapUpError && <p className="mt-4 text-sm font-semibold text-brick-600">{wrapUpError}</p>}
      </Card>
    );
  }

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
            onClick={startWrapUp}
          >
            End session &amp; do a Wrap-Up
          </Button>
        </div>
      )}
      {ended && !wrapUpStarted && (
        <Card tint="coral" className="mt-4 text-center">
          <p className="font-display font-bold mb-2">Session ended — nice work!</p>
          {wrapUpScore === null ? (
            <>
              <p className="text-sm text-charcoal-teal/80 mb-4">
                {wrapUpError ?? "Your Wrap-Up will appear here when questions are available."}
              </p>
              <Button href="/child/workshop" variant="primary">Go to The Workshop</Button>
            </>
          ) : (
            <p className="text-sm text-charcoal-teal/80">Wrap-Up complete — {wrapUpScore}% saved to your progress.</p>
          )}
        </Card>
      )}
    </>
  );
}
