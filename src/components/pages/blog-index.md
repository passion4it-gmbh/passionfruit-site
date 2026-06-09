---
component: blog-index
oneLiner: Blog index page with dark hero and chronological post grid
status: stable
tags: [page]
---

## Purpose

Renders the bilingual blog index page. Queries the `blog` collection for the current locale, sorts posts newest-first, and displays them in a responsive three-column grid of `BlogCard` components below a dark hero. Falls back to a centered empty-state message when no posts exist for the locale.

## When to use

On a site that has the `blog-index` entry in `PAGES` (`src/lib/page-registry.ts`). Invoked by the catch-all route `src/pages/[...path].astro` — do not instantiate directly.

## When NOT to use

- For a single post full-page view, use `BlogPost` via the content-collection dynamic route, not this template.
- For a homepage featured post teaser, embed a `BlogCard` inline rather than using this full page.

## Props

| Prop          | Type     | Required | Default | Notes                                                         |
| ------------- | -------- | -------- | ------- | ------------------------------------------------------------- |
| `lang`        | `Locale` | yes      | —       | Drives collection filtering, i18n strings, and locale prefix. |
| `currentSlug` | `string` | yes      | —       | Passed through to `BaseLayout` for the active nav link.       |

## Example

```astro
---
import BlogIndex from "~/components/pages/blog-index.astro";
---

<!-- Invoked by src/pages/[...path].astro via PageContent — do not call directly -->
<BlogIndex lang="de" currentSlug="blog" />
```

Composes: `<BaseLayout>` (headerVariant: "on-dark"), dark hero with `site.name` eyebrow, `blog.title` heading and `blog.description` lead, followed by a `<BlogCard>` grid or `blog.noPosts` empty-state text.

## i18n keys

| Key                | Notes                                       |
| ------------------ | ------------------------------------------- |
| `blog.title`       | Page `<title>`, hero heading, and SEO title |
| `blog.description` | Meta description and hero lead paragraph    |
| `blog.noPosts`     | Empty-state message when no posts exist     |
| `site.name`        | Hero eyebrow label                          |

## Gotchas

- **No `heroImage` support.** The hero is text-only; no image slot exists.
- **No filter or pagination.** Posts are listed chronologically without tag filtering. Adding tag filtering requires a new query strategy and a filter UI component.
- **Bilingual entries required.** Both `de` and `en` blog posts must use the same `translationKey` — `scripts/check-bilingual.mjs` enforces this at build time.
- **Scroll animations require re-init on view transitions.** The inline `<script>` re-attaches the `IntersectionObserver` on `astro:after-swap` to handle Astro View Transitions correctly.
- **`currentSlug` has no default.** The catch-all route always supplies it; do not use this page outside that routing context.
