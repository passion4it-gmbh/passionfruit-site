# Contact Form Consolidation — Part B (site convergence) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge `passionfruit-site`'s contact form onto the canonical template implementation — adopt the template's Cloudflare Function (locale-aware Brevo + Turnstile) verbatim, delete the site's bespoke version, keep the site's contact-page polish, and supply passion4it's values as Cloudflare secrets.

**Architecture:** The site and template have **unrelated git histories**, so this is NOT a git merge. Canonical function files are adopted via `git checkout upstream/main -- <paths>`; `contact.astro` is hand-edited to add the delivery bits while preserving the site's structure/polish; configuration moves from hardcoded constants to env/secrets.

**Tech Stack:** Astro 6 static, Cloudflare Pages Functions, `@cloudflare/workers-types`, Brevo, Cloudflare Turnstile, node:test via tsx.

> **No-code-in-plan note:** Per the maintainer's standing rule, this plan describes edits in precise prose, not code blocks. Exact paths, commands, and expected outputs are given.

**Spec:** `passionfruit/docs/superpowers/specs/2026-06-08-contact-form-consolidation-design.md` (Part B, §5). **Note:** spec D1's "`git merge upstream/main`" is superseded — the repos have unrelated histories, so Part B uses path-level adoption instead (same outcome).
**Repo / branch:** `passionfruit-site`, branch `feat/contact-consolidation` (off `main`, post-#11-merge). Opens a new site PR.
**Upstream remote:** `upstream` → the template; `upstream/main` carries the canonical contact-form (squashed PR #35, incl. locale-aware email).

---

## Starting state (verified)

- Site functions: bespoke `functions/api/_contact.ts` (hardcoded `TO_EMAIL=info@passion4it.de`, `FROM_EMAIL=kontakt@passion4it.de`, `FROM_NAME="PASSION4IT Kontaktformular"`, German subject), `functions/api/_contact.test.ts`, `functions/api/contact.ts` (reads `body.company`, honeypot+validation, no Turnstile).
- Site `contact.astro`: single-column hero, `<Content />` (no `<Prose>`), dial-safe `tel:` (`.replace(/\(0\)/g,"").replace(/[^\d+]/g,"")`), inline-styled off-screen honeypot (`#company`), POST body `{ name, email, message, company }`, German mailto fallback. **No** Turnstile, **no** privacy notice, **no** `data-lang`.
- Site toolchain: **no** `@cloudflare/workers-types`, **no** `functions/tsconfig.json`; root `tsconfig.json` exclude = `["dist", "eslint.config.mjs", "eslint.astro.config.mjs", "scripts"]` (does NOT exclude `functions`); `typecheck` = `astro check --minimumSeverity warning && tsc --noEmit`; `test` = `node --test scripts/check-bilingual.test.mjs && pnpm test:og && tsx --test functions/api/_contact.test.ts`.
- Site i18n `contact.form` (de+en): has name/email/message/send/sending/success/error; **missing** the 3 privacy keys.
- Site `public/_headers` CSP: no `challenges.cloudflare.com`.
- Site `.env.example`: `PUBLIC_FORM_ENDPOINT=`, `BREVO_API_KEY=`. `.dev.vars`: `BREVO_API_KEY` only.

## Canonical contract (from `upstream/main`)

- `functions/api/contact.ts` exports `onRequestPost: PagesFunction<Env>` with `Env = { CONTACT_RECIPIENT?, CONTACT_SENDER?, BREVO_API_KEY?, TURNSTILE_SECRET_KEY?, CONTACT_SENDER_NAME? }`; reads body `{ name, email, message, honeypot, turnstileToken, lang }`; flow = parse → honeypot (`body.honeypot` non-empty → silent 200) → gated Turnstile → validate → config → dispatch.
- `functions/api/_provider.ts` exports `sendContactEmail({ name, email, message, recipient, sender, apiKey, senderName?, lang? })`; locale-aware subject/body (DE `Kontaktanfrage von …`, EN `Contact form: …`); neutral `SENDER_NAME` default overridable via `senderName`.
- `functions/tsconfig.json` type-checks `functions/**` with `@cloudflare/workers-types` (`lib: ES2022 + WebWorker`), excludes `**/*.test.ts`.

The form must therefore send the honeypot under the key **`honeypot`** (not `company`), plus `turnstileToken` and `lang`.

---

## Task B1: Adopt canonical functions + toolchain

**Files:**

- Adopt (from `upstream/main`): `functions/api/_provider.ts`, `functions/api/contact.ts`, `functions/api/_provider.test.ts`, `functions/api/contact.test.ts`, `functions/tsconfig.json`
- Delete: `functions/api/_contact.ts`, `functions/api/_contact.test.ts`
- Modify: `package.json`, `tsconfig.json`

- [ ] **Step 1: Adopt the canonical function files**

Run: `git checkout upstream/main -- functions/api/_provider.ts functions/api/contact.ts functions/api/_provider.test.ts functions/api/contact.test.ts functions/tsconfig.json`
Then remove the bespoke pair: `git rm functions/api/_contact.ts functions/api/_contact.test.ts`
Expected: the four canonical files staged/added, the canonical `contact.ts` overwrites the bespoke one, the two `_contact*` files removed.

- [ ] **Step 2: Add the Workers types dependency**

Run: `pnpm add -D @cloudflare/workers-types`
Expected: added under `devDependencies`; lockfile updated.

- [ ] **Step 3: Wire the toolchain in `tsconfig.json` and `package.json`**

- `tsconfig.json`: add `"functions"` to the `exclude` array (so the root `tsc --noEmit` does not compile Worker code under browser libs — the canonical `functions/tsconfig.json` checks it separately).
- `package.json` scripts: change `typecheck` to `astro check --minimumSeverity warning && tsc --noEmit && tsc --noEmit -p functions/tsconfig.json`. Add `"test:functions": "tsx --test functions/api/*.test.ts"`. Change `test` from `… && tsx --test functions/api/_contact.test.ts` to `node --test scripts/check-bilingual.test.mjs && pnpm test:og && pnpm test:functions`.

- [ ] **Step 4: Run the adopted tests**

Run: `pnpm exec tsx --test 'functions/api/*.test.ts'`
Expected: PASS — the canonical `_provider.test.ts` (incl. DE locale branch) and `contact.test.ts` (handler matrix incl. DE forwarding) all pass. These tests ship WITH the files; they are not rewritten here.

- [ ] **Step 5: Typecheck**

Run: `pnpm typecheck`
Expected: PASS — root `tsc` (now excluding `functions`) plus `tsc -p functions/tsconfig.json` (with Workers types) both clean. No `any`.

- [ ] **Step 6: Commit**

Run: `git add functions/ package.json tsconfig.json pnpm-lock.yaml && git commit -m "feat: adopt canonical contact function + Turnstile from template"`

---

## Task B2: Wire the canonical delivery into `contact.astro` (preserve polish)

A surgical edit of the site's existing `src/components/pages/contact.astro` — add the delivery bits, keep the hero/`<Content />`/dial-safe `tel:`/German mailto exactly as they are.

**Files:**

- Modify: `src/components/pages/contact.astro`

- [ ] **Step 1: Frontmatter — sitekey + privacy href**

Add `import { findPageByKey } from "~/lib/page-registry";` to the imports. Add `const turnstileSiteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;`. Resolve the privacy page via `findPageByKey("privacy")` and build `const privacyHref = lang === "de" ? "/" + slug.de : "/en/" + slug.en;` with a graceful fallback (`/datenschutz` / `/en/privacy`) if the page is absent.

- [ ] **Step 2: Form markup — `data-lang`, Turnstile widget, privacy notice**

- On `<form id="contact-form" …>` add `data-lang={lang}` alongside the existing `data-*` attributes.
- Inside the form, before the submit `<Button>` (and after the existing honeypot div — leave that honeypot div as-is; it already provides `#company`): add the Turnstile widget rendered ONLY when `turnstileSiteKey` is truthy — `<div class="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="auto"></div>`; and a privacy-notice `<p class="text-sm text-muted">` = `{t("contact.form.privacyNoticePrefix")}` + `<a href={privacyHref} class="underline hover:text-accent">{t("contact.form.privacyLinkLabel")}</a>` + `{t("contact.form.privacyNoticeSuffix")}`.
- After `</BaseLayout>`'s content, when `turnstileSiteKey` is truthy, include the Turnstile script ONCE: `<script is:inline src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>`.

- [ ] **Step 3: Script — send `honeypot`, `turnstileToken`, `lang`**

In the inline submit `<script>`:

- Read `const lang = form.dataset.lang ?? "en";` near the other `form.dataset.*` reads.
- Keep reading the honeypot value from `#company` (the existing line). Read the Turnstile token from `form.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')?.value ?? ""`.
- Change the POST body from `{ name, email, message, company }` to `{ name, email, message, honeypot: <the company-field value>, turnstileToken, lang }` — i.e. the honeypot value is sent under the key **`honeypot`** (the canonical function reads `body.honeypot`). The simplest clean form: rename the local variable that holds the company-field value to `honeypot` and send `{ name, email, message, honeypot, turnstileToken, lang }`.
- The `mailto:` fallback branch (German subject/body) is UNCHANGED.

- [ ] **Step 4: Verify**

Run: `pnpm typecheck` → PASS.
Run: `pnpm lint:a11y` → PASS (no new errors; the honeypot stays `aria-hidden`).
Run: `pnpm build` → PASS (sync + lint + typecheck + astro build + bilingual check). NOTE: this needs the new i18n keys (Task B3) to exist or `t()` will surface missing keys — if build flags missing keys here, do Task B3 Step 1 first, then re-run. (Tasks B2 and B3 may be committed in either order; if executing strictly sequentially, run B3 Step 1 before this build.)

- [ ] **Step 5: Commit**

Run: `git add src/components/pages/contact.astro && git commit -m "feat: wire Turnstile, privacy notice, and locale into contact form"`

---

## Task B3: i18n privacy keys, CSP host, env docs

**Files:**

- Modify: `src/i18n/de.json`, `src/i18n/en.json`
- Modify: `public/_headers`
- Modify: `.env.example`, `.dev.vars`

- [ ] **Step 1: Add the privacy-notice i18n keys (both locales, lockstep)**

Under `contact.form` in BOTH `src/i18n/de.json` and `src/i18n/en.json`, add (same canonical values as the template):

- `privacyNoticePrefix` — DE `"Mit dem Absenden stimmen Sie unserer "`; EN `"By submitting, you agree to our "`.
- `privacyLinkLabel` — DE `"Datenschutzerklärung"`; EN `"Privacy Policy"`.
- `privacyNoticeSuffix` — DE `" zu."`; EN `"."`.
  Run: `node scripts/check-bilingual.mjs` → PASS.

- [ ] **Step 2: Allow Turnstile in the CSP**

In `public/_headers`, add `https://challenges.cloudflare.com` to the `script-src`, `frame-src`, and `connect-src` directives of the `Content-Security-Policy` (under `/*`). No other directive changes.

- [ ] **Step 3: Document the env vars; add local secrets**

- `.env.example`: add `PUBLIC_TURNSTILE_SITE_KEY=` (public Turnstile sitekey; spam protection skipped when empty), and a comment block listing the server-only Cloudflare Pages secrets: `CONTACT_RECIPIENT`, `CONTACT_SENDER`, `CONTACT_SENDER_NAME`, `TURNSTILE_SECRET_KEY` (and the already-present `BREVO_API_KEY`). Mirror the template's `.env.example` wording.
- `.dev.vars` (git-ignored; for local `wrangler pages dev`): add `CONTACT_RECIPIENT=info@passion4it.de`, `CONTACT_SENDER=kontakt@passion4it.de`, `CONTACT_SENDER_NAME=PASSION4IT Kontaktformular`, and (for local testing) a `TURNSTILE_SECRET_KEY` test value or leave it unset to skip verification locally. `BREVO_API_KEY` already present.

- [ ] **Step 4: Verify build**

Run: `pnpm build` → PASS.
Run: `rg "challenges.cloudflare.com" dist/_headers` → present in the three directives.

- [ ] **Step 5: Commit**

Run: `git add src/i18n/de.json src/i18n/en.json public/_headers .env.example && git commit -m "feat: privacy notice i18n, Turnstile CSP host, contact env docs"`
(`.dev.vars` is git-ignored — not committed.)

---

## Final verification + operational wiring

- [ ] **Full suite + build**

Run: `pnpm test` → bilingual + og + **functions** (canonical) tests pass.
Run: `pnpm build` → PASS.

- [ ] **Local smoke (optional but recommended)**

Run `wrangler pages dev` (reading `.dev.vars`) and POST a sample submission per locale to `/api/contact`; confirm 200 `ok:true` and (with a real Brevo key) a German subject for `lang:"de"`. With no `TURNSTILE_SECRET_KEY` set locally, Turnstile is skipped.

- [ ] **Open the site PR**

Run: `git push -u origin feat/contact-consolidation` then `gh pr create` (base `main`). The Cloudflare **preview** deploy verifies the real form end-to-end.

- [ ] **Operational (post-merge, not a code commit): set Cloudflare Pages production secrets**

On the `passionfruit-site` Pages project, set: `CONTACT_RECIPIENT=info@passion4it.de`, `CONTACT_SENDER=kontakt@passion4it.de`, `CONTACT_SENDER_NAME=PASSION4IT Kontaktformular` (secrets); `TURNSTILE_SECRET_KEY` (secret) + `PUBLIC_TURNSTILE_SITE_KEY` (plain, build-time) from a Turnstile widget created for the site's domain; ensure `PUBLIC_FORM_ENDPOINT=/api/contact` (build-time) and `BREVO_API_KEY` (already set). A redeploy picks up the `PUBLIC_*` build vars. (The template's `/deploy` Step 9 automates this; the site can also do it via the Cloudflare dashboard/API.)

---

## Self-review notes

- **Spec coverage (Part B, §5):** D1 mechanism corrected to path-level adoption (unrelated histories) — Task B1 + header note. D4 (passion4it as secrets, `CONTACT_SENDER_NAME` preserves German From-name) — Task B3 + operational. D5 (delete bespoke `_contact.ts`, adopt canonical) — Task B1. D6 (preserve site polish in `contact.astro`) — Task B2 is additive-only; hero/`<Content />`/dial-safe `tel:`/German mailto untouched. Turnstile + honeypot + privacy + locale — Tasks B2/B3.
- **Honeypot key:** the site's form sent `company`; the canonical function reads `honeypot`. Task B2 Step 3 renames the body key to `honeypot` so the adopted function works. The HTML field stays `#company` (its name is irrelevant to the server now — only the value, sent as `honeypot`, matters).
- **Sequencing caveat:** Task B2's build needs the Task B3 Step 1 i18n keys. If executing strictly task-by-task, run B3 Step 1 before B2 Step 4's build (noted inline). Otherwise commit order B1 → B2 → B3 is fine as long as the final build (after B3) passes.
- **Out of scope:** catching the rest of the site up to upstream (it is broadly behind, unrelated history); the site's hero/`<Prose>` differences are left as-is.
