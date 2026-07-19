---
name: apcp
description: >
  AI Project Continuity Protocol. Ensures every session starts from documentation, not conversation
  history. Sessions are queue items — fresh context per session, state lives in files not memory.
  Modes: session-start (orient + loop/DX/debt check), handoff (capture state + commit), reset (full update + commit).
  Trigger: "/apcp", "run continuity protocol", "session start protocol", "update handoff", "context reset".
---

# AI Project Continuity Protocol (APCP)

Production-grade sessions run on documentation, not memory. Conversation history is temporary. Project files are permanent. Source code wins. Docs win over conversation.

**Doctrine framing:**
- **Harness Over Model (queue model):** Each session is a queue item. Fresh context per session. State lives in files and git, not the running context window. DX≈AX — if the codebase is hard to read, the next session's agent starts blind.
- **Agent Loops:** Sessions contain loops. Loops have state. Handoff captures loop state so the next session picks up mid-loop without re-deriving iteration count, cost, or stop criteria.
- **Ponytail:** Complexity debt is tracked across sessions via `ponytail.md`. Session start surfaces it; handoff records new debt added.

---

## Priority Order

When information conflicts, this order wins:

1. Source Code
2. Architecture Documentation
3. Business Rules
4. Memory Files (`memory/decisions.md`, `memory/patterns.md`)
5. Current Conversation

Conflict → higher priority wins. Never invent missing requirements. Never trust conversation over code.

---

## Required Project Files

| File | Purpose |
|------|---------|
| `docs/memory.md` or `memory/decisions.md` | Decisions, rationale, assumptions, status, debt |
| `docs/architecture.md` or `ARCHITECTURE.md` | System design, modules, patterns |
| `docs/business-rules.md` | Domain logic, constraints |
| `docs/database.md` | Schema, relationships, naming conventions |
| `docs/api-contracts.md` | API shapes, versioning, breaking-change log |
| `docs/handoff.md` or `HANDOFF.md` | Completed / Current / Next / Blockers / Risks / Files |
| `docs/progress.txt` | Append-only per-session timeline (HANDOFF.md is overwritten; this isn't) |
| `.claude/project-dna.md` | Intent, stack, constraints, DX baseline, loop library |
| `.claude/ponytail.md` | Complexity debt ledger — `ponytail:` comment index |

Missing file → identify it, state the risk, continue with available info. Missing `project-dna.md` = highest risk: agents in this session will re-derive project context and make different assumptions.

---

## Mode: Session Start

Run at the beginning of every session. Reads state; does not write anything.

### Step 1 — Read all docs

In order:
1. `.claude/project-dna.md` — project intent, stack, classification (strategic/tactical), DX baseline, loop library
2. `HANDOFF.md` or `docs/handoff.md` — what was in progress
3. `memory/decisions.md` or `docs/memory.md` — key decisions and rationale
4. `ARCHITECTURE.md` or `docs/architecture.md` — system design
5. `docs/business-rules.md` — domain constraints (if exists)
6. `docs/database.md` — schema (if exists)
7. `docs/api-contracts.md` — API contracts (if exists)
8. `.claude/ponytail.md` — current debt ledger

### Step 2 — DX≈AX check (Harness Over Model)

Before reading any code: assess whether the codebase is agent-navigable.

```bash
# Type coverage
cat tsconfig.json 2>/dev/null | grep '"strict"'
cat pyproject.toml 2>/dev/null | grep 'mypy\|pyright'

# ARCHITECTURE.md freshness
git log --oneline -1 -- ARCHITECTURE.md 2>/dev/null || echo "NOT TRACKED"

# Module count
find . -name "*.ts" -not -path "*/node_modules/*" 2>/dev/null | wc -l
```

Compare to `dx_score_baseline` in `project-dna.md`. Flag if:
- Strict typing disabled since last session: "⚠ DX regression — code generated this session will be lower quality."
- ARCHITECTURE.md not updated in >14 days but code changed: "⚠ Architecture doc stale — read carefully, may not reflect current structure."
- Module count grew >20% since baseline: "⚠ Fragmentation signal — ARCHITECTURE.md critical before any agent spawns."

### Step 3 — Loop state check (Agent Loops)

Read `project-dna.md → Loop Library`. Read `HANDOFF.md → Loop State` (if present from previous session).

For each loop that was running last session:
- What iteration was it at?
- Did it hit its hard cap?
- Were stop criteria met or still pending?
- Any unexpected costs or runaway behavior?

Surface to user:
```
Loop State:
  loop-001 [name] — status: running | paused | complete | cap_hit
  Last iteration: N / hard cap: M
  Stop criteria: [met | pending — condition]
  Cost signal: [normal | ⚠ unexpected token usage]
```

If no loop state in HANDOFF.md: flag "No loop state recorded — if loops ran last session, verify manually before resuming."

For deeper loop health audit (failure modes, component gaps, cost signals): invoke `/loop-engineering audit` with the Loop Library as context. Optional — run when loops behaved unexpectedly or cost signals are high.

### Step 4 — Ponytail debt signal

```bash
grep -rc "ponytail:" . --include="*.ts" --include="*.py" --include="*.js" --include="*.go" 2>/dev/null | awk -F: '{sum += $2} END {print "Ponytail debt:", sum, "items"}'
```

Read `.claude/ponytail.md` for trend from last session. Surface:
- Count + trend (stable / growing / shrinking)
- If count > 10: "⚠ High debt — consider debt sprint before new features this session."
- If count > 20: "⚠ Critical debt — strongly recommend cleanup before any feature work."

### Step 5 — Harness health quick check

```bash
# Hooks still executable?
ls -la .claude/hooks/ 2>/dev/null || echo "NO HOOKS"

# .env in .gitignore?
grep -E "^\.env" .gitignore 2>/dev/null || echo "⚠ .ENV NOT IN GITIGNORE — CRITICAL"
```

Flag CRITICAL if `.env` not in `.gitignore`. Surface hook status in orient output.

### Step 6 — Build mental model

Classify modules: **completed / in-progress / blocked / debt**.

Never write code before completing steps 1–5.

### Step 6.5 — Route recommendation

Based on what Steps 1–6 just read, state which backbone skill fits this session — recommendation only, never auto-invoke:

- No `.claude/project-dna.md` found → `/project-init`
- `prd.json` exists with open (`passes: false`) stories and the ask is "continue/resume/keep going" → `/ralph`
- `project-dna.md` exists and `last_init`/`last_mid` is 30+ days ago, or ponytail/loop signals show drift → `/project-mid`
- Harness exists, no drift signal, new feature work being described → `/feature-init`
- None of the above (a one-off question, a detour skill named directly) → no recommendation needed

### Step 7 — Orient output

```
## Session Orient
_[YYYY-MM-DD HH:MM] — session-start_

**DX score:** N/3 (baseline: N/3) [delta: +N/-N | regression ⚠]
**Hooks:** ✅ present | ⚠ [issue]
**Ponytail debt:** N items [stable | growing ⚠ | shrinking ✅]

**Completed:** [list]
**In Progress:** [list]
**Blocked:** [list — include reason]
**Tech Debt:** [list]

**Loop State:**
  [loop-id] [name] — [status] — iter N/hard_cap M — [stop criteria status]
  (none active)

**Open Questions:** [only if required — one per line]

**Priority for this session:** [inferred from HANDOFF.md next steps]
**Recommended next skill:** [from Step 6.5 — omit line if none applies]
```

Ask clarifying questions only if required. One question at most. Do not enumerate options the user didn't ask about.

---

## Mode: Handoff

Run when context reaches ~40–60% or before ending a session.

### Step 1 — DX delta check

Before writing docs, check whether DX degraded during this session:

```bash
cat tsconfig.json 2>/dev/null | grep '"strict"'
ls ARCHITECTURE.md 2>/dev/null || echo "MISSING"
find . -name "*.ts" -not -path "*/node_modules/*" 2>/dev/null | wc -l
```

If DX dropped vs session-start reading: flag in HANDOFF.md as a blocker. Next session's agent needs to know typing loosened.

### Step 2 — Capture loop state

For each loop that ran this session:

```
loop_id: [id]
name: [name]
iterations_run: N
hard_cap: M
stop_criteria_met: yes | no — [condition status]
cost_signal: normal | ⚠ unexpected [describe]
resume_from: [iteration N+1 | complete | blocked]
```

Write to HANDOFF.md under `## Loop State`. If no loops ran: write `loops: none this session`.

### Step 3 — Capture ponytail debt

```bash
# New ponytail: comments added this session vs session-start count
git diff HEAD --unified=0 | grep "^+" | grep "ponytail:"
```

For each new `ponytail:` entry: append to `.claude/ponytail.md`:
```markdown
## [YYYY-MM-DD] <file:line> — <description>
`ponytail: <original comment text>`
Status: open
```

Update trend line in `ponytail.md`:
```
[YYYY-MM-DD] debt count: N (delta: +N/-N since session-start)
```

### Step 4 — Update docs

1. `memory/decisions.md` or `docs/memory.md` — add any new decisions, rationale, assumptions made this session
2. `HANDOFF.md` or `docs/handoff.md` — full structure below
3. `ARCHITECTURE.md` or `docs/architecture.md` — if architecture changed
4. `docs/database.md` — if schema changed
5. `docs/api-contracts.md` — if APIs changed
6. `.claude/project-dna.md` — update `updated:` date, `dx_score_current:`, loop library if loops were added/modified

### Step 5 — Write HANDOFF.md

```markdown
## Handoff — [YYYY-MM-DD HH:MM]

## Completed This Session
[finished work — list with file paths]

## Current Task
[what was being implemented — specific function/file/story]

## Next Steps
[next logical actions, ordered by priority]

## Loop State
loop_id: [id] | iter: N/M | stop_criteria: met|pending | resume: from iter N+1 | cost: normal|⚠
(or: loops: none this session)

## DX Status
dx_score: N/3 | typing: maintained|⚠ loosened | ARCHITECTURE.md: current|⚠ stale
(any DX regression should be the first blocker next session addresses)

## Ponytail Debt
count: N items | delta: +N/-N this session | trend: stable|growing⚠|shrinking✅

## Blockers
[blockers with context — include any loops that hit hard cap without meeting stop criteria]

## Risks
[known risks]

## Files Modified
[list of every file touched this session]
```

### Step 6 — Append progress log

HANDOFF.md is overwritten each session — no timeline. Append one line to `docs/progress.txt` (create if absent) so a fresh session can `grep`/`tail` recent history without relying on git log alone:

```bash
echo "[YYYY-MM-DD HH:MM] <one-line summary of what happened this session>" >> docs/progress.txt
```

### Step 7 — Commit

```bash
git add docs/ memory/ HANDOFF.md ARCHITECTURE.md .claude/project-dna.md .claude/ponytail.md
git commit -m "Session handoff [YYYY-MM-DD HH:MM] — [one-line summary of what happened]"
```

---

## Mode: Reset

Full context reset. Run handoff mode first, then:

1. Verify all required project files are current and committed.
2. Confirm DX score is recorded in `project-dna.md`.
3. Confirm loop state is captured for any active loops.
4. Confirm ponytail debt count is current in `ponytail.md`.
5. Commit everything.
6. Instruct user to start a new session.

**Test for sufficiency:** can a fresh agent understand the project, continue development, make correct decisions, and maintain architecture consistency using documentation alone — without this conversation?

If no → documentation is insufficient. Find what's missing and write it before ending.

Specific checks:
- Would the fresh agent know the project_type (strategic/tactical)? → project-dna.md
- Would the fresh agent know which loops are running and at what iteration? → HANDOFF.md loop state
- Would the fresh agent know the current DX score? → project-dna.md + HANDOFF.md
- Would the fresh agent know the ponytail debt level? → ponytail.md + HANDOFF.md
- Would the fresh agent know what NOT to build (ability/wait gaps)? → memory/decisions.md

---

## Coding Rules

Priority:
1. Maintainability
2. Readability
3. Simplicity (run minimalism gate from Ponytail before adding any new component)
4. Scalability
5. Performance

No premature optimization. No unnecessary abstractions. No framework worship.

**From Ponytail:** before building any new module, run the six-step ladder mentally:
Delete → Reduce → Defer → Reuse → Outsource → Build.
If you build it and it feels complex: add a `ponytail:` comment and record in `ponytail.md`.

**From Harness Over Model:** distinguish procedure work (build harness) from ability work (delegate to model, no scaffolding). Don't encode current model limitations into permanent scaffolding.

---

## Architecture Rules

Before creating new services, APIs, tables, or modules:

- Read `ARCHITECTURE.md` or `docs/architecture.md` for consistency.
- Avoid drift, duplicate patterns, parallel implementations.
- Check if new module is procedure or ability (Harness Over Model). Ability modules don't need harness wrappers.
- Update ARCHITECTURE.md immediately when structure changes — stale arch doc = DX regression = AX regression next session.

---

## Database Rules

Before modifying schema:

1. Review `docs/database.md`.
2. Check relationships, naming conventions, migration impact.
3. Prefer extending existing models over new tables.
4. Record decision in `memory/decisions.md` with why.

---

## API Rules

Before modifying APIs:

1. Review `docs/api-contracts.md`.
2. Maintain consistency, avoid breaking changes.
3. Update the doc immediately after any change — do not defer to handoff.

---

## Decision Log Format

For every significant decision, write to `memory/decisions.md` or `docs/memory.md`:

```markdown
### [Decision title] — [YYYY-MM-DD]
- **Problem:** [what needed deciding]
- **Options:** [what was considered]
- **Tradeoffs:** [pros/cons]
- **Decision:** [what was chosen]
- **Reasoning:** [why — include if minimalism gate was run, which step resolved it]
```

Include procedure/ability/wait classification for any new component decisions.

---

## AI Behavior

Act as Senior Software Architect + Senior Full Stack Engineer + System Designer + Technical Reviewer.

Not a code generator. Challenge assumptions. Surface risks: scalability, security, maintainability, loop runaway, DX degradation, complexity debt accumulation.

**Session as queue item:** each session is a fresh queue item. Don't carry assumptions from prior sessions — verify from docs. If docs contradict the assumption, docs win. If docs contradict code, code wins.

**Loop discipline:** any iterative operation proposed during a session must have a hard cap and objective stop criteria before execution. No "run until it looks right."

**Minimalism discipline:** any new component proposed must survive the six-step ladder. If user overrides, record the override and the ponytail: debt it creates.
