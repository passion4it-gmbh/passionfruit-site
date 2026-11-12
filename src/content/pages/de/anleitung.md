---
translationKey: "guide"
title: "Anleitung: So benutzt du passionfruit"
description: "Von der leeren Vorlage zur Website im Netz. Was du brauchst, wo du arbeitest, welche Schritte Claude übernimmt und welche bei dir bleiben."
---

Diese Anleitung erklärt passionfruit von Anfang bis Ende. Sie richtet sich an Menschen, die eine Website wollen und nicht programmieren. Wer Entwickler ist, findet die technischen Details im [Repository auf GitHub](https://github.com/passion4it-gmbh/passionfruit).

## Was passionfruit ist

passionfruit ist eine kostenlose Website-Vorlage unter MIT-Lizenz. Du legst daraus dein eigenes Projekt an und sagst Claude Code in normalen Sätzen, was die Website zeigen soll. Claude schreibt den Code, die Texte in beiden Sprachen und hilft dir beim Veröffentlichen.

Wichtig zu wissen: Sobald dein Projekt angelegt ist, gehört es dir. Es gibt keine Verbindung mehr zur Vorlage, die sich von selbst aktualisiert. Neuerungen holst du dir bei Bedarf (siehe [Neuerungen übernehmen](#neuerungen-übernehmen)).

## Was du brauchst

| Was                        | Wofür                              | Kosten                   |
| -------------------------- | ---------------------------------- | ------------------------ |
| GitHub-Konto               | Hier liegt der Code deiner Website | kostenlos                |
| Claude-Abo mit Claude Code | Claude baut und pflegt die Website | ab dem Pro-Abo           |
| Cloudflare-Konto           | Hier läuft deine Website im Netz   | kostenloser Tarif reicht |

Wenn du auf deinem eigenen Rechner arbeitest statt im Browser, brauchst du zusätzlich Node.js ab Version 22.23.4, pnpm und git. Fehlt etwas davon, sagt dir Claude beim Start, was du installieren musst. Im Browser unter claude.ai/code ist alles schon vorhanden.

## Wo du arbeitest

passionfruit funktioniert nur in **Claude Code**. Der normale Claude-Chat kennt die Befehle wie `/onboard` nicht. Wenn du `/onboard` tippst und nichts passiert, bist du fast immer im Chat statt in Claude Code.

| Hier funktioniert es                                                                                   | Hier nicht                            |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| [claude.ai/code](https://code.claude.com/docs/en/claude-code-on-the-web) im Browser, ohne Installation | der normale Claude-Chat auf claude.ai |
| der Reiter **Code** in der [Claude-Desktop-App](https://code.claude.com/docs/en/desktop)               | der Chat-Bereich der Desktop-App      |
| Claude Code im Terminal oder in einer IDE-Erweiterung                                                  |                                       |

Die Befehle musst du dir nicht merken. Du kannst Claude auch einfach schreiben, was du willst, zum Beispiel „richte diese Website für mein Unternehmen ein“. Claude wählt dann den passenden Ablauf.

## Schritt 1: Projekt anlegen

Es gibt drei Wege. Alle führen zum selben Ergebnis, einem eigenen Projekt mit der Vorlage darin.

**Weg A, ohne Installation (empfohlen, wenn du nicht programmierst):**

1. Öffne die [Vorlage auf GitHub](https://github.com/passion4it-gmbh/passionfruit) und klicke auf **Use this template**. Gib deinem neuen Repository einen Namen.
2. Öffne [claude.ai/code](https://code.claude.com/docs/en/claude-code-on-the-web) und verbinde dein neues Repository.
3. Tippe `/onboard`.

**Weg B, auf deinem Rechner:** Gib im Terminal ein:

```bash
pnpm create passionfruit meine-website
```

Das lädt die aktuelle Version der Vorlage, legt den Ordner an, richtet git ein, installiert alles Nötige und speichert einen ersten Stand. Danach öffnest du den Ordner in Claude Code und tippst `/onboard`.

**Weg C, aus Claude Code im Terminal heraus:** Wer Claude Code im Terminal nutzt, kann die Vorlage als Plugin einbinden und das Projekt von Claude anlegen lassen:

```text
/plugin marketplace add passion4it-gmbh/passionfruit
/create-passionfruit-site
```

Claude fragt nach dem Namen und ob das Projekt öffentlich oder privat auf GitHub liegen soll, und übergibt danach an `/onboard`.

## Schritt 2: Website einrichten mit /onboard

`/onboard` macht aus der Beispiel-Website deine eigene. Claude prüft zuerst still, ob alles Nötige installiert ist, und fragt dann, ob du neu anfängst oder eine bestehende Website umziehst.

**Bestehende Website umziehen:** Du nennst die Adresse deiner jetzigen Seite. Claude liest Name, Seiten, Farben und Inhalte von dort und füllt die Antworten vor. Danach kann Claude die alten Seiten eine nach der anderen nachbauen.

**Neu anfangen:** Claude stellt dir die Fragen einzeln:

1. Wie heißt dein Unternehmen oder Projekt?
2. Was machst du? (ein Satz, er wird zur Unterzeile auf der Startseite)
3. Welche Sprache ist deine Hauptsprache?
4. Brauchst du eine zweite Sprache?
5. Welche Akzentfarbe soll es sein? (vier fertige Farben oder deine eigene)
6. Welche Seiten brauchst du? (zum Beispiel Über uns, Leistungen, Blog, Team, Kontakt)
7. Wie lauten deine Kontaktdaten?
8. Welche Angaben gehören ins Impressum? (Rechtsform, Verantwortlicher, USt-ID, Registergericht)
9. Welche Social-Media-Profile hast du?
10. Hast du schon eine eigene Web-Adresse?

Danach tauscht Claude alle Beispielinhalte gegen deine aus, entfernt Seiten, die du nicht brauchst, erzeugt ein neues Vorschaubild für soziale Netzwerke und speichert alles.

**Claude erfindet nichts.** Kundenstimmen, Zahlen, Auszeichnungen, Preise, Teammitglieder oder Stellenangebote kommen nur auf die Seite, wenn du sie lieferst. Hast du für einen Bereich noch nichts, bleibt er ausgeblendet, und Claude sagt dir am Ende, was weggelassen wurde. Du kannst es später ergänzen.

**Wann du das Ergebnis siehst:** Auf deinem Rechner startet Claude eine Vorschau unter `http://localhost:4321`. Im Browser unter claude.ai/code gibt es diese Vorschau nicht. Dort siehst du die Website zum ersten Mal, wenn sie mit `/deploy` online ist.

## Schritt 3: Logo einbinden mit /brand

`/brand` ersetzt das Platzhalter-Symbol im Browser-Tab und das Vorschaubild für soziale Netzwerke. Du hast drei Möglichkeiten: dein vorhandenes Logo verwenden, eines erzeugen lassen oder den Schritt erst einmal überspringen.

Arbeitest du im Browser, lädst du dein Logo zuerst in dein GitHub-Repository hoch (**Add file → Upload files**). Am besten eignet sich eine SVG-Datei, PNG und JPG gehen auch.

## Schritt 4: Online gehen mit /deploy

`/deploy` bringt deine Website ins Netz. Claude erledigt den technischen Teil. Im Cloudflare-Dashboard klickst du selbst, Claude sagt dir dabei jeden Schritt einzeln an.

Bevor es losgeht, prüft Claude, ob noch Platzhalter im Impressum oder in der Datenschutzerklärung stehen. Ist das so, hält Claude an. Eine öffentliche deutsche Website mit Platzhalter-Impressum ist ein rechtliches Risiko.

Im Cloudflare-Dashboard öffnest du **Workers & Pages**, wählst **Create application**, dann den Reiter **Pages** und **Connect to Git**. Dort wählst du dein Repository und trägst ein:

| Feld                   | Eintrag                                                        |
| ---------------------- | -------------------------------------------------------------- |
| Project name           | dein Firmenname in Kleinbuchstaben, zum Beispiel `meine-firma` |
| Production branch      | `main`                                                         |
| Framework preset       | Astro                                                          |
| Build command          | `pnpm build`                                                   |
| Build output directory | `dist`                                                         |

Nach ein paar Minuten ist die Website unter `meine-firma.pages.dev` erreichbar. Diese Adresse nennst du Claude, damit Suchmaschinen und Vorschaubilder die richtige Adresse verwenden.

**Eigene Domain:** In deinem Cloudflare-Projekt unter **Custom domains** trägst du deine Adresse ein. Liegt die Domain bei einem anderen Anbieter, zeigt Cloudflare dir den DNS-Eintrag, den du dort setzen musst.

**Achtung bei Cloudflare-Zusatzfunktionen:** Web Analytics, Zaraz und das Google-Tag-Gateway von Cloudflare fügen Skripte an deinem Cookie-Banner vorbei ein. Lass sie ausgeschaltet, solange sie nicht auf die Einwilligung warten.

**Kontaktformular (optional):** Ohne weitere Einrichtung öffnet das Formular das E-Mail-Programm des Besuchers. Sollen Nachrichten direkt in deinem Postfach landen, brauchst du ein kostenloses Brevo-Konto und den Spamschutz Turnstile von Cloudflare, das dauert etwa 15 Minuten. Die Schlüssel dafür trägst du selbst im Cloudflare-Dashboard ein.

**Passwörter und Schlüssel gehören nie in den Chat.** Claude fragt nicht danach. Wenn du einen Schlüssel brauchst, trägst du ihn direkt beim jeweiligen Anbieter ein.

## Im Alltag: Inhalte ändern

Ab jetzt sagst du Claude in normalen Sätzen, was sich ändern soll. Zum Beispiel: „Füge auf der Leistungsseite einen Abschnitt zu Schulungen hinzu“ oder „Mach die Überschriften auf der Startseite kürzer“.

So kommt eine Änderung auf die Website:

1. Claude legt jede Änderung auf einem eigenen Zweig an und öffnet einen Pull Request auf GitHub.
2. Cloudflare baut dazu eine Vorschau und hängt den Link an den Pull Request. Dort prüfst du das Ergebnis.
3. Passt alles, führst du den Pull Request zusammen. Damit geht die Änderung live.

Für wiederkehrende Aufgaben gibt es eigene Befehle. `/new-post` legt einen Blogbeitrag an, `/new-team-member` ein neues Teammitglied. Claude fragt dabei nach Inhalt, Autor und Schlagworten und schreibt den Beitrag in beiden Sprachen.

**Zwei Sprachen sind Pflicht, wenn du dich dafür entschieden hast.** Jede Seite und jeder Beitrag muss auf Deutsch und Englisch existieren. Fehlt eine Sprache, bricht der Build ab und nichts geht live. Das ist Absicht, damit keine halb übersetzte Website online steht. Hast du bei `/onboard` nur eine Sprache gewählt, entfällt diese Prüfung.

## Neuerungen übernehmen

passionfruit wird weiterentwickelt. Dein Projekt bekommt diese Neuerungen nicht automatisch, du entscheidest selbst, was du übernimmst.

Der einfachste Weg führt über Claude:

```text
Prüfe passion4it-gmbh/passionfruit/releases auf Versionen, die neuer
sind als unsere. Übernimm die Neuerungen, die für unsere Website sinnvoll
sind, und passe sie an unsere Farben an.
```

Wer lieber mit git arbeitet, kann die Vorlage als zweite Quelle einbinden und einzelne Änderungen übernehmen. Die genauen Befehle stehen im [README der Vorlage](https://github.com/passion4it-gmbh/passionfruit#staying-current). Über neue Versionen informiert dich GitHub, wenn du im Repository **Watch → Custom → Releases** wählst.

## Was bei dir bleibt

Claude nimmt dir viel Arbeit ab, aber nicht alles.

- **Rechtstexte prüfen lassen.** Impressum und Datenschutzerklärung füllt Claude mit deinen Angaben. Ob sie rechtlich ausreichen, sollte eine Anwältin, ein Anwalt oder ein Rechtstexte-Generator prüfen.
- **Inhalte liefern.** Kundenstimmen, Zahlen und Referenzen kommen von dir. Claude formuliert, erfindet aber nichts dazu.
- **Klicken in fremden Diensten.** Konten bei GitHub, Cloudflare und Brevo legst du selbst an, Einstellungen dort nimmst du selbst vor.
- **Freigeben.** Was live geht, entscheidest du, indem du den Pull Request zusammenführst.

## Wenn etwas hakt

**Ich tippe `/onboard` und nichts passiert.** Du bist im Claude-Chat statt in Claude Code. Wechsle zu claude.ai/code oder in den Reiter **Code** der Desktop-App.

**Der Build bei Cloudflare schlägt fehl.** Kopiere die letzten Zeilen des Build-Protokolls in den Chat mit Claude. Prüfe außerdem, ob als Build-Befehl `pnpm build` und als Ausgabeordner `dist` eingetragen ist.

**Die Website zeigt noch den alten Stand.** Schau im Cloudflare-Projekt unter **Deployments**, ob der letzte Durchlauf fertig ist. Warte eine Minute und lade die Seite neu.

**Am Pull Request erscheint kein Vorschau-Link.** Cloudflare baut Vorschauen nur für Zweige im selben Repository. Prüfe im Cloudflare-Projekt die Einstellungen unter **Settings → Builds**.

**Ich finde einen Knopf nicht, den Claude nennt.** Das Cloudflare-Dashboard ändert sich hin und wieder. Beschreib Claude, was du auf dem Bildschirm siehst, dann passt Claude die Anleitung an.

## Alle Befehle auf einen Blick

| Befehl                      | Was er tut                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------- |
| `/onboard`                  | richtet die Vorlage für dein Unternehmen ein oder zieht eine bestehende Website um |
| `/brand`                    | ersetzt Platzhalter-Symbol und Vorschaubild durch dein Logo                        |
| `/deploy`                   | bringt die Website über Cloudflare Pages ins Netz                                  |
| `/new-post`                 | legt einen Blogbeitrag in beiden Sprachen an                                       |
| `/new-team-member`          | legt ein Teammitglied mit Foto und Kurzprofil an                                   |
| `/create-passionfruit-site` | legt ein neues Projekt aus Claude Code im Terminal heraus an                       |

Fragen, die diese Anleitung nicht beantwortet, stellst du uns über das [Kontaktformular](/kontakt/).
