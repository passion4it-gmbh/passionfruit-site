---
component: guide
oneLiner: Renders the bilingual usage guide (Anleitung / Guide) via PageContent
status: stable
tags: [page, content]
---

## Purpose

Renders the long-form usage guide that explains passionfruit end to end for non-technical site owners: prerequisites, where to work, `/onboard`, `/brand`, `/deploy`, day-to-day changes, updates and troubleshooting. Fetches the `guide` pages-collection entry for the current locale and renders it inside `PageContent`.

## When to use

Invoked by the catch-all route `src/pages/[...path].astro` via the `guide` key in `PAGES` (`/anleitung/` ↔ `/en/guide/`).

## When NOT to use

For legal pages use `privacy` / `imprint` with `LegalDocument`. For the marketing feature overview use `features`.

## Props

| Prop          | Type     | Required | Default | Notes                                                   |
| ------------- | -------- | -------- | ------- | ------------------------------------------------------- |
| `lang`        | `Locale` | yes      | —       | Drives collection lookup and hreflang alternate slug.   |
| `currentSlug` | `string` | yes      | —       | Passed through to `BaseLayout` for the active nav link. |

## Example

Composes:

- `<BaseLayout>` (default light header)
- `<PageContent entry={entry} lang={lang} />`

## i18n keys

`navigation.guide` is consumed by `Header.astro` and `Footer.astro`, not by this component.

## Gotchas

- **Content lives in the collection.** Edit `src/content/pages/de/anleitung.md` and `src/content/pages/en/guide.md`, always both.
- **Keep it in sync with the skills.** The guide paraphrases `/onboard`, `/brand` and `/deploy`. When a skill's questions or Cloudflare steps change upstream, update both guide files in the same PR.
- **Page entry is required.** Without a `translationKey: "guide"` entry for the locale the component redirects to `/404`.
