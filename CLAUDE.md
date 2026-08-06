# TADO

CLI that installs lifecycle AI-agent skill bundles into agent tool directories.
Zero external dependencies. Node ≥18 ESM.

## Commands

```bash
npm test                                     # node --test (integration, real temp dirs)
tado install --target codex,agents           # copy mode (default)
tado install --target claude --mode symlink  # symlink mode
tado install --target all                    # all 4 targets
tado plugin scaffold                         # Codex plugin + marketplace upsert
tado chain list                              # print proposed skill toolchains
tado chain check                             # validate every toolchain step resolves to a real skill
tado list                                    # print bundled skill names
```

## Skill groups

| Group | Skills |
|-------|--------|
| **lifecycle** | `apcp`, `aios-audit`, `wayfinder`, `project-init`, `project-mid`, `feature-init`, `ralph`, `memory-writer` |
| **engineering** | `harness-engineer`, `agentic-engineering`, `loop-engineering`, `vapt-init`, `playwright`, `osint-recon-frameworks`, `cloudfox`, `cyberchef`, `nuclei`, `sherlock`, `bloodhound`, `global-agent-guardrails`, `prompt-cache-cost-management` |
| **design** | `frontend`, `ai-ui-design`, `reference-to-design-system` |
| **media-design** | `bibigpt-media-workflow`, `media-design-bootstrap`, `open-design-plugin-authoring`, `video-toolkit-workflow`, `watch-video-and-answer` |
| **research** | `storm-research`, `prd-builder`, `grill-with-docs`, `context7`, `opensrc`¹, `craft-prompt` |
| **deliberation** | `the-council` |
| **utilities** | `caveman`, `ai-news`², `doc-cleanup`, `wait-what`, `guided-setup-walkthrough` |
| **dev-workflow** | `agent-observability`, `agentic-review-loop`, `agentic-system-design`, `ai-automation-delivery-loop`, `claude-code-idea-to-build-loop`, `claude-code-website-hacks`, `claude-design-workflow`, `cloud-agent-build-verify-loop`, `decision-review`, `fable-mode`, `git-worktree-isolation`, `goal-file-orchestration-prompt`, `herder-agent-workspace`, `in-house-ai-consultant-roadmap`, `no-mistakes-review-pipeline`, `phased-app-build-system`, `repo-to-skill`, `scrollworld`, `senior-engineer-prompting`, `yt-to-skill` |
| **writing** | `humanize-proofreader` |
| **personal-ops** | `personal-assistant-buildout`, `llm-wiki-builder`, `personal-web-cleanup` |
| **trading** | `kronos-candlestick-forecasting`, `order-flow-trading`, `price-action-market-structure`, `trading-fundamentals`, `trend-pullback-trading` |
| **chains**³ | `new-project-bootstrap`, `idea-to-shipped-app`, `research-to-prompt`, `loop-design-to-runtime-ops`, `design-system-to-implementation`, `security-baseline-to-recon`, `ingest-to-skill-authoring`, `session-hygiene-loop` |

> ¹ `opensrc` — Claude only. `allowed-tools` frontmatter ignored by Codex; requires `opensrc` binary.
> ² `ai-news` — Claude only. Uses `WebSearch` + writes to `raw/website/`; won't function in Codex without equivalent tool wiring.
> Some `dev-workflow`/`design`/`personal-ops` skills spawn dedicated subagents (`arl-*`, `uiux-*`, `pab-*`, `pabs-*`, etc). Their `.md` files live at `skills/<category>/<skill>/agents/claude/` and are installed into `<target>/agents/` alongside the skill — Codex has no equivalent yet since no `.toml` companions exist for them.
> ³ `chains` — each skill is a thin sequencer over an existing `TOOLCHAINS` entry in `lib/constants.js`; body just tells the agent which skills to invoke, in order, via the Skill tool. Keep both in sync by hand if a chain's steps change.

## Structure

```
bin/tado.js          entry point
lib/cli.js           arg parser + command dispatch
lib/install.js       skill + agent copy/symlink logic
lib/plugin.js        Codex plugin scaffold + marketplace upsert
lib/chain.js          validates TOOLCHAINS steps resolve to real SKILL_NAMES entries
lib/constants.js     targets, layouts, skill names — single source of truth
lib/fs-utils.js      ensureDir / copyOrSymlink / readJson / writeJson
skills/              79 SKILL.md bundles (installed verbatim)
agents/codex/        harness-engineer.toml
agents/claude/       harness-engineer.md
test/cli.test.js     integration tests (no mocks)
```

## Target layouts

| Target  | Skills                 | Agent companion                              |
|---------|------------------------|----------------------------------------------|
| codex   | ~/.codex/skills/       | ~/.codex/agents/harness-engineer.toml        |
| claude  | ~/.claude/skills/      | ~/.claude/agents/harness-engineer.md         |
| agents  | ~/.agents/skills/      | —                                            |
| cursor  | ~/.cursor/skills/      | —                                            |

## Conventions

- No external deps — stdlib only (`node:fs`, `node:path`, `node:os`)
- Tests hit real filesystem via temp dirs; no mocks
- `copyOrSymlink` always replaces destination before writing
- New targets: add to `PRESET_ROOTS` + `TARGET_LAYOUTS` in `constants.js`
- New skills: add dir under `skills/`, append name to `SKILL_NAMES` in `constants.js`
