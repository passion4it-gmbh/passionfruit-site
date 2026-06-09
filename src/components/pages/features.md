---
component: features
oneLiner: Features page with dark hero, hardcoded feature card grid, and CTA
status: stable
tags: [page]
---

## Purpose

Renders the site's bilingual features page. Presents a curated set of eight hardcoded feature cards (bilingual, toggled by `lang`) in a two-column responsive grid, each with a Lucide icon, heading, prose description, and a bullet list. Opens with a dark hero section (optional `heroImage` from the `pages` collection) and closes with a dark CTA section that reuses the home-page install-command block and a GitHub link.

## When to use

On this site only — `features` is a site-specific page composer for the passionfruit marketing site. Invoked by the catch-all route `src/pages/[...path].astro` via the `features` key in `PAGES`.

## When NOT to use

- Do not use as a generic services or capabilities page — the feature content is hardcoded to document the passionfruit framework's own capabilities.
- Do not reach for this composer to display CMS-driven feature content; create a new page composer backed by a content collection instead.

## Props

| Prop          | Type     | Required | Default | Notes                                                          |
| ------------- | -------- | -------- | ------- | -------------------------------------------------------------- |
| `lang`        | `Locale` | yes      | —       | Drives i18n strings, feature card content, and alternate slug. |
| `currentSlug` | `string` | yes      | —       | Passed through to `BaseLayout` for the active nav link.        |

## Example

```astro
---
import Features from "~/components/pages/features.astro";
---

<!-- Invoked by src/pages/[...path].astro via PageContent — do not call directly -->
<Features lang="en" currentSlug="features" />
```

Composes: `<BaseLayout>` (headerVariant: "on-dark"), dark hero with two-column layout (text left, optional `heroImage` right), a feature-card grid section, and a dark CTA section with a copyable install command and a GitHub button.

The optional `heroImage` is read from the `features` pages-collection entry's `heroImage` field. When absent the hero is single-column text.

Feature cards are defined inline as a typed `Feature[]` array (not from a content collection). Adding or editing features requires editing this component directly. Each card carries: icon (Lucide), title, description, and a bullets array — backtick spans in bullets are converted to `<code>` elements via `set:html`.

## i18n keys

| Key                            | Notes                                       |
| ------------------------------ | ------------------------------------------- |
| `features.title`               | `<BaseLayout>` SEO title, hero heading      |
| `features.description`         | `<BaseLayout>` meta description, hero lead  |
| `site.name`                    | Hero eyebrow label                          |
| `home.ctaSection.title`        | CTA section heading                         |
| `home.ctaSection.subtitle`     | CTA section subheading                      |
| `home.ctaSection.command`      | Install command displayed and copied in CTA |
| `home.ctaSection.commandLabel` | Aria-label for the copy button in CTA       |
| `home.ctaSection.github`       | GitHub button label in CTA                  |

## Gotchas

- **Feature content is hardcoded, not CMS-driven.** To add, remove, or reorder feature cards, edit the `features` array in this component directly. Eight cards are defined for DE and EN independently — keep them in sync.
- **`heroImage` is optional.** Comes from `pageEntry?.data.heroImage` on the `pages` collection entry with `translationKey: "features"`. When absent, the hero is single-column. The pages entry itself is not required — a missing entry only means no hero image and no alternate slug resolution.
- **Alternate slug lookup is best-effort.** `getAlternateCollectionSlug` is called but the pages-collection entry is optional; if absent, `alternateSlug` is undefined and the hreflang link is silently omitted.
- **Bullet backtick syntax requires `set:html`.** Bullets use backtick notation (e.g. `` `check-bilingual.mjs` ``) which is transformed to `<code>` via a `replace()` call and rendered with `set:html`. Never put untrusted user content here.
- **CTA reuses `home.ctaSection.*` keys.** Changes to those i18n strings affect both the home page and this features page.
- **Scroll animations and copy button require re-init on view transitions.** Both `initScrollAnimations` and `initCopyButtons` re-attach on `astro:after-swap`.
