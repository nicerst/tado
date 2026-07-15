---
name: ralph
description: "Autonomous agent loop: execute a PRD in iterative cycles until all user stories pass. Each cycle spawns a fresh agent, commits one story, marks it done. Use for long-running implementation tasks that exceed single-session context."
trigger: /ralph
version: 1.0.0
---

# /ralph

Autonomous implementation loop. Turns a PRD into code, one user story per iteration, until all stories pass.

Named after Ralph Wiggum — not smart, but keeps going.

---

## When to Use

- Multi-story implementation that would exhaust a single context window
- Unattended coding runs (overnight, between meetings)
- Projects where each story is independently committable
- Testing how far an agent can run before needing human input

---

## How It Works

```
prd.json (stories with passes: false)
  → ralph.sh spawns fresh claude/amp
  → agent reads prd.json, picks highest-priority passes: false story
  → implements all acceptance criteria
  → runs quality checks (typecheck, tests, lint)
  → commits with story ID in message
  → marks story passes: true in prd.json
  → appends summary to progress.txt
  → if all stories pass: outputs <promise>COMPLETE</promise>
  → ralph.sh detects signal → exits 0
  → else: ralph.sh waits 2s → spawns next iteration
```

Each iteration: **fresh context**. No accumulated hallucination or context drift. Memory lives in git history + `progress.txt` + `prd.json`.

Each iteration must decide and record its reasoning in `progress.txt`, never pause mid-story to ask the user — runs are unattended by design; a fresh-context agent that asks a clarifying question stalls the whole run.

---

## Setup

```bash
# Add ralph files to your project root
# Minimum: ralph.sh + CLAUDE.md + prd.json
# Source: https://github.com/snarktank/ralph

chmod +x ralph.sh
```

Or use `opensrc` to fetch:

```bash
opensrc path snarktank/ralph
cp $(opensrc path snarktank/ralph)/ralph.sh ./
cp $(opensrc path snarktank/ralph)/CLAUDE.md ./RALPH.md  # rename to avoid collision
cp $(opensrc path snarktank/ralph)/prd.json.example ./prd.json
```

---

## prd.json Format

```json
{
  "project": "MyApp",
  "branchName": "ralph/feature-name",
  "description": "Short description of what to build",
  "userStories": [
    {
      "id": "US-001",
      "title": "Add priority field to database",
      "description": "As a developer, I need to store task priority so it persists.",
      "acceptanceCriteria": [
        "Add priority column to tasks table: 'high' | 'medium' | 'low' (default 'medium')",
        "Generate and run migration successfully",
        "Typecheck passes"
      ],
      "priority": 1,
      "passes": false,
      "notes": ""
    }
  ]
}
```

**Priority** = execution order. Lower = first. Each story should be independently committable.

**Story design rules:**
- One story = one commit. Scope accordingly.
- Acceptance criteria must be verifiable (pass/fail, not "looks good").
- Dependent stories must have sequential priorities with no gaps between them.

---

## Running

```bash
./ralph.sh --tool claude 10      # up to 10 iterations, Claude Code
./ralph.sh --tool amp 20         # up to 20 iterations, Amp
./ralph.sh 5                     # 5 iterations, default tool (amp)
```

Watch output in terminal. Each iteration prints header + agent output.

**Stop condition:** `<promise>COMPLETE</promise>` in agent output → exits 0.
**Timeout:** hits max iterations → exits 1. Check `progress.txt` for last known state.
**Stall condition:** same story fails quality checks 2 cycles in a row with no change in failure mode (same error, same file) → stop, flag story for human review. Don't burn remaining iterations retrying an unchanging failure.

---

## Memory Architecture

| File | Purpose | Durability |
|------|---------|-----------|
| `prd.json` | Stories + pass/fail state | Persists across runs |
| `progress.txt` | Append-only iteration log | Never reset within run |
| `git commits` | Each story = one atomic commit | Permanent |
| `.last-branch` | Detects branch change → triggers archive | Temp tracking |
| `archive/` | Snapshots of completed runs | Permanent |

**Archive trigger:** when `branchName` in prd.json changes between runs, previous `prd.json` + `progress.txt` auto-archive to `archive/YYYY-MM-DD-feature-name/`.

---

## Customizing Quality Checks

The per-iteration `CLAUDE.md` prompt tells the agent what quality gates to run. Edit the quality checks section:

```markdown
## Quality Checks (must all pass before marking story done)
- npx tsc --noEmit
- npm test
- npm run lint
- npx playwright test    # add for E2E
```

Adapt to your stack: `pytest` for Python, `go test ./...` for Go, `cargo test` for Rust.

For story-level code review beyond typecheck/test/lint, wire `agentic-review-loop`'s AI review score gate (≥4/5) into the per-iteration CLAUDE.md prompt — the generator (ralph's spawned agent) should not be the one approving its own story as done.

---

## Monitoring a Run

```bash
# Watch progress in real time
tail -f progress.txt

# See completed stories
cat prd.json | jq '.userStories[] | select(.passes == true) | .title'

# See remaining stories
cat prd.json | jq '.userStories[] | select(.passes == false) | .title'

# Git log of story commits
git log --oneline
```

---

## Project-Mid Candidate

Ralph is the execution engine for a planned `project-mid` health-check skill. At day 30+, when a project has accumulated stories and humans need to step back:
1. `/project-mid` recalibrates scope, archives completed stories, surfaces drift
2. Hands off remaining stories to ralph for autonomous execution
3. Human reviews and merges ralph's commits

`project-mid` is flagged, not yet built.

---

## Anti-Patterns

- Tightly coupled stories — if US-002 requires US-001's schema change, order correctly and ensure each commit compiles standalone
- Max iterations too high — diminishing returns after context is "used up"; 10–15 is usually right
- No quality checks in CLAUDE.md — ralph marks stories done without verifying they work
- Editing prd.json during a ralph run — ralph reads it at iteration start; concurrent edits confuse state
- Stories with vague acceptance criteria — "looks good" is not verifiable; use specific pass/fail tests
