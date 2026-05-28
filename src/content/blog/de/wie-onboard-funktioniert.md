---
translationKey: "how-onboard-works"
title: "Wie /onboard funktioniert"
description: "Acht Fragen, eine personalisierte Marketing-Website. Wir zerlegen den /onboard-Skill Schritt für Schritt."
publishedAt: 2026-05-28
author: "PASSION4IT"
heroImage: ../../../assets/blog/how-onboard-works.webp
tags: ["skills", "tutorial"]
---

Wenn du `pnpm create passionfruit my-site` ausführst, bekommst du erstmal eine generische Vorlage mit Platzhalter-Texten und einem Beispiel-Branding. Der nächste Schritt — `/onboard` — verwandelt diese Vorlage in **deine** Website. Acht Fragen, vielleicht zwanzig Minuten Zeit, danach ist alles personalisiert.

Schauen wir uns an, was hinter jeder Frage steht.

## 1. Wie heißt deine Firma oder dein Projekt?

Der Name landet in deutlich mehr Dateien, als du denkst: i18n-JSONs (DE und EN), strukturierte Daten als JSON-LD, der Title-Suffix in jedem `<head>`, das Footer-Copyright, das Header-Logo, die README. Claude erledigt diesen Find-and-Replace zuverlässig — und vor allem überall.

## 2. Was machst du? (Ein Satz)

Dieser eine Satz wird zur Meta-Description, zum Hero-Subtitle und — wenn du keine Custom-OG-Bilder hochlädst — zum Default-Sharing-Snippet. Investier zwei Minuten Hirnschmalz hier. Eine gute Beschreibung lautet nicht „Wir machen Webdesign" sondern „Wir bauen Online-Shops für regionale Manufakturen, die internationale Kunden gewinnen wollen".

## 3. Was ist deine primäre Sprache?

Deutsch im Apex oder Englisch im Apex? passionfruit nutzt das **apex-locale**-Schema: Die Primärsprache liegt unter `/`, die Sekundärsprache unter `/en/` (oder `/de/`). Das ist nicht nur Routing — es bestimmt, wie der Sprach-Switcher arbeitet, welches `<html lang>` initial gesetzt wird und wie der `x-default` hreflang-Eintrag aussieht.

## 4. Brauchst du eine zweite Sprache?

Wenn nein, baut Claude die Vorlage zu einer einsprachigen Site um: Die `/en/`-Routen werden gelöscht, das Page-Registry wird auf Single-Slug-Einträge umgestellt, der Sprach-Switcher verschwindet aus dem Header, der Bilingual-Check wird deaktiviert. Wenn ja, fragt Claude nach dem Locale (`en`, `fr`, `it` …) und behält die volle Architektur.

## 5. Welche Akzentfarbe?

Vier Presets sind direkt anwählbar: Indigo, Smaragd, Bernstein, Rosa. Oder du beschreibst deine Markenfarben mit Worten („tiefes Petrol mit warmen Akzenten") und Claude leitet die Tokens ab. Geändert werden drei CSS-Variablen in `src/styles/global.css`: `--color-accent`, `--color-accent-hover`, `--color-accent-glow`. Der Rest des Designs adaptiert sich automatisch.

## 6. Welche Seiten brauchst du?

Multi-Select aus: Home, Über uns, Leistungen, Blog, Team, Kontakt, Datenschutz, Impressum. Was du abwählst, wird aus drei Stellen entfernt: dem Page-Registry, der Navigation in Header und Footer, dem `src/components/pages/`-Verzeichnis. Was du behältst, bleibt als personalisierbarer Platzhalter zurück.

## 7. Kontaktdaten?

E-Mail, Telefon, Adresse — diese landen im Footer, auf der Kontaktseite, im Impressum, im JSON-LD `Organization`-Schema. Die Adresse wird auch korrekt in die strukturierten Daten für lokale SEO eingebaut, falls du auf Google Maps gefunden werden willst.

## 8. Social-Media-Links?

LinkedIn, Instagram, X, GitHub — was du angibst, landet im Footer als Icon-Linkleiste und in den `sameAs`-Einträgen des Organization-JSON-LD.

## Was danach passiert

Nach den acht Antworten arbeitet Claude die folgenden Dateien in Lockstep durch:

- `src/i18n/de.json` und `src/i18n/en.json` (Firmenname, Tagline, Navigation, Footer-Copyright)
- `src/lib/structured-data.ts` (Organization-JSON-LD)
- `src/layouts/BaseLayout.astro` (Title-Suffix)
- `astro.config.mjs` (Site-URL, falls angegeben)
- `src/styles/global.css` (Akzentfarbe-Tokens)
- `src/lib/page-registry.ts` (entfernte Seiten)
- `src/components/Header.astro` und `Footer.astro` (Navigation)
- `src/components/pages/imprint.astro` und `privacy.astro` (Adresse, Geschäftsführer)
- `CLAUDE.md` Abschnitt 1 (Projektkontext für zukünftige Sessions)
- `STYLE_GUIDE.md` (Farb-Sektion)
- `README.md` (Marketing-Boilerplate raus, kurzer business-spezifischer Text rein — die „Staying Current"-Sektion bleibt verbatim drin, weil sie erklärt, wie du Framework-Updates ziehst)

Am Ende macht Claude einen Commit: `feat: initial setup — [Firmenname] website`.

## Migration einer bestehenden Site

`/onboard` hat eine zweite Variante: Wenn du sagst „ich migriere eine bestehende Website", fragt Claude nach der URL, crawlt die Site (oder lässt sich von dir die Seiten beschreiben), und füllt die Antworten für dich aus. Danach hilft dir der `/goal`-Skill, die alten Inhalte systematisch in die neue Struktur zu übernehmen — Seite für Seite, mit modernem Design.

## Was als Nächstes

Nach `/onboard` willst du wahrscheinlich `/brand` ausführen — das ersetzt das Platzhalter-Favicon und das OG-Sharing-Bild durch deine eigenen. Und wenn die Site dir gefällt: `/deploy` richtet Cloudflare Pages ein.

Probier es selber:

```bash
pnpm create passionfruit my-site
cd my-site
claude
/onboard
```
