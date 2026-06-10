---
component: Header
oneLiner: Sticky site header with locale-aware nav, variant tones, and mobile menu
status: stable
tags: [navigation]
---

## Purpose

Renders the persistent top bar of every page: the site logo (linked to the locale home), a three-item desktop nav (Features, Blog, Contact), a `LanguageSwitcher`, and a collapsible mobile hamburger menu. Handles state-aware background for the `on-dark` variant — transparent at the top of the page, filling to `bg-surface-dark/80` after 80 px of scroll or while the mobile menu is open.

## When to use

Include once in every page layout, directly before the page `<main>`. Pass `currentSlug` and `alternateSlug` from the page's `getStaticPaths` entry so the embedded `LanguageSwitcher` can produce the correct cross-locale link.

## When NOT to use

- Do not render `Header` inside individual page components — it belongs in the shared layout only.
- Do not pass `variant="on-dark"` on light-background pages; the transparent-to-dark scroll transition looks wrong against a light surface.
- Do not add extra nav items directly here — ship the change to the passionfruit framework first, then pull it into this site.

## Props

| Prop            | Type                      | Required | Default      | Notes                                                                                  |
| --------------- | ------------------------- | -------- | ------------ | -------------------------------------------------------------------------------------- |
| `lang`          | `Locale`                  | yes      | —            | Drives nav link paths and the `LanguageSwitcher`.                                      |
| `currentSlug`   | `string`                  | no       | `undefined`  | Slug of the current page within its locale; sets the active nav state.                 |
| `alternateSlug` | `string`                  | no       | `undefined`  | Slug of the equivalent page in the other locale; forwarded to `LanguageSwitcher`.      |
| `variant`       | `"on-dark" \| "on-light"` | no       | `"on-light"` | Controls logo, link, and hamburger colours. Use `on-dark` for hero-over-image layouts. |

## Example

```astro
---
import Header from "~/components/Header.astro";
---

<!-- Light page -->
<Header lang={lang} currentSlug="blog" alternateSlug="blog" />

<!-- Dark hero page — header starts transparent, fills in on scroll -->
<Header lang={lang} currentSlug="" alternateSlug="" variant="on-dark" />
```

## i18n keys

- `site.name`
- `navigation.features`
- `navigation.blog`
- `navigation.contact`

Nav link slugs are resolved inline via `lang === "de"` ternaries: `funktionen` ↔ `features`, `kontakt` ↔ `contact`. `blog` is the same in both locales. These must stay in sync with `src/lib/page-registry.ts`.

## Gotchas

- **Nav data source.** Nav items are a static array inside `Header.astro`, not derived from `page-registry.ts`. If you add or rename a page, update both `page-registry.ts` and the `navItems` array.
- **Site nav differs from the framework template.** This site has three nav items (Features, Blog, Contact). The framework seed has additional entries (About, Services, Team, Case Studies) that are absent here.
- **Mobile menu JS.** The mobile toggle is driven by an inline `<script>` that re-initialises on `astro:after-swap`. If a second `Header` is added to a page the script will wire up duplicate listeners.
- **Background state.** The script toggles a `data-solid` attribute on the header (`isOpen || scrollY > 80`); the `on-dark` variant styles it via `data-solid:` Tailwind variants. The menu-open condition is load-bearing: the open mobile menu grows the sticky header beyond the hero's `-mt-16` pull-up in `BaseLayout`, so a still-transparent header would show the light page body behind the menu links. On `on-light` pages the attribute is set but unstyled — the header stays `bg-surface/80` regardless.
- **Keyboard.** Pressing `Escape` while the mobile menu is open closes it and returns focus to the toggle button.
- **No slots.** Header renders no `<slot />`. Extra content (e.g., announcement banners) belongs above or below the `<Header />` call in the layout.
