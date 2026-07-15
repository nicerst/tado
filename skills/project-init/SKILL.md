---
name: project-init
description: Use when bootstrapping any new project from scratch, onboarding an existing project that has no .claude/ harness, or after a major stack change invalidates the existing harness. Triggers on "/project-init".
---

# /project-init

Full project bootstrap from zero to production-ready harness. Runs in fixed order. Never skip steps. Never parallelize steps that have dependencies.

**Doctrine foundation — three principles govern every decision in this skill:**
- **Harness Over Model (Matt Pocock):** 50% project quality comes from harness, 50% from model. DX≈AX — codebase quality IS agent harness work. Classify every gap as procedure/ability/wait before building.
- **Agent Loops (Cole):** Every multi-step agentic operation gets Reason→Act→Observe structure, objective stop criteria, and a hard cap. No loop without a max.
- **Ponytail:** Always-on minimalism. Run six-step ladder before building anything. Track complexity debt in `ponytail.md`.

## When to Use

- Starting any new project from scratch
- Onboarding an existing project that has no `.claude/` harness
- After a major stack change that invalidates the existing harness

## Trigger

`/project-init`

Optional flags:
- `/project-init existing` — skip PRD + grill, jump straight to harness audit (for existing projects)
- `/project-init harness-only` — skip PRD + scaffold, only build/complete harness gaps
- `/project-init tactical` — abbreviated init for short-lived, one-off projects (skip loop library + memory files)

---

## Steps (execute in order)

### Step 0 — Load skill index
Invoke `superpowers` skill. Required so subsequent steps can pick the right skills.

Then check if Context7 is configured for this project. Context7 prevents hallucinated APIs from stale training data — wire it up before code generation starts.

```bash
cat .claude/settings.json 2>/dev/null | grep -i context7
cat ~/.claude/settings.json 2>/dev/null | grep -i context7
```

If not found, and project has any external library dependencies (package.json, pyproject.toml, go.mod exist), suggest:
> "Context7 not detected. Run `npx ctx7 setup --claude` to fetch live library docs during this project."

If user confirms: run setup, add ambient rule to `CLAUDE.md`:
```
# Context7
Always use Context7 when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.
```

**Non-blocking:** if user skips, continue to Step 0.5 immediately.

### Step 0.5 — Strategic vs Tactical Classification

**From Harness Over Model:** not all projects warrant full harness investment. Classify before spending tokens on scaffolding that won't pay off.

Ask or infer from PRD/context:

| Signal | Strategic | Tactical |
|--------|-----------|----------|
| Expected lifespan | Months+ | Days to weeks |
| Team/agents using it | 2+ | Solo, one-off |
| Will be iterated on? | Yes | No — ship and done |
| Loop operations? | Recurring (cron, batch, nightly) | One-shot |
| Service/infra count | 2+ services or infra components (API + worker, multi-DB, queue, microservices) | Single service |

Set `project_type` and `service_count` (single \| multi) now. Applies throughout:
- **Strategic:** full init, all steps, loop library, memory files, full harness
- **Tactical:** abbreviated init — steps 1→3→4→8→11 only. Skip loop library, skip memory, minimal harness (protect.py only).

If `/project-init tactical` flag passed: jump to abbreviated path immediately.

**Bitter-lesson check (Harness Over Model):** before investing in harness for a specific behavior, ask: "Will a better model handle this natively in 6 months?" If yes → mark as `wait`, don't build. Harness should encode invariants (protect raw/, never delete without confirm), not compensate for current model limitations. What is `wait` today is noise tomorrow.

**⚡ Stack research (storm-research):** if tech stack or architecture approach is uncertain — framework comparison, database selection, auth strategy — consider running before committing:
```
/storm-research '<Option A> vs <Option B> for [project context]'
```
Non-blocking. Skip if stack is already decided or obvious from PRD.

### Step 1 — PRD
Invoke `prd-builder` skill. Output: draft PRD document.
- If `/project-init existing`: skip to Step 3.

**Memory checkpoint 1 (after PRD complete):**
Append to `memory/decisions.md`:
```markdown
## [YYYY-MM-DD HH:MM] PRD — Stack + Intent
source_step: prd
<one-sentence project intent>
stack: <runtime, framework, database, auth>
hard_constraints: <from PRD — compliance, must-nots>
project_type: strategic|tactical
```

### Step 2 — Grill (BLOCKING)

Invoke `grill-with-docs` skill. Stress-test PRD until ALL four exit criteria are met:

1. Every acceptance criterion is **mechanically verifiable** — has a specific pass/fail condition (test command, count, threshold), not "good enough" or "works correctly"
2. No ambiguous domain terms — each term has exactly one precise definition
3. At least 3 edge cases explicitly scoped in or scoped out
4. User says "done" or "move on"

**Why mechanically verifiable?** Mechanically verifiable ACs become the objective stop criteria for every build loop in Step 7. Subjective ACs ("works correctly") produce loops that never cleanly exit — they burn tokens indefinitely with no objective out. Bad ACs here cascade into every downstream agent.

**Adversarial check (non-blocking):** name the plan's weakest assumption and whether the downside if it's wrong is bounded (redo a feature) or unbounded (redo the architecture). Surface to user, don't gate on it — this is a flag, not an exit criterion.

**Hard block:** if user says "done" or "move on" before criteria 1–3 are met, refuse to proceed.
- (a) Every AC has explicit pass/fail condition — name the test or measurement
- (b) No undefined domain terms remain
- (c) ≥3 edge cases documented (scoped in or out)

Example: "Before we move on — AC #2 says 'login works correctly'. What exactly passes: 200 with valid JWT, redirect to /dashboard, both?"

| Excuse to skip the grill | Reality |
|---|---|
| "PRD looks clear enough already" | Clear to you ≠ mechanically verifiable. Name the test or it's not an AC. |
| "User is in a hurry, don't slow them down" | A soft AC here becomes a loop with no exit criterion in Step 7 — slower, not faster. |
| "This is a small/simple project" | Small projects fail from vague ACs just as often. The gate cost is fixed and small. |
| "We can clarify edge cases during build" | Edge cases found mid-build mean re-architecting, not clarifying. |
| "User said 'move on', that's their call" | Their call to override is explicit, after you name what's missing — not silent compliance. |

**Memory checkpoint 2 (after grill complete):**
Append to `memory/decisions.md`:
```markdown
## [YYYY-MM-DD HH:MM] Grill — AC + Edge Cases
source_step: grill
<key AC clarifications — each with pass/fail condition>
edge_cases_in: [list]
edge_cases_out: [list]
```

### Step 2.5 — Minimalism Gate (Ponytail)

**From Ponytail:** run the six-step minimalism ladder on every feature in the PRD before any scaffolding. Remove complexity before building it.

For each feature, work through in order — stop at the first step that resolves it:

1. **Delete:** Does this feature need to exist? Cut entirely if it's nice-to-have but not core.
2. **Reduce:** Can this feature be simpler? Strip sub-features not in the core value loop.
3. **Defer:** Can this be built after the MVP ships? Move to backlog if yes.
4. **Reuse:** Is this feature already solved by a library/API/existing tool in the stack?
5. **Outsource:** Can this be a SaaS integration instead of built code?
6. **Build:** Only what survived steps 1–5.

Output a verdict per feature:
```
Feature: User notifications
Verdict: DEFER — not in core value loop. Add after first 100 users.

Feature: Auth
Verdict: OUTSOURCE — use Clerk/Supabase, not custom.

Feature: Dashboard
Verdict: BUILD (survived ladder)
```

Initialize debt ledger:
```bash
# Create if absent — Step 9 appends to this file
touch .claude/ponytail.md
```
Write header to `.claude/ponytail.md`:
```markdown
# Complexity Debt Ledger
_Initialized: YYYY-MM-DD_

Tag complex code with `ponytail:` comment inline.
This file tracks known debt. Review in /project-mid. Resolve before /feature-init adds more.

## Active Debt
(populated during development — search codebase: grep -r "ponytail:" .)
```

**Non-blocking:** user can override individual verdicts. Record overrides in `memory/decisions.md` with reason.

### Step 3 — Confirm scaffold exists

**3a. Check for git repo:**
```bash
git rev-parse --git-dir 2>/dev/null || echo "NOT A GIT REPO"
```
If not a git repo: tell user "Initialize git first: `git init && git add . && git commit -m 'init'`, then say 'continue'." Wait for confirmation. Harness hooks reference git — without a repo they fail silently.

**3b. Check for project scaffold:**
Check for `package.json`, `pyproject.toml`, `go.mod`, or equivalent.
- If missing: tell user "Scaffold the project first (e.g. `npx create-next-app`), commit it, then say 'continue'."
- Wait for user confirmation before proceeding.
- If present: continue immediately.

**3c. DX≈AX baseline (Harness Over Model):**

DX≈AX: Developer Experience equals Agent Experience. A codebase that's hard for humans to navigate is hard for agents to extend. Measure baseline now — agents in Step 7 and all future sessions inherit this codebase.

```bash
# Type coverage (TypeScript)
cat tsconfig.json 2>/dev/null | grep '"strict"'
# Or Python
cat pyproject.toml 2>/dev/null | grep 'mypy\|pyright'

# ARCHITECTURE.md presence
ls ARCHITECTURE.md 2>/dev/null || echo "MISSING"

# Module count (proxy for fragmentation)
find . -name "*.ts" -not -path "*/node_modules/*" 2>/dev/null | wc -l
```

Output DX score (0–3):
- +1: strict typing enabled
- +1: ARCHITECTURE.md exists
- +1: module count < 100 (not yet fragmented)

Record in project-dna.md as `dx_score_baseline`. Flag to user if DX score is 0–1: "Low DX baseline — agents will struggle with this codebase. Consider: enable strict types, write ARCHITECTURE.md before Step 7 agents run."

**Non-blocking:** low DX is a warning, not a blocker. But it should be in the record — a drop between sessions is a signal.

### Step 3.5 — Frontend design gate (frontend projects only)

Check for frontend framework:
```bash
cat package.json 2>/dev/null | grep -E '"next"|"react"|"vue"|"astro"|"svelte"|"solid"'
```

**Skip entirely if no frontend framework detected.**

If frontend framework found:

**New project** (no existing UI code):
1. Invoke `ai-ui-design` skill — design system first, before any page generation. Output: design system spec, tokens, component vocabulary.
   - If user supplies a visual reference (image, Figma file, or URL) instead of a from-scratch brief: invoke `reference-to-design-system` skill instead — produces paired `design.md` + `design.html` + a CLAUDE.md sync rule block.
2. Invoke `frontend` skill in brief inference mode — set dials (VARIANCE / MOTION / DENSITY) consistent with the design system.
3. Record design system decisions + dials in `memory/patterns.md` at Step 9.

**Existing project** (`/project-init existing`):
1. Invoke `ai-ui-design audit` — detect AI smell, missing design system, inconsistent tokens.
2. Invoke `frontend audit` — scan existing pages for slop patterns.
3. Surface findings to user at Step 6 scope decision — do not auto-fix.

This step is fast (2–5 min). Skipping it means all subsequent UI generation runs without brief context and defaults to category-reflex aesthetics.

**Data-path veto (non-negotiable):** reject any scaffold where client-side code imports a DB client directly (e.g. frontend importing `pg`, `prisma`, `mongodb` driver). Client talks to an API/service layer, never the DB. Flag and block at this gate, not at code review.

### Step 3.6 — Doc cleanup (existing projects only)

**Skip entirely for new projects.** Only runs when `/project-init existing` was used.

Invoke `doc-cleanup` skill. Runs cleanup before harness audit reads the repo — stale docs pollute harness-engineer's context read and produce less accurate gap reports.

**Non-blocking:** if user skips or skill errors, continue to Step 3.7 immediately.

After cleanup completes or skips: output one-liner ("Cleaned N files" or "Cleanup skipped") then proceed.

### Step 3.65 — Service Architecture Gate (strategic multi-service only)

**Skip entirely if `project_type != strategic` or `service_count != multi`** (set at Step 0.5). Single-service and tactical projects get no value here — architecture is not yet a live risk.

Invoke `agentic-system-design` skill. Decide monorepo vs polyrepo, service boundaries, and data-path ownership (which service owns which DB/table — no service reaches into another's data store directly) before Stack locks in Step 3.7.

Output an Architecture Decision Record — 3-6 lines, written directly into `project-dna.md → Hard Constraints` at Step 3.7:
```
service_boundaries: <list of services + one-line responsibility each>
data_ownership: <service → owned data store, no cross-reaches>
repo_layout: monorepo|polyrepo — reason
```

**Why gated, not a comment:** an inline comment in project-dna.md is easy to skip; a step with a skip condition is not. Cost is zero for the common single-service case (condition fails, step is skipped) and prevents an expensive mid-build re-architecture for the multi-service case this targets.

### Step 3.7 — Write project-dna.md

Write (or update) `.claude/project-dna.md`. This file is the compaction-proof project context — every spawned agent reads it before executing. Do not skip.

**Template:**
```yaml
---
bootstrap_version: 1
harness_version: 0
created: YYYY-MM-DD
updated: YYYY-MM-DD
last_init: YYYY-MM-DD
---

# Project DNA

## Intent
<one sentence: what this project does for whom — from PRD>

## Classification
project_type: strategic|tactical
service_count: single|multi
dx_score_baseline: 0|1|2|3

## Stack
runtime: node|python|go|rust
framework: next|fastapi|gin|...
database: postgres|sqlite|none
auth: supabase|clerk|none
package_manager: npm|pnpm|pip|cargo|...

## Hard Constraints
- <from PRD/grill: must-nots, compliance requirements, immutable rules>
<!-- If service_count == multi, Step 3.65 output (Architecture Decision Record) goes here: service_boundaries, data_ownership, repo_layout -->

## Success Definition
<from PRD: measurable outcome with explicit pass/fail condition — mechanically verifiable>

## Design Dials
VARIANCE: N
MOTION: N
DENSITY: N
# Remove this section entirely if no frontend detected at Step 3.5

## Harness
hook_checksums: {}
harness_budget: procedure/ability/wait split recorded at Step 11
# harness_budget = balance of procedure gaps built vs ability/wait gaps skipped

## Loop Library
# Populated at Step 3.8
loops: []
```

**Rules for this step:**
- For **new projects**: create from PRD + grill outputs.
- For **existing projects**: read existing file if present, update `last_init` + changed fields. If absent: derive from `CLAUDE.md`, `package.json`/`pyproject.toml`, existing README.
- Every spawned agent in Step 7 receives fields from this file in their briefing — accuracy here determines briefing quality.

### Step 3.8 — Loop Library Design

**From Agent Loops:** every project has operations that are loop-shaped. Define them before build starts — not after the first runaway agent teaches you which ones needed hard caps.

**Loop-shaped operations (from Agent Loops doc):**
- Reconciliation / matching tasks ✅
- Batch processing with per-item verification ✅
- Iterative generation with quality gate (draft → review → revise) ✅
- Retry-until-pass operations ✅
- Nightly / cron autonomous runs ✅

**NOT loop-shaped:**
- One-shot transforms ❌
- User-interactive flows (user drives the loop, not the agent) ❌
- Simple CRUD ❌

**For each loop-shaped operation found in the PRD:** invoke loop-engineering skill in scaffold mode:

```
/loop-engineering scaffold
```

Answer the 6 guided questions (trigger, discovery source, agent output, evaluator, state store, budget). The skill produces a complete loop design: pattern selection (solo / maker-checker / manager-helpers), stop criteria, hard cap, and all 6 components.

Copy the output into `project-dna.md → Loop Library`.
If this vault tracks the project: write loop library to `wiki/project-<slug>.md` too.

If no loops identified: write `loops: none` and continue. Not all projects need loops.

### Step 4 — Harness audit

**Classify gap types before spawning harness-engineer (from Harness Over Model):**

Before spawning, establish the K/S/W (Keep/Skip/Wait) framework for this project:
- **Procedure gap (Keep/Build):** operation that must always produce deterministic output (e.g., protect.py, gitignore check, secrets scan). Worth building harness — deterministic behavior the model can't guarantee alone.
- **Ability gap (Skip):** operation that requires model judgment (e.g., "write better code"). Don't build harness for this — model handles it; harness adds friction, not quality.
- **Wait gap (Bitter-lesson):** operation where frontier models are improving rapidly. Flag for review in 6 months. Don't build now.

Spawn `Agent(subagent_type="harness-engineer")` (full mode, NOT audit-only). Inject K/S/W classification brief:

```
CLASSIFICATION GUIDANCE:
- Procedure gaps: worth building (deterministic, non-negotiable behavior)
- Ability gaps: skip (model handles — harness adds friction)
- Wait gaps: flag only, don't build (model will catch up — check again in 6 months)
Expect harness-engineer to label each gap with gap_type: procedure|ability|wait.
```

**Expected output:** agent writes `.claude/.harness-gaps.json` before finishing. Read this file to populate Step 5 tasks.

**JSON schema for `.harness-gaps.json`:**
```json
{
  "schema_version": "1",
  "harness_score_before": 3,
  "harness_score_after": 0,
  "mode": "full",
  "gaps": [
    {
      "gap_id": "gap-001",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "gap_type": "procedure|ability|wait",
      "title": "protect.py missing",
      "description": "No PreToolUse security guard.",
      "affected_files": [".claude/hooks/protect.py"],
      "independent": true,
      "template_type": "python",
      "confidence": 0.95,
      "status": "open"
    }
  ],
  "files_built": []
}
```

**Post-classification actions:**
- `gap_type: ability` → skip entirely. Do not TaskCreate.
- `gap_type: wait` → TaskCreate with note: "[WAIT: bitter-lesson candidate, revisit YYYY-MM-DD+6mo]". Do not build.
- `gap_type: procedure` → build.

**If `.harness-gaps.json` is missing after agent returns:** treat as CRITICAL failure. Surface to user. Do not proceed to Step 5 without this file.

### Step 5 — TaskCreate for every gap

**5a. Fingerprint-based dedup (re-runs only):**
Run `TaskList` first. For each procedure gap in `.harness-gaps.json`, compute fingerprint:
```
fingerprint = hash(gap_type + "|" + primary_affected_file + "|" + severity)
```
Skip creating a task if fingerprint already exists in TaskList (check description for `[fp:<hash8>]`). Do not dedup by name — names change across re-runs; fingerprints do not.

**5b. Create tasks:**
For each gap not already tracked (CRITICAL → HIGH → MEDIUM → LOW):
- Create one task per gap using TaskCreate.
- Embed fingerprint as first line: `[fp:<first-8-chars-of-hash>]`
- Procedure gaps: build. Ability gaps: skip. Wait gaps: create task, label `[WAIT: revisit YYYY-MM-DD]`, do not build.

### Step 5.5 — Write HANDOFF.md proactively

Before any agents spawn in Step 7, write `HANDOFF.md` at project root:

```markdown
# HANDOFF — [project name]
_Written: YYYY-MM-DD HH:MM (proactive — before build start)_

## Project Intent
<from project-dna.md>

## Classification
project_type: strategic|tactical
dx_score_baseline: N/3

## Build Plan
Procedure gaps being built (priority order):
1. [gap-001] gap title — CRITICAL
2. [gap-002] gap title — HIGH
...

Ability gaps (skipped — model handles):
- [gap-00N] gap title — reason: ability

Wait gaps (deferred — bitter-lesson):
- [gap-00N] gap title — revisit: YYYY-MM-DD

## Loop Library
<paste from project-dna.md Loop Library>

## Task IDs
open: [list of TaskCreate IDs]
completed: []

## Resume
If context compacted mid-build: `/project-init harness-only`
```

**Purpose:** if context compacts mid-build, next session reads this and knows exactly what was in progress. Written BEFORE build starts — not reactively when context fills.

### Step 6 — Show build plan and proceed

Show build plan:
> "Found N procedure gaps. Building CRITICAL + HIGH now. Skipping N ability gaps (model handles). Deferring N wait gaps (bitter-lesson, revisit dates in HANDOFF.md)."

List which gaps are independent (safe to parallelize) vs dependent:

**Files that are always sequential (never parallelize):**
`CLAUDE.md`, `.claude/settings.json`, `.claude/settings.local.json`, `AGENTS.md`, `MEMORY.md`, `memory/*.md`

Independent = touch exclusively separate files with none of the above.

**Do NOT wait for user confirmation. Proceed immediately.** User can interrupt if the plan needs change.

If user says "stop" or "wait": pause and ask what to change.
If user says "defer" or "skip": save tasks, output final report, stop.

**Memory checkpoint 3:**
Append to `memory/decisions.md`:
```markdown
## [YYYY-MM-DD HH:MM] Build Plan
source_step: build-plan
procedure_gaps: [list gap IDs + titles]
ability_gaps_skipped: [list — reason: model handles]
wait_gaps_deferred: [list — revisit dates]
parallel_groups: [which gaps run in parallel]
sequential_gaps: [which must be sequential — shared files]
```

### Step 7 — Build gaps

**Context budget check:** if this conversation is long (PRD + grill filled significant context), prefer sequential over parallel. Parallel worktree agents mid-long-session risk compaction that loses task state.

Build in priority order: CRITICAL → HIGH → MEDIUM → LOW.
- Independent procedure gaps: fire parallel `Agent(isolation: "worktree")` calls in single message.
- Dependent gaps or any gap touching shared files: sequential.
- Mark each TaskUpdate → in_progress when starting, → completed when done.

**Agent briefing template (required for every spawned agent):**

Read `.claude/project-dna.md` and inject these fields into every agent brief:
```
PROJECT: <project_name — from DNA intent line>
INTENT: <one-sentence intent — from DNA>
STACK: <runtime + framework + package_manager — from DNA>
TASK: <gap_id> — <gap title>
AFFECTED FILES: <affected_files list from gap JSON>
DO NOT TOUCH: CLAUDE.md, .claude/settings.json, .claude/settings.local.json, AGENTS.md, MEMORY.md, memory/*.md
GUARDRAIL: never pause mid-task to ask the user a clarifying question — decide, record the reasoning in your result notes, and continue. This run is unattended.
CONSTRAINTS: <hard_constraints from DNA — one per line>
TEST COMMAND: <auto-detected: npm test | pytest | go test ./...>
EFFORT: <optional — set via `fable-mode` effort calibration if task weight warrants a non-default reasoning depth>

LOOP STRUCTURE (required if this task involves iteration):
  GOAL: <what success looks like — objective, from grill ACs>
  CONTEXT: <current state of relevant files>
  ACTION: <what to do this iteration>
  VERIFY: <how to check success — test command, assertion, count>
  STOP IF: <objective stop criteria — specific and measurable>
  HARD CAP: <max N iterations — required, no exceptions>

MULTI-AGENT PATTERN (if coordination needed):
  Pattern: solo|maker-checker|manager-helpers
  Reason: <from Loop Library if applicable>

OUTPUT REQUIRED: Before returning, write .claude/agent-result-<gap_id>.json:
{
  "gap_id": "<gap_id>",
  "status": "success|partial|failed",
  "files_written": ["list of files created or modified"],
  "notes": "optional — brief note for partial/failed only",
  "failure_reason": "required if status=failed",
  "ponytail_debt": ["list of ponytail: comments added, if any — format: 'file:line — description'"]
}
```

**Maker-Checker mandate for security hooks:** any gap touching `protect.py`, auth hooks, or secrets scanning MUST use Maker-Checker pattern. A second agent grades the hook's deny decisions before the gap is marked complete. Circular self-verification (hook testing its own output) is not acceptable for security-critical code.

**Review gate for non-security gaps:** invoke `agentic-review-loop` skill's AI review score gate (≥4/5) as the second-agent evaluator before marking a procedure gap `status: success` — same Generator-vs-Evaluator principle as Maker-Checker, applied to ordinary code changes.

**Agent output contract enforcement:**
After each agent completes, read `.claude/agent-result-<gap_id>.json`:
- **File missing:** treat as failure. Retry once with `failure_reason: "agent-result.json not written"` in next briefing.
- **`status: failed`:** surface `failure_reason` to user, mark task blocked, continue to next gap.
- **`status: partial`:** mark task in_progress, note in HANDOFF.md open items, surface to user after build.
- **`status: success`:** mark task completed.
- **`ponytail_debt` non-empty:** append each entry to `.claude/ponytail.md`.

Never mark a task completed without a valid agent-result.json showing `status: success|partial`.

### Step 7.5 — Post-build re-audit

After all Step 7 agents complete, spawn harness-engineer in audit mode:

```
Spawn Agent(subagent_type="harness-engineer") with mode=audit
Brief: "Read .claude/.harness-gaps.json (original gaps) and current harness state.
        Write .claude/.harness-gaps-postbuild.json with status per gap:
        'resolved' (gap gone), 'open' (still present), 'new' (not in original report)."
```

After agent returns:
1. `status: open` → fingerprint dedup → create new task if not tracked → add to HANDOFF.md open items → surface to user: "Gap [ID] not resolved. Requeueing."
2. `status: new` → create task with fingerprint dedup.
3. Max 2 re-audit cycles total. Gaps remaining after cycle 2: mark BLOCKED in final report.

Update `harness_version` in `project-dna.md`: increment by 1 for each build cycle completed.

### Step 8 — Smoke-test every hook

**Detect hook runtime first:**
```bash
ls .claude/hooks/*.py 2>/dev/null | head -1 && echo "PYTHON"
ls .claude/hooks/*.js 2>/dev/null | head -1 && echo "NODE"
ls .claude/hooks/*.ts 2>/dev/null | head -1 && echo "TS"
```

For **Python hooks**:
```bash
echo '{"tool_name":"Bash","tool_input":{"command":"rm -rf /"}}' | python3 .claude/hooks/protect.py
echo '{"tool_name":"Bash","tool_input":{"command":"npm run build"}}' | python3 .claude/hooks/protect.py
echo '{"stop_hook_active":false}' | python3 .claude/hooks/gate.py
echo '{}' | python3 .claude/hooks/load_handoff.py
```

For **Node/JS hooks**: replace `python3 .claude/hooks/<hook>.py` with `node .claude/hooks/<hook>.js`.
For **TypeScript hooks**: use `npx tsx .claude/hooks/<hook>.ts`.
For **mixed runtimes**: test each hook file with its own runtime.

If any hook fails or produces wrong output: fix before proceeding.
Verify the deny case produces `"permissionDecision": "deny"` or `"decision": "block"` — a hook exiting 0 on bad input is not a guard.

### Step 9 — Write memory files

Note: `memory/decisions.md` already has checkpoints from Steps 1, 2, and 6. Append remaining context and write remaining files.

**`memory/decisions.md`** — append:
- Why this stack (not alternatives)
- Why this auth approach
- Why these specific packages
- Any trade-offs accepted
- Wait-gap revisit dates

**`memory/patterns.md`** — recurring code patterns:
- Query patterns (parameterization, caching)
- Component patterns (if frontend: include VARIANCE/MOTION/DENSITY dials from Step 3.5)
- API patterns
- Project-specific conventions
- Loop patterns — which pattern (solo/maker-checker/manager-helpers) applies to which operation

**`memory/user_prefs.md`** — user preferences observed:
- UI preferences
- Code style preferences
- Workflow preferences

**`.claude/ponytail.md`** — debt ledger (initialized at Step 2.5):
Append any `ponytail_debt` entries collected from agent-result.json files:
```markdown
## [YYYY-MM-DD] <file:line> — <brief description>
`ponytail: <original comment text>`
Status: open
```

**Before writing:** check if files exist. Update (append) rather than overwrite. Never delete existing memory content.

**Optional upgrade (strategic projects only):** flat `memory/*.md` files are the default. If the project wants cross-project searchable, cross-linked memory instead, `llm-wiki-builder` skill is a heavier-weight upgrade path — not default, don't invoke for tactical projects.

**Secret scan before writing:**
```bash
grep -E '(sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{36}|xoxb-|AKIA[0-9A-Z]{16}|-----BEGIN (RSA|EC|OPENSSH) PRIVATE|password\s*[:=]\s*\S|api_key\s*[:=]\s*\S)' memory/decisions.md memory/patterns.md memory/user_prefs.md 2>/dev/null
```
If matches found: remove matching lines, warn user.

Update `memory/MEMORY.md` index with pointers to all files.

### Step 10 — Quality gate

**10a. Secrets gitignore check:**
```bash
grep -E "\.env|\.env\.yaml|secret" .gitignore 2>/dev/null || echo "MISSING"
```
If `.env`, `.env.yaml`, or equivalent not in `.gitignore`: add them and warn user. Committing secrets is irreversible once pushed.

**10b. Build check:**
```bash
npm run build    # or equivalent for detected stack
npx tsc --noEmit # TypeScript only
```
Must exit 0 before declaring project-init complete.

**10b.5. Dependency audit:**

For **Node projects**:
```bash
npm audit --json 2>/dev/null | python3 -c "
import json, sys
d = json.load(sys.stdin)
c = d.get('metadata', {}).get('vulnerabilities', {})
crit = c.get('critical', 0)
high = c.get('high', 0)
print(f'CRITICAL: {crit}, HIGH: {high}')
" 2>/dev/null || echo "npm audit unavailable"
```
- **CRITICAL: blocking** — do not proceed until resolved (`npm audit fix`)
- **HIGH: warn only** — surface in final report, do not block

For **Python projects** (non-blocking):
```bash
pip-audit 2>/dev/null || true
```

**10c. Test suite check:**

Detect test framework:
```bash
npm test 2>/dev/null
cat package.json 2>/dev/null | grep -E '"@playwright/test"|"playwright"'
```

If `@playwright/test` in `package.json`:
```bash
npx playwright test
```
Playwright test failures are blocking.

If no test suite found: warn "No test suite found — add tests before shipping." Do not block, do not hide.

**Playwright MCP note:** if project has browser-automation needs, suggest:
```bash
claude mcp add playwright npx @playwright/mcp@latest
```

**10d. DX≈AX delta:**

Re-run DX checks from Step 3c. Compute DX score again. If score decreased vs baseline (new modules added, strict typing loosened): flag to user. DX≈AX — a drop in DX during init means agents in every future session will run slower.

```bash
cat tsconfig.json 2>/dev/null | grep '"strict"'
ls ARCHITECTURE.md 2>/dev/null || echo "MISSING"
find . -name "*.ts" -not -path "*/node_modules/*" 2>/dev/null | wc -l
```

**10e. Harness budget check:**

From `.harness-gaps.json`:
```
procedure_gaps_built: N
ability_gaps_skipped: N
wait_gaps_deferred: N
total_gaps: N

harness_investment_ratio = procedure_gaps_built / total_gaps
```

Flag if ratio > 0.75: "Harness-heavy — review whether ability/wait gaps were correctly classified."
Flag if ratio < 0.25 on a strategic project: "Harness-light — confirm model capability before relying on it for invariants."

**10f. Ponytail debt count:**
```bash
grep -r "ponytail:" . --include="*.ts" --include="*.py" --include="*.js" --include="*.go" 2>/dev/null | wc -l
```
Report count in final report. >10 items open at end of init is a signal the minimalism gate (Step 2.5) wasn't applied aggressively enough.

### Step 11 — Final report and checksum update

**Update hook checksums in `.claude/project-dna.md`:**
```bash
python3 -c "
import hashlib, json, os
hooks = {}
hdir = '.claude/hooks'
if os.path.isdir(hdir):
    for f in sorted(os.listdir(hdir)):
        path = os.path.join(hdir, f)
        if os.path.isfile(path):
            hooks[f] = hashlib.sha256(open(path,'rb').read()).hexdigest()[:16]
print(json.dumps(hooks, indent=2))
"
```
Write output to `project-dna.md → Harness → hook_checksums`. Update `harness_version` to current build cycle count.

**Output final report:**
```
PROJECT-INIT COMPLETE
═══════════════════════════════════
Bootstrap: v1 | Harness: vN
Project type:   strategic|tactical
DX score:       N/3 baseline → N/3 post-build
Harness score:  X/10 → Y/10
Harness budget: N procedure built / N ability skipped / N wait deferred

Hooks built:    [list]
Skills built:   [list]
Loop library:   N loops defined [solo: N, maker-checker: N, manager-helpers: N]
Ponytail debt:  N items open (see .claude/ponytail.md)
Memory files:   decisions.md, patterns.md, user_prefs.md, ponytail.md

Gate:           ✅ build + tsc clean | npm audit: ✅ (or ⚠ N high)
Open tasks:     N remaining (MEDIUM/LOW — CRITICAL+HIGH resolved)
Blocked gaps:   N (list gap IDs and failure reasons if any)
Wait gaps:      N deferred — revisit: [dates]
═══════════════════════════════════

Next: /feature-init for first feature, or ask for a feature plan.
```

---

## Rules

- Never mark Step 4 complete until TaskCreate is done for ALL procedure gaps (Step 5).
- Never mark project-init complete with open CRITICAL or HIGH tasks.
- Never skip Step 8 — untested hooks are not hooks, they are false confidence.
- Never skip Step 9 — memory written now costs nothing; memory written next session costs a full re-briefing.
- Never commit `.env`, `.env.yaml`, `*secret*`, or credential files — check gitignore at Step 10 before any git operations.
- Never mark a gap completed without reading agent-result.json — agent says done is not done.
- Never skip project-dna.md (Step 3.7) — every agent re-derives project context without it.
- Never write HANDOFF.md reactively — write at Step 5.5 before build starts. Reactive is too late.
- Never spawn parallel agents touching CLAUDE.md, settings.json, AGENTS.md, or memory/*.md — always sequential for shared files.
- Never build harness for ability gaps or wait gaps — procedure gaps only.
- Never run a loop without a hard cap — max_iterations OR max_time. "Until done" is not a cap.
- Never accept subjective stop criteria without a hard time cap as backup.
- If context window fills mid-init: write current state to HANDOFF.md open items, then continue next session with `/project-init existing`.

## Anti-patterns to avoid

- Loading all skills at Step 0 — superpowers loads the index; invoke other skills just-in-time at their step.
- Running harness-engineer before scaffold exists — it reads package.json; without it, output is generic and wrong.
- Skipping DX≈AX baseline — agents in session 2 inherit the codebase built in session 1. Bad DX = bad AX.
- Skipping doc-cleanup on existing projects — stale plans skew harness-engineer's repo read.
- Running harness-engineer before git init — hooks reference git; without a repo they fail silently.
- Skipping TaskCreate and building directly from gap report — gap report disappears into context; tasks don't.
- Marking gaps "done" without smoke-testing — the protect.py JSON format bug shipped this way.
- Parallelizing agents that touch CLAUDE.md or settings.json — they overwrite each other.
- Spawning many parallel agents late in a long session — compaction mid-build loses task state.
- Trusting agent summary without agent-result.json — agent says done is not done. Read the contract file.
- Skipping project-dna.md — every agent re-derives project context and makes different assumptions.
- Accepting "done" at Step 2 before criteria 1–3 pass — soft ACs produce loops that never cleanly exit.
- Name-based task dedup on re-runs — names change; fingerprints don't. Name dedup creates duplicates.
- Building harness for ability gaps — you're encoding current model limitations into permanent scaffolding. The model will improve; the harness will stay and slow you down.
- Skipping the minimalism gate — complexity debt compounds. The feature not cut at Step 2.5 becomes the bug debugged at Step 10.
- Skipping loop library design — loops defined ad-hoc later have no hard caps, no objective stop criteria, and burn tokens.
- Security hooks without Maker-Checker — a protect.py that only tests its own output has circular verification.
