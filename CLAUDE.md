# passionfruit-site

## 1. Project

This is the public marketing site for the **passionfruit** website template — meta on purpose. The site is itself a passionfruit project, so anything we ship here is also a live demo of what users get out of the box.

- **Audience:** non-technical site owners (primary), curious developers (secondary).
- **Primary CTA:** `pnpm create passionfruit my-site`.
- **Languages:** German at root, English at `/en/` (bilingual is the framework's USP — we eat the dog food).
- **Hosting:** Cloudflare Pages at `passionfruit.passion4it.de`.
- **Pages:** Home, Features (`/funktionen/`, `/en/features/`), Blog, Contact, Imprint, Privacy. No About, no Team — the agency portfolio at passion4it.de fills that slot.
- **Hard rule:** if you ever feel the urge to add a custom component, **ship it upstream to the passionfruit framework first**, then pull it in here. Customizing this site directly defeats the dogfood signal.

## 2. Self-improvement rule

**Claude must keep CLAUDE.md, STYLE_GUIDE.md, and CONTRIBUTING.md in sync with reality.** Update these files when:

- The user establishes a preference ("always use rounded buttons" → add to STYLE_GUIDE.md button section)
- A new content collection is added → document its schema, paths, and workflow in CONTRIBUTING.md
- A recurring issue is fixed → add to the quality checklist so it doesn't happen again
- A new component pattern emerges → document it in STYLE_GUIDE.md
- Routing changes → update the routing section below
- New commands are added → update the commands table

This is not optional. These files are the project's memory. If they drift from reality, future sessions will produce wrong code.

## 3. First-time setup

If the site still shows "passionfruit", run `/onboard` to personalize it for your business. After onboarding, run `/brand` to replace the placeholder favicon and social sharing image with your own logo.

## 4. Tech stack

| Tool            | Version / notes                                                                    |
| --------------- | ---------------------------------------------------------------------------------- |
| Astro           | 7, static output                                                                   |
| Markdown        | Sätteri (Astro 7's engine); external links via a hast plugin in `astro.config.mjs` |
| Tailwind        | v4 via `@tailwindcss/vite` (theme in `src/styles/global.css` `@theme` block)       |
| TypeScript      | strict — no `any`, ever                                                            |
| Package manager | pnpm                                                                               |
| Icons           | `@lucide/astro` (no emojis)                                                        |
| Consent         | vanilla-cookieconsent                                                              |
| Analytics       | PostHog (EU instance, env-var-gated)                                               |
| Font            | Inter Variable (self-hosted via `@fontsource-variable/inter`)                      |
| React           | Dependency present; only use when interactivity genuinely demands it               |

## 5. Bilingual rule

**Hard rule: every page and every collection entry must exist in both DE and EN.**

- Pairing is via `translationKey` frontmatter field — same value across both locale files.
- `scripts/check-bilingual.mjs` runs as `prebuild` and exits 1 if any entry is monolingual.
- Never commit a single-locale entry. Always update both DE and EN in the same commit.

## 6. Content workflows

See CONTRIBUTING.md for full details. Summary:

**Blog post:** `src/content/blog/{de,en}/<slug>.md` — needs translationKey, title, description, publishedAt, author, tags.

**Team member:** `src/content/team/{de,en}/<slug>.md` — needs translationKey, name, role, displayOrder.

**Page:** `src/content/pages/{de,en}/<slug>.md` — needs translationKey, title, description. Also update `src/lib/page-registry.ts`.

**Translations:** Always update both `src/i18n/de.json` and `src/i18n/en.json` in lockstep. Nested key structure, accessed via `t('section.key')`.

## 7. Component conventions

- Prefer Astro components over React.
- Brand tokens via Tailwind utility classes only — no hex literals in components.
- Icons via `@lucide/astro`. No emojis.
- Translation strings via `useTranslations(locale)` from `~/i18n`.
- Images via `<Image>` component from `astro:assets`.
- Always update both i18n JSON files when adding strings.
- **Layout primitives:** `<Section tone="..." padding="..." container="...">` for every section frame; `<Prose>` for long-form Markdown rendering. Never compose ad-hoc `<section>` or `<div>` wrappers when a primitive exists.
- **Motion primitives:** `<Motion effect="fade-up" duration="base">` or its sugars `<FadeUp>` / `<FadeIn>` for entrance animations. Reduced-motion is handled for you — don't author per-element keyframes.
- **Section archetypes** (`src/components/sections/`): `AsymmetricHero`, `MagazineGrid`, `StickyStory`, `EditorialQuote`, `SplitFeature`, `Trust`, `Comparison`, `FAQ`. Pick the right archetype before reaching for a custom layout.
- **State surfaces** (`src/components/state/`): `<Skeleton variant="...">` for loading states, `<EmptyState>` (CTA required — no dead-end empties), `<ErrorState tone="warning|error|info">`. Don't roll custom gray boxes or ad-hoc error text.
- **Sidecar docs:** every `*.astro` in `src/components/` has a sibling `*.md` sidecar (purpose, props, slots, owned i18n keys, gotchas) plus a generated index in `src/components/CLAUDE.md`. Props describe the local component, never upstream. Update the sidecar in the same commit as the component — a build-time check (`scripts/check-component-docs.mjs`, run in `prebuild`) fails on missing/malformed sidecars; `pnpm sync:component-catalog` regenerates the catalog. See `src/components/CLAUDE.md` for the schema.
- The `passionfruit-design`, `passionfruit-a11y`, and `passionfruit-perf` skills auto-load on design, accessibility, and performance work respectively — read them for the full decision-shortcut cheat sheets.

## 8. Styling

**Read `STYLE_GUIDE.md` before touching any UI.** It is the single source of truth for colors, typography, buttons, cards, layout, accessibility, social proof, and state surfaces. The Decision Shortcuts cheat sheet at the bottom of `STYLE_GUIDE.md` is the fastest path to the right answer.

Key rules:

- No hex literals in components — use Tailwind tokens that map to `global.css` `@theme` values
- Buttons use variant (primary / secondary / ghost) x tone (on-light / on-dark)
- One card component per content type (`BlogCard` is the only card in this repo)
- 44px minimum touch targets
- `focus-visible` ring on all interactive elements

## 9. Analytics and consent

`vanilla-cookieconsent` dispatches `passionfruit:consent-changed` events. Both analytics providers listen for that event and load on demand once `window.hasAnalyticsConsent()` returns true. Both are env-var-gated and no-op when their key is absent.

**PostHog (EU)** — `PUBLIC_POSTHOG_API_KEY`, `PUBLIC_POSTHOG_HOST` (defaults to `https://eu.i.posthog.com` — ingest endpoint), `PUBLIC_POSTHOG_UI_HOST` (defaults to `https://eu.posthog.com` — dashboard for toolbar/heatmap links).

**Google Analytics 4** — `PUBLIC_GA_MEASUREMENT_ID` (format `G-XXXXXXXXXX`). Uses Consent Mode v2 with `analytics_storage: granted` only after the user accepts; ad cookies stay denied. IP anonymization on.

You can run either, both, or neither. Most users want GA4 (familiar dashboard); PostHog is for those who want session replay, funnels, and feature flags.

## 10. Contact form

The contact form (`src/components/pages/contact.astro`) submits a JSON body `{name, email, message, honeypot, turnstileToken, lang}` via POST to `/api/contact`. The honeypot is a hidden field rendered with the DOM name `company`; its value is sent on the wire as `honeypot`. Any non-empty value causes the request to be silently dropped (200 returned to the visitor, no email sent).

**Delivery:** `functions/api/contact.ts` (Cloudflare Pages Function) calls the Brevo transactional email API. Nothing is hardcoded — the To, From, and From display name all come from env vars (see below); Reply-To is the visitor's address, and the subject/body are localized by the `lang` field. **Spam protection:** honeypot + optional Cloudflare Turnstile (gated by `TURNSTILE_SECRET_KEY`) + Cloudflare edge limits — no app-level rate limiting by design.

The address shown on the page and the `mailto:` fallback are a separate thing: they come from the `contact.info.email` i18n string (currently `info@passion4it.de` in both locales), independent of the Function's `CONTACT_RECIPIENT`.

**Env vars:**

- `PUBLIC_FORM_ENDPOINT=/api/contact` — build-time flag; enables real delivery via the Function. Leave EMPTY (default in `.env.example`) to fall back to a `mailto:` link — no Function is called.
- `CONTACT_RECIPIENT` — secret; the address form submissions are delivered to (the To:).
- `CONTACT_SENDER` — secret; a Brevo-verified sender address (the From:).
- `CONTACT_SENDER_NAME` — optional secret; From: display name (default: `Website contact form`).
- `BREVO_API_KEY` — secret; Brevo transactional API key.
- `PUBLIC_TURNSTILE_SITE_KEY` (public, build-time) / `TURNSTILE_SECRET_KEY` (secret) — set **together** to enable Turnstile verification; leave both empty to rely on the honeypot alone. If `CONTACT_RECIPIENT`, `CONTACT_SENDER`, or `BREVO_API_KEY` is missing the Function returns a `config` error.

Set the secrets in the Cloudflare Pages dashboard (Settings → Environment Variables) for production. For local testing with `wrangler pages dev`, add them to a git-ignored `.dev.vars` file (never commit it).

**DNS on `passion4it.de`:** To authenticate the sending domain in Brevo, add the Brevo code TXT record, the DKIM TXT record, and a DMARC record if none already exists. **SPF and MX records are NOT changed — Microsoft 365 keeps the mailboxes.** Brevo sends via its own return-path and achieves DMARC compliance through DKIM alignment.

**Testing:** The Function is not exercised by `pnpm build`. End-to-end delivery is verified on the Cloudflare preview or production environment with `BREVO_API_KEY` set, or locally via `wrangler pages dev`.

## 11. Routing

- URL scheme: **apex-locale** — DE at root (`/`), EN under `/en/`.
- Localized slugs: `/leistungen` (DE) ↔ `/en/services` (EN).
- Single source of truth: `src/lib/page-registry.ts` — `PAGES` array maps `PageKey` to `{ de, en }` slug pairs.
- Catch-all route: `src/pages/[...path].astro`.
- Home pages: `src/pages/index.astro` (DE), `src/pages/en/index.astro` (EN).

## 12. Quality checklist

Before committing:

- [ ] `pnpm build` passes (runs lint, typecheck, bilingual check)
- [ ] Both DE and EN locales render correctly
- [ ] No `any` in TypeScript
- [ ] Mobile layout intact at 375px
- [ ] No hex literals in components
- [ ] New collection entries have `translationKey` in both locales
- [ ] New i18n strings added to both `de.json` and `en.json`
- [ ] Changes align with STYLE_GUIDE.md

## 13. Image generation

### Social sharing (OG) image — `pnpm generate-og`

Produces the site's bilingual OG sharing image from project data (no API key, runs in <1 second). Inputs are auto-discovered: `site.name` + `site.tagline` from `src/i18n/{de,en}.json`, accent color from `src/styles/global.css`, logo from `public/favicon.svg`. Optional: drop a photo at `src/assets/og/bg.png` and it gets composited full-cover behind the text (with a left-anchored scrim for legibility). Outputs land at `public/og-default-de.png` and `public/og-default-en.png` (1200×630). `BaseLayout` picks the locale-specific file per page.

```bash
pnpm generate-og              # regenerate both locales
pnpm generate-og --lang de    # only DE
pnpm generate-og --lang en    # only EN
```

Re-run when `site.name` / `site.tagline` / favicon / accent color / `src/assets/og/bg.png` changes. The bilingual check (`scripts/check-bilingual.mjs`) fails a build if one locale's PNG is present without the other — no half-state can ship.

### Content images — `pnpm generate-image`

Generate hero / background / decorative images using GPT Image models:

```bash
pnpm generate-image "your prompt here" -o src/assets/blog/my-image.png
```

**Requires `OPENAI_API_KEY` in `.env`.** The user must provide their own OpenAI API key. If the key is missing, the script will error with a clear message — prompt the user to add it.

Options: `--size` (1536x1024 for landscapes, 1024x1536 for portraits), `--quality high`, `--background transparent` (png/webp only, not gpt-image-2), `--format` (png/jpeg/webp).

**Prompt guidelines for good results:**

- Be specific about composition, lighting, and mood
- Reference a visual style ("editorial photography", "Kinfolk magazine", "minimal tech aesthetic")
- Specify colors to match brand tokens (accent: #6366f1, dark: #1a1a2e)
- Always end with "No text, no logos" unless text is wanted
- Use `--size 1536x1024` for hero/banner images, `1024x1024` for square thumbnails

## 14. Quality tooling

**Commit hooks** (lefthook): pre-commit runs lint-staged (ESLint, Prettier, cspell on changed files) + bilingual check. Commit-msg runs commitlint (conventional commits: `feat:`, `fix:`, `chore:`, `docs:`).

**Spell checker** (cspell): checks all markdown content in `src/content/`. German + English dictionaries loaded. Add unknown words to `project-words.txt`.

**Link checker** (linkinator): runs against built `dist/` output after `astro build`. Catches broken internal links — pages referenced in nav or content that don't exist. Runs in CI after build.

**Alt text** enforcement: `jsx-a11y/alt-text` is set to `error` (not warn) in the a11y ESLint config. Missing alt text on images blocks the build.

**Fixture-leak gate** (`scripts/check-fixtures.mjs`, runs in `prebuild`): fails the build if the upstream template's demo brand leaks into shipped code (`.astro/.ts/.js/.css`). Brand identity in code must come from the `site.name` i18n string + `Astro.site`, never string literals.

## 15. Deployment

**Default host: Cloudflare Pages** (free, fast, automatic HTTPS). Run `/deploy` to set it up.

**Required GitHub secrets/variables:**

- `CLOUDFLARE_API_TOKEN` (secret) — from Cloudflare dashboard → API Tokens
- `CLOUDFLARE_ACCOUNT_ID` (secret) — from Cloudflare dashboard sidebar
- `CLOUDFLARE_PROJECT_NAME` (variable) — the Cloudflare Pages project name
- `BREVO_API_KEY` (secret) — Brevo transactional API key for contact-form delivery (see §10)
- `PUBLIC_FORM_ENDPOINT` (variable, value `/api/contact`) — enables the contact form's server-side send

The deploy job is gated on `CLOUDFLARE_PROJECT_NAME` being set — when unset, the deploy workflow shows as "skipped" instead of failing. This keeps the template green out of the box.

**Site URL:** Update `site` in `astro.config.mjs` after deployment. This affects canonical URLs, sitemap, and OG meta tags.

**Security headers + caching** live in `public/_headers` (Cloudflare Pages auto-picks this up). Includes HSTS, CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and long-cache rules for `/_astro/*`. The CSP is scoped to what's actually used (PostHog + GA4); **if you add a new third-party script, iframe, or asset host, update the CSP or it will be blocked silently in the browser console.**

**CSP violation reporting** is opt-in: when `PUBLIC_POSTHOG_API_KEY` is set at build time, `scripts/postbuild-headers.mjs` injects `Reporting-Endpoints` + `report-uri`/`report-to` directives pointing at PostHog's `/report/` ingest. The script is a no-op without the key, so forks ship safely with reporting disabled. Bump the `v=1` tag in the script when materially changing the CSP so historical noise doesn't drown out fresh regressions.

## 16. Git workflow

**Never push directly to `main`.** Every change goes through a pull request, even if it's just you.

**The flow:**

1. Create a branch: `git checkout -b feat/<short-name>`
2. Make changes, commit (commitlint enforces conventional commits: `feat:`, `fix:`, `chore:`, `docs:`)
3. Push: `git push -u origin feat/<short-name>`
4. Open a PR: `gh pr create --fill` (or via GitHub UI)
5. Wait for CI to pass and Cloudflare to deploy a preview — the preview URL is auto-commented on the PR
6. Review the live preview (visit the URL from the PR comment)
7. **Squash merge** when approved — this keeps `main` history linear and readable
8. Push to `main` automatically triggers a production deploy

**Why squash merge:** WIP commits ("fix typo", "address review") shouldn't pollute `main`. One PR = one logical change = one commit. The PR description becomes the commit message.

**Repo settings to enable on GitHub:**

- Settings → General → Pull Requests:
  - ✅ Allow squash merging — default to "Pull request title and description"
  - ❌ Allow merge commits
  - ❌ Allow rebase merging
  - ✅ Automatically delete head branches
- Settings → Branches → Add branch protection rule for `main`:
  - ✅ Require a pull request before merging
  - ✅ Require status checks to pass (CI workflow)
  - ✅ Require linear history

**Preview deployments:** Every PR gets a unique preview URL like `https://<branch-name>.<project>.pages.dev`. Updates on every push to the branch. The bot comment on the PR is updated in place — no spam.

## 17. Commands

| Command               | Purpose                                                                      |
| --------------------- | ---------------------------------------------------------------------------- |
| `pnpm dev`            | Local dev server                                                             |
| `pnpm build`          | Production build (sync + lint + typecheck + astro build + postbuild headers) |
| `pnpm preview`        | Preview built output                                                         |
| `pnpm typecheck`      | `astro check` + `tsc --noEmit`                                               |
| `pnpm lint`           | ESLint + Prettier with autofix                                               |
| `pnpm lint:a11y`      | Accessibility lint (alt-text = error, rest = warn)                           |
| `pnpm test`           | Bilingual + og-generator unit tests                                          |
| `pnpm check:spelling` | Spell check content markdown (DE + EN)                                       |
| `pnpm check:links`    | Broken link check on built output                                            |
| `pnpm check:all`      | Spelling + a11y + build + link check (full CI locally)                       |
| `pnpm generate-og`    | Regenerate localized OG sharing images from project data                     |
| `pnpm generate-image` | Generate images via GPT Image (needs `OPENAI_API_KEY`)                       |
| `/brand`              | Replace placeholder favicon and OG image with your own                       |
| `/deploy`             | Interactive Cloudflare Pages deployment setup                                |
| `/new-post`           | Scaffold a bilingual blog post (DE + EN)                                     |
| `/new-team-member`    | Scaffold a bilingual team member entry (DE + EN)                             |
