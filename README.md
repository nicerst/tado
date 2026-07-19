# `@nicerst/tado`

Portable lifecycle skill bundle for Codex-style agent workflows.

Bundled skills (51):

| Group | Skills |
|-------|--------|
| **lifecycle** | `apcp`, `project-init`, `project-mid`, `feature-init`, `ralph`, `memory-writer` |
| **engineering** | `harness-engineer`, `agentic-engineering`, `loop-engineering`, `vapt-init`, `playwright` |
| **design** | `frontend`, `ai-ui-design`, `reference-to-design-system` |
| **research** | `storm-research`, `prd-builder`, `grill-with-docs`, `context7`, `opensrc`¹ |
| **deliberation** | `the-council` |
| **utilities** | `caveman`, `ai-news`², `doc-cleanup` |
| **dev-workflow** | `agentic-review-loop`, `agentic-system-design`, `claude-code-idea-to-build-loop`, `claude-code-website-hacks`, `claude-design-workflow`, `fable-mode`, `goal-file-orchestration-prompt`, `in-house-ai-consultant-roadmap`, `phased-app-build-system`, `repo-to-skill`, `yt-to-skill` |
| **writing** | `humanize-proofreader` |
| **personal-ops** | `personal-assistant-buildout`, `llm-wiki-builder` |
| **trading** | `order-flow-trading`, `price-action-market-structure`, `trading-fundamentals`, `trend-pullback-trading` |

> ¹ **`opensrc`** — Claude only. Uses `allowed-tools: Bash(opensrc:*)` frontmatter (ignored by Codex) and requires the `opensrc` binary installed separately. Installs to Codex but tool permission won't auto-apply.
>
> ² **`ai-news`** — Claude only. Uses `WebSearch` tool and writes to `raw/website/` — both Claude Code-specific. Installs to Codex but won't function without equivalent tool wiring.
>
> Some `dev-workflow`/`design`/`personal-ops` skills spawn dedicated subagents (`arl-*`, `uiux-*`, `pab-*`, `pabs-*`, etc). Their `.md` files live at `skills/<category>/<skill>/agents/claude/` and install to `~/.claude/agents/` alongside the skill. **Claude only** — Codex has no Task/Agent-tool equivalent to auto-spawn subagents mid-skill, so these skills still run on Codex but degrade to no auto-delegation.

## Install via `npx`

Claude Code + Codex, both at once:

```bash
npx @nicerst/tado install --target claude,codex
```

Other targets:

```bash
npx @nicerst/tado install --target claude
npx @nicerst/tado install --target codex
npx @nicerst/tado install --target cursor --mode symlink
npx @nicerst/tado install --target all
```

Target layouts:
- `codex` -> `~/.codex/skills` plus `~/.codex/agents/harness-engineer.toml`
- `agents` -> `~/.agents/skills`
- `claude` -> `~/.claude/skills` plus `~/.claude/agents/harness-engineer.md` and per-skill subagents under `~/.claude/agents/`
- `cursor` -> `~/.cursor/skills`

## From a fresh `git clone` (no npm registry)

```bash
git clone <repo-url> tado
cd tado
node bin/tado.js install --target claude,codex
```

No `npm install` needed — zero external deps. Re-running the same command after `git pull` updates skills already on disk, or install with `--mode symlink` once so future `git pull`s update in place with no re-install step.

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
