"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { VoiceInputButton } from "@/components/VoiceInputButton";
import { submitContactMessage, type ContactInput } from "@/features/contact/actions";

const topics: { value: ContactInput["topic"]; label: string }[] = [
  { value: "general", label: "General question" },
  { value: "parent", label: "I'm a parent" },
  { value: "tutor", label: "I'm a tutor" },
  { value: "school", label: "I'm a school" },
  { value: "press", label: "Press enquiry" },
  { value: "safeguarding", label: "Safeguarding concern" },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<ContactInput["topic"]>("general");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    const result = await submitContactMessage({ name, email, topic, message });
    setSending(false);
    if (!result.ok) {
      setError("error" in result ? result.error : "Something went wrong — please try again.");
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <PageShell>
        <main className="max-w-xl mx-auto px-6 py-20 text-center">
          <Card tint="teal">
            <span className="text-5xl" aria-hidden>📬</span>
            <h1 className="font-display font-bold text-2xl mt-4 mb-2">Message sent</h1>
            <p className="text-charcoal-teal/80 leading-relaxed">
              Thank you — we&apos;ll get back to you as soon as we can. If this was a safeguarding
              concern involving a child already using Fennby, please also use{" "}
              <a href="/trust#report" className="font-semibold text-teal-900 hover:underline">
                Report a concern
              </a>{" "}
              from inside your account for the fastest response.
            </p>
          </Card>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-16">
        <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
          Company
        </span>
        <h1 className="font-display font-bold text-4xl mb-2">Contact us</h1>
        <p className="text-charcoal-teal/80 leading-relaxed mb-8">
          We&apos;d love to hear from you — whether you&apos;re a parent, tutor, or school.
        </p>
        <Card>
          <form className="grid gap-5" onSubmit={onSubmit}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-semibold mb-1">Your name</label>
                <input
                  id="contact-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
                  placeholder="Jane Reece"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-semibold mb-1">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-topic" className="block text-sm font-semibold mb-1">What&apos;s this about?</label>
              <select
                id="contact-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value as ContactInput["topic"])}
                className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
              >
                {topics.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="contact-message" className="block text-sm font-semibold">Message</label>
                <VoiceInputButton onResult={(text) => setMessage((m) => (m ? `${m} ${text}` : text))} />
              </div>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 focus:border-teal-700 outline-none"
                placeholder="How can we help?"
              />
            </div>
            {error && <p className="text-sm text-brick-600 font-semibold">{error}</p>}
            <Button type="submit" variant="primary" disabled={sending} className="justify-center mt-2">
              {sending ? "Sending…" : "Send message"}
            </Button>
          </form>
        </Card>
      </main>
    </PageShell>
  );
}
