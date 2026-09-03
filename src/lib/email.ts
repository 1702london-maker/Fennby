type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.FENNBY_EMAIL_FROM);
}

export async function sendEmail({ to, subject, text, replyTo }: SendEmailInput) {
  if (!isEmailConfigured()) {
    return { ok: false, error: "email_not_configured" as const };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.FENNBY_EMAIL_FROM,
      to,
      subject,
      text,
      reply_to: replyTo,
    }),
  });

  if (!response.ok) {
    return { ok: false, error: "email_send_failed" as const };
  }

  return { ok: true, data: await response.json() };
}
