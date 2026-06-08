/**
 * Pure, I/O-free helpers for the /api/contact Cloudflare Pages Function.
 *
 * Prefixed with `_` so Cloudflare does NOT route this file as an endpoint.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const TO_EMAIL = "info@passion4it.de";
export const FROM_EMAIL = "kontakt@passion4it.de";
export const FROM_NAME = "PASSION4IT Kontaktformular";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ContactInput {
  name: string;
  email: string;
  message: string;
  company: string; // honeypot field
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

// ---------------------------------------------------------------------------
// Honeypot guard
// ---------------------------------------------------------------------------

/**
 * Returns true when the request body contains a non-empty `company` field,
 * which indicates a bot filling in the honeypot.
 */
export function isHoneypotTripped(raw: unknown): boolean {
  if (!isRecord(raw)) return false;
  const company = raw["company"];
  return typeof company === "string" && company.trim().length > 0;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

type ValidateSuccess = {
  ok: true;
  data: { name: string; email: string; message: string };
};
type ValidateFailure = { ok: false };
type ValidateResult = ValidateSuccess | ValidateFailure;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates and sanitises the contact form payload.
 * Returns trimmed values on success; `{ ok: false }` on any failure.
 */
export function validateContact(raw: unknown): ValidateResult {
  if (!isRecord(raw)) return { ok: false };

  const { name, email, message } = raw;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return { ok: false };
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName || !trimmedEmail || !trimmedMessage) return { ok: false };
  if (trimmedName.length > 200) return { ok: false };
  if (trimmedEmail.length > 254) return { ok: false };
  if (trimmedMessage.length > 5000) return { ok: false };
  if (!EMAIL_REGEX.test(trimmedEmail)) return { ok: false };

  return {
    ok: true,
    data: { name: trimmedName, email: trimmedEmail, message: trimmedMessage },
  };
}

// ---------------------------------------------------------------------------
// Brevo payload builder
// ---------------------------------------------------------------------------

interface BrevoRecipient {
  email: string;
  name?: string;
}

interface BrevoPayload {
  sender: { name: string; email: string };
  to: BrevoRecipient[];
  replyTo: BrevoRecipient;
  subject: string;
  textContent: string;
}

/**
 * Builds the JSON body for Brevo's POST /v3/smtp/email endpoint.
 */
export function buildBrevoPayload(data: {
  name: string;
  email: string;
  message: string;
}): BrevoPayload {
  return {
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email: TO_EMAIL }],
    replyTo: { email: data.email, name: data.name },
    subject: `Kontaktanfrage von ${data.name}`,
    textContent: `Name: ${data.name}\nE-Mail: ${data.email}\n\n${data.message}`,
  };
}
