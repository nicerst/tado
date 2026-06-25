---
name: project-init
description: >
  Full project bootstrap. Establishes the product brief, stress-tests scope,
  verifies scaffold, audits the harness, records one gap per task/checklist
  item, builds missing harness pieces, smoke-tests them, writes memory, and
  exits with a clean quality gate.
trigger: /project-init
---

# /project-init

Run once at project start, or once after a major stack reset.

## Modes

- `/project-init`
- `/project-init existing`
- `/project-init harness-only`

## Fixed order

### 0. Skill/runtime check

In Codex, the skill system is already loaded. Do not re-bootstrap it.

If the repo depends heavily on external libraries, check whether `context7` is available. If not, note the gap and continue.

### 1. PRD

Run `prd-builder` unless `existing` or `harness-only` mode skips it.

Write a short memory checkpoint to `memory/decisions.md` after the PRD:
- project intent
- stack guess
- hard constraints

### 2. Grill

Run `grill-with-docs` unless skipped by mode.

Do not proceed until:
- every acceptance criterion is testable
- ambiguous domain language is resolved
- at least 3 edge cases are scoped in/out
- the user explicitly agrees to move on

Write a second memory checkpoint with clarified ACs and edge cases.

### 3. Confirm scaffold

Verify:
- git repo exists
- real project scaffold exists (`package.json`, `pyproject.toml`, etc.)

If missing, stop and tell the user to scaffold first.

### 3.5 Frontend gate

If frontend detected:
- run `frontend` for dial calibration
- if existing UI exists, audit it quickly before building more UI

### 3.6 Doc cleanup

For `existing` projects only, run `doc-cleanup` before harness audit.
Non-blocking.

### 3.7 Write `.Codex/project-dna.md`

Record:
- intent
- stack
- hard constraints
- success definition
- UI dials if relevant
- harness metadata

Every spawned worker or future session should be able to start from this file.

### 4. Harness audit

Run `harness-engineer` in full mode.

Required artifact:
- `.Codex/.harness-gaps.json`

If it is missing, stop. No build work starts before the gap file exists.

### 5. Gap tracking

Create one tracked item per gap.

Write the canonical gap checklist into `HANDOFF.md` immediately.
If the runtime also supports native task/plan tracking, mirror the same gaps there, but `HANDOFF.md` remains the fallback source of truth.

Do not skip low-severity gaps; just deprioritize them.

### 5.5 Proactive `HANDOFF.md`

Write it before build starts:
- project intent
- gap list in priority order
- tracked item IDs or checklist markers
- exact resume command

### 6. Build plan

Show:
- which gaps are independent
- which must stay sequential

Auto-proceed unless the user explicitly stops.

### 7. Build gaps

Priority:
- CRITICAL
- HIGH
- MEDIUM
- LOW

If isolated worktree/subagent execution is available, parallelize only independent gaps.
Otherwise run sequentially.

Per gap, persist:
- status
- files written
- smoke-test result
- failure note if partial

### 7.5 Post-build re-audit

Run `harness-engineer audit`.

Use `.Codex/.harness-gaps-postbuild.json` to:
- requeue unresolved gaps
- surface new gaps
- update `HANDOFF.md`

### 8. Smoke-test

Detect hook runtime first, then test every built hook.

Do not mark a harness gap done unless the affected hook/rule actually works.

### 9. Memory

Run `memory-writer`.

Minimum outputs:
- `memory/decisions.md`
- `memory/patterns.md`
- `memory/user_prefs.md`

Secret scan before finalizing memory.

### 10. Quality gate

Run the stack-appropriate gate:
- build
- typecheck if relevant
- test suite if present
- dependency audit

Blocking:
- failed build/test/typecheck
- critical dependency vulnerabilities

### 11. Final report

Output:
- harness score before/after
- files/hook set built
- open remaining gaps
- gate result
- next command (`/feature-init` or equivalent)

Update hook checksums and harness version in `.Codex/project-dna.md`.

## Rules

- Do not start feature work before Step 4 + Step 5 are done.
- `HANDOFF.md` is the canonical fallback checklist if native tasks are absent.
- Do not skip smoke tests.
- Do not leave open CRITICAL/HIGH harness gaps and call init complete.
