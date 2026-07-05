import { SimplePage } from "@/components/SimplePage";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function ContactPage() {
  return (
    <SimplePage eyebrow="Company" title="Contact us" body="We'd love to hear from you — whether you're a parent, tutor, or school.">
      <Card>
        <div className="grid gap-4 max-w-md">
          <label className="text-sm font-semibold" htmlFor="contact-email">Email</label>
          <input id="contact-email" type="email" className="rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="you@example.com" />
          <label className="text-sm font-semibold" htmlFor="contact-message">Message</label>
          <textarea id="contact-message" rows={4} className="rounded-2xl border-2 border-teal-100 px-4 py-3 focus:border-teal-700 outline-none" placeholder="How can we help?" />
          <Button variant="primary" className="mt-2 justify-center">Send message</Button>
        </div>
      </Card>
    </SimplePage>
  );
}
