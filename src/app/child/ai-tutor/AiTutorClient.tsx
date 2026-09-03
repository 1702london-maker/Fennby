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
  "Hey Fennby, teach me about photosynthesis.",
  "Can you teach me fractions with an example?",
  "Help me solve a verbal reasoning analogy.",
  "Explain percentage questions step by step.",
  "Give me a comprehension strategy.",
];

function latestAssistantMessage(messages: DisplayMessage[]) {
  return [...messages].reverse().find((message) => message.role === "assistant")?.content ?? "";
}

function latestUserMessage(messages: DisplayMessage[]) {
  return [...messages].reverse().find((message) => message.role === "user")?.content ?? "";
}

function cleanWakePhrase(text: string) {
  return text.replace(/^hey\s+fennby[,\s]*/i, "").trim();
}

function getBoardTopic(messages: DisplayMessage[]) {
  const source = `${latestUserMessage(messages)} ${latestAssistantMessage(messages)}`.toLowerCase();
  if (source.includes("photosynthesis") || source.includes("plant")) return "photosynthesis";
  if (source.includes("fraction") || source.includes("pizza")) return "fractions";
  if (source.includes("percent")) return "percentages";
  if (source.includes("analogy")) return "analogies";
  return "general";
}

function LessonWhiteboard({ topic, explanation }: { topic: string; explanation: string }) {
  const commonText = explanation || "Say, Hey Fennby, teach me about photosynthesis, or choose a starter lesson.";

  if (topic === "photosynthesis") {
    return (
      <svg viewBox="0 0 640 360" className="h-full w-full" role="img" aria-label="Photosynthesis diagram">
        <rect width="640" height="360" rx="26" fill="#F7FBF8" />
        <circle cx="112" cy="82" r="44" fill="#F6C85F" />
        <path d="M112 150 C112 215 208 218 208 292" stroke="#146B6B" strokeWidth="10" fill="none" strokeLinecap="round" />
        <ellipse cx="168" cy="178" rx="76" ry="34" fill="#9DBB75" transform="rotate(-16 168 178)" />
        <ellipse cx="255" cy="202" rx="76" ry="34" fill="#5FA777" transform="rotate(18 255 202)" />
        <path d="M112 126 L177 161" stroke="#F07A5A" strokeWidth="5" strokeLinecap="round" />
        <path d="M112 126 L237 184" stroke="#F07A5A" strokeWidth="5" strokeLinecap="round" />
        <rect x="378" y="54" width="184" height="64" rx="18" fill="#E2F1EF" />
        <rect x="390" y="154" width="164" height="64" rx="18" fill="#F9E2D7" />
        <rect x="390" y="256" width="164" height="64" rx="18" fill="#E8F0D5" />
        <path d="M378 86 C314 90 300 122 260 174" stroke="#146B6B" strokeWidth="4" fill="none" strokeDasharray="8 8" />
        <path d="M390 186 C322 184 292 194 255 202" stroke="#D9654F" strokeWidth="4" fill="none" strokeDasharray="8 8" />
        <path d="M390 288 C315 288 260 270 208 292" stroke="#6F8D48" strokeWidth="4" fill="none" strokeDasharray="8 8" />
        <text x="470" y="84" textAnchor="middle" fill="#123F3F" fontSize="20" fontWeight="700">Sunlight</text>
        <text x="472" y="192" textAnchor="middle" fill="#123F3F" fontSize="18" fontWeight="700">Water + CO2</text>
        <text x="472" y="294" textAnchor="middle" fill="#123F3F" fontSize="18" fontWeight="700">Sugar + Oxygen</text>
      </svg>
    );
  }

  if (topic === "fractions") {
    return (
      <svg viewBox="0 0 640 360" className="h-full w-full" role="img" aria-label="Fraction diagram">
        <rect width="640" height="360" rx="26" fill="#F7FBF8" />
        <circle cx="210" cy="180" r="110" fill="#F6C85F" />
        <path d="M210 180 L210 70 A110 110 0 0 1 320 180 Z" fill="#F07A5A" />
        <path d="M210 70 L210 290 M100 180 L320 180" stroke="#123F3F" strokeWidth="5" />
        <text x="430" y="150" fill="#123F3F" fontSize="32" fontWeight="800">1 out of 4</text>
        <text x="430" y="198" fill="#146B6B" fontSize="42" fontWeight="800">1/4</text>
      </svg>
    );
  }

  if (topic === "percentages") {
    return (
      <svg viewBox="0 0 640 360" className="h-full w-full" role="img" aria-label="Percentage bar diagram">
        <rect width="640" height="360" rx="26" fill="#F7FBF8" />
        <rect x="80" y="145" width="480" height="70" rx="18" fill="#E2F1EF" />
        <rect x="80" y="145" width="192" height="70" rx="18" fill="#F07A5A" />
        <text x="176" y="190" textAnchor="middle" fill="white" fontSize="24" fontWeight="800">40%</text>
        <text x="320" y="260" textAnchor="middle" fill="#123F3F" fontSize="24" fontWeight="800">Percent means out of 100</text>
      </svg>
    );
  }

  return (
    <div className="grid h-full place-items-center p-8 text-center">
      <div>
        <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full bg-teal-100 text-5xl" aria-hidden>
          👩‍🏫
        </div>
        <p className="mx-auto max-w-md text-lg font-semibold leading-relaxed text-charcoal-teal">{commonText}</p>
      </div>
    </div>
  );
}

export function AiTutorClient({ wrapUpQuestions }: { wrapUpQuestions: WrapUpQuestion[] }) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [speakReplies, setSpeakReplies] = useState(true);
  const [handsFree, setHandsFree] = useState(false);
  const [listening, setListening] = useState(false);
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

  useEffect(() => {
    if (!speakReplies || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const reply = latestAssistantMessage(messages);
    if (!reply) return;
    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.lang = "en-GB";
    utterance.rate = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return () => window.speechSynthesis.cancel();
  }, [messages, speakReplies]);

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

  const handleVoiceLesson = (text: string) => {
    const heard = text.trim();
    if (!heard) return;
    const lessonRequest = cleanWakePhrase(heard);
    if (handsFree || /^hey\s+fennby/i.test(heard)) {
      void send(lessonRequest || heard);
      return;
    }
    setDraft((current) => (current ? `${current} ${heard}` : heard));
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
              <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-white text-charcoal-teal" aria-hidden>
                <span className="text-3xl">🎓</span>
                <span className={`absolute -right-1 -top-1 h-4 w-4 rounded-full ${sending ? "bg-coral-600" : "bg-sage-600"}`} />
              </div>
              <div>
                <p className="text-xs font-bold text-white/60">AI CLASSROOM</p>
                <h2 className="font-display font-bold text-xl">Fennby Tutor</h2>
              </div>
            </div>
            <div className="mt-5 rounded-3xl border border-white/15 bg-white/10 p-4">
              <div className="flex items-end justify-center gap-2" aria-hidden>
                <span className={`block h-8 w-3 rounded-full bg-coral-300 ${sending ? "animate-pulse" : ""}`} />
                <span className={`block h-14 w-3 rounded-full bg-teal-100 ${sending ? "animate-pulse" : ""}`} />
                <span className={`block h-10 w-3 rounded-full bg-sage-300 ${sending ? "animate-pulse" : ""}`} />
                <span className={`block h-16 w-3 rounded-full bg-white ${sending ? "animate-pulse" : ""}`} />
              </div>
              <p className="mt-3 text-center text-xs font-semibold text-white/70">
                {sending ? "Thinking through your question" : "Ready to speak and explain"}
              </p>
            </div>
            <div className="mt-5 grid gap-2 text-sm text-white/80">
              <p>Safe schoolwork help only</p>
              <p>Parent-visible history</p>
              <p>Hands-free voice lessons</p>
            </div>
            <label className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">
              <span>Speak replies</span>
              <input
                type="checkbox"
                checked={speakReplies}
                onChange={() => setSpeakReplies((value) => !value)}
                className="h-5 w-5 accent-coral-500"
              />
            </label>
            <label className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">
              <span>Hands-free lesson</span>
              <input
                type="checkbox"
                checked={handsFree}
                onChange={() => setHandsFree((value) => !value)}
                className="h-5 w-5 accent-coral-500"
              />
            </label>
            <div className="mt-3">
              <VoiceInputButton
                label={listening ? "Listening" : "Say Hey Fennby"}
                autoStart={handsFree}
                continuous={handsFree}
                onListeningChange={setListening}
                onResult={handleVoiceLesson}
              />
            </div>
            <p className="mt-3 text-xs text-white/65">
              Try saying, Hey Fennby, teach me about photosynthesis.
            </p>
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
                    <h2 className="font-display font-bold text-2xl text-charcoal-teal">Teaching whiteboard</h2>
                  </div>
                  {latestAssistantMessage(messages) && (
                    <ReadAloudButton text={latestAssistantMessage(messages)} label="Read board" />
                  )}
                </div>
                {latestAssistantMessage(messages) ? (
                  <div className="grid lg:grid-cols-[1fr_15rem] gap-6 items-start">
                    <p className="text-lg leading-relaxed text-charcoal-teal whitespace-pre-wrap">
                      {latestAssistantMessage(messages)}
                    </p>
                    <div className="min-h-[15rem] rounded-3xl bg-mist-50 p-2">
                      <LessonWhiteboard topic={getBoardTopic(messages)} explanation={latestAssistantMessage(messages)} />
                    </div>
                  </div>
                ) : (
                  <div className="grid min-h-64 lg:grid-cols-[1fr_15rem] gap-6 items-center">
                    <div className="text-center lg:text-left">
                      <p className="font-display font-bold text-2xl mb-3">Choose a lesson or ask a question.</p>
                      <p className="text-charcoal-teal/65 max-w-md">
                        Say, Hey Fennby, teach me about photosynthesis. The tutor will explain it out loud, draw the idea here, then ask what you think next.
                      </p>
                    </div>
                    <div className="h-60 rounded-3xl bg-mist-50 p-2">
                      <LessonWhiteboard topic="photosynthesis" explanation="" />
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
                  <VoiceInputButton onResult={handleVoiceLesson} label={handsFree ? "Listening" : "Dictate"} />
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
