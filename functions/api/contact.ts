/**
 * Cloudflare Pages Function: POST /api/contact
 *
 * Validates the honeypot, validates the payload, then forwards to Brevo.
 */

import {
  buildBrevoPayload,
  isHoneypotTripped,
  validateContact,
} from "./_contact.ts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Env {
  BREVO_API_KEY: string;
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function json(status: number, obj: Record<string, unknown>): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" },
  });
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return json(400, { ok: false, error: "invalid" });
  }

  // Silent drop for bots that fill in the honeypot field.
  if (isHoneypotTripped(body)) {
    return json(200, { ok: true });
  }

  const result = validateContact(body);
  if (!result.ok) {
    return json(400, { ok: false, error: "invalid" });
  }

  if (!context.env.BREVO_API_KEY) {
    return json(500, { ok: false, error: "config" });
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": context.env.BREVO_API_KEY,
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(buildBrevoPayload(result.data)),
    });

    if (!res.ok) {
      return json(502, { ok: false, error: "send" });
    }

    return json(200, { ok: true });
  } catch {
    return json(502, { ok: false, error: "send" });
  }
}
