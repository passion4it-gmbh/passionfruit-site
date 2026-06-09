---
component: PostHogAnalytics
oneLiner: Consent-gated PostHog EU analytics with session replay and autocapture
status: stable
tags: [analytics]
---

## Purpose

Loads the PostHog JS SDK only after analytics consent is granted via the `passionfruit:consent-changed` event. Configured for the EU-hosted PostHog instance by default (`https://eu.i.posthog.com`). Enables session recording (all inputs masked), autocapture, performance monitoring, and page-leave tracking. Handles Astro SPA navigation by firing `$pageview` on `astro:after-swap`. No-op when `PUBLIC_POSTHOG_API_KEY` is absent.

## When to use

- When session replay, funnel analysis, feature flags, or heatmaps are needed — capabilities GA4 lacks.
- Alongside `GoogleAnalytics` — both load independently on consent with no conflict.
- When EU data residency is required (default host is `https://eu.i.posthog.com`).

## When NOT to use

- When `PUBLIC_POSTHOG_API_KEY` is not set — the component silently no-ops.
- When only basic page-view analytics are needed and GA4 is already configured — PostHog adds a second CDN request; justify the payload.

## Props

None

## Example

```astro
---
// Typically placed in the shared layout, e.g. src/layouts/BaseLayout.astro
import PostHogAnalytics from "~/components/PostHogAnalytics.astro";
---

<head>
  <!-- ... -->
  <PostHogAnalytics />
</head>
```

## i18n keys

None

## Gotchas

- **Env-var gated.** Requires `PUBLIC_POSTHOG_API_KEY` at build time. When absent, renders nothing — silent no-op. Optionally set `PUBLIC_POSTHOG_HOST` (ingest, defaults to `https://eu.i.posthog.com`) and `PUBLIC_POSTHOG_UI_HOST` (dashboard, defaults to `https://eu.posthog.com`).
- **Consent required.** Calls `window.hasAnalyticsConsent()` before initializing. Listens for `passionfruit:consent-changed` for deferred consent. `CookieConsent.astro` must be present on the page.
- **EU instance.** The default `api_host` points to PostHog's EU ingest endpoint. To use the US instance, set `PUBLIC_POSTHOG_HOST=https://us.i.posthog.com` and `PUBLIC_POSTHOG_UI_HOST=https://app.posthog.com`.
- **Session recording is on by default** with `maskAllInputs: true`. To disable, edit the component and set `disable_session_recording: true` in the PostHog `init` config — there is no prop for this.
- **`person_profiles: 'identified_only'`** — anonymous visitors do not get a person profile, reducing EU GDPR exposure.
- **`window.posthog.__loaded` guard.** Prevents re-initialization across idle callbacks and consent events.
- **Cookie autoclear.** The `CookieConsent` config automatically clears PostHog cookies (`/^_ph/`, `/^ph_/`) when the user revokes analytics consent.
- **CSP.** PostHog loads `array.js` from `https://us-assets.i.posthog.com` (the SDK CDN, even for EU instances). Add this origin to `script-src` in `public/_headers` or PostHog will be blocked silently.
- **Idle loading.** Uses `requestIdleCallback` (3 s timeout) or `setTimeout(200 ms)` fallback so PostHog never blocks first paint.
