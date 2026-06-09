---
component: CookieConsent
oneLiner: GDPR cookie consent banner (vanilla-cookieconsent) with DE/EN translations
status: stable
tags: [consent]
---

## Purpose

Renders the `vanilla-cookieconsent` banner and preferences modal. Dispatches `passionfruit:consent-changed` events that all analytics components listen to. Exposes `window.hasAnalyticsConsent()` as the synchronous consent check gate used by `GoogleAnalytics` and `PostHogAnalytics`. Banner copy is hardcoded in both DE and EN — no build-time i18n dependency.

## When to use

- Once, in the shared layout, on every page of the site.
- Whenever any analytics component (`GoogleAnalytics`, `PostHogAnalytics`) is present — without `CookieConsent`, analytics components have no consent signal and never load.

## When NOT to use

- More than once per page — `CookieConsent.run()` is global; a second instantiation will conflict.
- On a site with no analytics or third-party scripts — the banner is unnecessary overhead if no consent-gated content exists.

## Props

| Prop   | Type     | Required | Default | Notes                                                                               |
| ------ | -------- | -------- | ------- | ----------------------------------------------------------------------------------- |
| `lang` | `string` | yes      | —       | Current page locale. Accepts `"de"` or `"en"` — unknown values fall back to `"en"`. |

## Example

```astro
---
// In your shared layout, e.g. src/layouts/BaseLayout.astro
import CookieConsent from "~/components/CookieConsent.astro";
---

<html lang={lang}>
  <head></head>
  <body>
    <slot />
    <CookieConsent lang={lang} />
  </body>
</html>
```

## i18n keys

None — banner copy is hardcoded inside the component in both DE and EN. It does not use `useTranslations`. To change banner text, edit the `translations` object inside `CookieConsent.astro`.

## Gotchas

- **Two consent categories only:** `necessary` (always on, read-only) and `analytics`. There is no marketing/advertising category — ad consent signals in GA4 are permanently denied.
- **Auto-detects locale from `document.documentElement.lang` at runtime.** The `lang` prop is passed for SSR consistency but the component reads the DOM attribute at boot. Always set the correct `lang` on the `<html>` element.
- **`window.__cookieConsentReady` flag.** Set to `true` after `CookieConsent.run()` completes. `window.hasAnalyticsConsent()` returns `false` until this flag is set, preventing a race where analytics runs before consent state is loaded.
- **Cookie settings button.** Any element with `id="cookie-settings"` opens the preferences modal on click. Add a footer link with this ID to let users revisit their choices. Re-wired on `astro:after-swap` for SPA navigation.
- **PostHog cookie autoclear.** When the user revokes analytics consent, `vanilla-cookieconsent` automatically clears cookies matching `/^_ph/` and `/^ph_/`. GA4 cookies are not autocleaned — the browser retains them until expiry.
- **`vanilla-cookieconsent` CSS** is imported globally inside the component. The `<style is:global>` block sets the library's CSS variables to values matching `--color-accent`, `--color-surface`, and Inter from `global.css`. This is the only sanctioned place for hex literals in a component — do not import the library CSS elsewhere.
- **Consent Mode v2 integration** is handled by the individual analytics components, not here. `CookieConsent` only dispatches the event; analytics components interpret it.
