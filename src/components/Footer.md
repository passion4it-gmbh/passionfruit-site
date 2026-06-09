---
component: Footer
oneLiner: Dark-surface site footer with nav, legal links, and copyright bar
status: stable
tags: [navigation]
---

## Purpose

Renders the persistent bottom section of every page: a three-column grid (brand + tagline, main nav links, legal links) and a bottom bar with the dynamic copyright year and the passionfruit attribution link. Always dark-surface (`bg-surface-dark text-text-on-dark`). Copyright year is derived from `new Date().getFullYear()` at build time.

## When to use

Include once in every page layout, after the page `<main>` and before `</body>`. Pair with `Header` — both receive the same `lang` prop from the parent layout.

## When NOT to use

- Do not suppress Footer on landing pages just to save space — wrap it in a conditional in the layout rather than deleting it.
- Do not embed Footer inside individual page components; it belongs in the shared layout only.

## Props

| Prop   | Type     | Required | Default | Notes                                    |
| ------ | -------- | -------- | ------- | ---------------------------------------- |
| `lang` | `Locale` | yes      | —       | Drives link paths and translated labels. |

## Example

```astro
---
import Footer from "~/components/Footer.astro";
---

<Footer lang={lang} />
```

## i18n keys

- `site.name`
- `site.tagline`
- `navigation.features`
- `navigation.blog`
- `navigation.contact`
- `footer.privacy`
- `footer.imprint`
- `footer.copyright`
- `footer.builtWith`

Nav link slugs are resolved inline via `lang === "de"` ternaries: `funktionen` ↔ `features`, `kontakt` ↔ `contact`. Legal slugs: `datenschutz` ↔ `privacy`, `impressum` ↔ `imprint`. These must stay in sync with `src/lib/page-registry.ts`.

## Gotchas

- **Site nav differs from the framework template.** Footer nav mirrors the Header: Features, Blog, Contact only. The framework seed includes About, Services, Team entries that are not present here.
- **Social links are a placeholder.** The brand column contains a `<!-- TODO: Add social links -->` comment. Fill these in during `/onboard` — they are not driven by i18n or props.
- **Copyright year is build-time.** `currentYear` is computed from `new Date().getFullYear()` at build time, not at request time. Acceptable for a static site; would need runtime resolution for on-demand rendering.
- **`footer.builtWith` split.** The component splits `t("footer.builtWith")` on the literal string `"passionfruit"` to wrap it in an `<a>`. The i18n value must contain exactly one occurrence of `passionfruit` or the split will produce wrong output.
- **No slots.** Footer renders no `<slot />`. For a newsletter signup or cookie reset button, add the component above `<Footer />` in the layout.
- **Legal column heading is hardcoded.** The "Legal" column heading is a plain string, not an i18n key. Localise it if needed.
