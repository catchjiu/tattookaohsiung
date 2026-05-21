export function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type SendEmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
};

const EMAIL_TIMEOUT_MS = 12_000;

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export async function sendEmail({
  to,
  subject,
  html,
  from,
}: SendEmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY is not set — email not sent");
    return false;
  }

  const fromAddress = from || process.env.EMAIL_FROM?.trim();
  if (!fromAddress) {
    console.warn(
      "[Email] EMAIL_FROM is not set — Resend will reject the send. Set a verified sender in Coolify."
    );
    return false;
  }

  const recipients = Array.isArray(to) ? to : [to];

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: recipients,
        subject,
        html,
      }),
      signal: AbortSignal.timeout(EMAIL_TIMEOUT_MS),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(
        `[Email] Resend failed (${res.status}) to ${recipients.join(", ")}:`,
        body
      );
      return false;
    }

    return true;
  } catch (err) {
    console.error(`[Email] Send failed to ${recipients.join(", ")}:`, err);
    return false;
  }
}
