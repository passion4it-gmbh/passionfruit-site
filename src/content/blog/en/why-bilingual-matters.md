---
translationKey: "why-bilingual-matters"
title: "Why bilingual — from day one"
description: "Most static site generators treat i18n as an afterthought. passionfruit makes bilingual the default. Why that difference matters."
publishedAt: 2026-05-28
author: "PASSION4IT"
heroImage: ../../../assets/blog/why-bilingual-matters.webp
tags: ["architecture", "i18n"]
---

If you start with any modern static site generator today, multilingual support is a plugin. Astro has `astro-i18n`, Hugo has `i18n` bundles, Next has `next-intl`. All three work — but all three treat the bilingual case as an **extension** of the monolingual default. You start with one language, then at some point you add a second, and suddenly half your pages are half-translated, slug translations don't line up, the language switcher points to 404s.

passionfruit flips the assumption. **Bilingual is the baseline**, monolingual is the special case.

## What that means in the architecture

When you run `pnpm create passionfruit my-site`, you get a site with German at the apex (`/`) and English under `/en/`. Both languages exist, both have real content, both go through the build. If you tell the `/onboard` skill "no, I only need one language", Claude **removes** the second language — not the other way around.

That's not pedantry. It drives four architectural decisions:

### 1. Page registry as single source of truth

`src/lib/page-registry.ts` lists every static page with both slugs:

```ts
{
  key: "features",
  slug: { de: "funktionen", en: "features" },
  component: () => import("~/components/pages/features.astro"),
}
```

This structure then automatically generates:

- The catch-all routing handler (`src/pages/[...path].astro`)
- The bilingual `sitemap.xml`
- The `hreflang` annotations in `BaseLayout.astro`
- The language switcher — which only links to counterparts that actually exist

Don't like the slug `funktionen`? Change it in **one** place. Everything else follows.

### 2. Content collections with translationKey

Every blog post, every static page markdown file has a `translationKey` in the frontmatter:

```yaml
---
translationKey: "introducing-passionfruit"
title: "Introducing passionfruit"
---
```

The same key exists in the German version. That makes pairing trivial — no convention-over-configuration voodoo, no "the filename must match between two folders". Just a key.

### 3. `check-bilingual.mjs` — the pre-build guardian

A 200-line script runs as a `prebuild` hook. For every content collection, it asks: does each `translationKey` exist in **both** locales? If no, the build aborts — before you can even deploy.

That might sound pedantic. But we wrote the script **after** we'd repeatedly "just quickly" added a German page and forgotten to update the English version. Three weeks later, the client complains. The script kills exactly that failure mode.

### 4. i18n keys in JSON, not in components

Every UI string lives in `src/i18n/de.json` or `en.json`. Components only use `t("path.to.key")`. This buys two things:

1. You can send the JSON files to a translator without them needing to understand Tailwind classes
2. cspell checks the translations directly, with German **and** English dictionaries

## What that buys the user

Concretely: this site, right here. You're reading it now — probably in English. But click the switcher in the top right and you're instantly on the German version — same content, same structure, correctly linked, with hreflang in the `<head>` for Google.

We didn't translate this site "gradually". We **built** it bilingual. Every commit that added a DE string came with the matching EN string — otherwise the build would have failed.

That's the difference between "multilingual as a feature" and "multilingual as architecture".

## When you don't need this

Fair: many sites don't need a second language. A Berlin-Neukölln restaurant serving German-speaking guests doesn't need English. A local tradesperson with a 50 km radius of customers doesn't either.

For exactly that case, `/onboard` has question 4: "Do you need a second language?" Answer: no. Claude tears down.

But even then, you indirectly benefit: the page registry is still clean, i18n keys are still centralized, you could **tomorrow** add a second language without ripping anything out. The architecture costs you nothing while leaving you options.

## What would have happened if we'd done it the other way

If we'd started monolingual and bolted bilingual on later, we'd probably have these bugs that I recognize from older projects:

- Forgotten translations rendering as `[missing: key]` in production
- Language switchers pointing to 404s
- Sitemaps that only list the primary language
- hreflang missing entirely
- Slug translations drifting between DE and EN (`/leistungen` ↔ `/en/services` is easy; `/blog/mein-post` ↔ `/en/blog/mein-post` because someone forgot to translate the slug — happens constantly)

By treating "only one language" as the special case, we get all that for free — even for monolingual sites.

## Try it yourself

One language is enough for you? Cool — `/onboard` asks, we tear down.

You want both? Even cooler — `pnpm create passionfruit my-site` is already bilingual.

```bash
pnpm create passionfruit my-site
```
