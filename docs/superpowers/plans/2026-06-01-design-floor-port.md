# Design-Floor Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring this site onto the framework's "design floor" — editorial type/motion/state CSS + tokens, shared `Section`/`Prose`/motion/state primitives, the full section-archetype library with an honest consumer, a few clean-fit archetype adoptions on real pages, and the docs/skills — without regressing the bespoke marketing pages or clobbering brand identity.

**Architecture:** Single PR on branch `feat/design-floor-port`, structured into four commit layers (Foundation → Archetypes+fixtures → Real-page adoption → Docs+skills), ordered by dependency. This is a **port**: most files are copied verbatim from the upstream framework checkout; a handful are surgically merged. Token merge is additive-only (keep every brand value, add new capability tokens).

**Tech Stack:** Astro 6 (static), Tailwind v4 (`@theme` in `src/styles/global.css`), TypeScript strict, pnpm, `@lucide/astro`, `@fontsource-variable/inter`.

---

## Conventions for this plan (read first)

- **No code snippets in this document** (per project CLAUDE.md, which overrides the writing-plans "show the code" default). Because this is a port, every "add" step names an **exact upstream source path** and an **exact local destination path** — copy the file verbatim and read it at implementation time. Every "modify" step gives exact file paths, line ranges, token/identifier names, and the precise nature of the edit. No code is reproduced here; it would only go stale against the source.
- **Source repo (read-only):** `/Users/mordras/dev/passion4it/passionfruit/` — referred to below as **UPSTREAM**. Verified at upstream commit `343d058` (Spec 1 #29 + Spec 2 #32 + #33 cleanups landed).
- **Destination repo:** `/Users/mordras/dev/passion4it/passionfruit-site/` — referred to as **LOCAL** (cwd). Branch `feat/design-floor-port` already exists with the spec committed (`7a45957`).
- **Commit trailer:** end every commit message with the same `Co-Authored-By:` trailer used on commit `7a45957` (check it with `git show -s --format=%B 7a45957` before the first commit, and reuse it verbatim). Conventional-commit subjects are enforced by commitlint.
- **Verification, not unit tests:** these are presentational Astro components and CSS. Adding unit tests for them would be overengineering. The verification gate per task is `pnpm typecheck` / `pnpm build` / `pnpm check:links` / dev-server visual checks, plus the existing `pnpm test` (bilingual + OG) which must stay green. Do not fabricate component unit tests.
- **Lefthook** runs lint-staged (eslint/prettier/cspell) + commitlint on every commit; prettier will reformat copied files — expected, do not fight it.

## Ground truth established during planning (do not re-investigate)

1. **`@theme` merge is additive.** Shared token _names_ are identical across repos, but two groups of shared tokens hold **different values** — keep LOCAL values for both:
   - Type scale: `--text-display`, `--text-h1`, `--text-h2`, `--text-h3`, `--text-body-lg` (local is the larger 3→5.5rem family; upstream is smaller). **Keep local.**
   - Transitions: `--transition-fast/normal/slow` (local literals 150/300/500ms; upstream redirected them to `--duration-*`). **Keep local literals.** None of the new CSS sheets reference `--transition-*`, so keeping them is safe.
   - Eases `--ease-default/spring/bounce` already exist locally — **keep**, do not duplicate.
2. **Upstream global.css moved `body` + `h1–h6` base styling into `typography.css`.** Therefore LOCAL `global.css` must **drop** its `@layer base` `body{}` and `h1–h6{}` blocks (typography.css owns them) and **keep** `a`, `a:hover`, `::selection`.
3. **`motion.css` is a strict superset of `scroll-animations.css`.** Every local class/keyframe (`anim-*`, `hero-stagger`/`hero-reveal`, `glow-orb`/`glow-pulse`, `in-view`, all six keyframes, both `@supports` blocks, reduced-motion block) is present verbatim upstream. Deleting `scroll-animations.css` loses nothing.
4. **`@fontsource-variable/inter/opsz.css` exists in LOCAL `node_modules`** and is the optical-sizing variable file. The font-import switch is safe; no fallback needed (closes spec risk #3).
5. **FAQ archetype is drop-in.** `FAQProps extends SectionProps` with `items: FAQItem[]`, `FAQItem = { question: string; answer: string }` — identical field names to LOCAL `getFAQs()`/`faqs.ts`/`FAQs.astro`. Native `<details>` accordion, no JS, purely prop-driven. Reuse existing `home.faq.title` as the `headline` prop → **no new i18n keys**.
6. **MagazineGrid does NOT fit the home "how it works" section** (3 uniform icon+step cards, no images; `MagazineGridCell` is `{size, headline, lede?, image?, imageAlt?, href?}` — image/size-driven, no icon). **Decision: leave "how it works" bespoke.** MagazineGrid's only consumer is the fixture.
7. **No new i18n keys required anywhere.** `comparison.feature/yes/no` (used by Comparison archetype) and `state.loading` (used by Skeleton) already exist in both `de.json`/`en.json`. Archetypes are otherwise prop-driven; `EmptyState`/`ErrorState` take all text via props.
8. **Fixtures are dev-only** — each `design-floor/*.astro` redirects to `/` when `!import.meta.env.DEV`, sets `noindex={true}` (LOCAL `BaseLayout` already supports the `noindex` prop, same name as upstream), and is absent from the sitemap by construction (`sitemap.xml.ts` emits only `PAGES` + the `blog` collection). Triple SEO protection. Keep upstream's behavior verbatim.
9. **Fixture asset reconciliation:** `design-floor/sections.astro` is the only fixture importing assets. Six of nine import paths exist locally. The three missing are `~/assets/case-studies/portrait-manufacturing.png`, `~/assets/case-studies/portrait-shopify.png`, `~/assets/case-studies/logo-consulting.png`. Repoint to assets we carry; **do not create a `case-studies/` dir** (that collection is a non-goal).
10. **Primitive/archetype dependencies all satisfiable:** `Section`/`Prose` have zero `~/` deps; archetypes depend only on `Section`, `Button` (exists), `@lucide/astro`, `astro:assets`, and the existing `comparison.*` keys; `EmptyState` depends on `Button`. Nothing pulls a non-goal component.
11. **The three skills cross-reference an unported `passionfruit-content` skill.** Porting that 4th skill is out of spec scope and overlaps the in-flight sidecar initiative. **Adapt** the cross-references to point at LOCAL `CLAUDE.md` (§5 Bilingual, §6 Content workflows) instead, so no reference dangles.

## File structure

**Created — copied verbatim from UPSTREAM (paths identical unless noted):**

- `src/types/motion.ts`, `src/types/sections.ts`
- `src/styles/motion.css`, `src/styles/typography.css`, `src/styles/state.css`
- `src/components/Prose.astro` + `Prose.md`, `src/components/Section.astro` + `Section.md`
- `src/components/motion/{FadeIn,FadeUp,Motion}.astro` + their `.md`
- `src/components/state/{Skeleton,EmptyState,ErrorState}.astro` + their `.md`
- `src/components/sections/{AsymmetricHero,MagazineGrid,StickyStory,EditorialQuote,SplitFeature,Trust,Comparison,FAQ}.astro` + their `.md`
- `src/pages/design-floor/{index,type,motion,sections,state}.astro`
- `.claude/skills/passionfruit-design.md`, `passionfruit-a11y.md`, `passionfruit-perf.md` (from UPSTREAM `.claude/skills/<name>/SKILL.md`, flattened)

**Modified (surgical):**

- `src/styles/global.css` — font import, CSS imports, `@theme` token additions, remove base `body`/`h1–h6` blocks
- `src/components/BlogPost.astro` — wrap body in `<Prose dropCap>`
- `src/components/PageContent.astro` — wrap body in `<Prose>`
- `src/pages/index.astro`, `src/pages/en/index.astro` — swap bespoke FAQ section for `<FAQ>` archetype
- `STYLE_GUIDE.md` — adopt upstream structure + new-surface docs, preserve brand values
- `CLAUDE.md` — §7, §8, and quality-checklist STYLE_GUIDE references

**Deleted:**

- `src/styles/scroll-animations.css`
- `src/components/FAQs.astro`

---

## LAYER 1 — Foundation

### Task 1: Port type contracts

**Files:**

- Create: `src/types/motion.ts` (from UPSTREAM `src/types/motion.ts`)
- Create: `src/types/sections.ts` (from UPSTREAM `src/types/sections.ts`)

- [ ] **Step 1:** Copy UPSTREAM `src/types/motion.ts` → LOCAL `src/types/motion.ts` verbatim. (Exports `MotionProps`: `effect?`, `delay?`, `duration?`, `threshold?`, `once?`.)
- [ ] **Step 2:** Copy UPSTREAM `src/types/sections.ts` → LOCAL `src/types/sections.ts` verbatim. (Exports `SectionFrameProps`, `SectionProps`, the eight archetype prop interfaces, and the item types incl. `FAQItem = {question, answer}`. Imports only `import type { ImageMetadata } from "astro"`.)
- [ ] **Step 3:** Run `pnpm typecheck`. Expected: PASS (the files are inert — nothing imports them yet — and must compile clean under strict TS).
- [ ] **Step 4:** Commit. Subject: `feat(types): add motion and section type contracts`. Stage only the two new files.

### Task 2: CSS foundation + `@theme` token merge

**Files:**

- Create: `src/styles/motion.css` (from UPSTREAM `src/styles/motion.css`)
- Create: `src/styles/typography.css` (from UPSTREAM `src/styles/typography.css`)
- Create: `src/styles/state.css` (from UPSTREAM `src/styles/state.css`)
- Delete: `src/styles/scroll-animations.css`
- Modify: `src/styles/global.css`

- [ ] **Step 1:** Copy UPSTREAM `src/styles/motion.css`, `typography.css`, `state.css` → LOCAL `src/styles/` (same names), verbatim.
- [ ] **Step 2:** Delete LOCAL `src/styles/scroll-animations.css`.
- [ ] **Step 3:** Edit `src/styles/global.css` line 1: change `@import "@fontsource-variable/inter";` → `@import "@fontsource-variable/inter/opsz.css";`.
- [ ] **Step 4:** Edit `src/styles/global.css` line 3: replace the single `@import "./scroll-animations.css";` with three imports in this order — `./motion.css`, `./typography.css`, `./state.css` — so the import block reads: opsz font, `tailwindcss`, motion, typography, state (mirrors UPSTREAM global.css lines 1–5).
- [ ] **Step 5:** Edit `src/styles/global.css` `@theme` block — **add** the following token groups, copying the exact declarations from UPSTREAM `src/styles/global.css` at the cited lines. Add them; do **not** modify or remove any existing local token.
  - Type sizes — UPSTREAM lines 43–46: `--text-body`, `--text-body-sm`, `--text-caption`, `--text-eyebrow`. (Keep local `--text-display/-h1/-h2/-h3/-body-lg` untouched.)
  - Leading — UPSTREAM lines 49–52: `--leading-display`, `--leading-heading`, `--leading-body`, `--leading-caption`.
  - Durations — UPSTREAM lines 81–84: `--duration-instant`, `--duration-quick`, `--duration-base`, `--duration-slow`.
  - Easings (new only) — UPSTREAM lines 93–96: `--ease-standard`, `--ease-emphasized`, `--ease-enter`, `--ease-exit`. **Do NOT** copy UPSTREAM lines 86–90 (the `--transition-*`→duration redirects) or 98–101 (`--ease-default/spring/bounce` back-compat) — local already has those literals; keeping them is the brand decision.
  - Section padding — UPSTREAM lines 104–106: `--space-section-sm/-md/-lg`.
  - Skeleton + state — UPSTREAM lines 109–113: `--color-skeleton-base`, `--color-skeleton-shimmer`, `--color-state-warning`, `--color-state-error`, `--color-state-info`.
  - Overlay scrim — UPSTREAM lines 118–120: `--color-overlay-scrim-strong/-mid/-clear`.
  - Shadow lift — UPSTREAM line 124: `--color-shadow-lift`.
  - Grid — UPSTREAM lines 127–130: `--grid-cols-12`, `--grid-gap-sm/-md/-lg`.
- [ ] **Step 6:** Edit `src/styles/global.css` `@layer base` (local lines ~86–122): **remove** the `body { … }` block (local ~87–95) and the `h1,h2,h3,h4,h5,h6 { … }` block (local ~97–108) — `typography.css` now owns both. **Keep** the `a` / `a:hover` rules and the `::selection` rule. Leave all `@layer components` / `@layer utilities` blocks (`.container`, `.card`, `.glass*`, `.btn-glow`, `.text-*`, `.gradient-text`, `.eyebrow`, `.bg-grid`, `.noise`) exactly as-is.
- [ ] **Step 7:** Run `pnpm typecheck` then `pnpm build`. Expected: PASS. (If the CSS fails to resolve a token, a referenced `--leading-*`/`--text-*`/`--duration-*`/`--ease-*`/`--color-*`/`--space-section-*`/`--grid-*` token is missing from Step 5 — fix and rebuild.)
- [ ] **Step 8:** Start `pnpm dev`. Visually check at 375px and desktop: **home** and **features** (`/funktionen/`, `/en/features/`) — confirm **no layout regression** (type sizes, hero, cards, spacing, animations unchanged-to-similar). Blog/pages prose is expected to be unchanged at this point (Prose not yet applied). Spot-check home hero stagger, card-enter, scroll reveals still play (accept minor timing changes from the new `--duration-*`/`--ease-*` rebasing; fix only true regressions).
- [ ] **Step 9:** Commit. Subject: `feat(styles): adopt design-floor CSS foundation and merge theme tokens`. Stage the three new CSS files, the deleted `scroll-animations.css`, and `global.css`.

### Task 3: Port primitives (Section, Prose, motion, state)

**Files:**

- Create: `src/components/Section.astro` + `Section.md`
- Create: `src/components/Prose.astro` + `Prose.md`
- Create: `src/components/motion/{FadeIn,FadeUp,Motion}.astro` + their `.md`
- Create: `src/components/state/{Skeleton,EmptyState,ErrorState}.astro` + their `.md`

- [ ] **Step 1:** Copy UPSTREAM `src/components/Section.astro` + `Section.md` and `src/components/Prose.astro` + `Prose.md` → LOCAL same paths, verbatim. (Both primitives have zero `~/` deps and no i18n.)
- [ ] **Step 2:** Copy UPSTREAM `src/components/motion/` (`Motion.astro`+`.md`, `FadeIn.astro`+`.md`, `FadeUp.astro`+`.md`) → LOCAL `src/components/motion/`, verbatim. (They import `~/types/motion` from Task 1 and rely on `motion.css` `[data-motion-*]` rules from Task 2.)
- [ ] **Step 3:** Copy UPSTREAM `src/components/state/` (`Skeleton.astro`+`.md`, `EmptyState.astro`+`.md`, `ErrorState.astro`+`.md`) → LOCAL `src/components/state/`, verbatim. (`Skeleton` imports `~/i18n` and uses `state.loading` — already present in both locales; `EmptyState` imports `~/components/Button.astro` — present.)
- [ ] **Step 4:** Run `pnpm typecheck`. Expected: PASS. (Confirms `~/types/motion`, `~/i18n` `state.loading`, and `Button` all resolve.)
- [ ] **Step 5:** Run `pnpm lint:a11y`. Expected: PASS (no alt-text/a11y errors introduced by the primitives).
- [ ] **Step 6:** Commit. Subject: `feat(components): add Section, Prose, motion and state primitives`. Stage `src/components/Section.*`, `Prose.*`, `motion/`, `state/`.

### Task 4: Apply Prose to long-form bodies

**Files:**

- Modify: `src/components/BlogPost.astro` (local body markup ~lines 92–94)
- Modify: `src/components/PageContent.astro` (local body markup ~lines 36–38)

- [ ] **Step 1:** In `src/components/BlogPost.astro`: add `import Prose from "~/components/Prose.astro";` to the frontmatter, and wrap the existing `<Content />` (inside `<article class="blog-prose max-w-3xl mx-auto">`) in `<Prose dropCap>…</Prose>` — matching UPSTREAM `BlogPost.astro`. Keep the existing `blog-prose.css` import and the `<article>` wrapper.
- [ ] **Step 2:** In `src/components/PageContent.astro`: add `import Prose from "~/components/Prose.astro";`, and wrap `<Content />` (inside `<article class="blog-prose">`) in `<Prose>…</Prose>` (no `dropCap`) — matching UPSTREAM `PageContent.astro`. Keep the `blog-prose.css` import.
- [ ] **Step 2.5:** Skim `src/styles/blog-prose.css` for rules that now overlap what `Prose` owns (drop-cap, max-measure, paragraph spacing/`p + p`). If a rule duplicates Prose's behavior and causes a visible double-up in Step 4, remove the duplicated `blog-prose.css` rule (Prose wins); otherwise leave `blog-prose.css` intact. Resolve only actual conflicts — no speculative deletion. (Closes spec risk #5.)
- [ ] **Step 3:** Run `pnpm build`. Expected: PASS.
- [ ] **Step 4:** `pnpm dev` visual check at 375px + desktop on one blog post and one content page (e.g. imprint/privacy): the editorial drop-cap renders on the blog post, measure is capped, and the body reads well. This is an **intended** improvement, not a regression. Confirm no broken layout, no double drop-cap, no specificity fight with `blog-prose.css`.
- [ ] **Step 5:** Commit. Subject: `feat(components): render blog and page bodies through Prose`. Stage `BlogPost.astro`, `PageContent.astro`, and `blog-prose.css` if touched.

---

## LAYER 2 — Archetype library + honest demo

### Task 5: Port the section archetype library

**Files:**

- Create: `src/components/sections/{AsymmetricHero,MagazineGrid,StickyStory,EditorialQuote,SplitFeature,Trust,Comparison,FAQ}.astro` + each one's `.md` sidecar

- [ ] **Step 1:** Copy all eight UPSTREAM `src/components/sections/*.astro` files **and** their eight `.md` sidecars → LOCAL `src/components/sections/`, verbatim. (Deps: each imports `~/types/sections` + `~/components/Section.astro`; `AsymmetricHero`/`SplitFeature` also import `Button`; `Comparison` imports `~/i18n` and uses `comparison.feature/yes/no` — present in both locales; `EmptyState`/state are not used here.)
- [ ] **Step 2:** Run `pnpm typecheck`. Expected: PASS (archetypes compile against the Task-1 types and existing components; they are not yet consumed by any page, so this only proves they type-check).
- [ ] **Step 3:** Run `pnpm lint:a11y`. Expected: PASS.
- [ ] **Step 4:** Commit. Subject: `feat(sections): add the design-floor archetype library`. Stage `src/components/sections/`.

### Task 6: Port the `/design-floor/` fixtures (the honest consumer)

**Files:**

- Create: `src/pages/design-floor/{index,type,motion,sections,state}.astro`
- Modify (during copy): `src/pages/design-floor/sections.astro` asset imports

- [ ] **Step 1:** Copy UPSTREAM `src/pages/design-floor/{index,type,motion,sections,state}.astro` → LOCAL same paths, verbatim. Preserve each file's `import.meta.env.DEV` redirect guard and `<BaseLayout noindex={true}>`.
- [ ] **Step 2:** In LOCAL `src/pages/design-floor/sections.astro`, repoint the three missing asset imports to assets this repo carries (do NOT add a `case-studies/` dir):
  - `~/assets/case-studies/portrait-manufacturing.png` → `~/assets/team/max.png`
  - `~/assets/case-studies/portrait-shopify.png` → `~/assets/team/anna.png`
  - `~/assets/case-studies/logo-consulting.png` → `~/assets/home/hero.png` (landscape, fits the `Trust` logo slot)
    Leave the six valid imports (`home/hero.png`, `blog/ai-websites.png`, `blog/digital-transformation.png`, `team/anna.png`, `team/lena.png`, `team/max.png`) unchanged. Adjust any now-inaccurate `imageAlt`/alt text on those three so it honestly describes the substituted image (a11y: alt must match content).
- [ ] **Step 3:** Run `pnpm typecheck` then `pnpm build`. Expected: PASS (all asset imports resolve; archetypes render).
- [ ] **Step 4:** `pnpm dev` and load `/design-floor/`, `/design-floor/type`, `/design-floor/motion`, `/design-floor/sections`, `/design-floor/state`. Confirm each renders, every archetype/primitive shows, and the three substituted images appear. Confirm each page emits `<meta name="robots" content="noindex,nofollow">` (view source).
- [ ] **Step 5:** In the production build output (`dist/`), confirm `dist/sitemap.xml` contains **no** `/design-floor/` URL, and that `dist/design-floor/*` are redirect stubs to `/` (dev-only guard). Run `pnpm check:links`. Expected: PASS (no broken internal links).
- [ ] **Step 6:** Run `pnpm lint:a11y`. Expected: PASS (alt text correct on all fixture imagery after Step 2).
- [ ] **Step 7:** Commit. Subject: `feat(design-floor): add archetype fixture pages`. Stage `src/pages/design-floor/`.

---

## LAYER 3 — Consume archetypes on real pages (clean fits only)

### Task 7: Adopt the FAQ archetype on home; remove the bespoke FAQs component

**Files:**

- Modify: `src/pages/index.astro` (FAQ section, local ~lines 185–195)
- Modify: `src/pages/en/index.astro` (same section)
- Delete: `src/components/FAQs.astro`

- [ ] **Step 1:** In `src/pages/index.astro`: replace the import `import FAQs from "~/components/FAQs.astro";` with `import FAQ from "~/components/sections/FAQ.astro";`. Keep `import { getFAQs } from "~/data/faqs";` and `const faqItems = getFAQs(lang)`.
- [ ] **Step 2:** In `src/pages/index.astro`: replace the bespoke FAQ `<section>` (the `py-28 md:py-40` block that renders an outer `<h2>{t("home.faq.title")}</h2>` and `<FAQs items={faqItems} />`) with a single `<FAQ headline={t("home.faq.title")} items={faqItems} />`. The archetype supplies its own `Section` frame (`tone="surface"`, `padding="lg"`, `container="narrow"`) and heading — do not wrap it in another `<section>`/`<h2>`. Do **not** pass `eyebrow`/`lede` (no new i18n keys; keep the swap minimal and honest).
- [ ] **Step 3:** Apply the identical change to `src/pages/en/index.astro` (same import swap + same `<FAQ headline={t("home.faq.title")} items={faqItems} />`). Both locales change in lockstep.
- [ ] **Step 4 (MagazineGrid decision — documented, no code):** Leave the "how it works" three-card section bespoke. It is **not** a clean MagazineGrid fit (uniform icon+step cards, no images; `MagazineGridCell` is image/size-driven with no icon field). MagazineGrid's consumer remains the `/design-floor/sections` fixture. No edit in this step — this checkbox records the decision so it isn't revisited.
- [ ] **Step 5:** Verify nothing else references `FAQs.astro`: run `rg "components/FAQs" src` — expect zero matches. Then delete `src/components/FAQs.astro`.
- [ ] **Step 6:** Run `pnpm build`. Expected: PASS (bilingual check included — both locales still symmetric).
- [ ] **Step 7:** `pnpm dev` visual + interaction check: home in **both** DE (`/`) and EN (`/en/`) — the FAQ accordion renders, the `<details>` open/close works, and the section heading/spacing read correctly at 375px + desktop. Note the section frame may differ slightly from the old bespoke spacing (`container="narrow"` + `padding="lg"`); that is the accepted adoption change. If it reads too bare without an eyebrow, the contingency is to add `home.faq.eyebrow` to **both** `de.json` and `en.json` in lockstep and pass `eyebrow={t("home.faq.eyebrow")}` — only if needed.
- [ ] **Step 8:** Run `pnpm check:links`. Expected: PASS.
- [ ] **Step 9:** Commit. Subject: `feat(home): adopt FAQ archetype, remove bespoke FAQs component`. Stage both `index.astro` files and the deleted `FAQs.astro` (and the two i18n files only if the eyebrow contingency was used).

---

## LAYER 4 — Docs + Claude skills

### Task 8: Rewrite STYLE_GUIDE onto the upstream structure (preserve brand values)

**Files:**

- Modify: `STYLE_GUIDE.md`

- [ ] **Step 1:** Adopt UPSTREAM `STYLE_GUIDE.md`'s structure as the new skeleton: intro (auto-load note + Decision Shortcuts pointer + "this guide wins"), `Design Philosophy`, §1–§9 with the per-section **Use when / Don't use when** framing and **Pattern vs. anti-pattern** blocks, plus the new **§10 Social proof** (`<Trust>`/`<Comparison>`), **§11 Media embeds**, **§12 State surfaces** (`<Skeleton>`/`<EmptyState>`/`<ErrorState>`), and the closing **Decision Shortcuts** table. Bring in the new subsections: §2 `### Long-form Markdown (<Prose>)`, §5 `### Section frame and archetypes`, §6 `### Motion primitives`.
- [ ] **Step 2 (brand-drift guard — critical):** In §2 "Fluid Type Scale", use **LOCAL** clamp values, not upstream's: `.text-display` 3→5.5rem, `.text-h1` 2.25→3.5rem, `.text-h2` 1.75→2.75rem, `.text-h3` 1.25→1.75rem, `.text-body-lg` 1.0625→1.25rem. (Our `@theme` kept these; upstream's guide documents its smaller scale — that would contradict our CSS.)
- [ ] **Step 3 (brand-value verification):** Row-by-row confirm every preserved brand value survived the rewrite verbatim: the 13 color hexes (§1), tracking tokens (`-0.025`/`-0.04`/`-0.05em`) and eyebrow spec (§2), the 3×2 button variant×tone matrix + 44px touch target + `--radius-md` + `focus-visible:ring-2 ring-accent ring-offset-2` (§3), "one card per content type / no generic `<Card>`" + `.card`/`.glass` specs (§4), container `76rem` + section spacing + breakpoints (§5), the dark-section `noise`/`bg-grid`/`glow-orb` markup + stagger 100/200/400/600ms + spring `cubic-bezier(0.16,1,0.3,1)` (§6/§7), WCAG-AA/skip-link/heading-order (§8), Lucide sizes + icon container + the 5-row image aspect table (§9). In §1, additionally mention the new `--color-overlay-scrim-*` and `--color-shadow-lift` tokens (use these instead of raw `rgba()`).
- [ ] **Step 4:** Run `pnpm lint` (prettier will format the markdown). Read the rendered file top-to-bottom once to confirm no upstream-specific value (e.g. the smaller type scale, or any framework-only collection reference) leaked in, and that every section reads coherently.
- [ ] **Step 5:** Commit. Subject: `docs(style-guide): adopt design-floor structure and surface docs`. Stage `STYLE_GUIDE.md`.

### Task 9: Port the three Claude skills and update CLAUDE.md

**Files:**

- Create: `.claude/skills/passionfruit-design.md`, `.claude/skills/passionfruit-a11y.md`, `.claude/skills/passionfruit-perf.md`
- Modify: `CLAUDE.md` (§7 lines ~65–72, §8 lines ~74–84, checklist line ~115)

- [ ] **Step 1:** For each of UPSTREAM `.claude/skills/{passionfruit-design,passionfruit-a11y,passionfruit-perf}/SKILL.md`, create the flat LOCAL file `.claude/skills/<name>.md`: copy the YAML frontmatter (`name`, `description` — same two keys local flat skills already use) and the body verbatim.
- [ ] **Step 2 (dangling-ref fix):** In all three new skill bodies, rewrite any "Where to look" / cross-reference pointer to the unported `passionfruit-content` skill so it points at LOCAL equivalents instead: `CLAUDE.md` §5 (Bilingual rule) and §6 (Content workflows), and `CONTRIBUTING.md`. Verify no remaining mention of `passionfruit-content` in the three files (`rg "passionfruit-content" .claude/skills`). Keep references to `STYLE_GUIDE.md`, `public/_headers`, `postbuild-headers.mjs`, `BaseLayout.astro`, `pnpm lint:a11y` (all valid locally).
- [ ] **Step 3:** Edit `CLAUDE.md` §8 (Styling) lead line: extend the SSOT list from "colors, typography, buttons, cards, layout, and accessibility" to also cover **social proof, media embeds, and state surfaces**, and mention the **Decision Shortcuts** cheat sheet. Keep the "Read `STYLE_GUIDE.md` before touching any UI" instruction.
- [ ] **Step 4:** Edit `CLAUDE.md` §7 (Component conventions): add bullets for the new primitives (`<Section>`, `<Prose>`, `<Motion>`/`<FadeUp>`/`<FadeIn>`), the section-archetype library (`AsymmetricHero`, `MagazineGrid`, `StickyStory`, `EditorialQuote`, `SplitFeature`, `Trust`, `Comparison`, `FAQ`), and the state surfaces (`Skeleton`, `EmptyState`, `ErrorState`). Note that the three `passionfruit-*` skills auto-load on design/a11y/perf work.
- [ ] **Step 5:** Confirm the §11 quality-checklist line `- [ ] Changes align with STYLE_GUIDE.md` still points at the rewritten guide (no edit needed unless wording references removed sections).
- [ ] **Step 6:** Run `pnpm build`. Expected: PASS (docs/skills changes are inert to the build; this confirms nothing broke).
- [ ] **Step 7:** Commit. Subject: `docs(skills): add design/a11y/perf skills and update CLAUDE.md`. Stage the three skill files and `CLAUDE.md`.

---

## Final verification + PR

### Task 10: Full-suite verification and open the PR

- [ ] **Step 1:** Run `pnpm test`. Expected: PASS (bilingual + OG-generator tests unchanged and green).
- [ ] **Step 2:** Run `pnpm check:all` (spelling + a11y + build + link check — the full local CI). Expected: PASS. If cspell flags a new word from STYLE_GUIDE/skills, add it to `project-words.txt`.
- [ ] **Step 3:** Final visual parity pass (`pnpm dev`, 375px + desktop): home + features show **no regression**; blog/pages show the **intended** editorial prose; both-locale FAQ accordion works; all five `/design-floor/*` fixtures render in dev. Capture before/after screenshots of home + one blog post + features for the PR description.
- [ ] **Step 4:** Update CLAUDE.md/STYLE_GUIDE/CONTRIBUTING for any reality drift discovered during implementation (self-improvement rule) — e.g. if blog-prose.css rules were removed in Task 4, or the FAQ eyebrow contingency was used. Commit any such doc fix separately: `docs: sync project docs with design-floor port`.
- [ ] **Step 5:** Push the branch: `git push -u origin feat/design-floor-port`.
- [ ] **Step 6:** Open the PR: `gh pr create --fill` (or with a written body). PR body must: summarize the four layers; state the two adoption decisions (FAQ adopted on home; MagazineGrid intentionally not — fixture-only consumer); list the non-goals deliberately excluded; embed the before/after screenshots; note the dev-only fixtures + noindex + sitemap exclusion. End the body with the Claude Code generation line.
- [ ] **Step 7:** Confirm CI passes and the Cloudflare preview deploys; review the preview URL from the PR bot comment, paying attention that `/design-floor/*` redirect to `/` in the preview (prod build) while the real pages render correctly. Leave the PR for squash-merge per the project git workflow.

---

## Self-review (run against the spec)

**Spec coverage — every spec section maps to a task:**

- Layer 1 Foundation (typography/state CSS, motion.css swap, global.css font/import/`@theme` merge, types, Prose/Section, motion/state primitives, BlogPost/PageContent Prose wrap) → Tasks 1–4. ✅
- Layer 2 (eight archetypes + sidecars, five fixtures, case-studies asset reconciliation, noindex, sitemap exclusion) → Tasks 5–6. ✅
- Layer 3 (FAQ archetype on both home locales, MagazineGrid clean-fit decision, delete FAQs.astro, i18n lockstep) → Task 7. ✅
- Layer 4 (STYLE_GUIDE structure+surface merge with brand preservation, CLAUDE.md refs, three flat skills) → Tasks 8–9. ✅
- Testing/verification + acceptance criteria → Tasks 2/4/6/7 inline + Task 10 full suite. ✅
- Non-goals (no #31 tooling, no consumer-less generics, no `.claude-plugin`, no version bump, no wholesale redesign) → none introduced; Task 6 explicitly avoids the `case-studies/` dir; Task 9 avoids porting `passionfruit-content`. ✅

**Decisions resolved vs the spec's open conditionals:**

- MagazineGrid "only if clean fit" → resolved to **not adopted** with documented rationale (Task 7 Step 4). ✅
- FAQ items field mapping (spec risk #4) → resolved: exact `{question, answer}` match, no mapping needed. ✅
- Font opsz availability (risk #3) → resolved: file present, no fallback. ✅
- Prose/blog-prose.css coexistence (risk #5) → handled in Task 4 Step 2.5. ✅
- New i18n keys → resolved: none required (Ground truth 5 & 7); contingency documented (Task 7 Step 7). ✅

**Placeholder scan:** No "TBD/TODO". Every add-step names exact source + dest paths; every modify-step names exact files, line ranges, token/identifier names. (Code bodies are intentionally absent per project convention — the upstream file is the source, read at implement time.) ✅

**Type/identifier consistency:** `FAQItem`/`FAQProps.items`, `MotionProps`, `SectionProps`, `MagazineGridCell`, the eight archetype names, the `noindex` prop, the `comparison.feature/yes/no` and `state.loading` keys, and the `@theme` token names are used identically across tasks and match the verified upstream source. ✅

**Ordering:** types → tokens+CSS → primitives → Prose wrap → archetypes → fixtures → home adoption → docs/skills → full verify. Each task's dependencies are produced by an earlier task. ✅
