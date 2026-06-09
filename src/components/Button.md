---
component: Button
oneLiner: Variant×tone CTA primitive that renders as <a> or <button> automatically
status: stable
tags: [primitive]
---

## Purpose

Single CTA primitive covering three visual variants (`primary`, `secondary`, `ghost`) across two surface tones (`on-light`, `on-dark`). Renders as an `<a>` when `href` is provided and as a `<button>` otherwise — no conditional import logic needed at the call site.

## When to use

- Primary call-to-action on hero sections, cards, and form submissions.
- Secondary or ghost links that must look like buttons (e.g., "Learn more" alongside a primary CTA).
- Any interactive element that needs consistent 44px touch target, focus ring, and transition behavior.

## When NOT to use

- Inline text links inside paragraphs — use a styled `<a>` element; `Button` is display-level, not inline.
- Navigation links in `<nav>` bars — use `<a>` directly; `Button` adds visual weight that conflicts with navigation semantics.
- Icon-only actions without visible text — the component has no icon-only padding shortcut; compose with `@lucide/astro` and supply an `aria-label` manually.

## Props

| Prop      | Type                                  | Required | Default      | Notes                                                                           |
| --------- | ------------------------------------- | -------- | ------------ | ------------------------------------------------------------------------------- |
| `variant` | `"primary" \| "secondary" \| "ghost"` | no       | `"primary"`  | Visual style.                                                                   |
| `tone`    | `"on-light" \| "on-dark"`             | no       | `"on-light"` | Surface context. Affects secondary and ghost colors; primary is accent on both. |
| `href`    | `string`                              | no       | —            | When present, renders an `<a>`; absent → `<button>`.                            |
| `type`    | `"button" \| "submit"`                | no       | `"button"`   | Only applied when rendering as `<button>`.                                      |
| `class`   | `string`                              | no       | `""`         | Extra classes merged onto the root element.                                     |

Additional HTML attributes (e.g., `aria-label`, `data-*`, `disabled`) are spread through `...rest`.

## Example

```astro
---
import Button from "~/components/Button.astro";
---

<!-- Link CTA (renders as <a>) -->
<Button href="/kontakt">Kontakt aufnehmen</Button>

<!-- Submit button -->
<Button type="submit" variant="secondary">Abschicken</Button>

<!-- Ghost button on dark surface -->
<Button variant="ghost" tone="on-dark" href="/en/features">Learn more</Button>
```

## i18n keys

None

## Gotchas

- When `href` is set, `type` is ignored — the element is an `<a>`, not a `<button>`.
- The `disabled:` Tailwind modifier fires on `<button>` but never on `<a>` — anchors have no `:disabled` pseudo-class. When rendering as a link, add `aria-disabled="true"` and prevent navigation in JS manually.
- Minimum height is 44px (`min-h-[44px]`) for touch compliance; don't override this with a tighter height utility.
- Focus ring uses `focus-visible`, so it only appears on keyboard navigation — no visual noise for mouse users.
