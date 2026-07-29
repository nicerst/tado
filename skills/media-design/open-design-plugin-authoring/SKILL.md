---
name: open-design-plugin-authoring
description: Use when creating, validating, or preparing an Open Design skill, plugin, template, design system, prototype, deck, video, or artifact package.
source: https://github.com/nexu-io/open-design
source_commit: 7af539b89c981b23c74f1af78b38d351f56540f8
license: Apache-2.0
---

# Open Design Plugin Authoring

Build Open Design skills/plugins as portable contracts first. Add runtime/plugin metadata only when needed.

## Setup

```bash
git clone https://github.com/nexu-io/open-design.git
cd open-design
corepack enable
pnpm install
pnpm tools-dev run web
```

Requirements: Node `~24`, pnpm `10.33.2`.

Windows fallback:

```bash
npm install -g pnpm@10.33.2
```

## Choose The Artifact Lane

Classify first:

- `prototype`
- `deck`
- `template`
- `design-system`
- `image`
- `video`
- `audio`
- `live-artifact`
- `hyperframes`

Then decide whether output is:

- Skill only: `SKILL.md` + optional `assets/` and `references/`.
- Plugin: `SKILL.md` + `open-design.json` + preview/examples/evals.
- Runtime adapter: data object + registry entry, not a custom class unless stream format is new.

## Workflow

1. Restate brief and output lane.
2. Draft `SKILL.md` as the portable contract.
3. Add `DESIGN.md` only when a reusable brand/design system is required.
4. Add `open-design.json` only for marketplace/plugin behavior.
5. Keep capabilities minimal and explicit.
6. Add preview/example artifacts for visual plugins.
7. Add evals only where failures are concrete.
8. Validate.

## Commands

```bash
pnpm tools-dev
pnpm tools-dev run web
pnpm tools-dev status
pnpm tools-dev logs
pnpm tools-dev check
pnpm guard
pnpm typecheck
pnpm --filter @open-design/web build
pnpm --filter @open-design/daemon build
od mcp install <agent>
od mcp install <agent> --print
od skills list
od skills show <id>
od plugin scaffold --id my-plugin --title "My Plugin"
od plugin validate ./my-plugin
pnpm --filter @open-design/plugin-runtime typecheck
```

## Rules

- Use `pnpm tools-dev`; avoid legacy root aliases like `pnpm dev`, `pnpm start`, `pnpm daemon`.
- Filesystem-capable runtimes should write canonical files, not echo source inside `<artifact>`.
- Text/API runtimes should return one complete `<artifact>`.
- `OD_DAEMON_URL` must be a real port, not `:0`.
- Derive daemon data paths from resolved `OD_DATA_DIR` or `RUNTIME_DATA_DIR`.
- Skills registry is read-only; distribute new work through plugins unless repo docs say otherwise.

## Avoid

- Do not create a plugin when a skill-only folder works.
- Do not invent broad capabilities "for later".
- Do not add a per-agent class for a runtime adapter if data registration covers it.
- Do not submit without preview/screenshot and trust/capability explanation.
