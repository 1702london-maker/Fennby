// Minimal ambient types for the Web Speech API (SpeechRecognition), which
// isn't part of the standard TS DOM lib yet. Only the members Fennby uses.
interface FennbySpeechAlternative {
  transcript: string;
}
interface SpeechRecognitionEvent extends Event {
  results: { 0?: FennbySpeechAlternative }[];
}
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}
interface Window {
  SpeechRecognition: { new (): SpeechRecognitionInstance };
  webkitSpeechRecognition: { new (): SpeechRecognitionInstance };
}
