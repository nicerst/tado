---
name: harness-engineer
description: >
  Audit and upgrade a project's Codex harness: rules, hooks, settings, handoff,
  project DNA, and project-specific skills. Produces `.Codex/.harness-gaps.json`
  and, in audit mode, `.Codex/.harness-gaps-postbuild.json`.
trigger: /harness-engineer
---

# /harness-engineer

The harness is the multiplier. Same model, better harness, better output.

## Modes

- `/harness-engineer` → full audit + build
- `/harness-engineer audit` → re-audit only
- `/harness-engineer drift` → compare expected harness vs current state
- `/harness-engineer ratchet "<failure>"` → encode one recurring failure permanently

In Codex, prefer an isolated subagent/worktree when the runtime supports it. If not, run inline but keep only the compact gap report in the main context.

## What to read first

- `AGENTS.md`
- `.Codex/settings.json`
- `.Codex/settings.local.json` if present
- `.Codex/hooks/`
- `.Codex/skills/`
- `.Codex/project-dna.md` if present
- stack manifest (`package.json`, `pyproject.toml`, etc.)

## Audit dimensions

Score each as present / partial / missing:
- rules discipline
- safety guard hook
- lint/feedback hook
- stop gate
- session handoff + load
- project DNA / cold-start brief
- stack-specific validation wiring
- project-specific skills

Critical gaps:
- no stop gate
- no destructive-op guard
- hooks wired but non-blocking when they should block
- no handoff/project DNA on long-running work

## Gap report

Always write `.Codex/.harness-gaps.json` in full mode.

Required fields per gap:
- `gap_id`
- `severity`
- `title`
- `description`
- `affected_files`
- `independent`
- `template_type`
- `confidence`
- `status`

Also output a human summary grouped by severity.

## Audit mode

For `/harness-engineer audit`:
1. read `.Codex/.harness-gaps.json`
2. re-check each gap
3. write `.Codex/.harness-gaps-postbuild.json` with `resolved|open|new`
4. stop

Do not build in audit mode.

## Build targets

Build only components that deliver a clear behavior:

- `protect` hook
  - blocks destructive commands and immutable-path writes
- `lint` hook
  - immediate non-blocking feedback after edits
- `gate` hook
  - blocks false completion until project checks pass
- `handoff` and `load_handoff`
  - preserve resume context across sessions
- tightened `AGENTS.md`
  - short, incident-backed rules only
- `.Codex/project-dna.md`
  - compaction-proof project brief
- project skills
  - only for repeated workflows that merit codification

## Codex-safe workflow rules

- If the runtime has native task tracking, use it.
- If not, persist one checklist item per gap in `HANDOFF.md`; do not invent another fallback file.
- If isolated subagents are unavailable, execute gaps sequentially and keep the per-gap result contract.

Per built gap, capture:
- status
- files written
- smoke-test result
- short failure reason if incomplete

## Ratchet mode

Map recurring failures to the right layer:
- convention gap → `AGENTS.md`
- unsafe operation → guard hook
- false done → gate
- repeated re-briefing → handoff / project DNA

Add one concrete fix, not a policy essay.

## Rules

- Never finish full mode without `.Codex/.harness-gaps.json`.
- Never claim a harness gap is fixed without smoke-testing the affected hook/rule.
- Never build speculative harness pieces "for later".
- Prefer fewer, stronger controls over many advisory notes.
