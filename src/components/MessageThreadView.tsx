import { Message } from "@/lib/types";

export function MessageThreadView({ messages, currentSenderId }: { messages: Message[]; currentSenderId: string }) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((m) => (
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
          <p className="text-xs font-semibold opacity-70 mb-1">
            {m.senderName} · {new Date(m.timestamp).toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
          </p>
          <p>{m.content}</p>
        </div>
      ))}
    </div>
  );
}
