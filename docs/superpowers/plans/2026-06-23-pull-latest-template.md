# Pull Latest passionfruit Template — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (recommended for this migration) or superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `passionfruit-site` up to the latest upstream template (`upstream/main`, framework v1.1.1 — Astro 7, Sätteri markdown, new collections + components, fixture-leak gate) as a full dogfood demo, while preserving the site's real content, branding, and deployment config.

**Architecture:** The site and `upstream/main` have **unrelated git histories** — there is no merge base, so this is a manual port, not a `git merge`. Strategy: **adopt the upstream tree wholesale onto a branch, then surgically restore the small, enumerable set of site-real files + brand values + config on top.** Taking upstream's i18n/components as the base (rather than merging into the site's) means every new component's i18n keys already exist; the site's copy is layered back via a site-wins deep-merge. The user chose "full dogfood demo": bring the new collections (events, careers, caseStudies, team), their pages, routing, nav, and the template's bilingual demo fixtures; the standalone Features page is dropped in favour of upstream's About/Services pages.

**Tech Stack:** Astro 7 (static), Tailwind v4, TypeScript strict (no `any`), pnpm, `@astrojs/markdown-satteri`, Cloudflare Pages.

## Global Constraints

- Branch + PR only — never push to `main`. Conventional commits (`feat:`/`fix:`/`chore:`/`docs:`).
- Bilingual hard rule: every page/collection entry exists in both DE and EN, paired by `translationKey`. `scripts/check-bilingual.mjs` (prebuild) must pass.
- No `any` in TypeScript. No hex literals in components.
- Fixture-leak gate (`scripts/check-fixtures.mjs`, prebuild): the literal "greenleaf" brand may live in `src/content`, `src/i18n`, `src/data`, `src/pages/design-floor` (fixtures) but **never** in shipped code (`.astro/.ts/.js/.css` under layouts/components/lib/pages). Brand identity in code comes from `site.name` (i18n) + `Astro.site`.
- Preserve site identity verbatim: `site: "https://passionfruit.passion4it.de"` (astro.config), `name: "passionfruit-site"` (package.json), `site.name = "passionfruit"` (i18n), real imprint/privacy/contact content, real blog posts, testimonials, deployment/Brevo/DNS docs.
- Quality gate before PR: `pnpm build` + `pnpm check:all` green, plus a **manual bilingual visual pass of every page** (the known failure mode of a framework sync is a ported component referencing an i18n key that renders blank — the build will NOT catch it; a visual check will).

---

## Reference Lists (the substance of the port)

**SKIP — framework-distribution / template-repo infra, irrelevant or harmful to a site instance (remove after the bulk adopt):**

- `.github/workflows/release.yml`, `.github/workflows/template-cleanup.yml`
- `release-please-config.json`, `.release-please-manifest.json`, `CHANGELOG.md`
- `.claude-plugin/marketplace.json`, `.claude-plugin/plugin.json`
- `.claude/skills/create-passionfruit-site/SKILL.md` (bootstrap-a-new-site skill)
- All upstream-only files under `docs/superpowers/specs/` and `docs/superpowers/plans/` dated `2026-05-28`, `2026-05-29`, `2026-06-08` (the template's own dev history; the site keeps its own `docs/`).

**RESTORE — site-real content/identity that the bulk adopt overwrote with GreenLeaf placeholder (`git checkout main -- <path>`):**

- `src/pages/index.astro`, `src/pages/en/index.astro` (passionfruit homepage)
- `src/content/pages/de/impressum.md`, `src/content/pages/en/imprint.md`
- `src/content/pages/de/datenschutz.md`, `src/content/pages/en/privacy.md`
- `src/content/pages/de/kontakt.md`, `src/content/pages/en/contact.md`
- `src/data/testimonials.ts`

**PATCH — adopt upstream file, restore one site value (Edit):**

- `astro.config.mjs` → set `site: "https://passionfruit.passion4it.de"`
- `package.json` → `name: "passionfruit-site"`, keep site `version`, drop the framework `author`/`homepage`/`bugs`/`repository`/`description` metadata

**MERGE — site-wins deep-merge (jq):**

- `src/i18n/de.json`, `src/i18n/en.json`

**DELETE — orphaned by the Features-page drop:**

- `src/components/pages/features.astro`, `src/components/pages/features.md`
- `src/content/pages/de/funktionen.md`, `src/content/pages/en/features.md`
- `src/assets/pages/features.webp`

**AUTO-SURVIVE — site-only files the bulk adopt leaves untouched (verify present, no action):**

- Site blog posts: `src/content/blog/{de,en}/passionfruit-ist-da|warum-zweisprachig|wie-onboard-funktioniert` (+EN slugs) and `src/assets/blog/*.webp`
- `src/assets/og/bg.png`
- Site `docs/superpowers/` plans/specs (design-floor-port, contact-page-polish, contact-form-consolidation-part-b)

---

## Phase 0: Branch + baseline

**Files:** none (git only).

- [ ] **Step 1: Confirm clean tree + fresh upstream.** Run `git status` (expect clean) and `git fetch upstream`. Record current commit of `main`.
- [ ] **Step 2: Create the work branch.** `git checkout -b feat/pull-latest-template`.
- [ ] **Step 3: Capture a pre-port build baseline** so regressions are attributable. Run `pnpm build` on the untouched branch; note PASS/FAIL. (Expected PASS — this is the known-good starting point.)
- [ ] **Step 4: Commit nothing yet.** Proceed to Phase 1.

## Phase 1: Adopt the upstream tree

**Files:** whole tree (bulk), then remove the SKIP list, then delete the Features orphans.

- [ ] **Step 1: Bulk-adopt upstream.** `git checkout upstream/main -- .` — this overwrites every path present in upstream with upstream's version, adds all upstream-only files, and leaves site-only files untouched. Brings the lockfile too.
- [ ] **Step 2: Remove the SKIP list.** `git rm -r --cached` + delete each path in the SKIP reference list above (use `git rm` for the tracked ones the bulk step just staged; for `.github/workflows/release.yml`, `template-cleanup.yml`, `.claude-plugin/`, `release-please-*`, `CHANGELOG.md`, `.claude/skills/create-passionfruit-site/`, and the dated `docs/superpowers/{specs,plans}/2026-05-28|29 / 06-08` files).
- [ ] **Step 3: Delete the Features orphans** (DELETE reference list).
- [ ] **Step 4: Sanity check the staging.** `git status` — expect: new collection files, new components, new pages, modified config/components staged; SKIP + Features files deleted; site-only content untouched.
- [ ] **Step 5: Do NOT build yet** (deps not installed, site identity not restored). Proceed.

## Phase 2: Restore site identity files

**Files:** RESTORE list + the two PATCH files.

- [ ] **Step 1: Restore site-real content.** `git checkout main -- <each path in the RESTORE list>` (homepage DE+EN, impressum/imprint, datenschutz/privacy, kontakt/contact, testimonials.ts).
- [ ] **Step 2: Patch `astro.config.mjs`** — change the `site` value from upstream's `https://example.com` back to `https://passionfruit.passion4it.de`. Leave the Sätteri `markdown.processor` + `externalLinks` hast plugin from upstream intact.
- [ ] **Step 3: Patch `package.json`** — restore `name: "passionfruit-site"`, keep the site's `version`, and remove the framework-package metadata keys (`description`, `author`, `homepage`, `bugs`, `repository`). Keep all adopted deps, scripts (incl. `check-fixtures` in prebuild/test), `engines`, `packageManager`.
- [ ] **Step 4: Audit the restored homepage for dangling Features links.** `rg -n "funktionen|/features|features\.astro" src/pages/index.astro src/pages/en/index.astro` — repoint any link/CTA to the dropped Features page toward Services (`/leistungen`, `/en/services`) or remove it. (The link checker in Phase 7 is the backstop.)
- [ ] **Step 5: No commit yet** — i18n still needs merging. Proceed.

## Phase 3: i18n site-wins deep-merge

**Files:** `src/i18n/de.json`, `src/i18n/en.json`.

**Interface note:** upstream i18n adds namespaces `about, services, team, events, careers, caseStudies, filter, legal, podcast, video` (GreenLeaf demo values). Site keeps `features` (leftover, harmless — homepage may reference it). Result must be: every upstream key present (so adopted components never render blank) AND every site value preserved (so passionfruit brand/home/legal copy survives). A recursive object merge where the site operand wins on shared leaf keys and arrays are taken from the site achieves both.

- [ ] **Step 1: Stash the upstream-base and site-overlay for each locale.** The bulk adopt (Phase 1) put upstream's i18n at `src/i18n/{de,en}.json`. Obtain the site's version from `git show main:src/i18n/de.json` (and `en.json`).
- [ ] **Step 2: Produce the merged files.** Deep-merge with **upstream as base, site as override** using `jq -s '.[0] * .[1]'` (jq's `*` recursively merges objects, right operand wins; arrays are replaced by the right/site operand). Write the result back to `src/i18n/de.json` and `src/i18n/en.json`. Re-run through `prettier --write` so formatting matches.
- [ ] **Step 3: Verify brand keys survived.** `jq '.site' src/i18n/de.json` must show `name: "passionfruit"` (NOT "Greenleaf Digital"); same for `en.json`. `jq -r 'keys[]' src/i18n/de.json` must include all 10 new upstream namespaces.
- [ ] **Step 4: Verify key parity DE↔EN.** Confirm `jq -r 'paths|join(".")' de.json | sort` and the same for `en.json` produce identical key sets (the bilingual check enforces entry pairing, not i18n key parity — do this manually here).

## Phase 4: Install deps + resolve Astro 7 / Sätteri breakage

**Files:** as surfaced by typecheck/build (expected: none beyond what upstream already fixed, since adopted code is Astro-7-clean; the risk is in the restored site homepage + site blog markdown).

- [ ] **Step 1: Install.** `pnpm install` (picks up Astro 7, `@astrojs/markdown-satteri`, `@astrojs/react@6`, lucide/sharp bumps, `eslint-plugin-astro@2`; drops `rehype-external-links`, `wrangler`). Expect success.
- [ ] **Step 2: Astro sync + typecheck.** `pnpm typecheck`. Fix any type errors in the **restored** site files (homepage, testimonials) against Astro 7 / the new `page-registry.ts` types. The adopted upstream code is already type-clean. No `any`.
- [ ] **Step 3: First build attempt.** `pnpm build`. Likely failure points and fixes:
  - Restored site homepage importing a removed/renamed export → align with the adopted component API.
  - Site blog markdown rendering through Sätteri instead of rehype — external-link behaviour now comes from the `externalLinks` hast plugin in `astro.config.mjs`; verify site posts still render.
  - Upstream demo blog/collection fixtures referencing an asset not present → confirm the asset came in via the bulk adopt (case-study portraits are at `src/assets/case-studies/`); add if missing.
- [ ] **Step 4: Iterate** build → fix → build until green. Do not silence errors; fix at the root.
- [ ] **Step 5: Run unit tests.** `pnpm test` (bilingual, component-docs, **check-fixtures**, og, functions). Expect PASS — the fixture gate passes because GreenLeaf lives only in fixtures, not code.

## Phase 5: Docs reconciliation (self-improvement rule)

**Files:** `CLAUDE.md` (surgical), `STYLE_GUIDE.md`, `CONTRIBUTING.md` (adopt upstream + verify no site delta lost), `README.md`.

**Approach:** the site's `CLAUDE.md` carries hard-won site-specific specifics that upstream's generic version lacks — keep it as the base and **surgically update only the sections the port changes**. For `STYLE_GUIDE.md`/`CONTRIBUTING.md` (framework docs that now document the new collections), adopt upstream's version (already staged by Phase 1), then diff against `main` to confirm no site-specific paragraph was lost.

- [ ] **Step 1: Update `CLAUDE.md` §1 (page set)** — replace the lean page list with the new full-dogfood set: Home, About, Services, Blog, Events, Case-Studies, Team, Careers, Contact, Imprint, Privacy. Remove the "No About, no Team" line.
- [ ] **Step 2: Update `CLAUDE.md` §4 (tech stack)** — Astro 7, `@astrojs/markdown-satteri` as the Markdown engine, drop the `rehype-external-links` mention (now a Sätteri hast plugin).
- [ ] **Step 3: Update `CLAUDE.md` §6 (content workflows)** — document the new collections (team, careers, events, caseStudies): paths `src/content/<collection>/{de,en}/`, required frontmatter (from `src/content.config.ts`), and the bilingual rule.
- [ ] **Step 4: Update `CLAUDE.md` §11 (routing)** — update the `PAGES`/`PageKey` description and localized slugs (`/ueber-uns↔/en/about`, `/leistungen↔/en/services`, `/veranstaltungen↔/en/events`, `/referenzen↔/en/case-studies`, `/team`, `/karriere↔/en/careers`).
- [ ] **Step 5: Update `CLAUDE.md` §14 (quality tooling)** — add the fixture-leak gate (`scripts/check-fixtures.mjs`, prebuild).
- [ ] **Step 6: Update `CLAUDE.md` §17 (commands) + §7 (skills list)** — reflect the adopted skill set (skills now live at `.claude/skills/<name>/SKILL.md`; add `passionfruit-content`; add any new scaffold commands).
- [ ] **Step 7: Preserve site-specific sections verbatim** — confirm §10 (contact form Brevo + passion4it.de DNS), §15 (Cloudflare deployment + GitHub secrets), and the §1 "this is the marketing site / ship-upstream-first" framing are intact.
- [ ] **Step 8: Verify `STYLE_GUIDE.md`/`CONTRIBUTING.md`** — `git diff main -- STYLE_GUIDE.md CONTRIBUTING.md README.md`; confirm the adopted versions don't drop any passion4it-specific content. Re-apply if they do.

## Phase 6: Regenerate OG images

**Files:** `public/og-default-de.png`, `public/og-default-en.png`.

- [ ] **Step 1: Regenerate** with `pnpm generate-og` — pulls `site.name`/`site.tagline` (passionfruit, from the merged i18n), accent colour, favicon, and optional `src/assets/og/bg.png`. Produces passionfruit-branded OG images, overwriting upstream's GreenLeaf ones.
- [ ] **Step 2: Confirm both locale PNGs exist** (the bilingual check fails if one is present without the other).

## Phase 7: Full verification gate + bilingual visual pass

**Files:** none (verification + targeted fixes).

- [ ] **Step 1: Full local CI.** `pnpm check:all` (spelling + a11y + build + link check). Expect PASS. The link checker catches any surviving `/funktionen` reference — fix at the source.
- [ ] **Step 2: Spelling.** New GreenLeaf demo fixtures may introduce unknown words → add legitimate ones to `project-words.txt`.
- [ ] **Step 3: Bilingual visual pass — the critical, build-invisible check.** `pnpm preview` (or `pnpm dev`) and walk **every** page in **both** locales: Home, About, Services, Blog (+ a post), Events (+ detail), Case-Studies (+ detail), Team, Careers (+ detail), Contact, Imprint, Privacy, plus the 404/500 pages. Look specifically for **blank/empty rendered strings** (the symptom of an adopted component reading an i18n key the site-wins merge happened to override with an incompatible shape). For each blank, fix the offending key in `src/i18n/{de,en}.json`.
- [ ] **Step 4: Verify nav + header.** Confirm the header renders the new page set with correct DE/EN labels and no dead "Funktionen" entry; confirm the mobile menu still shows a solid background (recent fix #19).
- [ ] **Step 5: Verify identity-critical pages** render the **real** content: Imprint = PASSION4IT GmbH; Privacy = passionfruit.passion4it.de; Contact = real form; Home = passionfruit copy (not GreenLeaf).
- [ ] **Step 6: Mobile check at 375px** — layout intact on Home + one collection index + one detail page.

## Phase 8: Commit + PR

**Files:** none (git + gh).

- [ ] **Step 1: Stage in reviewable commits.** Suggested grouping (squash-merged later, so internal granularity is for review clarity): (a) `chore(deps): adopt upstream template v1.1.1 — Astro 7 + Sätteri + deps`; (b) `feat(collections): events, careers, case-studies, team + components, pages, fixtures`; (c) `feat(framework): adopt upstream components, layouts, scripts, error pages, skills`; (d) `fix(site): restore passionfruit content, branding, i18n, OG, deployment config`; (e) `docs: sync CLAUDE/STYLE_GUIDE/CONTRIBUTING with new structure`.
- [ ] **Step 2: Final pre-PR build.** `pnpm build` green.
- [ ] **Step 3: Push** `git push -u origin feat/pull-latest-template`.
- [ ] **Step 4: Open PR** `gh pr create --fill`; in the body, call out: unrelated-history manual port, full-dogfood scope, Features page dropped, GreenLeaf demo fixtures are placeholder (re-run `/onboard` or rebrand later), and the items deliberately skipped (release automation, template-cleanup, `.claude-plugin`).
- [ ] **Step 5: Review the Cloudflare preview** URL from the PR bot comment — repeat the Phase 7 visual spot-check on the deployed preview before squash-merging.

---

## Self-Review (against the chosen scope)

- **Astro 7 + deps:** Phase 4. **Sätteri markdown + external-links plugin:** adopted in Phase 1, verified Phase 4 Step 3. ✅
- **New collections + components + pages + fixtures + routing + nav (full dogfood):** Phase 1 (adopt) + Phase 7 (verify). ✅
- **Fixture-leak gate / check-fixtures:** adopted Phase 1, runs in Phase 4 Step 5. ✅
- **404/500 error pages, structured-data, skills restructure:** adopted Phase 1, verified Phase 7. ✅
- **Preserve real content (imprint/privacy/contact/testimonials/blog) + branding (site.name, site URL, package name) + OG:** Phases 2, 3, 6. ✅
- **i18n missing-key risk (memory note):** mitigated by upstream-base merge (Phase 3) + mandatory visual pass (Phase 7 Step 3). ✅
- **Dropped Features dangling links:** Phase 2 Step 4 + Phase 7 Step 1 (linkinator). ✅
- **Docs in sync (self-improvement rule):** Phase 5. ✅
- **Deliberately skipped infra (release/template-cleanup/.claude-plugin/bootstrap skill):** SKIP list, Phase 1 Step 2, disclosed in PR. ✅
