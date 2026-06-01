# Contact Page Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the contact page's placeholder email/phone (single-sourced from i18n) and make the form actually deliver to `info@passion4it.de` via a Cloudflare Pages Function → Brevo, GDPR-clean and without touching the existing M365 mail flow.

**Architecture:** The client form already POSTs `{name, email, message}` to `PUBLIC_FORM_ENDPOINT` with a mailto fallback — we add a honeypot field, then stand up `functions/api/contact.ts` (Cloudflare Pages Function) that validates, drops honeypot hits, and calls Brevo's transactional API. Pure validation/payload logic lives in a co-located `_contact.ts` helper so it's unit-testable; the handler does I/O. Content/i18n/privacy edits are bilingual-lockstep.

**Tech Stack:** Astro 6 (static), TypeScript strict, Cloudflare Pages Functions, Brevo transactional email API, pnpm, node:test/tsx.

---

## Conventions for this plan (read first)

- **No code snippets in this document** (per project CLAUDE.md, which overrides the writing-plans "show the code" default). Each step gives exact file paths, identifiers, API field names, validation rules, and status codes — precise enough to implement directly. API field names (e.g. Brevo's `replyTo`, `textContent`) and identifiers are references, not code blocks.
- **Branch:** `feat/contact-form` (already created off `origin/main`; the spec is committed there as `a571370`). This is independent of the design-floor PR (#10).
- **Commit trailer:** end every commit message with the same `Co-Authored-By:` trailer used on the spec commit (`git show -s --format=%B a571370 | tail -1` → reuse verbatim). Conventional-commit subjects (commitlint enforces).
- **Lefthook** runs lint-staged (eslint/prettier/cspell) + commitlint per commit; prettier reformatting is expected.
- **Verified external facts (do not re-research):**
  - **Brevo:** `POST https://api.brevo.com/v3/smtp/email`; headers `api-key: <key>`, `accept: application/json`, `content-type: application/json`; JSON body keys: `sender` (`{name, email}`), `to` (array of `{email, name?}`), `replyTo` (`{email, name?}`), `subject`, `textContent` (and/or `htmlContent`). Success status is **201** with `{ messageId }`; auth failure is 401. We send **`textContent` only** (plain text → no HTML-injection surface, no escaping needed).
  - **Cloudflare Pages Functions:** a file at `functions/api/contact.ts` exporting `onRequestPost` is invoked on `POST /api/contact`. The handler receives a context object with `request` and `env`; the secret is `context.env.BREVO_API_KEY`. Other HTTP methods to that path get an automatic 405 when only `onRequestPost` is exported. Files/identifiers prefixed `_` (e.g. `_contact.ts`) are **not** treated as routes — safe for shared helpers and tests.
  - **Build coverage:** `functions/` is consumed by Cloudflare at deploy, NOT by `astro build`. But `pnpm typecheck` (`tsc --noEmit`, root tsconfig includes `**/*`) and `pnpm lint` (eslint/prettier over the repo) DO cover `functions/`, so the Function must typecheck + lint cleanly. `Request`/`Response`/`fetch` are DOM globals available under Astro's tsconfig; type `env` with a local `interface Env { BREVO_API_KEY: string }` and type the handler context with only the fields used — **no `@cloudflare/workers-types` dependency, no `any`**.
  - **Form wiring already present:** `contact.astro:34` reads `import.meta.env.PUBLIC_FORM_ENDPOINT`; the inline `<script>` fetches it with `{name, email, message}` and renders success/error, falling back to `mailto:` when the endpoint is empty. We only ADD a honeypot field + include it in the payload.
  - **Sender constants:** To `info@passion4it.de`, From `kontakt@passion4it.de`, Reply-To = visitor's submitted email. Hardcode To/From as named constants in the helper (this is the passion4it site; per spec, upstreaming is a non-goal).
  - **Real phone (from imprint):** `+49 (0) 9942 – 46 593 0`. **Email:** `info@passion4it.de` (already correct in i18n).

## File structure

**Create**

- `functions/api/_contact.ts` — pure, I/O-free helpers + constants: the `ContactInput` shape, `isHoneypotTripped`, `validateContact`, `buildBrevoPayload`, and the `TO_EMAIL`/`FROM_EMAIL` constants. One responsibility: turn a raw request body into either a rejection or a ready-to-send Brevo payload.
- `functions/api/_contact.test.ts` — node:test/tsx unit tests for the helper (honeypot, validation, payload shape). `_`-prefixed so Cloudflare never routes it.
- `functions/api/contact.ts` — the `onRequestPost` handler: parse JSON, apply the helper, call Brevo with `env.BREVO_API_KEY`, map outcomes to HTTP status. Only this file does I/O.

**Modify**

- `src/components/pages/contact.astro` — add the hidden honeypot field to the form; include its value in the submit handler's JSON payload.
- `src/i18n/de.json` + `src/i18n/en.json` — set `contact.info.phone`; add a honeypot field `aria-label` string if used, in lockstep.
- `src/content/pages/de/kontakt.md` + `src/content/pages/en/contact.md` — remove the duplicated placeholder contact list; keep intro prose.
- `src/content/pages/de/datenschutz.md` + `src/content/pages/en/privacy.md` — add the Brevo-processor line, in lockstep.
- `.env.example` — document `PUBLIC_FORM_ENDPOINT` and `BREVO_API_KEY`.
- `package.json` — append the helper unit test to the `test` script.
- `CLAUDE.md` — add a "Contact form" section (delivery via Brevo CF Function, env vars, DNS records to add, M365 untouched).

---

## Task 1: Fix the contact details (content + i18n)

**Files:**

- Modify: `src/i18n/de.json`, `src/i18n/en.json` (`contact.info.phone`)
- Modify: `src/content/pages/de/kontakt.md`, `src/content/pages/en/contact.md`

- [ ] **Step 1:** In `src/i18n/de.json` and `src/i18n/en.json`, set `contact.info.phone` (currently `""`) to `+49 (0) 9942 – 46 593 0` in BOTH files. (The page's `tel:` link strips whitespace at runtime; keep the human-readable spacing in the value.)
- [ ] **Step 2:** In `src/content/pages/de/kontakt.md`, remove the entire "## So erreichen Sie uns" section and its bullet list (the `hello@example.com` / `+49 123 456 789` / `Musterstraße` lines). Keep the frontmatter and the "## Schreiben Sie uns" intro paragraph. The displayed contact details now come solely from the page's i18n-driven icon list.
- [ ] **Step 3:** In `src/content/pages/en/contact.md`, mirror Step 2: remove the "## How to Reach Us" section + its list; keep the "## Write to Us" intro. (Bilingual lockstep — both files change together.)
- [ ] **Step 4:** Run `pnpm build`. Expected: PASS (prebuild bilingual check green; both locales still symmetric).
- [ ] **Step 5:** `pnpm dev`, load `/kontakt/` (DE) and `/en/contact/` (EN). Confirm the contact block shows `info@passion4it.de` and `+49 (0) 9942 – 46 593 0` (phone link no longer blank), and the intro prose reads cleanly with no duplicated/placeholder list. Stop dev.
- [ ] **Step 6:** Commit. Subject: `fix(contact): real phone via i18n, drop placeholder contact list`. Stage the two i18n files + the two content files.

## Task 2: Make the form actually send (honeypot + Cloudflare Function → Brevo)

**Files:**

- Create: `functions/api/_contact.ts`, `functions/api/_contact.test.ts`, `functions/api/contact.ts`
- Modify: `src/components/pages/contact.astro`, `package.json`

- [ ] **Step 1 (helper):** Create `functions/api/_contact.ts` exporting (all pure, no I/O):
  - Constants `TO_EMAIL = "info@passion4it.de"`, `FROM_EMAIL = "kontakt@passion4it.de"`, `FROM_NAME` = the site/company name (e.g. `"PASSION4IT Kontaktformular"`).
  - `interface ContactInput { name: string; email: string; message: string; company: string }` (`company` = honeypot).
  - `isHoneypotTripped(raw: unknown): boolean` — true when `raw` has a non-empty string `company` field. Used to silently drop bots.
  - `validateContact(raw: unknown): { ok: true; data: { name: string; email: string; message: string } } | { ok: false }` — require `name`/`email`/`message` to be non-empty strings after trim; `email` matches a basic email regex; enforce length caps (name ≤ 200, email ≤ 254, message ≤ 5000). Trim values in the returned `data`.
  - `buildBrevoPayload(data: { name: string; email: string; message: string }): object` — returns the Brevo request body: `sender = { name: FROM_NAME, email: FROM_EMAIL }`, `to = [{ email: TO_EMAIL }]`, `replyTo = { email: data.email, name: data.name }`, `subject = "Kontaktanfrage von " + data.name`, `textContent` = a plain-text block containing `Name:`, `E-Mail:`, a blank line, then the message. No `htmlContent`.
- [ ] **Step 2 (failing test):** Create `functions/api/_contact.test.ts` using `node:test` + `node:assert/strict`, importing from `./_contact.ts`. Cover: (a) `isHoneypotTripped` true when `company` non-empty, false when absent/empty; (b) `validateContact` rejects missing/blank fields and a malformed email, and accepts a valid trio (asserting trimmed `data`); (c) `buildBrevoPayload` produces `sender.email === FROM_EMAIL`, `to[0].email === TO_EMAIL`, `replyTo.email === <input email>`, a subject containing the name, and a `textContent` containing the message.
- [ ] **Step 3 (run test red):** Append `&& tsx --test functions/api/_contact.test.ts` to the `test` script in `package.json`, then run `pnpm test`. Expected: the new file FAILS first if the helper is incomplete; iterate Step 1 until it PASSES. (If you wrote the full helper in Step 1, expect PASS — that's fine; the point is the test asserts the contract.)
- [ ] **Step 4 (handler):** Create `functions/api/contact.ts` exporting `onRequestPost`. Type `env` as `interface Env { BREVO_API_KEY: string }` and the context param with only `{ request: Request; env: Env }`. Logic: parse `await request.json()` inside try/catch (catch → `Response` 400). If `isHoneypotTripped(body)` → return 200 JSON `{ ok: true }` WITHOUT sending. Run `validateContact(body)`; on `{ ok: false }` → 400 JSON `{ ok: false, error: "invalid" }`. If `env.BREVO_API_KEY` is falsy → 500 JSON `{ ok: false, error: "config" }`. Otherwise `fetch("https://api.brevo.com/v3/smtp/email", { method: "POST", headers: { "api-key": env.BREVO_API_KEY, accept: "application/json", "content-type": "application/json" }, body: JSON.stringify(buildBrevoPayload(data)) })`. If the response status is not 201 (and not otherwise `.ok`) → 502 JSON `{ ok: false, error: "send" }`. On success → 200 JSON `{ ok: true }`. All returns are `new Response(JSON.stringify(...), { status, headers: { "content-type": "application/json" } })`.
- [ ] **Step 5 (honeypot in form):** In `src/components/pages/contact.astro`, add a visually-hidden honeypot input to the `<form>` (before the submit button): a text input `name="company"` `id="company"` with `tabindex="-1"`, `autocomplete="off"`, not `required`, wrapped in a container that is hidden from users and assistive tech (off-screen / `aria-hidden="true"`; do NOT rely solely on `required`). Then in the inline `<script>`, read `#company`'s value and include it as `company` in the `JSON.stringify({ name, email, message, company })` payload sent to the endpoint. Leave the mailto-fallback branch unchanged (it ignores `company`).
- [ ] **Step 6:** Run `pnpm typecheck` then `pnpm lint`. Expected: PASS (the Function typechecks under the root tsconfig with DOM globals + the local `Env`; no `any`; eslint/prettier clean). Then `pnpm test` → PASS (helper tests green).
- [ ] **Step 7:** Run `pnpm build`. Expected: PASS (astro build ignores `functions/`; nothing broke).
- [ ] **Step 8:** Commit. Subject: `feat(contact): deliver form via Cloudflare Function and Brevo`. Stage `functions/api/_contact.ts`, `functions/api/_contact.test.ts`, `functions/api/contact.ts`, `src/components/pages/contact.astro`, `package.json`.

## Task 3: Config, privacy disclosure, and docs

**Files:**

- Modify: `.env.example`
- Modify: `src/content/pages/de/datenschutz.md`, `src/content/pages/en/privacy.md`
- Modify: `CLAUDE.md`

- [ ] **Step 1:** In `.env.example`, add a "Contact form" block documenting: `PUBLIC_FORM_ENDPOINT` (set to `/api/contact` to enable the real send; leave empty to keep the mailto fallback) and `BREVO_API_KEY` (the Brevo transactional API key; a secret — set it in Cloudflare Pages env, never commit it). Match the file's existing comment style.
- [ ] **Step 2:** In `src/content/pages/de/datenschutz.md`, add one sentence in the contact-data section naming the processor: contact-form submissions are delivered via **Brevo** (EU-hosted email service) acting as a processor under Art. 28 GDPR; no transfer to a third country. Keep the existing self-handling language consistent.
- [ ] **Step 3:** In `src/content/pages/en/privacy.md`, mirror Step 2 in English (Brevo as an EU-hosted processor for contact-form delivery, Art. 28 GDPR, no third-country transfer). Bilingual lockstep.
- [ ] **Step 4:** In `CLAUDE.md`, add a "Contact form" section documenting: the form POSTs to `/api/contact` (gated on `PUBLIC_FORM_ENDPOINT`); `functions/api/contact.ts` calls Brevo (To `info@`, From `kontakt@`, Reply-To = visitor); honeypot spam guard; env vars `PUBLIC_FORM_ENDPOINT` + `BREVO_API_KEY` (Cloudflare Pages, key as secret); the Brevo DNS records to add on `passion4it.de` (Brevo code TXT, DKIM, DMARC-if-missing) and the explicit note that **SPF/MX are untouched (M365 keeps the mailboxes)**. Add `BREVO_API_KEY` to the deployment-secrets list if §14 enumerates secrets.
- [ ] **Step 5:** Run `pnpm build`. Expected: PASS (bilingual check green — datenschutz/privacy edited in lockstep; cspell may flag "Brevo" — if so, add it to `project-words.txt`).
- [ ] **Step 6:** Commit. Subject: `docs(contact): document Brevo form delivery, env, and DNS`. Stage `.env.example`, the two content files, `CLAUDE.md`, and `project-words.txt` if changed.

## Task 4: Verify and open the PR

- [ ] **Step 1:** Run `pnpm test` (bilingual + OG + the new helper test) and `pnpm check:all` (spelling + a11y + build + links). Expected: PASS.
- [ ] **Step 2:** `pnpm dev` final visual pass at 375px + desktop: `/kontakt/` and `/en/contact/` show the real email + phone and the cleaned intro; the form renders with the honeypot invisible (check via DevTools that `#company` is present but not visible/focusable). Confirm the mailto fallback still triggers in dev (no `PUBLIC_FORM_ENDPOINT` set locally). Stop dev.
- [ ] **Step 3 (optional local end-to-end):** If validating the Function locally, run `npx wrangler pages dev` against the built output with `BREVO_API_KEY` set in `.env`, POST a sample body to `/api/contact`, and confirm: valid → 200 + email arrives; honeypot set → 200 + no email; missing field → 400. (Skip if relying on the deploy preview.)
- [ ] **Step 4:** Push: `git push -u origin feat/contact-form`.
- [ ] **Step 5:** Open the PR against `main` with `gh pr create --repo passion4it-gmbh/passionfruit-site --base main --head feat/contact-form` (the repo has two remotes — pass `--repo` explicitly to avoid the upstream-remote ambiguity). PR body must include: the content fixes; the Brevo-via-Function delivery design; honeypot; the **user setup checklist** — (a) create Brevo account + API key, (b) authenticate `passion4it.de` in Brevo (add Brevo code TXT, DKIM, DMARC-if-missing — **no SPF/MX change**, M365 untouched), (c) set `PUBLIC_FORM_ENDPOINT=/api/contact` + `BREVO_API_KEY` (secret) in Cloudflare Pages; and the caveat that end-to-end send is verifiable only on the preview/prod with the key set. End with the Claude Code generation line.
- [ ] **Step 6:** Confirm CI is green and the Cloudflare preview deploys; note in the PR that the form falls back to mailto until the env vars are set.

---

## Self-Review

**Spec coverage — every spec requirement maps to a task:**

- Placeholder details fixed / i18n single source → Task 1. ✅
- Blank phone filled (both locales) → Task 1 Step 1. ✅
- Form actually sends via CF Function → Brevo → Task 2. ✅
- Honeypot spam guard → Task 2 Steps 1–2, 5. ✅
- From `kontakt@`, Reply-To visitor, To `info@` → Task 2 Step 1 constants + payload. ✅
- Keep env-gating (`PUBLIC_FORM_ENDPOINT`) → unchanged form wiring + Task 3 `.env.example`. ✅
- `BREVO_API_KEY` documented, never committed → Task 3 Step 1; `.env` already gitignored. ✅
- Privacy processor line (both locales) → Task 3 Steps 2–3. ✅
- M365 untouched + DNS records documented → Task 3 Step 4 + Task 4 PR body. ✅
- No CSP change (server-side Brevo call) → no `public/_headers` edit in any task. ✅
- Testing/verification → Task 2 unit tests + Task 4 build/test/visual/preview. ✅
- Non-goals (Turnstile, storage, dedicated IP, design change, upstreaming) → none introduced. ✅

**Placeholder scan:** No "TBD/TODO". Each step names exact files, identifiers, API fields, validation rules, and status codes. (Code bodies intentionally absent per project convention.) ✅

**Type/identifier consistency:** `ContactInput`, `isHoneypotTripped`, `validateContact`, `buildBrevoPayload`, `TO_EMAIL`/`FROM_EMAIL`/`FROM_NAME`, `Env`/`BREVO_API_KEY`, honeypot field `company`, endpoint `/api/contact`, Brevo fields `sender`/`to`/`replyTo`/`subject`/`textContent`, status codes (200/400/500/502, Brevo 201) are used consistently across Tasks 2–4 and match the verified APIs. ✅

**Ordering:** content fixes (independently shippable) → backend (helper → test → handler → form) → config/privacy/docs → verify/PR. Each task stands on its own; Task 2's handler depends only on its own helper. ✅
