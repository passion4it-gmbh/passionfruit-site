---
component: imprint
oneLiner: Imprint (Impressum) page rendered from the pages collection
status: stable
tags: [page]
---

## Purpose

Renders the bilingual imprint page. Fetches the `imprint` pages-collection entry for the current locale, renders its markdown body inside a `blog-prose` article block, and wires the hreflang alternate link. Uses the default (light) header — no dark hero.

## When to use

On any site with a German or Austrian commercial web presence — an Impressum is legally required. Invoked by the catch-all route `src/pages/[...path].astro` via the `imprint` key in `PAGES`.

## When NOT to use

- For privacy policy content, use `privacy` instead.
- For any other legal document (AGB, terms of service), follow the same pattern but create a new page component — do not extend this one.

## Props

| Prop          | Type     | Required | Default | Notes                                                   |
| ------------- | -------- | -------- | ------- | ------------------------------------------------------- |
| `lang`        | `Locale` | yes      | —       | Drives collection lookup and hreflang alternate slug.   |
| `currentSlug` | `string` | yes      | —       | Passed through to `BaseLayout` for the active nav link. |

## Example

```astro
---
import Imprint from "~/components/pages/imprint.astro";
---

<!-- Invoked by src/pages/[...path].astro via PageContent — do not call directly -->
<Imprint lang="de" currentSlug="impressum" />
```

Composes: `<BaseLayout>` (no `headerVariant` — default light header), a single `<section>` with `container` inner padding, and a `blog-prose` `<article>` containing an `<h1>` from `entry.data.title` followed by the rendered markdown `<Content />`.

## i18n keys

None. This component makes no `t()` calls. Title and description come from `entry.data`. Content lives in `src/content/pages/{de,en}/imprint.md`.

## Gotchas

- **Pages collection entry is required.** If no `pages` entry with `translationKey: "imprint"` exists for the locale, the component redirects to `/404`. Both DE and EN entries must be present.
- **No dark hero.** The imprint page uses the default light header with no hero section — do not add `headerVariant="on-dark"` without also adding corresponding hero markup.
- **Content is in the collection, not i18n.** Update imprint text in `src/content/pages/{de,en}/imprint.md`, not in `de.json` / `en.json`.
- **Alternate slug requires both locales.** `getAlternateCollectionSlug` is called for hreflang; if the alternate-locale entry is absent, the hreflang link is silently omitted.
- **`useTranslations` is imported but unused.** The import is present for consistency with other page composers; the compiler trims it. Do not add `t()` calls here.
