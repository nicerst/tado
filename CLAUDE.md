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
tado list                                    # print bundled skill names
```

## Skill groups

| Group | Skills |
|-------|--------|
| **lifecycle** | `apcp`, `project-init`, `project-mid`, `feature-init`, `ralph`, `memory-writer` |
| **engineering** | `harness-engineer`, `agentic-engineering`, `loop-engineering`, `vapt-init` |
| **design** | `frontend`, `ai-ui-design` |
| **research** | `storm-research`, `prd-builder`, `grill-with-docs`, `context7` |
| **maintenance** | `doc-cleanup` |

## Structure

```
bin/tado.js          entry point
lib/cli.js           arg parser + command dispatch
lib/install.js       skill + agent copy/symlink logic
lib/plugin.js        Codex plugin scaffold + marketplace upsert
lib/constants.js     targets, layouts, skill names — single source of truth
lib/fs-utils.js      ensureDir / copyOrSymlink / readJson / writeJson
skills/              14 SKILL.md bundles (installed verbatim)
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
