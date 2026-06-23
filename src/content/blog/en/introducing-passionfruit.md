---
translationKey: "introducing-passionfruit"
title: "Introducing passionfruit"
description: "An open-source template for bilingual marketing websites, built for Claude Code. Today we ship the first public release."
publishedAt: 2026-05-28
author: "PASSION4IT"
heroImage: ../../../assets/blog/introducing-passionfruit.webp
tags: ["release", "launch"]
featured: true
---

If you're running a small business and need a website, the market looks like this: pay an agency five figures, wrestle with WordPress, or settle for a site builder while secretly wishing for more. None of these options are satisfying.

At [PASSION4IT](https://passion4it.de), we've been building custom sites for clients for years — and we know exactly where the recurring pain lives: bilingual support, GDPR done properly, decent performance, a blog that isn't trapped in a CMS, and a stack someone can still read in ten years.

**passionfruit** is our answer. An open-source template that brings exactly this stack — and that's integrated with Claude Code tightly enough for non-developers to be productive with it.

## The idea in one sentence

> Run `pnpm create passionfruit my-site`, open `claude`, type `/onboard`, answer eight questions — and you have a finished bilingual marketing site on Cloudflare Pages.

This isn't a marketing line. The site you're reading — `passionfruit.passion4it.de` — was built exactly this way. We eat our own dog food.

## What's inside

passionfruit comes with everything a modern site needs and nothing you don't:

- **Astro 7, TypeScript strict, Tailwind v4** — fast builds, zero JavaScript by default, clean code
- **German + English as the baseline** — not a "Pro feature", but the architecture of the page registry and content collections
- **GDPR-compliant** — cookie consent built in, analytics on EU servers, no data leaks via Google Fonts
- **WCAG AA** — focus rings, alt-text required, 44 px touch targets, `prefers-reduced-motion` respected
- **Quality gates** — ESLint, Prettier, cspell, linkinator, a bilingual check that prevents monolingual slip-ups
- **Cloudflare Pages** — free hosting, automatic HTTPS, preview deploys for every pull request

The full feature list with details lives on the [Features page](/en/features/).

## Why Claude Code?

Claude Code is surprisingly good at writing Astro, Tailwind, and TypeScript — provided the project has clear conventions. passionfruit ships exactly those conventions: a curated `CLAUDE.md`, a `STYLE_GUIDE.md`, a `CONTRIBUTING.md`, plus six skills (`/onboard`, `/brand`, `/deploy`, `/new-post`, …) that encapsulate the common tasks.

The result: you describe what you want. Claude reads the conventions, writes the code, holds bilingual symmetry, holds GDPR discipline, holds design tokens. You don't need to know what Astro Content Collections are. You just say: "add a newsletter block in the footer".

## What's next

We're starting with version 0.4 — the skeleton is up, six skills are in, the core quality gates are live. Coming up in the next weeks:

- **More skills**: `/new-page`, `/translate` (for migrating monolingual sites), `/audit` (for performance and a11y checks)
- **Presets**: restaurant, coaching, trades — preconfigured colors, page structures, sample content
- **More languages**: French, Italian — the architecture is ready for it
- **Component library**: small, drop-in pieces (pricing table, testimonials carousel, newsletter block) for targeted adoption

If you want to help build: the repo is open at [github.com/passion4it-gmbh/passionfruit](https://github.com/passion4it-gmbh/passionfruit), issues and PRs are welcome.

## Try it

One command:

```bash
pnpm create passionfruit my-site
```

In five minutes you'll have a deployed site. If something's missing — email us at [info@passion4it.de](mailto:info@passion4it.de) or open a GitHub issue.

We're looking forward to seeing your first passionfruit site.
