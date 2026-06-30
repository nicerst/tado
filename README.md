# `@nicerst/tado`

Portable lifecycle skill bundle for Codex-style agent workflows.

Bundled skills (22):

| Group | Skills |
|-------|--------|
| **lifecycle** | `apcp`, `project-init`, `project-mid`, `feature-init`, `ralph`, `memory-writer` |
| **engineering** | `harness-engineer`, `agentic-engineering`, `loop-engineering`, `vapt-init`, `playwright` |
| **design** | `frontend`, `ai-ui-design` |
| **research** | `storm-research`, `prd-builder`, `grill-with-docs`, `context7`, `opensrc` |
| **deliberation** | `the-council` |
| **utilities** | `caveman`, `ai-news`, `doc-cleanup` |

## Install via `npx`

```bash
npx @nicerst/tado install --target codex,agents
```

Other targets:

```bash
npx @nicerst/tado install --target claude
npx @nicerst/tado install --target cursor --mode symlink
npx @nicerst/tado install --target all
```

Target layouts:
- `codex` -> `~/.codex/skills` plus `~/.codex/agents/harness-engineer.toml`
- `agents` -> `~/.agents/skills`
- `claude` -> `~/.claude/skills` plus `~/.claude/agents/harness-engineer.md`
- `cursor` -> `~/.cursor/skills`

Cursor note:
- This package installs user skills into `~/.cursor/skills`.
- It does not write into Cursor's built-in `~/.cursor/skills-cursor` directory.

## Install globally

```bash
npm install -g @nicerst/tado
tado install --target codex,agents
```

## Codex plugin flow

Scaffold a local plugin copy plus marketplace entry:

```bash
npx @nicerst/tado plugin scaffold
codex plugin add tado@personal
```

This creates:
- plugin files under `~/plugins/tado`
- marketplace entry in `~/.agents/plugins/marketplace.json`

Plugin note:
- The `plugin scaffold` flow is Codex-specific.
- Claude and Cursor support in this package is via direct skill installation, not plugin scaffolding.

## Copy vs symlink

Default mode is `copy`.

Use symlinks if you want one working tree to drive all installs:

```bash
npx @nicerst/tado install --target codex --mode symlink
npx @nicerst/tado plugin scaffold --mode symlink
```

## Development

```bash
npm test
```
