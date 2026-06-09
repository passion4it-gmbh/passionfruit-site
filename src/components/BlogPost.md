---
component: BlogPost
oneLiner: Full-page blog post renderer with dark hero, prose body, and back-link
status: stable
tags: [content]
---

## Purpose

Renders a complete blog post detail page. Owns the hero section (dark background with optional blurred hero image, tags, title, date, author) and the content section (prose-typed article body rendered from the collection entry's Markdown). Resolves the back-link to the blog index automatically via `page-registry`.

## When to use

Use exactly once per blog post route — as the primary page body when the catch-all route resolves a `blog` collection entry. Do not use on listing pages; use `BlogCard` there.

## When NOT to use

- Do not use inside another section or layout fragment. This component renders two full `<section>` elements and expects to be mounted directly in the page body.
- Do not pre-render the entry in the parent page — the component calls `render(entry)` internally.

## Props

| Prop    | Type                      | Required | Notes                                            |
| ------- | ------------------------- | -------- | ------------------------------------------------ |
| `entry` | `CollectionEntry<"blog">` | yes      | The blog collection entry to render.             |
| `lang`  | `Locale`                  | yes      | Drives i18n strings, date formatting, back-link. |

## Example

```astro
---
import BlogPost from "~/components/BlogPost.astro";
import type { Locale } from "~/i18n";
import type { CollectionEntry } from "astro:content";

const { entry, lang } = Astro.props as {
  entry: CollectionEntry<"blog">;
  lang: Locale;
};
---

<BlogPost {entry} {lang} />
```

## i18n keys

| Key                | Notes                                     |
| ------------------ | ----------------------------------------- |
| `cta.backToBlog`   | Back-link label in hero and content foot  |
| `blog.publishedAt` | Publication date line (interpolates date) |
| `blog.author`      | Author line (interpolates name)           |

## Gotchas

- **`blog-prose` stylesheet.** The component imports `~/styles/blog-prose.css` directly. Do not duplicate this import in the parent page.
- **Hero image is decorative.** When `heroImage` is present it renders full-bleed at `opacity-15` with `alt=""`. The post title is the accessible heading; the image is purely atmospheric.
- **Hero image is optional.** When absent, the dark hero section still renders with a grid pattern and gradient — the page remains visually coherent.
- **`render()` is called internally.** Do not pre-render the entry in the parent page.
- **Back-link uses `page-registry`.** `findPageByKey("blog-index")` must return a valid entry or the fallback `"blog"` slug is used.
- **Stagger animations.** Hero children carry `hero-stagger` class with inline `--delay` custom properties. Do not add additional entrance animations to the parent page that conflict with these.
