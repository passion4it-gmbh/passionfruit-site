# Design-floor port (upstream Spec 1 + Spec 2) — design

**Status:** Approved in brainstorming. Awaiting user review of this spec before plan.
**Date:** 2026-05-29
**Scope:** This site repo only (`passionfruit-site`). The framework repo (`passion4it-gmbh/passionfruit`) is the source, not modified.
**Upstream baseline:** `upstream/main` (framework, tagged v1.0.0). Our last sync pulled upstream PRs #27/#28/#30 (the OG generator). This port covers what landed since.

## Problem

The framework shipped its "design floor" — an editorial type system, a motion/state design language, a library of reusable section archetypes (Spec 1, upstream #29) — plus a Claude-consumption STYLE_GUIDE rewrite and three auto-loading skills (Spec 2, upstream #32). This site, the live dogfood demo, is still on the pre-design-floor styling: a single `scroll-animations.css`, no editorial typography, no shared `Section`/`Prose` primitives, no archetype library, and a STYLE_GUIDE that predates the rewrite.

A dogfood site that doesn't ship what users get out of the box undercuts its own signal. We port the design floor.

## Goal

Bring this site onto the framework's design floor: foundation (type/motion/state CSS, tokens, primitives), the full archetype library with an honest consumer, a few real-page archetype adoptions where they map cleanly, and the docs/skills — **without regressing the site's bespoke, more-polished marketing pages** and **without clobbering brand identity**.

## Decisions (from brainstorming)

1. **Full scope:** foundation + adopt archetypes, via "re-platform + honest demo" — pull the whole library and primitives, keep our content and visual identity, swap archetypes onto real sections only where one maps cleanly, and give the remaining archetypes a real consumer via the `/design-floor/` fixture pages rather than contorting marketing pages.
2. **Single PR**, structured by commit into the four layers below (one logical change: "adopt the design floor").
3. **`/design-floor/` fixtures:** ship them now as the archetype consumers, marked `noindex` and (already) excluded from the sitemap. A polished, public **component-documentation page is a future follow-up, explicitly out of scope here** — these fixtures plus the pulled `.md` sidecars seed it.
4. **Merge, never clobber:** every shared `@theme` token name already exists in both repos; brand-identity values stay ours, only new capabilities are added.

## Non-goals (explicitly NOT pulled)

- **#31 sidecar-docs tooling** — `scripts/check-component-docs.mjs`, the prebuild gate, `pnpm sync:component-catalog`, and the auto-generated `src/components/CLAUDE.md` catalog. This collides with the in-flight _local_ sidecar initiative (the untracked `docs/superpowers/{specs,plans}/2026-05-28-component-sidecar-docs*` documents), which deliberately chose a no-tooling, locally-authored approach. We pull the `.md` sidecars that ride along with the _new_ components (primitives + archetypes) as plain docs, but we author no sidecars for our existing components and add no tooling. The tooling-vs-convention decision stays with that workstream.
- **Consumer-less generics** — the careers / events / case-studies collections and their cards/detail/filter components, `CollectionFilter`, `GTMAnalytics`, `LegalDocument`, `YouTubeFacade`, `SpotifyFacade`, `TeamCard`. No consumer here; skip (consistent with the last sync's reasoning).
- **`.claude-plugin` packaging** — upstream packages its skills as a marketplace plugin; this site uses flat `.claude/skills/*.md`. We keep the local convention.
- **release-please version bump** — upstream's own versioning, not portable.
- **Wholesale page redesign** — our bespoke hero and custom sections are kept.

## Architecture — four layers

The four layers are commit boundaries inside one branch/PR. They are ordered so the foundation can be verified before archetypes land: Layer 1 must not regress the bespoke marketing pages' layout, while long-form prose (blog/pages) intentionally gains the editorial type system. Because everything ships in one PR, cross-layer token dependencies (archetypes need the new grid/section/leading tokens) are satisfied.

### Layer 1 — Foundation (no layout regression on bespoke pages; intended editorial improvements on prose)

**Add (verbatim from upstream, brand-neutral):**

- `src/styles/typography.css` — editorial type system (optical sizing, OpenType features, vertical rhythm).
- `src/styles/state.css` — state-surface styling.
- `src/components/Prose.astro` (+ `Prose.md`) — long-form text primitive (drop-cap, hanging punctuation, measure cap).
- `src/components/Section.astro` (+ `Section.md`) — section frame primitive.
- `src/components/motion/` — `FadeIn`, `FadeUp`, `Motion` (+ their `.md` sidecars).
- `src/components/state/` — `Skeleton`, `EmptyState`, `ErrorState` (+ their `.md` sidecars).
- `src/types/motion.ts`, `src/types/sections.ts` — the interface contracts the primitives and archetypes are typed against.

**Replace:**

- `src/styles/scroll-animations.css` → adopt upstream `src/styles/motion.css`. Upstream's file is a strict superset of our animation class names (`anim-*`, `hero-stagger`, `glow-orb`, `in-view` all present) plus the view-transition/StickyStory classes (`pf-story`, `pf-vt-*`). Net: delete `scroll-animations.css`, add `motion.css`.

**Modify:**

- `src/styles/global.css`:
  - `@import` block: switch font to `@fontsource-variable/inter/opsz.css` (optical-sizing axis the type system rides on), and import `motion.css` + `typography.css` + `state.css` in place of `scroll-animations.css`.
  - `@theme`: **merge.** Keep our values for every shared token (brand colors, fonts, radii, spacing, transitions). **Add** upstream's new tokens: state colors (`--color-state-*`), scrim/shadow (`--color-overlay-scrim-*`, `--color-shadow-lift`), skeleton (`--color-skeleton-*`), 12-col grid (`--grid-cols-12`, `--grid-gap-*`), line-heights (`--leading-*`), durations (`--duration-*`), additional easings (`--ease-emphasized|enter|exit|standard`), section spacing (`--space-section-*`), and the extra type sizes (`--text-body`, `--text-body-sm`, `--text-caption`, `--text-eyebrow`).
- `src/components/BlogPost.astro` — wrap the rendered Markdown body in `<Prose dropCap>` (matches upstream). Keep the existing `blog-prose.css` import.
- `src/components/PageContent.astro` — wrap the rendered Markdown body in `<Prose>` (matches upstream). Keep `blog-prose.css`.

### Layer 2 — Archetype library + honest demo

**Add (with `.md` sidecars):**

- `src/components/sections/` — `AsymmetricHero`, `MagazineGrid`, `StickyStory`, `EditorialQuote`, `SplitFeature`, `Trust`, `Comparison`, `FAQ`.
- `src/pages/design-floor/` — `index`, `type`, `motion`, `sections`, `state` fixture pages. Each renders through `BaseLayout` with `noindex` set.

**Adapt:**

- `src/pages/design-floor/sections.astro` imports image assets; reconcile to our inventory. We already carry `home/hero.png`, `blog/ai-websites.png`, `blog/digital-transformation.png`, and `team/{anna,lena,max}.png`. The only missing imports are three `case-studies/` portraits (`portrait-manufacturing`, `portrait-shopify`, `logo-consulting`) — replace those references with assets we carry (e.g. reuse team/blog images for the portrait/logo slots). Do **not** introduce a `case-studies/` asset dir; that collection is a non-goal.

**No sitemap change needed:** `src/pages/sitemap.xml.ts` emits only registry pages (`PAGES`) + the `blog`/`pages` collections, so `/design-floor/*` is excluded by construction. `noindex` on the fixtures is the only SEO guard required.

### Layer 3 — Consume archetypes on real pages (clean fits only)

**Modify:**

- `src/pages/index.astro` and `src/pages/en/index.astro`:
  - Swap the bespoke `FAQs` usage for the `FAQ` archetype (`eyebrow`/`headline`/`lede`/`items`, typed via `~/types/sections`). The `getFAQs(lang)` data shape (`{question, answer}`) feeds it; verify field names against `FAQProps.items` and map if upstream uses different keys.
  - Map the "how it works" three-card grid onto `MagazineGrid` **only if it is a clean fit**; otherwise leave it bespoke. Honest demo — no contortion.
- `src/i18n/de.json` + `src/i18n/en.json`: add, in lockstep, any new keys the `FAQ` archetype surfaces beyond the existing items (e.g. a section `headline`/`eyebrow`/`lede`). Existing FAQ item copy stays in `src/data/faqs.ts`.

**Delete:**

- `src/components/FAQs.astro` once nothing references it.

### Layer 4 — Docs + Claude skills

**Modify:**

- `STYLE_GUIDE.md` — adopt upstream's Claude-consumption structure (intent-first sections, Decision Shortcuts cheat sheet) and the Spec-1 surface documentation (Section frame + archetypes, Motion primitives, State surfaces). **Preserve our brand-specific values** (our colors, fonts, type scale, the bespoke-hero notes) — this is a merge of structure + new-surface docs onto our content, not a wholesale replacement.
- `CLAUDE.md` — point the styling section's references at the rewritten STYLE_GUIDE; extend §7 (Component conventions) to mention the new primitives (`Section`, `Prose`, `Motion`) and the archetype library.

**Add:**

- `.claude/skills/passionfruit-design.md`, `passionfruit-a11y.md`, `passionfruit-perf.md` — adapt upstream's `<name>/SKILL.md` directory skills into this repo's flat `.claude/skills/<name>.md` convention (matching the existing `brand.md`/`deploy.md` files), preserving their auto-loading description/frontmatter so they trigger on design/a11y/perf work.

## Integration risks & mitigations

1. **Type-scale shift.** The editorial upgrade retuned shared type tokens (`--text-display`, `--tracking-display`, new `--leading-*`). Adopting upstream's structure could move every heading. **Mitigation:** keep our brand font families and base sizes; visual-diff the home and features (bespoke pages — must not regress) and a blog post (prose — expected to gain editorial type, confirm it reads well) at 375px + desktop after Layer 1.
2. **`motion.css` timing drift.** Class names are a superset, but upstream rebased keyframes/timings onto the new `--duration-*`/`--ease-*` tokens, so animation feel may differ slightly. **Mitigation:** spot-check the home hero stagger, card-enter, and scroll reveals; accept minor timing changes as part of the upgrade, fix only regressions.
3. **`inter/opsz.css` availability.** The font import changes to the optical-sizing subpath. **Mitigation:** confirm `@fontsource-variable/inter` (installed `^5.2.8`) exposes `inter/opsz.css`; fall back to the variable axis if not.
4. **`FAQ` items shape.** Archetype `items` may use different field names than our `{question, answer}`. **Mitigation:** read `FAQProps` in `src/types/sections.ts`; map in the page if needed.
5. **`Prose` + `blog-prose.css` coexistence.** Both are kept upstream. **Mitigation:** verify no double-styling/specificity conflict on a rendered post; reconcile `blog-prose.css` rules that `Prose` now owns.
6. **Skill format conversion.** Directory `SKILL.md` → flat `.md`. **Mitigation:** mirror the frontmatter shape of the existing local skills; verify the three are discoverable.
7. **Sidecar overlap.** Pulling `.md` sidecars for new components must not pre-empt the local sidecar initiative's conventions for _existing_ components. **Mitigation:** scope sidecars to the new files only; no tooling; note the overlap for that workstream.

## Testing / verification

- `pnpm build` — lint + typecheck + bilingual check + `astro build` + postbuild headers, all green.
- `pnpm check:links` — no broken internal links in `dist/`.
- `pnpm test` — bilingual + OG generator tests still pass.
- **Visual check (Layer 1 checkpoint):** screenshot home, one blog post, and features at 375px and desktop before/after. Home + features: no layout regression. Blog post: editorial type lands and reads well (drop-cap, measure cap intended).
- **Fixtures:** `/design-floor/{index,type,motion,sections,state}` render; each emits `<meta name="robots" content="noindex,nofollow">`; none appear in `dist/sitemap.xml`.
- **FAQ:** accordion behaves on home in both DE and EN after the swap.
- **A11y:** `pnpm lint:a11y` clean (alt-text on any fixture imagery).

## Acceptance criteria

- `src/styles/` holds `global.css`, `blog-prose.css`, `motion.css`, `typography.css`, `state.css`; `scroll-animations.css` is gone; nothing imports the old filename.
- `global.css` `@theme` contains every token this site had **before** plus upstream's new tokens; brand values unchanged.
- `Prose`, `Section`, the three `motion/` and three `state/` primitives, and `src/types/{motion,sections}.ts` exist; `BlogPost`/`PageContent` render through `Prose`.
- All eight `sections/` archetypes exist with sidecars; the five `/design-floor/` fixtures build, are `noindex`, and reference only assets this repo carries.
- Home consumes the `FAQ` archetype (both locales); `FAQs.astro` is removed; `MagazineGrid` is used on home only if it was a clean fit (documented either way).
- `STYLE_GUIDE.md` reflects the new structure + design-floor surface with brand values intact; `CLAUDE.md` references updated; the three skills exist in flat form.
- None of the non-goal components/collections/tooling are introduced.
- `pnpm build` and `pnpm check:links` pass; visual parity confirmed.
