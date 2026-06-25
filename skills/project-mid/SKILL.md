---
name: project-mid
description: >
  Mid-project health check for day-30+ work. Reads git state and prd/story
  state, surfaces drift, runs a light harness decay scan, refreshes memory,
  and optionally prepares a manual ralph handoff.
trigger: /project-mid
---

# /project-mid

Use when the project has shipped enough changes that the original plan is no longer trustworthy.

## Steps

### 1. Read current truth

Read:
- last 30 commits
- `git status`
- `prd.json` if present
- `progress.txt` if present
- `AGENTS.md`
- `memory/decisions.md`
- `memory/patterns.md`

Build three buckets:
- shipped
- drifted
- outstanding

### 2. Drift analysis

Output:

```text
DRIFT ANALYSIS
Shipped (N):
Drifted (N):
Outstanding (N):
```

Rules:
- `passes: true` stories are shipped candidates
- code in git but absent from plan is drift
- vague or oversized remaining stories count as outstanding debt

### 3. 4-check decay scan

Check only these four things. Do not spawn `harness-engineer` here.

1. Hooks exist and are executable
2. `AGENTS.md` is current enough to trust
3. `.env`-style secrets are ignored by git
4. `memory/` files exist

Flag failures as harness decay, not feature work.

### 4. Scope decision — hard human gate

Present the three lists and ask for a decision before editing the plan:
- cut
- absorb
- add
- reprioritize
- approve as-is

Do not continue without an explicit answer.

### 5. Refresh `prd.json`

Apply the human decision.

Ralph-ready story rules:
- one story = one context window
- one story = one commit
- acceptance criteria must be mechanical
- dependent stories must compile in sequence

If `prd.json` is missing, build one from the shipped/drift/outstanding analysis plus the Step 4 decision.

### 6. Refresh memory

Append only:
- `memory/decisions.md` for scope choices and why
- `memory/patterns.md` for patterns that emerged during the build

### 7. Ralph handoff — optional

If the user wants autonomous execution:
1. confirm `passes: false` stories remain
2. confirm `ralph.sh` exists, or print setup steps
3. print the launch command only

Never auto-launch `ralph`. `--dangerously-skip-permissions` stays a deliberate manual action.

### 8. Summary

Output:

```text
PROJECT-MID COMPLETE
Shipped: N
Drifted: N
Outstanding: N
Harness: ok|issue
Memory: updated|created
Ralph: ready|skipped
```

## Rules

- Step 4 is blocking.
- Do not run a full harness audit here.
- Do not overwrite memory files.
- Do not leave vague acceptance criteria in `prd.json`.
