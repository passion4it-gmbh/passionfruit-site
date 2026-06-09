---
component: privacy
oneLiner: Privacy policy page rendered from the pages collection
status: stable
tags: [page]
---

## Purpose

Renders the bilingual privacy policy page. Fetches the `privacy` pages-collection entry for the current locale, renders its markdown body inside a `blog-prose` article block, and wires the hreflang alternate link. Structurally identical to `imprint` — only the `translationKey` lookup (`"privacy"` vs `"imprint"`) and the legal content differ.

## When to use

On any site that processes personal data — a privacy policy is legally required under GDPR. Invoked by the catch-all route `src/pages/[...path].astro` via the `privacy` key in `PAGES`.

## When NOT to use

- For imprint (Impressum) content, use `imprint` instead.
- For terms of service or cookie policy, follow the same pattern but create a new page component — do not extend this one.

## Props

| Prop          | Type     | Required | Default | Notes                                                   |
| ------------- | -------- | -------- | ------- | ------------------------------------------------------- |
| `lang`        | `Locale` | yes      | —       | Drives collection lookup and hreflang alternate slug.   |
| `currentSlug` | `string` | yes      | —       | Passed through to `BaseLayout` for the active nav link. |

## Example

```astro
---
import Privacy from "~/components/pages/privacy.astro";
---

<!-- Invoked by src/pages/[...path].astro via PageContent — do not call directly -->
<Privacy lang="de" currentSlug="datenschutz" />
```

Composes: `<BaseLayout>` (no `headerVariant` — default light header), a single `<section>` with `container` inner padding, and a `blog-prose` `<article>` containing an `<h1>` from `entry.data.title` followed by the rendered markdown `<Content />`.

## i18n keys

None. This component makes no `t()` calls. Title and description come from `entry.data`. Content lives in `src/content/pages/{de,en}/privacy.md`.

## Gotchas

- **Pages collection entry is required.** If no `pages` entry with `translationKey: "privacy"` exists for the locale, the component redirects to `/404`. Both DE and EN entries must be present.
- **No dark hero.** The privacy page uses the default light header with no hero section, consistent with `imprint`.
- **Content is in the collection, not i18n.** Update privacy policy text in `src/content/pages/{de,en}/privacy.md`, not in `de.json` / `en.json`.
- **GDPR compliance is the site owner's responsibility.** The template ships placeholder privacy text. Replace it with a legally reviewed policy before going live.
- **Alternate slug requires both locales.** `getAlternateCollectionSlug` is called for hreflang; if the alternate-locale entry is absent, the hreflang link is silently omitted.
- **The contact page links here dynamically.** `contact.astro` resolves the privacy page href via `findPageByKey("privacy")` — do not change the `translationKey` in the collection entries without updating that lookup.
