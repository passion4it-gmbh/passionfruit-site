---
translationKey: "introducing-passionfruit"
title: "passionfruit ist da"
description: "Eine Open-Source-Vorlage für zweisprachige Marketing-Websites, gebaut für Claude Code. Heute starten wir die erste öffentliche Version."
publishedAt: 2026-05-28
author: "PASSION4IT"
tags: ["release", "launch"]
featured: true
---

Wenn du eine kleine Firma führst und eine Website brauchst, sieht der Markt heute so aus: Entweder du zahlst eine Agentur fünfstellig, du quälst dich durch WordPress, oder du nimmst einen Baukasten und sehnst dich heimlich nach mehr. Keine dieser Optionen ist befriedigend.

Wir bei [PASSION4IT](https://passion4it.de) bauen seit Jahren maßgeschneiderte Sites für Kunden — und wir wissen genau, wo die wiederkehrenden Schmerzen liegen: Zweisprachigkeit, die DSGVO sauber im Griff haben, anständige Performance, ein Blog, der nicht in einem CMS gefangen ist, ein Stack, den noch in zehn Jahren jemand lesen kann.

**passionfruit** ist unsere Antwort darauf. Eine Open-Source-Vorlage, die genau diesen Stack mitbringt — und die mit Claude Code so eng verzahnt ist, dass Nicht-Entwickler:innen damit produktiv werden.

## Die Idee in einem Satz

> `pnpm create passionfruit my-site`, danach `claude` öffnen, `/onboard` tippen, acht Fragen beantworten — und du hast eine fertige zweisprachige Marketing-Website auf Cloudflare Pages.

Das ist kein Marketing-Spruch. Diese Website hier — `passionfruit.passion4it.de` — wurde genau so gebaut. Wir essen unser eigenes Hundefutter.

## Was drinsteckt

passionfruit kommt mit allem, was man heute von einer modernen Website erwartet, und nichts, was man nicht braucht:

- **Astro 6, TypeScript strict, Tailwind v4** — schnelle Builds, null JavaScript per Default, sauberer Code
- **DE + EN als Grundannahme** — kein „Pro-Feature", sondern die Architektur des Page-Registry und der Content-Collections
- **DSGVO-konform** — Cookie-Consent eingebaut, Analytics auf EU-Servern, kein Daten-Leak via Google Fonts
- **WCAG AA** — Fokus-Ringe, alt-Text-Pflicht, 44 px Touch-Targets, `prefers-reduced-motion` respektiert
- **Qualitäts-Gates** — ESLint, Prettier, cspell, linkinator, ein Bilingual-Check, der monolinguale Versehen verhindert
- **Cloudflare Pages** — kostenloses Hosting, automatisches HTTPS, Vorschau-Deployments pro Pull Request

Die komplette Feature-Liste mit Hintergründen findest du auf der [Funktionen-Seite](/funktionen/).

## Warum mit Claude Code?

Claude Code ist überraschend gut darin, Astro, Tailwind und TypeScript zu schreiben — vorausgesetzt, das Projekt hat klare Konventionen. passionfruit liefert genau diese Konventionen: ein gepflegtes `CLAUDE.md`, ein `STYLE_GUIDE.md`, ein `CONTRIBUTING.md`, dazu sechs Skills (`/onboard`, `/brand`, `/deploy`, `/new-post`, …), die Standard-Aufgaben kapseln.

Das Ergebnis: Du beschreibst, was du willst. Claude liest die Konventionen, schreibt den Code, hält die Bilingual-Symmetrie ein, hält die DSGVO-Disziplin ein, hält die Design-Tokens ein. Du musst nicht wissen, was Astro Content Collections sind. Du musst nur sagen: „Füg mir einen Newsletter-Block am Footer hinzu".

## Was als Nächstes kommt

Wir starten mit Version 0.4 — Grundgerüst, sechs Skills, die wichtigsten Quality-Gates sind drin. In den nächsten Wochen kommen dazu:

- **Mehr Skills**: `/new-page`, `/translate` (für Migration von einsprachigen Sites), `/audit` (für Performance- und A11y-Checks)
- **Presets**: Restaurant, Coaching, Handwerk — vorkonfigurierte Farben, Seitenstrukturen, Beispielinhalte
- **Mehr Sprachen**: Französisch, Italienisch — die Architektur ist drauf vorbereitet
- **Component-Library**: Kleine, abnehmbare Bausteine (Pricing-Table, Testimonials-Karussell, Newsletter-Block) zum gezielten Adoptieren

Wenn du Lust hast mitzubauen: Das Repo liegt offen unter [github.com/passion4it-gmbh/passionfruit](https://github.com/passion4it-gmbh/passionfruit), Issues und PRs sind willkommen.

## Probier es aus

Ein Befehl reicht:

```bash
pnpm create passionfruit my-site
```

In fünf Minuten hast du eine deployte Website. Wenn dir was fehlt — schreib uns an [info@passion4it.de](mailto:info@passion4it.de) oder mach ein Issue auf GitHub auf.

Wir freuen uns drauf, deine erste passionfruit-Site zu sehen.
