---
name: apcp
description: >
  AI Project Continuity Protocol. Use at session start, before handoff, or
  before a context reset. Keeps sessions grounded in project files, not chat
  memory, and tracks DX drift, loop state, and ponytail debt.
trigger: /apcp
---

# /apcp

Sessions run on files, not conversation history.

Priority order on conflict:
1. Source code
2. `ARCHITECTURE.md`
3. `business-rules.md`
4. `database.md`
5. `api-contracts.md`
6. `memory/*.md`
7. Current conversation

## Required files

- `.Codex/project-dna.md`
- `HANDOFF.md`
- `ARCHITECTURE.md`
- `.Codex/ponytail.md` or `ponytail.md`
- `memory/decisions.md`
- `business-rules.md`
- `database.md`
- `api-contracts.md`

Missing file → note the gap, say what risk it creates, continue with what exists.

## Ponytail debt

Track only needless complexity:
- duplicate helpers for the same job
- abstractions with one caller or one implementation
- speculative config/scaffolding
- code added to work around an old model limitation

Do not label ordinary unfinished work as ponytail debt.

## Modes

### Session Start

Run in order:
1. Read the required files that exist.
2. Check DX state:
   - are hooks present and wired?
   - is `AGENTS.md` current?
   - is `HANDOFF.md` fresh?
3. Check loop state:
   - active branch
   - open harness gaps
   - `prd.json` / `progress.txt` if present
4. List current ponytail debt.
5. Output a compact orient block before doing implementation work.

Output:

```markdown
## Session Orient

**Completed:** [...]
**In Progress:** [...]
**Blocked:** [...]
**DX Check:** hooks [ok|issue], handoff [fresh|stale], rules [ok|issue]
**Loop State:** [manual build | feature-init pending | ralph-ready | ralph running]
**Ponytail Debt:** [...]
**Open Questions:** [...]   # only if truly needed
```

### Handoff

Run before ending a session or before a reset.

1. Update `HANDOFF.md`:
   - what changed
   - files touched
   - open items
   - exact resume point
2. Append new non-obvious decisions to `memory/decisions.md`.
3. Append new validated patterns to `memory/patterns.md`.
4. Update `.Codex/project-dna.md` if stack, constraints, or harness state changed.
5. Update ponytail debt notes in `.Codex/ponytail.md` or `ponytail.md`.
6. If the user asked for a commit, or the session workflow explicitly requires it, commit the doc updates.

### Reset

Use when context is noisy or after a major phase boundary.

1. Run Handoff first.
2. Verify the required files are current enough that a fresh session could continue safely.
3. Tell the user what command/skill should start next session.

## Rules

- Do not trust the chat over the files.
- Do not invent missing requirements.
- Do not overwrite memory files; append.
- Do not write code before Session Start completes when `/apcp` was explicitly invoked.
