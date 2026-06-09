---
component: LanguageSwitcher
oneLiner: DE/EN toggle resolving cross-locale slugs via page-registry lookup
status: stable
tags: [i18n]
---

## Purpose

Renders a `DE / EN` inline toggle that links the current page to its counterpart in the other locale. Uses `getAlternateLocaleSlug` from `src/lib/page-registry.ts` to find the correct translated slug, falling back to the locale root (`/` or `/en/`) when no registered alternate exists. Both labels are always real `<a>` elements; `aria-current="page"` marks the active locale.

## When to use

- In the site header on every page to let users switch locale.
- On detail pages (blog posts, etc.) where the alternate slug is known — pass it explicitly as `alternateSlug` so the link resolves to the correct sibling, not just the home page.

## When NOT to use

- On a single-locale site — this site is always bilingual (DE + EN); never remove one locale.
- As a standalone dropdown for more than two locales — the component is hardcoded to DE/EN. A multi-locale dropdown requires a different implementation.
- Inside dark backgrounds without token overrides — the component uses `text-text` and `text-accent`, which are light-surface tokens.

## Props

| Prop            | Type     | Required | Default     | Notes                                                                                                                                                   |
| --------------- | -------- | -------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lang`          | `Locale` | yes      | —           | The current page's locale (`"de"` or `"en"`). Determines which label gets the active accent style.                                                      |
| `currentSlug`   | `string` | no       | `undefined` | The current page's slug (without locale prefix). When omitted, the active label links to the locale root.                                               |
| `alternateSlug` | `string` | no       | `undefined` | Explicit override for the other locale's slug. Use for dynamic collection entries whose alternate slug is resolved at the page level, not the registry. |

## Example

```astro
---
import LanguageSwitcher from "~/components/LanguageSwitcher.astro";
---

<!-- Standard page — registry lookup resolves the alternate -->
<LanguageSwitcher lang={lang} currentSlug="funktionen" />

<!-- Blog post — pass the alternate slug explicitly -->
<LanguageSwitcher
  lang={lang}
  currentSlug={entry.slug}
  alternateSlug={alternateEntry?.slug}
/>
```

## i18n keys

None — label text (`DE` / `EN`) and `aria-label` values (`"Deutsch"` / `"English"`) are hardcoded in the component. These are stable language codes, not translatable UI copy.

## Gotchas

- **`aria-current="page"`** is set on the active locale's `<a>`. Both labels are always rendered as links — screen readers rely on `aria-current` to identify the current language.
- **Fallback to locale root.** When `currentSlug` is omitted or `getAlternateLocaleSlug` returns nothing, the alternate link falls back to `getLocalizedPath("", otherLang)` — i.e., `/en/` or `/`. Register the page in `page-registry.ts` if a proper cross-locale link is needed.
- **`getAlternateLocaleSlug` looks up `page-registry.ts` only.** Collection entries (blog posts, etc.) are not in the registry. Resolve the alternate entry's slug at the page level and pass it as `alternateSlug`.
- **No third locale.** Adding a new locale requires changes to `~/i18n`, `page-registry.ts`, and this component's `otherLang` ternary.
