# passionfruit-site

The marketing site for **passionfruit** — the bilingual website template that turns Claude Code into your web developer.

Live at **[passionfruit.passion4it.de](https://passionfruit.passion4it.de)**.

This site is itself a passionfruit project. The repo doubles as a working example of what users get out of the box — no custom components, no special tricks. If a feature exists here, it exists in every passionfruit scaffold.

## Local development

```bash
pnpm install
pnpm dev          # local server at http://localhost:4321
pnpm build        # production build (lint + typecheck + bilingual check)
pnpm check:all    # full CI suite locally
```

## Related

- **Framework:** [`passion4it-gmbh/passionfruit`](https://github.com/passion4it-gmbh/passionfruit) — the template this site uses
- **CLI:** [`passion4it-gmbh/create-passionfruit`](https://github.com/passion4it-gmbh/create-passionfruit) — `pnpm create passionfruit`
- **Agency:** [passion4it.de](https://passion4it.de) — the team behind it

## Staying Current

passionfruit is a one-shot template — your project is yours once it's scaffolded. But passionfruit itself keeps evolving (new components, design improvements, security fixes), and you can pull those in whenever you want.

**The Claude-driven way (recommended):**

```
Check passion4it-gmbh/passionfruit/releases for versions newer than
ours. Pull in the newsletter signup component from the latest release
and adapt it to our brand colors.
```

Claude fetches the relevant files from the latest release, adapts them to your codebase, and wires them in. You only adopt what's useful.

**The git-native way:**

```bash
git remote add upstream https://github.com/passion4it-gmbh/passionfruit.git
git fetch upstream main
git log HEAD..upstream/main --oneline       # see what's new
git cherry-pick <sha>                        # pick a specific change
```

Expect conflicts on `src/i18n/*.json`, `src/lib/page-registry.ts`, and `src/content/` — those are your business content, keep your version.

Watch [Releases](https://github.com/passion4it-gmbh/passionfruit/releases) (click "Watch" → "Custom" → "Releases" on the repo) to get notified when there's something worth adopting.

## License

MIT
