---
translationKey: "how-onboard-works"
title: "How /onboard works"
description: "Eight questions, a personalized marketing site. We break down the /onboard skill step by step."
publishedAt: 2026-05-28
author: "PASSION4IT"
heroImage: ../../../assets/blog/how-onboard-works.webp
tags: ["skills", "tutorial"]
---

When you run `pnpm create passionfruit my-site`, you get a generic template with placeholder copy and example branding. The next step — `/onboard` — turns that template into **your** website. Eight questions, maybe twenty minutes of your time, and everything is personalized.

Let's look at what sits behind each question.

## 1. What's your company or project name?

The name lands in more files than you'd think: i18n JSONs (DE and EN), structured data as JSON-LD, the title suffix in every `<head>`, the footer copyright, the header logo, the README. Claude handles this find-and-replace reliably — and crucially, everywhere.

## 2. What do you do? (One sentence)

This one sentence becomes the meta description, the hero subtitle, and — unless you upload custom OG images — the default sharing snippet. Spend two minutes thinking about it. A good description isn't "We do web design" but "We build online shops for regional artisan brands that want international customers".

## 3. What's your primary language?

German at the apex or English at the apex? passionfruit uses an **apex-locale** scheme: the primary language sits at `/`, the secondary language at `/en/` (or `/de/`). This isn't just routing — it drives how the language switcher works, what `<html lang>` is set initially, and how the `x-default` hreflang entry looks.

## 4. Do you need a second language?

If no, Claude turns the template into a monolingual site: removes `/en/` routes, simplifies the page registry to single-slug entries, drops the language switcher from the header, disables the bilingual check. If yes, Claude asks which locale (`en`, `fr`, `it` …) and keeps the full architecture.

## 5. Which accent color?

Four presets are one click away: indigo, emerald, amber, rose. Or you describe your brand colors in words ("deep teal with warm accents") and Claude derives the tokens. Three CSS variables get changed in `src/styles/global.css`: `--color-accent`, `--color-accent-hover`, `--color-accent-glow`. The rest of the design adapts automatically.

## 6. Which pages do you need?

Multi-select from: Home, About, Services, Blog, Team, Contact, Privacy, Imprint. Whatever you drop gets removed from three places: the page registry, the header and footer navigation, the `src/components/pages/` directory. Whatever you keep stays as a personalizable placeholder.

## 7. Contact details?

Email, phone, address — these land in the footer, on the contact page, in the imprint, and in the `Organization` JSON-LD schema. The address is also wired into the structured data for local SEO if you want to show up on Google Maps.

## 8. Social media links?

LinkedIn, Instagram, X, GitHub — whatever you provide lands in the footer as an icon row, and in the `sameAs` entries of the Organization JSON-LD.

## What happens next

After the eight answers, Claude works through the following files in lockstep:

- `src/i18n/de.json` and `src/i18n/en.json` (company name, tagline, navigation, footer copyright)
- `src/lib/structured-data.ts` (Organization JSON-LD)
- `src/layouts/BaseLayout.astro` (title suffix)
- `astro.config.mjs` (site URL, if provided)
- `src/styles/global.css` (accent color tokens)
- `src/lib/page-registry.ts` (removed pages)
- `src/components/Header.astro` and `Footer.astro` (navigation)
- `src/components/pages/imprint.astro` and `privacy.astro` (address, managing director)
- `CLAUDE.md` section 1 (project context for future sessions)
- `STYLE_GUIDE.md` (color section)
- `README.md` (marketing boilerplate out, short business-specific text in — the "Staying Current" section stays verbatim because it explains how you pull framework updates)

At the end, Claude commits: `feat: initial setup — [Company Name] website`.

## Migrating an existing site

`/onboard` has a second mode: if you say "I'm migrating an existing site", Claude asks for the URL, crawls it (or has you describe the pages), and pre-fills the answers for you. After that, the `/goal` skill helps you systematically port the old content into the new structure — page by page, with modern design.

## What's next

After `/onboard`, you probably want to run `/brand` — that replaces the placeholder favicon and OG sharing image with your own. And if you like the site: `/deploy` sets up Cloudflare Pages.

Try it yourself:

```bash
pnpm create passionfruit my-site
cd my-site
claude
/onboard
```
