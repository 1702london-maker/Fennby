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

const lessonStarters = [
  "Can you teach me fractions with an example?",
  "Help me solve a verbal reasoning analogy.",
  "Explain percentage questions step by step.",
  "Give me a comprehension strategy.",
];

function latestAssistantMessage(messages: DisplayMessage[]) {
  return [...messages].reverse().find((message) => message.role === "assistant")?.content ?? "";
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

  const send = async (content = draft) => {
    if (!content.trim() || !conversationId) return;
    setError(null);
    const userMessage = content.trim();
    setMessages((m) => [...m, { role: "user", content: userMessage }]);
    setDraft("");
    setSending(true);
    const result = await sendAiTutorMessage({ conversationId, content: userMessage });
    setSending(false);
    if (!result.ok) {
      setError("I couldn't answer that just now. Please try again in a moment.");
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
      <section className="grid xl:grid-cols-[17rem_1fr] gap-5">
        <aside className="space-y-5">
          <Card tint="dark" className="overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-2xl text-charcoal-teal" aria-hidden>
                🎓
              </div>
              <div>
                <p className="text-xs font-bold text-white/60">AI CLASSROOM</p>
                <h2 className="font-display font-bold text-xl">Fennby Tutor</h2>
              </div>
            </div>
            <div className="mt-5 grid gap-2 text-sm text-white/80">
              <p>Safe schoolwork help only</p>
              <p>Parent-visible history</p>
              <p>Voice input and read-aloud</p>
            </div>
          </Card>

          <Card>
            <p className="text-xs font-bold text-teal-900 mb-3">START A LESSON</p>
            <div className="grid gap-2">
              {lessonStarters.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => send(starter)}
                  disabled={sending || !conversationId}
                  className="text-left rounded-2xl border border-teal-100 bg-mist-50 px-4 py-3 text-sm font-semibold text-charcoal-teal hover:bg-teal-100 disabled:opacity-50"
                >
                  {starter}
                </button>
              ))}
            </div>
          </Card>

          {messages.length > 0 && !ended && (
            <Button variant="outline" onClick={startWrapUp} className="w-full">
              End session &amp; do a Wrap-Up
            </Button>
          )}
        </aside>

        <div className="min-w-0 rounded-[2rem] border border-teal-100 bg-white shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_19rem] min-h-[34rem]">
            <div className="bg-mist-50 p-4 sm:p-6">
              <div className="rounded-3xl bg-white border border-teal-100 min-h-[21rem] p-5 sm:p-7 shadow-inner">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs font-bold text-charcoal-teal/50">LESSON BOARD</p>
                    <h2 className="font-display font-bold text-2xl text-charcoal-teal">Today&apos;s explanation</h2>
                  </div>
                  {latestAssistantMessage(messages) && (
                    <ReadAloudButton text={latestAssistantMessage(messages)} label="Read board" />
                  )}
                </div>
                {latestAssistantMessage(messages) ? (
                  <p className="text-lg leading-relaxed text-charcoal-teal whitespace-pre-wrap">
                    {latestAssistantMessage(messages)}
                  </p>
                ) : (
                  <div className="grid h-64 place-items-center text-center">
                    <div>
                      <p className="font-display font-bold text-2xl mb-3">Choose a lesson or ask a question.</p>
                      <p className="text-charcoal-teal/65 max-w-md">
                        The board will hold the tutor&apos;s explanation so you can read it, hear it, and come back to it.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 grid sm:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-teal-100 px-4 py-3">
                  <p className="text-xs font-bold text-teal-900">MODE</p>
                  <p className="font-semibold">Guided practice</p>
                </div>
                <div className="rounded-2xl bg-coral-100 px-4 py-3">
                  <p className="text-xs font-bold text-brick-600">VOICE</p>
                  <p className="font-semibold">Dictate or read aloud</p>
                </div>
                <div className="rounded-2xl bg-sage-600/15 px-4 py-3">
                  <p className="text-xs font-bold text-teal-900">WRAP-UP</p>
                  <p className="font-semibold">{wrapUpQuestions.length} questions ready</p>
                </div>
              </div>
            </div>

            <aside className="border-t lg:border-t-0 lg:border-l border-teal-100 bg-white flex flex-col min-h-[28rem]">
              <div className="px-4 py-3 border-b border-teal-100">
                <p className="font-display font-bold">Class chat</p>
                <p className="text-xs text-charcoal-teal/60">Saved for parent visibility</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length ? (
                  messages.map((m, i) => (
                    <div
                      key={i}
                      className={`rounded-2xl px-4 py-3 text-sm ${
                        m.role === "user" ? "bg-teal-900 text-white ml-6" : "bg-teal-100 text-charcoal-teal mr-6"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-xs font-semibold opacity-70">{m.role === "user" ? "You" : "AI Tutor"}</p>
                        <ReadAloudButton text={m.content} label="Read" />
                      </div>
                      <p>{m.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-charcoal-teal/60 text-center py-10">
                    Your classroom chat will appear here.
                  </p>
                )}
                {sending && <p className="text-sm font-semibold text-teal-900">Tutor is thinking...</p>}
              </div>
              <div className="border-t border-teal-100 p-3">
                {error && <p className="text-sm text-brick-600 font-semibold mb-2">{error}</p>}
                <div className="flex items-center gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                    placeholder="Ask in class..."
                    aria-label="Message"
                    className="min-w-0 flex-1 rounded-full border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
                  />
                  <VoiceInputButton onResult={(text) => setDraft((d) => (d ? `${d} ${text}` : text))} />
                </div>
                <Button variant="primary" disabled={sending || !conversationId || !draft.trim()} onClick={() => send()} className="w-full mt-3">
                  {sending ? "Sending..." : "Send to tutor"}
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>

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
