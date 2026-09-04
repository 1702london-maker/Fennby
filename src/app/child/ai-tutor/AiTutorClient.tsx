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
  "Hey Fennby, teach me something I am stuck on.",
  "Can you teach me fractions with a drawing?",
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

function getLessonSteps(topic: string) {
  if (topic === "photosynthesis") {
    return [
      "Sunlight reaches the leaf.",
      "Roots bring water up the stem.",
      "Leaves take in carbon dioxide.",
      "The plant makes sugar and oxygen.",
    ];
  }
  if (topic === "fractions") {
    return ["Draw one whole.", "Split it into equal parts.", "Shade the chosen parts.", "Write shaded parts over total parts."];
  }
  if (topic === "percentages") {
    return ["Start with 100 equal parts.", "Shade the parts you need.", "Count the shaded parts.", "Write the answer as percent."];
  }
  if (topic === "analogies") {
    return ["Find the first relationship.", "Say the rule out loud.", "Test the same rule on the options.", "Choose the matching pair."];
  }
  return ["Listen to the question.", "Draw the key idea.", "Try one small step.", "Answer out loud."];
}

function shortStep(text: string) {
  const cleaned = text
    .replace(/\s+/g, " ")
    .replace(/^(first|then|next|finally|so|now|try)\s*,?\s*/i, "")
    .trim();
  if (cleaned.length <= 58) return cleaned;
  return `${cleaned.slice(0, 55).trim()}...`;
}

function boardLines(text: string | undefined, fallback: string, maxLength = 18) {
  const words = (text || fallback).replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxLength) {
      current = next;
      continue;
    }
    if (current) lines.push(current);
    current = word.length > maxLength ? `${word.slice(0, maxLength - 1)}...` : word;
    if (lines.length === 1) break;
  }

  if (current && lines.length < 2) lines.push(current);
  return [lines[0] || fallback, lines[1] || ""];
}

function getDynamicLessonSteps(topic: string, explanation: string) {
  const sentences = explanation
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => shortStep(sentence.replace(/[.!?]+$/, "")))
    .filter((sentence) => sentence.length > 12 && !/^can you|^what would|^which/i.test(sentence));

  const fallback = getLessonSteps(topic);
  const unique = Array.from(new Set(sentences));
  return [...unique, ...fallback].slice(0, 4);
}

function getBoardTitle(topic: string, request: string) {
  if (topic === "photosynthesis") return "Plant science";
  if (topic === "fractions") return "Fractions";
  if (topic === "percentages") return "Percentages";
  if (topic === "analogies") return "Analogies";
  const cleaned = cleanWakePhrase(request).replace(/[?!.]+$/, "").trim();
  if (!cleaned) return "Live lesson";
  if (cleaned.length <= 28) return cleaned;
  return `${cleaned.slice(0, 25).trim()}...`;
}

function TutorVideo({ speaking, listening, thinking }: { speaking: boolean; listening: boolean; thinking: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-charcoal-teal via-teal-900 to-coral-600 p-4 text-white">
      <div className="absolute inset-0 opacity-25">
        <div className={`h-full w-full bg-[radial-gradient(circle_at_35%_25%,white,transparent_32%)] ${speaking ? "animate-pulse" : ""}`} />
      </div>
      <div className="relative mx-auto grid h-32 w-32 place-items-center rounded-full border border-white/25 bg-white/15">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-charcoal-teal">
          <div className="grid gap-2 justify-items-center">
            <div className="flex gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-charcoal-teal" />
              <span className="h-2.5 w-2.5 rounded-full bg-charcoal-teal" />
            </div>
            <span className={`block rounded-full bg-coral-600 transition-all ${speaking ? "h-4 w-9 animate-pulse" : "h-1.5 w-7"}`} />
          </div>
        </div>
      </div>
      <div className="relative mt-4 flex items-end justify-center gap-1.5" aria-hidden>
        {[18, 34, 52, 28, 44].map((height, index) => (
          <span
            key={height}
            className={`block w-2 rounded-full bg-white/80 ${speaking || thinking ? "animate-pulse" : ""}`}
            style={{ height, animationDelay: `${index * 120}ms` }}
          />
        ))}
      </div>
      <p className="relative mt-3 text-center text-xs font-bold text-white/80">
        {thinking ? "Thinking" : speaking ? "Speaking" : listening ? "Listening" : "Ready"}
      </p>
    </div>
  );
}

function StepStrip({ steps, visibleSteps, step }: { steps: string[]; visibleSteps: number; step: number }) {
  const progressWidth = `${(visibleSteps / steps.length) * 100}%`;

  return (
    <div className="rounded-2xl bg-white p-3">
      <div className="h-2 overflow-hidden rounded-full bg-teal-100">
        <div className="h-full rounded-full bg-coral-600 transition-all duration-500" style={{ width: progressWidth }} />
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {steps.map((item, index) => (
          <div
            key={item}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-300 ${
              index === step
                ? "scale-[1.03] bg-coral-100 text-brick-600 shadow-sm"
                : index < visibleSteps
                  ? "bg-teal-100 text-teal-900"
                  : "bg-mist-50 text-charcoal-teal/45"
            }`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function LessonWhiteboard({
  topic,
  explanation,
  request,
  step,
}: {
  topic: string;
  explanation: string;
  request: string;
  step: number;
}) {
  const commonText = explanation || "Tell me what you want to learn, and I will draw the steps as we go.";
  const steps = explanation ? getDynamicLessonSteps(topic, explanation) : getLessonSteps(topic);
  const visibleSteps = Math.min(step + 1, steps.length);
  const boardTitle = getBoardTitle(topic, request);
  const firstNote = boardLines(steps[0], "Ask");
  const secondNote = boardLines(steps[1], "Draw");
  const thirdNote = boardLines(steps[2], "Answer");

  if (topic === "photosynthesis") {
    return (
      <div className="grid h-full gap-3">
      <svg viewBox="0 0 640 360" className="min-h-[18rem] w-full" role="img" aria-label="Photosynthesis diagram">
        <style>{`
          @keyframes drawLine { from { stroke-dashoffset: 240; } to { stroke-dashoffset: 0; } }
          @keyframes floatLabel { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          @keyframes writeOn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes dashFlow { from { stroke-dashoffset: 80; } to { stroke-dashoffset: 0; } }
          @keyframes pulseNode { 0%, 100% { opacity: .7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
          @keyframes rayPulse { 0%, 100% { opacity: .35; } 50% { opacity: 1; } }
          .board-draw { stroke-dasharray: 240; animation: drawLine 1.8s ease-out both; }
          .board-draw-two { stroke-dasharray: 240; animation: drawLine 1.8s ease-out .45s both; }
          .board-float { animation: floatLabel 2.4s ease-in-out infinite; }
          .board-write { animation: writeOn .55s ease-out both; }
          .board-flow { stroke-dasharray: 12 10; animation: dashFlow 1.2s linear infinite; }
          .board-node { transform-box: fill-box; transform-origin: center; animation: pulseNode 1.4s ease-in-out infinite; }
          .board-ray { animation: rayPulse 1.1s ease-in-out infinite; }
        `}</style>
        <rect width="640" height="360" rx="26" fill="#F7FBF8" />
        <text x="42" y="40" fill="#123F3F" fontSize="24" fontWeight="800">{boardTitle}</text>
        <g className="board-float">
          <circle cx="112" cy="82" r="44" fill="#F6C85F" />
        </g>
        <path className="board-ray" d="M95 132 L68 176 M125 132 L134 180 M150 118 L194 154" stroke="#F6C85F" strokeWidth="8" strokeLinecap="round" />
        {step >= 1 && <path className="board-draw" d="M112 150 C112 215 208 218 208 292" stroke="#146B6B" strokeWidth="10" fill="none" strokeLinecap="round" />}
        {step >= 1 && <path className="board-flow" d="M112 150 C112 215 208 218 208 292" stroke="#EAF6F4" strokeWidth="5" fill="none" strokeLinecap="round" />}
        <ellipse cx="168" cy="178" rx="76" ry="34" fill="#9DBB75" transform="rotate(-16 168 178)" />
        <ellipse cx="255" cy="202" rx="76" ry="34" fill="#5FA777" transform="rotate(18 255 202)" />
        {step >= 0 && (
          <g className="board-write">
            <rect x="378" y="54" width="184" height="64" rx="18" fill="#E2F1EF" />
            <path className="board-draw" d="M378 86 C314 90 300 122 260 174" stroke="#146B6B" strokeWidth="4" fill="none" />
            <path className="board-flow" d="M378 86 C314 90 300 122 260 174" stroke="#F07A5A" strokeWidth="3" fill="none" />
            <circle className="board-node" cx="260" cy="174" r="10" fill="#F07A5A" />
            <text x="470" y="84" textAnchor="middle" fill="#123F3F" fontSize="20" fontWeight="700">Sunlight</text>
          </g>
        )}
        {step >= 2 && (
          <g className="board-write">
            <rect x="390" y="154" width="164" height="64" rx="18" fill="#F9E2D7" />
            <path className="board-draw-two" d="M390 186 C322 184 292 194 255 202" stroke="#D9654F" strokeWidth="4" fill="none" />
            <path className="board-flow" d="M390 186 C322 184 292 194 255 202" stroke="#146B6B" strokeWidth="3" fill="none" />
            <circle className="board-node" cx="255" cy="202" r="10" fill="#146B6B" />
            <text x="472" y="192" textAnchor="middle" fill="#123F3F" fontSize="18" fontWeight="700">Water + CO2</text>
          </g>
        )}
        {step >= 3 && (
          <g className="board-write">
            <rect x="390" y="256" width="164" height="64" rx="18" fill="#E8F0D5" />
            <path className="board-draw" d="M390 288 C315 288 260 270 208 292" stroke="#6F8D48" strokeWidth="4" fill="none" />
            <path className="board-flow" d="M390 288 C315 288 260 270 208 292" stroke="#F07A5A" strokeWidth="3" fill="none" />
            <circle className="board-node" cx="208" cy="292" r="10" fill="#6F8D48" />
            <text x="472" y="294" textAnchor="middle" fill="#123F3F" fontSize="18" fontWeight="700">Sugar + Oxygen</text>
          </g>
        )}
      </svg>
      <StepStrip steps={steps} visibleSteps={visibleSteps} step={step} />
      </div>
    );
  }

  if (topic === "fractions") {
    return (
      <div className="grid h-full gap-3">
      <svg viewBox="0 0 640 360" className="min-h-[18rem] w-full" role="img" aria-label="Fraction diagram">
        <style>{`
          @keyframes writeOn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slicePulse { 0%, 100% { opacity: .75; transform: scale(1); } 50% { opacity: 1; transform: scale(1.04); } }
          @keyframes pencilMove { 0% { transform: translate(0, 0); } 50% { transform: translate(34px, 18px); } 100% { transform: translate(0, 0); } }
          .board-write { animation: writeOn .55s ease-out both; }
          .board-slice { transform-box: fill-box; transform-origin: center; animation: slicePulse 1.3s ease-in-out infinite; }
          .board-pencil { animation: pencilMove 1.8s ease-in-out infinite; }
        `}</style>
        <rect width="640" height="360" rx="26" fill="#F7FBF8" />
        <text x="54" y="54" fill="#123F3F" fontSize="24" fontWeight="800">{boardTitle}</text>
        <circle cx="210" cy="180" r="110" fill="#F6C85F" />
        {step >= 1 && <path className="board-write" d="M210 70 L210 290 M100 180 L320 180" stroke="#123F3F" strokeWidth="5" />}
        {step >= 2 && <path className="board-write board-slice" d="M210 180 L210 70 A110 110 0 0 1 320 180 Z" fill="#F07A5A" />}
        {step >= 3 && <text className="board-write" x="430" y="150" fill="#123F3F" fontSize="32" fontWeight="800">1 out of 4</text>}
        {step >= 3 && <text className="board-write" x="430" y="198" fill="#146B6B" fontSize="42" fontWeight="800">1/4</text>}
        <g className="board-pencil">
          <rect x="390" y="245" width="90" height="14" rx="7" fill="#123F3F" transform="rotate(-18 390 245)" />
          <path d="M477 222 L505 228 L484 246 Z" fill="#F6C85F" />
        </g>
      </svg>
      <StepStrip steps={steps} visibleSteps={visibleSteps} step={step} />
      </div>
    );
  }

  if (topic === "percentages") {
    return (
      <svg viewBox="0 0 640 360" className="h-full w-full" role="img" aria-label="Percentage bar diagram">
        <rect width="640" height="360" rx="26" fill="#F7FBF8" />
        <style>{`
          @keyframes growBar { 0% { transform: scaleX(.05); } 55% { transform: scaleX(1); } 100% { transform: scaleX(.82); } }
          @keyframes countPulse { 0%, 100% { opacity: .65; } 50% { opacity: 1; } }
          .board-grow { transform-origin: 80px 180px; animation: growBar 2.2s ease-in-out infinite; }
          .board-count { animation: countPulse 1s ease-in-out infinite; }
        `}</style>
        <text x="54" y="68" fill="#123F3F" fontSize="24" fontWeight="800">{boardTitle}</text>
        <rect x="80" y="145" width="480" height="70" rx="18" fill="#E2F1EF" />
        {step >= 1 && <rect className="board-grow" x="80" y="145" width="192" height="70" rx="18" fill="#F07A5A" />}
        {step >= 2 && <text className="board-count" x="176" y="190" textAnchor="middle" fill="white" fontSize="24" fontWeight="800">40%</text>}
        {step >= 3 && <text x="320" y="260" textAnchor="middle" fill="#123F3F" fontSize="24" fontWeight="800">Percent means out of 100</text>}
      </svg>
    );
  }

  return (
    <div className="grid h-full gap-3">
      <svg viewBox="0 0 640 360" className="min-h-[18rem] w-full" role="img" aria-label="General lesson board">
        <style>{`
          @keyframes pointerPath { 0% { transform: translate(0, 0); } 25% { transform: translate(130px, 40px); } 50% { transform: translate(260px, -8px); } 75% { transform: translate(390px, 62px); } 100% { transform: translate(0, 0); } }
          @keyframes dashFlow { from { stroke-dashoffset: 80; } to { stroke-dashoffset: 0; } }
          @keyframes notePulse { 0%, 100% { opacity: .75; transform: scale(1); } 50% { opacity: 1; transform: scale(1.04); } }
          .board-pointer { animation: pointerPath 5s ease-in-out infinite; }
          .board-flow { stroke-dasharray: 12 10; animation: dashFlow 1.1s linear infinite; }
          .board-note { transform-box: fill-box; transform-origin: center; animation: notePulse 1.7s ease-in-out infinite; }
        `}</style>
        <rect width="640" height="360" rx="26" fill="#F7FBF8" />
        <text x="48" y="54" fill="#123F3F" fontSize="24" fontWeight="800">{boardTitle}</text>
        <path className="board-flow" d="M86 132 C172 82 236 172 322 122 S492 108 548 190" stroke="#146B6B" strokeWidth="6" fill="none" strokeLinecap="round" />
        <g className="board-note">
          <rect x="78" y="118" width="132" height="72" rx="18" fill="#E2F1EF" />
        <text x="144" y="150" textAnchor="middle" fill="#123F3F" fontSize="15" fontWeight="800">{firstNote[0]}</text>
        <text x="144" y="172" textAnchor="middle" fill="#123F3F" fontSize="15" fontWeight="800">{firstNote[1]}</text>
        </g>
        <g className="board-note" style={{ animationDelay: "180ms" }}>
          <rect x="256" y="86" width="132" height="72" rx="18" fill="#F9E2D7" />
          <text x="322" y="118" textAnchor="middle" fill="#123F3F" fontSize="15" fontWeight="800">{secondNote[0]}</text>
          <text x="322" y="140" textAnchor="middle" fill="#123F3F" fontSize="15" fontWeight="800">{secondNote[1]}</text>
        </g>
        <g className="board-note" style={{ animationDelay: "360ms" }}>
          <rect x="430" y="164" width="132" height="72" rx="18" fill="#E8F0D5" />
          <text x="496" y="196" textAnchor="middle" fill="#123F3F" fontSize="15" fontWeight="800">{thirdNote[0]}</text>
          <text x="496" y="218" textAnchor="middle" fill="#123F3F" fontSize="15" fontWeight="800">{thirdNote[1]}</text>
        </g>
        <g className="board-pointer">
          <circle cx="80" cy="282" r="14" fill="#F07A5A" />
          <path d="M94 282 L126 270 L112 300 Z" fill="#F07A5A" />
        </g>
        <text x="320" y="318" textAnchor="middle" fill="#123F3F" fontSize="20" fontWeight="700">{commonText}</text>
      </svg>
      <StepStrip steps={steps} visibleSteps={visibleSteps} step={step} />
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
  const [speaking, setSpeaking] = useState(false);
  const [boardStep, setBoardStep] = useState(0);
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
    utterance.rate = 0.88;
    utterance.pitch = 1.02;
    utterance.volume = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return () => {
      setSpeaking(false);
      window.speechSynthesis.cancel();
    };
  }, [messages, speakReplies]);

  useEffect(() => {
    const topic = getBoardTopic(messages);
    const reply = latestAssistantMessage(messages);
    const totalSteps = (reply ? getDynamicLessonSteps(topic, reply) : getLessonSteps(topic)).length;
    if (!reply) return;
    const resetTimer = setTimeout(() => setBoardStep(0), 0);
    const timer = setInterval(() => {
      setBoardStep((current) => (current + 1 >= totalSteps ? current : current + 1));
    }, 1800);
    return () => {
      clearTimeout(resetTimer);
      clearInterval(timer);
    };
  }, [messages]);

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
    if (speaking || sending) return;
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
              <TutorVideo speaking={speaking} listening={listening} thinking={sending} />
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
                enabled={!speaking && !sending}
                onListeningChange={setListening}
                onResult={handleVoiceLesson}
              />
            </div>
            <p className="mt-3 text-xs text-white/65">
              Try saying, Hey Fennby, teach me the topic I am stuck on.
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
                  <div className="grid gap-5">
                    <div className="relative overflow-hidden rounded-3xl bg-mist-50 p-3">
                      <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-coral-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        Drawing live
                      </div>
                      <LessonWhiteboard
                        topic={getBoardTopic(messages)}
                        explanation={latestAssistantMessage(messages)}
                        request={latestUserMessage(messages)}
                        step={boardStep}
                      />
                    </div>
                    <p className="rounded-3xl bg-mist-50 p-5 text-lg leading-relaxed text-charcoal-teal whitespace-pre-wrap">
                      {latestAssistantMessage(messages)}
                    </p>
                  </div>
                ) : (
                  <div className="grid min-h-64 gap-6">
                    <div className="relative overflow-hidden rounded-3xl bg-mist-50 p-3">
                      <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-coral-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        Board ready
                      </div>
                      <LessonWhiteboard topic="general" explanation="" request="" step={0} />
                    </div>
                    <div className="text-center lg:text-left">
                      <p className="font-display font-bold text-2xl mb-3">Choose a lesson or ask a question.</p>
                      <p className="text-charcoal-teal/65 max-w-md">
                        Say, Hey Fennby, then ask for any school topic. The tutor will explain it out loud, draw the idea here, then ask what you think next.
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
                  <VoiceInputButton
                    onResult={handleVoiceLesson}
                    label={handsFree ? "Listening" : "Dictate"}
                    enabled={!speaking && !sending}
                  />
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
