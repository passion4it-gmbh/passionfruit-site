---
component: StructuredData
oneLiner: Injects a Schema.org JSON-LD script tag into the page head
status: stable
tags: [seo]
---

## Purpose

Renders a `<script type="application/ld+json">` tag containing a Schema.org structured data object. Enables rich results in search engines (breadcrumbs, articles, organizations, FAQs, events) without any runtime JS overhead. The component is a thin wrapper — it does no validation; the caller is responsible for providing a well-formed Schema.org object.

## When to use

- On any page that has machine-readable entity data to expose (articles, organizations, FAQs, local business, breadcrumbs).
- Alongside helper functions in `src/lib/` that produce validated Schema.org objects, keeping page files clean.

## When NOT to use

- For arbitrary JSON embedding — use a native `<script>` tag if the data is not Schema.org.
- More than once per entity type per page — duplicate JSON-LD types can confuse crawlers. Multiple calls are fine for distinct types.

## Props

| Prop   | Type                      | Required | Default | Notes                                                                                                                                |
| ------ | ------------------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `type` | `string`                  | yes      | —       | Schema.org type string (e.g. `"Organization"`). Documentary only — not injected into output; the `data` object must include `@type`. |
| `data` | `Record<string, unknown>` | yes      | —       | The full Schema.org object to serialize. Must include `@context` and `@type`.                                                        |

## Example

```astro
---
import StructuredData from "~/components/StructuredData.astro";

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "passion4it",
  url: "https://passionfruit.passion4it.de",
};
---

<StructuredData type="Organization" data={orgLd} />
```

## i18n keys

None

## Gotchas

- **`type` is purely documentary.** It does not appear in the rendered output. The `data` object must carry `"@type"` itself.
- **`data` is serialized with `JSON.stringify` via Astro's `set:html`.** `set:html` is safe here because JSON-LD is not parsed as HTML markup, but avoid putting unsanitized user-controlled strings in `data` values.
- **Place this component inside `<head>` or at the very top of `<body>`.** Crawlers expect JSON-LD early in the document.
- **No runtime JS.** The component renders a static `<script>` tag — zero JavaScript executes on the client.
