---
translationKey: "why-bilingual-matters"
title: "Warum zweisprachig — von Anfang an"
description: "Die meisten Static-Site-Generatoren behandeln i18n als Nachgedanken. passionfruit macht zweisprachig zum Default. Warum das ein Unterschied ist, der zählt."
publishedAt: 2026-05-28
author: "PASSION4IT"
heroImage: ../../../assets/blog/why-bilingual-matters.webp
tags: ["architecture", "i18n"]
---

Wenn du heute mit irgendeinem Static-Site-Generator startest, ist Mehrsprachigkeit ein Plugin. Astro hat `astro-i18n`, Hugo hat `i18n`-Bundles, Next hat `next-intl`. Alle drei funktionieren — aber alle drei behandeln den zweisprachigen Fall als **Erweiterung** des einsprachigen Standards. Du fängst mit einer Sprache an, dann fügst du irgendwann eine zweite hinzu, und plötzlich sind die Hälfte deiner Seiten halb übersetzt, die Slug-Übersetzungen passen nicht zusammen, der Sprach-Switcher zeigt auf 404er.

passionfruit dreht diese Annahme um. **Zweisprachig ist die Grundannahme**, einsprachig ist der Spezialfall.

## Was das in der Architektur bedeutet

Wenn du `pnpm create passionfruit my-site` ausführst, bekommst du eine Site mit Deutsch im Apex (`/`) und Englisch unter `/en/`. Beide Sprachen existieren, beide haben echten Inhalt, beide gehen durch den Build. Wenn du im `/onboard`-Skill „nein, ich brauche nur eine Sprache" sagst, **entfernt** Claude die zweite Sprache — und nicht umgekehrt.

Das ist nicht nur Pedanterie. Es bestimmt vier Architektur-Entscheidungen:

### 1. Page-Registry als Single Source of Truth

`src/lib/page-registry.ts` listet jede statische Seite mit beiden Slugs:

```ts
{
  key: "features",
  slug: { de: "funktionen", en: "features" },
  component: () => import("~/components/pages/features.astro"),
}
```

Diese Struktur generiert dann automatisch:

- Den catch-all Routing-Handler (`src/pages/[...path].astro`)
- Die zweisprachige `sitemap.xml`
- Die `hreflang`-Annotationen in `BaseLayout.astro`
- Den Sprach-Switcher — der nur Gegenstücke verlinkt, die wirklich existieren

Wenn dir der Slug `funktionen` nicht gefällt, änderst du ihn an **einer** Stelle. Alles andere folgt.

### 2. Content-Collections mit translationKey

Jeder Blogbeitrag, jede statische Seiten-Markdown hat einen `translationKey` im Frontmatter:

```yaml
---
translationKey: "introducing-passionfruit"
title: "Introducing passionfruit"
---
```

Der gleiche Key existiert auch in der DE-Version. Das macht das Pairing trivial — kein Convention-over-Configuration-Voodoo, kein „dasselbe Filename muss in beiden Ordnern liegen". Nur ein Key.

### 3. `check-bilingual.mjs` — der Pre-Build-Wächter

Ein 200-Zeilen-Skript läuft als `prebuild`-Hook. Für jede Content-Collection prüft es: existiert jeder `translationKey` in **beiden** Lokalen? Wenn nein, bricht der Build ab — bevor du auch nur deployen kannst.

Das mag pedantisch klingen. Aber wir haben das Skript geschrieben, **nachdem** wir mehrfach „nur kurz" eine deutsche Seite ergänzt und vergessen hatten, die englische nachzuziehen. Drei Wochen später kommt die Beschwerde vom Kunden. Das Skript verhindert exakt diesen Fall.

### 4. i18n-Keys in JSON, nicht in Komponenten

Jede UI-Zeichenkette wohnt in `src/i18n/de.json` oder `en.json`. Komponenten benutzen ausschließlich `t("path.to.key")`. Das hat zwei Vorteile:

1. Du kannst die JSON-Dateien an einen Übersetzer schicken, ohne dass er Tailwind-Klassen versteht
2. cspell prüft die Übersetzungen direkt, mit deutschen **und** englischen Wörterbüchern

## Was das dem Nutzer bringt

Konkret: Diese Website hier. Du liest sie gerade — wahrscheinlich auf Deutsch, weil du im DACH-Raum sitzt. Aber wenn du den Switcher oben rechts klickst, bist du sofort auf der englischen Version — gleiche Inhalte, gleiche Struktur, korrekt verlinkt, mit hreflang im `<head>` für Google.

Wir haben diese Website nicht „nach und nach" übersetzt. Wir haben sie zweisprachig **gebaut**. Jeder Commit, der einen DE-String ergänzt, hatte den passenden EN-String dabei — sonst wäre der Build gescheitert.

Das ist der Unterschied zwischen „Mehrsprachigkeit als Feature" und „Mehrsprachigkeit als Architektur".

## Wenn du das nicht brauchst

Fair: Viele Sites brauchen keine zweite Sprache. Ein Restaurant in Berlin-Neukölln, das nur deutsch sprechende Gäste bedient, braucht keine englische Übersetzung. Ein lokaler Handwerker, dessen Kundenkreis 50 km umfasst, auch nicht.

Für genau diesen Fall hat `/onboard` die Frage 4: „Brauchst du eine zweite Sprache?" Antwort: nein. Claude baut zurück.

Aber selbst dann profitierst du indirekt: Der Page-Registry ist immer noch sauber, die i18n-Keys sind immer noch zentral, du könntest **morgen** eine zweite Sprache hinzufügen, ohne irgendwas umzubauen. Die Architektur kostet dich nichts, gewinnt dir aber Optionen.

## Was passieren würde, hätten wir es andersrum gemacht

Hätten wir mit einsprachig angefangen und Bilingual später draufgepfropft, wären wahrscheinlich diese Bugs entstanden, die ich aus alten Projekten kenne:

- Vergessene Übersetzungen, die in Production als `[missing: key]` durchscheinen
- Sprach-Switcher, die auf 404er zeigen
- Sitemap, in der nur die Primärsprache auftaucht
- Hreflang fehlt komplett
- Slug-Übersetzungen, die zwischen DE und EN drifte (`/leistungen` ↔ `/en/services` ist easy; `/blog/mein-post` ↔ `/en/blog/mein-post` weil jemand vergessen hat, den Slug zu übersetzen — passiert ständig)

Indem wir den Fall „nur eine Sprache" als Special-Case behandeln, kriegen wir all das geschenkt — auch für einsprachige Sites.

## Probier es selber

Eine Sprache reicht dir? Cool — `/onboard` fragt, wir bauen zurück.

Du willst beide? Noch cooler — `pnpm create passionfruit my-site` ist eh schon zweisprachig.

```bash
pnpm create passionfruit my-site
```
