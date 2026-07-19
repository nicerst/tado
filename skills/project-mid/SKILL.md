---
name: project-mid
description: "Use when a project is 30+ days in, scope feels drifted, stories keep getting added but nothing ships, or before handing off to ralph for an unattended run."
trigger: /project-mid
version: 2.0.0
---

# /project-mid

Day 30+ checkpoint. Diagnose drift, audit loop and harness health, recalibrate scope, refresh memory, optionally prep ralph for autonomous execution.

**Doctrine foundation:**
- **Harness Over Model:** Check DX≈AX delta — codebase quality is agent harness. Revisit bitter-lesson wait-gaps flagged at init. Verify procedure/ability gap classification still holds.
- **Agent Loops:** Audit the Loop Library — are loops hitting caps? Are stop criteria still objective? Any ad-hoc loops spawned without specs?
- **Ponytail:** Count and trend `ponytail:` debt. Run minimalism gate on any new/absorbed stories before they enter prd.json.

---

## When to Use

- Project is 30+ days in and context has accumulated
- Stories keep getting added but nothing ships
- You suspect scope drift but can't see it clearly
- About to hand off to ralph for unattended run
- Memory files are stale
- Loops are running but nobody audited them since init

---

## Entry guard

If no harness exists yet (`.claude/project-dna.md` missing), this isn't a mid-project checkpoint — redirect to `/project-init`. If the project is under 30 days old with no drift signals, redirect to `/feature-init` instead.

## Steps (execute in order)

### Step 1 — Context read

```bash
# Last 30 commits
git log --oneline -30

# Current branch + status
git status --short

# prd.json if exists
cat prd.json 2>/dev/null || echo "NO PRD.JSON"

# Open tasks
cat progress.txt 2>/dev/null | tail -20 || echo "NO PROGRESS.TXT"
```

Also read, if they exist:
- `.claude/project-dna.md` — classification, dx_score_baseline, loop library, harness_version
- `AGENTS.md`
- `memory/decisions.md`
- `memory/patterns.md`
- `.claude/ponytail.md` — debt ledger

Build mental model: what was originally planned, what shipped, what's outstanding, what loops are defined, what DX baseline was set at init.

---

### Step 2 — Drift analysis

Output three lists:

**Shipped** — stories with `passes: true` in prd.json + git commits matching original scope.

**Drifted** — things built (visible in git) not in original prd.json. Not automatically bad — flag for user decision.

**Outstanding** — stories with `passes: false` or not in prd.json at all.

Format:
```
DRIFT ANALYSIS
══════════════
Shipped (N):
  ✅ US-001 — Add priority column
  ✅ US-002 — Migration

Drifted (N) — built but not in original scope:
  ⚠ Dark mode toggle (commit: abc1234)
  ⚠ CSV export (commit: def5678)

Outstanding (N):
  ○ US-003 — Dashboard filter
  ○ US-004 — Email notifications
```

For each Shipped item, state before/after numbers where derivable (time saved, LOC, cost, manual steps removed) — not just the pass label. Pull from PRD success definition or commit diff stats. Skip the item if no number is derivable; don't invent one.

---

### Step 3 — Harness decay check

Check only these items. No deep audit, no spawning harness-engineer — that's project-init's job.

```bash
# 1. Hooks still executable?
ls -la .claude/hooks/ 2>/dev/null || echo "NO HOOKS"

# 2. AGENTS.md last updated
git log --oneline -1 -- AGENTS.md 2>/dev/null || echo "AGENTS.MD NOT TRACKED"

# 3. .env in .gitignore?
grep -E "^\.env" .gitignore 2>/dev/null || echo "⚠ .ENV NOT IN GITIGNORE"

# 4. Memory files present?
ls memory/*.md 2>/dev/null || echo "NO MEMORY FILES"

# 5. AI churn signal
TOTAL=$(git log --oneline -30 | wc -l | tr -d ' ')
CHURN=$(git log --oneline -30 | grep -c -i "fix\|revert\|correct" || true)
echo "AI churn: $CHURN / $TOTAL commits in last 30"
```

Flag AGENTS.md if last commit is >14 days ago. Flag missing `.env` in .gitignore as CRITICAL.

**AI churn flag:** if churn commits > 30% of last 30 commits: "⚠ High AI churn — consider tightening Stop gate or adding PostToolUse linter. Review burden may be growing faster than velocity."

**3a. DX≈AX delta (Harness Over Model):**

DX at init was recorded in `project-dna.md → dx_score_baseline`. Measure now and compare.

```bash
# Type coverage
cat tsconfig.json 2>/dev/null | grep '"strict"'
cat pyproject.toml 2>/dev/null | grep 'mypy\|pyright'

# ARCHITECTURE.md still present and non-stale?
git log --oneline -1 -- ARCHITECTURE.md 2>/dev/null || echo "ARCHITECTURE.MD NOT TRACKED"

# Module count growth
find . -name "*.ts" -not -path "*/node_modules/*" 2>/dev/null | wc -l
```

Compare to `dx_score_baseline`. DX drop = AX drop — every session after this runs slower.

Flag if:
- Strict typing was disabled: "⚠ DX regression — strict typing removed. Agent code quality will degrade."
- ARCHITECTURE.md not updated in >30 days but modules grew >20%: "⚠ Architecture doc stale — agents navigating blind."
- Module count grew >50% since init with no ARCHITECTURE.md update: "⚠ Fragmentation signal."

**3b. Bitter-lesson revisit (Harness Over Model):**

Read `memory/decisions.md` for `[WAIT: bitter-lesson candidate, revisit YYYY-MM-DD]` entries. If any revisit date has passed:

For each expired wait-gap:
> "Wait-gap '[title]' flagged [date] for revisit. Test: can the current model handle this natively without harness? If yes — leave as-is. If no — promote to procedure gap and add to prd.json."

Surface to user at Step 6 scope decision. Do not auto-promote.

**3c. Procedure/ability drift:**

Check for harness that may now be overcorrecting model limitations:
```bash
# Look for hooks that do "AI work" — rephrasing, code style, quality judgment
grep -r "improve\|better\|quality\|style\|enhance" .claude/hooks/ 2>/dev/null | head -5
```

If found: flag to user — "Hook doing model-ability work. Consider retiring it (models improved since init). Bitter-lesson rule."

---

### Step 3.5 — Frontend health check (frontend projects only)

```bash
grep -E '"(react|next|vue|svelte|angular)"' package.json 2>/dev/null | head -3
```

**Skip entirely if no frontend framework detected.**

If frontend framework found:
1. Invoke `ai-ui-design audit` — detect AI smell, missing/inconsistent design system, token violations. Flag: missing design system = root cause of most UI debt.
2. Invoke `frontend` skill in audit mode — scan existing UI for slop patterns accumulated since last checkpoint.
3. Flag all violations as **UI debt** items. Add to drift output at Step 2.
4. Surface at Step 6 scope decision — user decides whether to add cleanup stories.

Audit only — flag, don't fix.

---

### Step 4 — Loop Library health check

**From Agent Loops:** loops defined at project-init need periodic audit. Ad-hoc loops spawned between sessions may have no hard caps, no specs, no objective stop criteria.

Read `project-dna.md → Loop Library`. Then scan for ad-hoc loops before auditing:

```bash
# Check for loop scripts not in Loop Library
find . -name "*.sh" -o -name "*loop*" -o -name "*cron*" 2>/dev/null | grep -v node_modules | head -10

# Check for hard caps in loop scripts
grep -r "max_iter\|hard_cap\|MAX_\|timeout\|--max" . --include="*.sh" --include="*.py" --include="*.ts" 2>/dev/null | head -10

# Ad-hoc loop detection
git log --oneline -30 | grep -i "loop\|agent\|ralph\|autonomous\|overnight"
```

Invoke loop-engineering skill in audit mode — provide the Loop Library contents + ad-hoc loop evidence as context:

```
/loop-engineering audit
```

The skill scores each loop against the 5 failure modes and 6-component checklist. Include ad-hoc loops as "unspecified loops" for audit.

Output from audit:
```
LOOP HEALTH
══════════════
Defined loops (N): [score from loop-engineering audit]
Ad-hoc loops detected (N): [commit list]
Missing specs: N loops need Loop Library entries
```

Surface loop health at Step 6 scope decision. User decides which flagged loops to fix now vs defer.

---

### Step 5 — Ponytail debt review

**From Ponytail:** complexity debt compounds between checkpoints. Count, trend, and resolve.

```bash
# Count ponytail: comments in codebase
grep -r "ponytail:" . --include="*.ts" --include="*.py" --include="*.js" --include="*.go" 2>/dev/null

# Count
grep -rc "ponytail:" . --include="*.ts" --include="*.py" --include="*.js" --include="*.go" 2>/dev/null | awk -F: '{sum += $2} END {print "Total ponytail: debt:", sum}'
```

Read `.claude/ponytail.md` for the last recorded count (from project-init or previous project-mid). Compare.

Trend signals:
- **Count stable or decreasing:** healthy — debt being resolved.
- **Count growing:** ⚠ — complexity accumulating faster than it's being resolved. Tighten minimalism gate on new stories.
- **Count > 20:** flag for dedicated cleanup sprint before next feature.

Surface top 3 most-referenced files with ponytail debt (most debt = most fragile):
```bash
grep -rl "ponytail:" . --include="*.ts" --include="*.py" --include="*.js" --include="*.go" 2>/dev/null
```

**Minimalism gate on new/absorbed stories (from Ponytail six-step):**

Before any new story enters prd.json at Step 7, run it through the six-step ladder:
1. **Delete:** does this story need to exist?
2. **Reduce:** can it be simpler?
3. **Defer:** can it ship after MVP?
4. **Reuse:** solved by existing library/tool?
5. **Outsource:** SaaS instead of built?
6. **Build:** only what survived 1–5.

Record gate outcomes. Overrides allowed — document reason in `memory/decisions.md`.

---

### Step 6 — Scope decision (human gate — BLOCKING)

Present consolidated picture from Steps 2–5:

> "Here's the full picture:
>
> Drift: N shipped, N drifted, N outstanding
> Harness: [healthy | ⚠ issues]
> DX: [baseline N/3 → current N/3 | delta]
> Loops: [N healthy, N flagged]
> Ponytail debt: [N items, trend: stable/growing/shrinking]
> Bitter-lesson revisits: [N expired]
>
> What do you want to do?
> 1. Cut drifted items — remove from scope
> 2. Absorb drifted items — add to prd.json as completed
> 3. Add new stories
> 4. Reprioritize outstanding
> 5. Fix flagged loops — add specs, hard caps
> 6. Approve as-is — just refresh memory + handoff"

Wait for user response. Do NOT proceed to Step 7 without it.

If user adds new stories: run minimalism gate (Step 5 ladder) on each before absorbing into prd.json.
If user absorbs drifted items: run minimalism gate to confirm they belong in scope.

If user says "as-is" or "approve": skip to Step 8.

| Excuse to skip the scope gate | Reality |
|---|---|
| "Drift looks fine, just absorb it all" | Drift may be wrong-direction scope creep — that's the user's call, not an assumption. |
| "User's busy, just pick sensible defaults" | A silent default here means untracked scope in prd.json — ralph will build the wrong thing with confidence. |
| "It's obviously an approve-as-is case" | State the picture and let them say so — don't skip presenting drifted/outstanding counts. |
| "We already discussed this earlier in the session" | Numbers changed since Steps 2-5 ran. Present the current picture, not the remembered one. |

---

### Step 7 — prd.json + Loop Library refresh

**7a. prd.json update:**

Apply user's scope decisions:
- Completed stories: mark `passes: true`
- Drifted items absorbed: add as `passes: true` stubs
- New stories: add at correct priority
- Outstanding: re-prioritize

**Ralph-ready rules for new/updated stories:**
- One story = one context window. If it exceeds ~500 words, split.
- Acceptance criteria = specific, mechanical pass/fail. Not "looks good." Objective stop criteria — the loop exits when this condition is met.
- Dependent stories must have sequential priorities. Each commit must compile standalone.

**7b. Loop Library update:**

For each loop flagged in Step 4:
- Missing hard cap: add `hard_cap` field, confirm with user.
- Subjective stop criteria: propose objective alternative, confirm with user.
- Ad-hoc loops: write Loop Library entry or retire.
- Bitter-lesson expired: update status in `memory/decisions.md`.

Write updated loop library back to `project-dna.md → Loop Library`.

---

### Step 8 — Memory refresh

Update if they exist. Create if not.

**`memory/decisions.md`** — append:
- Why scope items were cut or absorbed
- Why new stories were added
- Minimalism gate overrides (what was added despite failing ladder + reason)
- Any stack/pattern changes
- Bitter-lesson decisions (promoted to procedure, or confirmed still-wait)
- Loop pattern changes

**`memory/patterns.md`** — append patterns that emerged since project-init:
- New query patterns, component patterns, API conventions
- Loop patterns used in practice (vs what was planned at init)
- Anything a fresh agent spawned by ralph would need to know

**`.claude/ponytail.md`** — update debt ledger:
- Add entries for new `ponytail:` comments found in Step 5
- Mark resolved entries `Status: resolved` with date
- Record trend: `[YYYY-MM-DD] debt count: N (delta: +N/-N since last check)`

**`project-dna.md`** — update:
- `updated: YYYY-MM-DD`
- `last_mid: YYYY-MM-DD`
- `dx_score_current: N` (from Step 3a)
- Loop Library (from Step 7b)

Before writing: read existing content. Append, never overwrite.

**Optional upgrade:** if flat `memory/*.md` files have grown unwieldy (30+ days of appends), `llm-wiki-builder` skill is a heavier-weight cross-linked replacement — propose, don't auto-migrate.

---

### Step 9 — Ralph handoff (optional)

Ask: "Ready to run ralph autonomously? I'll print the launch command."

If yes:
1. Confirm prd.json has at least one `passes: false` story with objective AC.
2. Confirm all outstanding stories have mechanical stop criteria (not subjective). If any are subjective: flag before handing to ralph — ralph loops don't exit cleanly on subjective criteria.
3. Confirm `ralph.sh` exists. If not:
   ```bash
   cp $(opensrc path snarktank/ralph)/ralph.sh ./
   chmod +x ralph.sh
   ```
4. Print launch command — do NOT run it. User owns this invocation.
   ```bash
   ./ralph.sh --tool claude 10
   # or:
   ./ralph.sh --tool amp 15
   ```
5. Remind user: ralph uses `--dangerously-skip-permissions`. Run only on branches where that's acceptable. Each ralph iteration is a loop — make sure Loop Library has a ralph entry with hard cap set.

---

### Step 10 — Report

```
PROJECT-MID COMPLETE
═══════════════════════════════════
Shipped:         N stories
Drifted:         N items (cut N / absorbed N)
Outstanding:     N stories → prd.json updated

DX score:        N/3 baseline → N/3 current [delta: +N/-N]
Harness:         ✅ healthy | ⚠ [issue]
Loops:           N healthy, N flagged → [fixed | deferred to user]
Ponytail debt:   N items [trend: stable | growing ⚠ | shrinking ✅]
Bitter-lesson:   N expired → [promoted to procedure | confirmed wait]

Frontend:        ✅ no slop | ⚠ N violations | n/a
Memory:          updated | created
Ralph:           ✅ prd.json ready — run ./ralph.sh | skipped
═══════════════════════════════════
```

---

## Rules

- Never skip Step 6. Scope decisions require the human.
- Never auto-launch ralph. Print the command; user runs it.
- Never overwrite memory files — append only.
- Never mark Step 7 done if prd.json has stories with vague, subjective acceptance criteria — ralph loops won't exit cleanly.
- Never add new stories to prd.json without running minimalism gate (Step 5 ladder).
- Never hand to ralph with loops that have subjective stop criteria — they won't exit.
- If no prd.json exists: create one from git log analysis + user input at Step 6.

## Anti-patterns

- Deep harness audit — that's project-init's job. Step 3 is lightweight decay check only.
- Absorbing all drift without asking — drift may be wrong direction; user decides.
- Absorbing stories without running minimalism gate — features deferred at init creep back in here.
- Writing prd.json stories too large for one context window — ralph will stall.
- Launching ralph in the same session — ralph spawns fresh claude with `--dangerously-skip-permissions`; always a deliberate manual action.
- Ignoring ponytail debt growth — a count that doubles between checkpoints is a fragility signal, not just a hygiene issue.
- Leaving loops without hard caps "to fix later" — ad-hoc loops without caps are the source of runaway overnight burns.
- Ignoring DX delta — a 2-point DX drop means every agent in every future session navigates blind. It's not just a code quality issue.
