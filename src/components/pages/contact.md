---
component: contact
oneLiner: Contact page with prose sidebar, contact info, and async form
status: stable
tags: [page]
---

## Purpose

Renders the bilingual contact page. Fetches the `contact` pages-collection entry for the current locale, renders its markdown body alongside a structured contact-info sidebar (email, phone, address icons), and an accessible async contact form. The form POSTs JSON to a Cloudflare Pages Function (`/api/contact`) when `PUBLIC_FORM_ENDPOINT` is set, or falls back to a pre-filled `mailto:` link. A hidden `company` honeypot field and optional Cloudflare Turnstile challenge protect against spam.

## When to use

On a site that has the `contact` entry in `PAGES` (`src/lib/page-registry.ts`). Invoked by the catch-all route `src/pages/[...path].astro` — do not instantiate directly.

## When NOT to use

- Do not use for a simple "get in touch" inline teaser — a `<Button>` pointing at the contact page is sufficient.
- Do not use if you only need a plain email link; a `mailto:` anchor suffices without this full page composer.

## Props

| Prop          | Type     | Required | Default | Notes                                                       |
| ------------- | -------- | -------- | ------- | ----------------------------------------------------------- |
| `lang`        | `Locale` | yes      | —       | Drives i18n strings, collection lookup, and alternate slug. |
| `currentSlug` | `string` | yes      | —       | Passed through to `BaseLayout` for the active nav link.     |

## Example

```astro
---
import Contact from "~/components/pages/contact.astro";
---

<!-- Invoked by src/pages/[...path].astro via PageContent — do not call directly -->
<Contact lang="de" currentSlug="kontakt" />
```

Composes: `<BaseLayout>` (headerVariant: "on-dark"), dark hero with heading and lead from `entry.data`, two-column section with prose `<Content />` + contact-info links on the left, and an async form card on the right. The form's translated UI strings are injected as `data-*` attributes on the `<form>` element so the inline `<script>` can access them without re-importing i18n.

Delivery is selected by the `PUBLIC_FORM_ENDPOINT` build-time env var:

1. **Unset (default)** — submission opens a pre-filled `mailto:` in the visitor's mail client.
2. **`/api/contact`** — POSTs `{ name, email, message, honeypot, turnstileToken, lang }` JSON to the Cloudflare Pages Function, which verifies Turnstile (when configured) and delivers via Brevo.

## i18n keys

| Key                                | Notes                                        |
| ---------------------------------- | -------------------------------------------- |
| `contact.title`                    | `<BaseLayout>` SEO title and meta            |
| `contact.description`              | `<BaseLayout>` meta description              |
| `contact.info.email`               | Displayed email and `mailto:` href           |
| `contact.info.phone`               | Displayed phone number and `tel:` href       |
| `contact.info.address`             | Displayed address string                     |
| `contact.form.name`                | Name field label                             |
| `contact.form.email`               | Email field label                            |
| `contact.form.message`             | Message field label                          |
| `contact.form.send`                | Submit button default label                  |
| `contact.form.sending`             | Submit button label while fetch is in-flight |
| `contact.form.success`             | Success message shown after submission       |
| `contact.form.error`               | Error message shown on failed submission     |
| `contact.form.privacyNoticePrefix` | Text before the privacy policy link          |
| `contact.form.privacyLinkLabel`    | Anchor text for the privacy policy link      |
| `contact.form.privacyNoticeSuffix` | Text after the privacy policy link           |
| `site.name`                        | Hero eyebrow label                           |

## Gotchas

- **Pages collection entry is required.** If no `pages` entry with `translationKey: "contact"` exists for the locale, the component redirects to `/404`. Both DE and EN entries must be present.
- **Honeypot is always active.** The `company` field is rendered off-screen with `aria-hidden`. Any non-empty value causes the function to silently return 200 without sending mail.
- **Turnstile is opt-in.** Set `PUBLIC_TURNSTILE_SITE_KEY` to render the Turnstile widget and load `challenges.cloudflare.com/turnstile/v0/api.js`. Leave it unset to skip the challenge entirely (honeypot still protects).
- **Displayed email is not the delivery recipient.** `contact.info.email` (in `de.json` / `en.json`) is what visitors see. `BREVO_API_KEY` and the To/From addresses are configured in `functions/api/contact.ts` and as Cloudflare Pages secrets — never exposed as `PUBLIC_*` vars.
- **Privacy notice link is resolved dynamically.** The privacy page slug is looked up via `findPageByKey("privacy")` so it stays correct across both locales without hardcoding paths.
- **Form i18n strings travel via `data-*` attributes.** The inline `<script>` reads `form.dataset.*` — do not remove these attributes or the client-side form logic breaks silently.
- **Re-init on view transitions.** Both the form handler and the scroll animation observer re-attach on `astro:after-swap`.
