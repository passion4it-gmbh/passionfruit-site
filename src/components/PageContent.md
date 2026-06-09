---
component: PageContent
oneLiner: pages-collection renderer with optional hero image, title, and prose body
status: stable
tags: [content]
---

## Purpose

Renders the body of a `pages` collection entry. Displays an optional hero image (full-width, 288 px tall, `rounded-lg`), the page title as an `<h1>`, and the markdown body via `<Prose>` constrained to `max-w-3xl`. The component calls `render(entry)` internally and imports `~/styles/blog-prose.css`. Use it for pages that are pure content with no custom sections or interactive elements.

## When to use

Use inside `src/components/pages/` page components that are backed by the `pages` collection and need only a title + markdown body. Wire `entry` from `getCollection("pages")` in the catch-all route (`src/pages/[...path].astro`).

## When NOT to use

- Do not use for blog posts — use `BlogPost` instead (it has its own dark hero and back-link).
- Do not use for the imprint/privacy pages — those have dedicated `pages/imprint.astro` and `pages/privacy.astro` composers that render their own `blog-prose` article.
- Do not use when the page needs custom sections, CTAs, or interactive components beyond a single prose block — build a dedicated page component in `src/components/pages/` instead.

## Props

| Prop    | Type                       | Required | Default | Notes                                                                                    |
| ------- | -------------------------- | -------- | ------- | ---------------------------------------------------------------------------------------- |
| `entry` | `CollectionEntry<"pages">` | yes      | —       | The pages collection entry for the current locale.                                       |
| `lang`  | `Locale`                   | yes      | —       | Required by the `Props` interface for consistency; not used in template logic currently. |

## Example

```astro
---
import PageContent from "~/components/PageContent.astro";
import { getEntry } from "astro:content";
import type { Locale } from "~/i18n";

const lang: Locale = "de";
const entry = await getEntry("pages", "de/impressum");
---

<PageContent {entry} {lang} />
```

## i18n keys

None — the component reads `entry.data.title` and renders the markdown body via `<Content />`. It does not call `useTranslations` or `t()`.

## Gotchas

- **`blog-prose` stylesheet is imported here.** Do not re-import `~/styles/blog-prose.css` in the parent page — it will be duplicated in the output.
- **`render()` is called internally.** Do not pre-render the entry in the parent page and pass `Content` as a prop; the component handles rendering itself.
- **Hero image is optional.** When `entry.data.heroImage` is absent the image slot is skipped entirely. Alt text is set to `entry.data.title`.
- **Container and section padding are built in.** The root element is `<div class="container section">`. Do not wrap in another container or add outer padding.
- **`lang` is declared in `Props` but unused in template logic.** It is kept for interface consistency and forward compatibility if locale-aware rendering is added later.
