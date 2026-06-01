# Contact page polish — design

**Status:** Approved in brainstorming. Awaiting user review of this spec before plan.
**Date:** 2026-06-01
**Scope:** This site repo only (`passionfruit-site`).

## Problem

The contact page is half-finished:

1. **Placeholder details.** `src/content/pages/{de/kontakt,en/contact}.md` list `hello@example.com`, `+49 123 456 789`, and a fictional "Musterstraße" address. These duplicate the contact block the page already renders from i18n (`contact.info.*`).
2. **Blank phone.** i18n `contact.info.phone` is an empty string in both locales, so the page's phone link renders empty (`tel:` with no number, no visible text).
3. **The form doesn't send.** `contact.astro` already POSTs `{name, email, message}` to `import.meta.env.PUBLIC_FORM_ENDPOINT` and renders success/error — but no endpoint is configured, so it falls back to a `mailto:` that just opens the visitor's mail client. Nothing is actually delivered.

## Goal

Make the contact page correct and the form actually deliver messages to `info@passion4it.de`, with a **GDPR-clean, EU-hosted** delivery path that **does not disturb the existing Microsoft 365 mail setup** on `passion4it.de`. Contact details come from a single source (i18n). Keep the existing form UI, validation, and success/error UX — only wire a real backend behind it.

## Decisions (from brainstorming)

1. **Delivery backend: Brevo transactional email API, called from a Cloudflare Pages Function** at `/api/contact`. Chosen because Brevo is EU-hosted (no third-country transfer to disclose — cleaner GDPR posture than Resend's US storage or a US form service), it fits the existing Cloudflare Pages hosting and the static Astro build (Functions need no SSR), and its free tier (300 emails/day) is ample for a contact form.
2. **Coexists with M365 without touching mail flow.** Brevo's standard (shared-IP) domain authentication uses **DKIM + a verification TXT (+ DMARC)** only — per Brevo's docs, **SPF and MX records are not required**; Brevo sends from its own return-path/envelope domain and reaches DMARC compliance via DKIM alignment (`d=passion4it.de`). So: MX/inbound stay 100% M365, the M365 SPF record is **not** modified, Brevo's DKIM uses its own selector alongside M365's `selector1/2`, and the single DMARC record is kept (Brevo passes it via DKIM). The only DNS additions are Brevo's records. (An SPF include + dedicated subdomain would only matter for a Brevo _dedicated IP_, which this does not use.)
3. **Sender identity:** From `kontakt@passion4it.de`, **Reply-To = the visitor's submitted email** (so replies go to the visitor from Outlook), To `info@passion4it.de`. The From mailbox need not exist in M365 (Brevo DKIM-signs it); Reply-To carries replies regardless.
4. **Spam protection: honeypot only** for v1. A hidden field real users never fill; submissions with it populated are silently accepted (HTTP 200, no tip-off to bots) but not emailed. Cloudflare Turnstile is a deliberate **non-goal** for now (easy follow-up if spam appears).
5. **Contact details: i18n is the single source.** Populate `contact.info.phone` (de + en) with the real number from the imprint, `+49 (0) 9942 – 46 593 0`. Email stays `info@passion4it.de` (already correct in i18n). Remove the duplicated/placeholder contact list from the two content markdown files, leaving their intro prose.
6. **Privacy disclosure:** add one line to the Datenschutzerklärung / Privacy page (both locales) naming Brevo as the EU-hosted processor for contact-form delivery. No third-country-transfer clause needed (that is the point of choosing an EU host).
7. **Keep the framework's env-gating.** The form stays gated on `PUBLIC_FORM_ENDPOINT` (so a fork without a backend still falls back to mailto). We turn it on here by setting that env var to `/api/contact` in the deployment env — we do not hardcode the endpoint.

## Architecture — data flow

1. **Client (existing, minimal change).** The form POSTs JSON to `PUBLIC_FORM_ENDPOINT`. Change: add a CSS-hidden honeypot field to the form markup and include its value in the POST payload. The existing submit handler, validation, disabled-state, and success/error rendering are unchanged.
2. **Edge function.** A Cloudflare Pages Function at `functions/api/contact.ts` handles `POST /api/contact`. It: rejects non-POST; parses and validates the JSON (required `name`/`email`/`message`, basic email shape, length caps); if the honeypot is non-empty, returns success **without** sending; otherwise calls the Brevo transactional API with the `BREVO_API_KEY` from the Function's environment, sending the notification (To `info@`, From `kontakt@`, Reply-To = visitor, subject + plain-text/HTML body containing name/email/message). Returns 200 on success, 4xx on invalid input, 5xx on a Brevo error. It stores nothing.
3. **Config / secrets.** `PUBLIC_FORM_ENDPOINT=/api/contact` (build-time public var) flips the form off the mailto fallback. `BREVO_API_KEY` is a Cloudflare Pages **secret** (and a local `.env` value for dev) — never committed. Both documented in `.env.example` and the project docs.
4. **No CSP change.** The browser only fetches `/api/contact` (same origin); the Brevo call is server-side from the Function, so `public/_headers` `connect-src` is unaffected. (Turnstile would have needed a CSP entry — another reason it is deferred.)

## Files

**Create**

- `functions/api/contact.ts` — Cloudflare Pages Function: validate → honeypot check → Brevo transactional send. Written provider-agnostically enough to be framework-portable later.

**Modify**

- `src/components/pages/contact.astro` — add the hidden honeypot field to the form and include it in the submit handler's JSON payload. (Endpoint wiring already present.)
- `src/i18n/de.json` + `src/i18n/en.json` — set `contact.info.phone` to `+49 (0) 9942 – 46 593 0` in both; add any honeypot `aria-label`/label string needed, in lockstep.
- `src/content/pages/de/kontakt.md` + `src/content/pages/en/contact.md` — remove the duplicated "So erreichen Sie uns / How to Reach Us" contact list (placeholder email/phone/address); keep the intro prose.
- `src/content/pages/de/datenschutz.md` + `src/content/pages/en/privacy.md` — add the Brevo-as-processor line, in lockstep.
- `.env.example` — document `PUBLIC_FORM_ENDPOINT` and `BREVO_API_KEY`.
- `CLAUDE.md` and/or `README` — short note on the contact-form delivery (Brevo via Cloudflare Function, the env vars, the DNS records to add, and that M365 is untouched), so the setup is reproducible.

**Deployment (user actions, documented — not code)**

- Brevo account + a `BREVO_API_KEY`; authenticate `passion4it.de` in Brevo (Brevo code TXT, DKIM, DMARC-if-missing — no SPF/MX change).
- Set `PUBLIC_FORM_ENDPOINT` and `BREVO_API_KEY` in the Cloudflare Pages project env (the key as a secret).

## Non-goals

- Cloudflare Turnstile / any captcha (deferred; honeypot only for v1).
- Storing submissions in a database or CRM; auto-reply to the visitor; multi-recipient routing; attachments.
- Brevo dedicated IP / dedicated sending subdomain (and therefore the SPF-merge dance).
- Changing the contact form's fields, layout, or visual design.
- Shipping the Cloudflare Function upstream to the framework (worth doing later — noted — but out of scope here).

## Integration risks & mitigations

1. **Function not exercised by `astro build`.** `functions/` is consumed by Cloudflare at deploy, not by the Astro static build, so a broken Function won't fail `pnpm build`. **Mitigation:** validate the Function with the Cloudflare Pages dev runtime (e.g. `wrangler pages dev`) and a real submit against the deploy preview (with `BREVO_API_KEY` set); cover the honeypot and invalid-input paths.
2. **DMARC alignment.** If `passion4it.de` has a strict DMARC policy via M365, Brevo mail must be DKIM-aligned to pass. **Mitigation:** complete Brevo domain authentication (the DKIM record) before relying on it; verify with a test send.
3. **Public env at build time.** `PUBLIC_FORM_ENDPOINT` must be present in the Cloudflare Pages **build** environment (not only runtime) for the client to pick it up. **Mitigation:** document it as a Pages build var; without it the form safely falls back to mailto.
4. **Honeypot silent-accept.** Returning success on a honeypot hit must not look like a real send in logs/analytics. **Mitigation:** drop silently server-side; no email, no error surfaced.

## Testing / verification

- `pnpm build` and the bilingual check stay green (content + i18n edited in lockstep).
- Cloudflare preview (with secrets set): a valid submission delivers an email to `info@passion4it.de` with From `kontakt@passion4it.de` and Reply-To = the visitor; a honeypot-filled submission delivers nothing but shows success; invalid input returns 4xx and the form shows its error state.
- Both locales: phone renders (DE + EN); form success/error copy renders; privacy line present in both.
- Confirm no `public/_headers` CSP change was needed and none was made.

## Acceptance criteria

- Contact page shows `info@passion4it.de` and `+49 (0) 9942 – 46 593 0` in both locales, sourced from i18n; the placeholder/duplicate list is gone from `kontakt.md`/`contact.md`.
- `contact.info.phone` is populated in both `de.json` and `en.json`.
- `functions/api/contact.ts` exists; the form POSTs `{name, email, message, <honeypot>}` to `/api/contact`; valid input triggers a Brevo send (To `info@`, From `kontakt@`, Reply-To = visitor); honeypot hits send nothing.
- `PUBLIC_FORM_ENDPOINT` and `BREVO_API_KEY` are documented in `.env.example`; the key is never committed.
- Privacy page (both locales) names Brevo as the EU processor for form delivery.
- M365 mail flow is untouched: no MX/SPF change, single DMARC kept; the Brevo DNS records to add are documented.
- `pnpm build` + bilingual check pass.
