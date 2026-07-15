---
name: feature-init
description: >
  Use before building any new feature that isn't a simple bug fix, doc update, or
  single-file change under 30 lines — especially when it touches multiple files or
  components, requirements are unclear or complex, or the work needs to be handed off
  to ralph for autonomous execution.
---

# Feature Init Skill

Turn a feature description into a structured implementation plan and ralph-ready prd.json story. SPARC-derived, 5 phases.

**Doctrine woven throughout:**
- **Ponytail:** Six-step minimalism gate runs at Phase 0 — feature must survive before planning starts. Complexity debt estimated at Phase 4.
- **Agent Loops:** Any loop-shaped operations get a full loop spec (pattern + stop criteria + hard cap) in Phase 3. ACs are objective stop criteria — framed to support clean loop exit.
- **Harness Over Model:** Each task classified procedure vs ability at Phase 1.5. DX≈AX impact assessed at Phase 3. Architecture doesn't build harness for ability work.

## When to Trigger

- New feature (not a bug fix)
- Multiple files or components involved
- Unclear or complex requirements
- Needs ralph handoff for autonomous execution
- Cross-cutting concerns (auth, API, schema, UI all touched)

## When to Skip

- Simple bug fix → go directly to code
- Documentation update → write it
- Config change → single edit
- Single-file, well-defined change under 30 lines
- Story already exists in prd.json

## Modes

| Command | Phases run | Time |
|---------|-----------|------|
| `/feature-init` | All phases | ~50m |
| `/feature-init quick` | Phase 0 + Phase 0 minimalism gate + Phase 1 + Phase 5 only | ~15m |
| `/feature-init from-spec <file>` | Read file as Phase 1 input, run phases 1.5–5 | ~35m |

---

## Phase 0 — Intake + Minimalism Gate

**Step A — Feature Read:**

Output one line:
```
[Feature kind] for [system/domain] — [primary goal] with [key constraint if any]
```

Examples:
- `Auth flow for payments API — JWT refresh with rate limiting required`
- `CSV export for wiki query — streaming large result sets with memory cap`
- `Webhook intake for pipeline — idempotent processing with retry on failure`

If you cannot write this line, ask one clarifying question. Do not proceed until the Feature Read is clear.

**Step B — Ponytail Six-Step Minimalism Gate (BLOCKING):**

Before any planning, run the feature through the minimalism ladder. Work top-to-bottom — stop at the first step that resolves it:

1. **Delete:** Does this feature need to exist? Cut entirely if it's nice-to-have, non-core, or solves a problem that hasn't happened yet.
2. **Reduce:** Can the feature be simpler? Strip sub-requirements not in the core value loop.
3. **Defer:** Can this ship after the current milestone? Move to backlog if yes.
4. **Reuse:** Is this already solved by an existing library, API, or tool in the project stack?
5. **Outsource:** Can this be a SaaS integration instead of built code?
6. **Build:** Only if the feature survived steps 1–5.

Output verdict:
```
Minimalism gate: BUILD | DEFER | REDUCE | DELETE | OUTSOURCE | REUSE
Reason: [one line]
Scope cuts: [anything trimmed from original request]
```

If verdict is not BUILD: tell user and stop. Do not plan a feature that failed the gate.
If user overrides: document reason, note complexity debt, continue. Record override in Phase 4 risks.

| Excuse to skip the gate | Reality |
|---|---|
| "User clearly wants this built" | Wanting it built isn't the same as it surviving Delete/Reduce/Defer/Reuse/Outsource. Run the ladder anyway. |
| "This is obviously core, skip to Build" | "Obviously core" is exactly the assumption the ladder exists to check. Two seconds per step. |
| "We're under time pressure, plan first, gate later" | A feature planned before the gate runs gets architecture built for scope that may not survive Step B. Rework, not speed. |
| "Previous features from this user always pass" | Pattern-matching on past features isn't a substitute for running this one through the ladder. |

**Step C — Loop-shape check:**

Does this feature involve any recurring, iterative, or batch operations?

Loop-shaped signals:
- Cron / scheduled runs ✅
- Retry-until-pass logic ✅
- Batch processing with per-item verification ✅
- Iterative generation with quality gate ✅
- Reconciliation / matching ✅

Not loop-shaped:
- One-shot transforms ❌
- User-interactive flows ❌
- Simple CRUD ❌

Record: `loop_shaped: yes|no`. If yes: Phase 3 must produce a loop spec. Flag it now.

---

## Phase 0.5 — Frontend dial calibration (UI features only)

Detect if feature touches UI (keywords in Feature Read: page, component, view, form, table, modal, chart, UI, layout, design).

**Skip entirely if feature is backend-only.**

If UI involved:

**New pages or components** (feature adds UI that doesn't exist yet):
1. Invoke `ai-ui-design` skill — check if project design system exists. If yes: extend for this feature. If no: generate design system before proceeding.
   - If user supplies a visual reference (image, Figma file, or URL) for a no-design-system project: invoke `reference-to-design-system` skill instead of a from-scratch generation.
2. Invoke `frontend` skill in brief inference mode — set dials (VARIANCE / MOTION / DENSITY) consistent with the design system.
3. Dials must be set before Phase 3 Architecture. All component decisions must respect them.

**Modifying existing UI** (feature changes existing pages):
1. Invoke `ai-ui-design audit` — detect AI smell / design system violations in the feature area.
2. Invoke `frontend` audit pass — flag slop patterns to avoid when modifying.

Do not proceed to Phase 1 until dials are set (if UI) or skip is confirmed (if backend-only).

---

## Phase 1 — Specification

Define requirements, acceptance criteria, and constraints.

```markdown
## Specification

**Goal**: [single sentence — what the feature does for the user]

**Inputs**: [what data/events trigger this feature]
**Outputs**: [what data/side-effects this feature produces]

**Acceptance criteria** (objective stop criteria — each one is mechanically verifiable):
- [ ] AC-1: [specific measurable outcome — names the test, count, or threshold that proves it]
- [ ] AC-2: ...

**Constraints**:
- [performance, security, backward-compat, schema limits, etc.]

**Out of scope**:
- [things explicitly NOT included — from minimalism gate cuts]
```

**AC gate (from Agent Loops):** every AC must be an objective stop criterion — a mechanical yes/no that an agent can evaluate without human judgment. "Works correctly" is not an AC. "Returns 200 with valid JWT within 200ms" is. Subjective ACs ("looks good", "feels fast") produce loops that never exit cleanly when handed to ralph.

If loop_shaped: yes (from Phase 0): add one loop-specific AC:
- `[ ] Loop-AC: [loop name] completes within [hard cap] with all items processed OR halts with explicit error list`

---

## Phase 1.5 — Procedure vs Ability Classification

**From Harness Over Model:** classify each component of this feature before designing anything. Building harness for ability work is the main source of scaffolding that slows future agents.

For each major component identified in Phase 1:

| Component | Type | Rationale |
|-----------|------|-----------|
| [component] | **Procedure** | Always same output given same input — deterministic rule |
| [component] | **Ability** | Requires model judgment — leave to model, no harness |
| [component] | **Wait** | Frontier models improving fast here — defer harness 6 months |

Definitions:
- **Procedure:** input → deterministic output. Examples: validation, gitignore check, format enforcement, rate limiting, schema migration.
- **Ability:** requires judgment, context, or creativity. Examples: code generation, summarization, quality assessment, tone matching.
- **Wait:** harness investment likely wasted. Examples: error explanation, doc generation, test writing — all rapidly improving natively.

**Rule:** architecture and scaffolding in Phase 3 covers ONLY procedure components. Ability components get model delegation, not hooks. Wait components get a calendar note.

Record:
```
Procedure components: [list — will have harness/hooks]
Ability components: [list — model delegates, no harness]
Wait components: [list — revisit date: YYYY-MM-DD+6mo]
```

---

## Phase 2 — Pseudocode

Sketch data flow and key logic. Not implementation — 10–20 lines max per function.

```markdown
## Pseudocode

**Entry point**: [function/route/event handler]
function featureName(input):
  validate input
  fetch dependencies (list them)
  transform: [key logic]
  persist / return / emit

**Key helpers**:
- `helperA(x)` — [what it does, not how]
- `helperB(y)` — ...

**Loop sketch (if loop_shaped: yes)**:
  iterate over [collection]:
    reason: [what state to observe]
    act: [what to do this item]
    observe: [how to verify this item succeeded]
    exit if: [objective stop condition]
    cap: [max N items OR max T minutes]
```

Gate: if pseudocode reveals a dependency you don't understand → add to Phase 4 risks.
Gate: if loop sketch reveals a subjective exit condition → flag it here, resolve in Phase 3 loop spec.

---

## Phase 2.5 — Codebase Scan

**Do not skip.** Ground architecture in real file paths and symbols before Phase 3 locks them.

Use available tools (`grep`, `find`) to scan the actual codebase:

1. Verify every file mentioned in Phase 2 pseudocode actually exists
2. Find real function/class/type names at integration points
3. Identify existing patterns the new code must match
4. Check DX baseline: is typing strict? Are integration points well-typed?

Output a **Repository Impact Map**:

```markdown
## Impact Map

**Verified files** (exist, will be modified):
- `path/to/real-file.ext` — contains `FunctionName()`, `TypeName` — integration point

**New files** (will be created):
- `path/to/new-file.ext` — purpose

**Symbol anchors** (real names from codebase scan):
- `ExistingFunctionName()` at `path/file.ext:L42` — must call or extend
- `ExistingType` at `path/types.ext:L10` — must satisfy

**DX signal**:
- Typing at integration points: strict | loose | missing
- Pattern consistency: matches existing conventions | diverges

**Scan gaps** (couldn't locate — add to Phase 4 risks):
- [anything pseudocode assumed but scan couldn't find]
```

**Human review gate:** if any scan gap is non-trivial, surface to user before proceeding. Don't lock Phase 3 on phantom paths.

---

## Phase 3 — Architecture

Identify files to touch, integration points, and dependencies. All file paths and symbols from Phase 2.5 Impact Map — no guessing.

```markdown
## Architecture

**Files to create**:
- `path/to/new-file.ext` — [purpose]

**Files to modify**:
- `path/to/existing.ext:L42` — `ExistingFunctionName()` — [what changes and why]

**Integration points**:
- [external service / DB / queue / API touched]
- [auth/middleware changes required]

**Schema changes** (if any):
- [table, columns, migration needed]

**Dependencies added** (if any):
- `package-name@version` — [why — procedure component only, not ability]

**Procedure harness** (procedure components only):
- [hook / skill / script to build for each procedure component]
- Do NOT add harness entries for ability or wait components

**DX≈AX impact**:
- Does this feature add or remove strict types? [add | remove | neutral]
- Does ARCHITECTURE.md need updating after this? [yes | no]
- Module count delta: [+N new files | refactored to -N]
- Net DX impact: [positive | neutral | negative — and why]
```

Gate: every file listed must be verified (Phase 2.5) or in "Files to create." No phantom imports. No harness for ability components.

**Loop spec (required if loop_shaped: yes):**

Invoke loop-engineering skill in scaffold mode:

```
/loop-engineering scaffold
```

Answer the 6 guided questions using this feature's context (trigger, discovery source, agent output, evaluator, state store, budget). The skill produces a complete loop design including:
- Pattern selection: solo / maker-checker / manager-helpers (with rationale)
- Stop criteria (objective or semi-objective — no subjective)
- Hard cap (required — no exceptions)
- All 6 components checklist

Copy the output `loop_id`, `pattern`, `stop_criteria`, and `hard_cap` into the YAML plan `loop_spec` block and prd.json story. Add the `loop_id` to `project-dna.md → Loop Library`.

Pair the hard cap with `fable-mode` effort calibration if per-iteration reasoning depth matters — match effort to task weight, not a fixed default across every iteration.

---

## Phase 4 — Refinement Plan

Risks, edge cases, validation approach, complexity debt estimate.

```markdown
## Refinement Plan

**Risks**:
| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| [risk] | high/med/low | [action] |
| [minimalism gate override — if applicable] | high | [added complexity, watch for ponytail: debt] |
| [loop hard cap too low / too high] | med | [calibrate from dry run] |

**Edge cases to handle**:
- [empty input, concurrent write, large payload, etc.]
- [loop: empty collection, partial failure mid-batch, cap hit before completion]

**Validation approach**:
- Unit: [what to unit test]
- Integration: [what to integration test]
- Manual smoke: [one sentence golden path to verify]
- Loop validation (if applicable): [how to verify loop ran within hard cap + produced objective result]

**Complexity debt estimate (Ponytail)**:
- Expected new ponytail: comments: [0 | 1–3 | 4+]
- High-debt areas: [list any components that feel over-engineered]
- Debt budget: [accept | flag for cleanup sprint if > N items]
```

GOAP/OODA replanning: if a phase blocks (can't determine architecture without reading code):
- **Observe:** read the relevant files before continuing
- **Orient:** identify what was unknown
- **Decide:** update plan, skip blocker, or surface to user
- **Act:** resume from updated state

---

## Phase 5 — Completion Criteria

Definition of done. Production-validator checklist.

```markdown
## Completion Criteria

**Definition of done**:
- [ ] All ACs from Phase 1 pass (each AC is mechanically verifiable — automated check preferred)
- [ ] No `mock|fake|stub|TODO|FIXME` in feature code: `grep -r "mock\|fake\|stub\|TODO\|FIXME" <affected-paths>`
- [ ] No unhandled error paths in entry point
- [ ] Manual smoke test passes: [one-sentence golden path]
- [ ] DX impact neutral or positive: strict types maintained, ARCHITECTURE.md updated if module count changed
- [ ] If PR-based: passed `agentic-review-loop`'s AI review score gate (≥4/5) before merge
- [ ] [Any deploy/migration step needed]

**Loop completion (if loop_shaped: yes)**:
- [ ] Loop ran within hard cap: [verify from logs or output]
- [ ] Stop criteria met with objective evidence: [specific check]
- [ ] Pattern used matches Loop Library entry: [loop_id in project-dna.md]
- [ ] No subjective exit in implementation: grep for "while True" / unbounded retry patterns

**Ponytail debt**:
- [ ] New ponytail: comments ≤ [debt budget from Phase 4]
- [ ] If budget exceeded: open cleanup task before this story is marked passes: true

**Not done until**:
- [ ] AC-1 verified by: [how — test command, count, assertion]
- [ ] AC-2 verified by: [how]
```

---

## Output: YAML Plan

After all phases, emit the structured plan:

```yaml
plan:
  objective: "[Feature Read line]"
  minimalism_gate: "BUILD"
  loop_shaped: yes|no
  phases:
    - name: "Specification"
      tasks:
        - id: "spec-1"
          description: "[core AC implementation]"
          agent: "coder"
          component_type: "procedure|ability"
          pattern: "solo|maker-checker|manager-helpers"  # only if agentic
          dependencies: []
          estimated_time: "30m"
          priority: "high"
    - name: "Testing"
      tasks:
        - id: "test-1"
          description: "[unit test for AC-1]"
          agent: "tester"
          component_type: "procedure"
          dependencies: ["spec-1"]
          estimated_time: "20m"
          priority: "high"
  loop_spec:    # omit if loop_shaped: no
    loop_id: "feature-<slug>-loop-001"
    pattern: "solo|maker-checker|manager-helpers"
    stop_criteria: "[objective condition]"
    hard_cap: "N iterations | T minutes"
  critical_path: ["spec-1", "test-1"]
  risks:
    - description: "[top risk from Phase 4]"
      mitigation: "[mitigation]"
  success_criteria:
    - "[AC-1 verbatim]"
    - "[AC-2 verbatim]"
  ponytail_debt_budget: 0|1-3|4+
  estimated_time: "Xh"
```

---

## Output: prd.json Story Block

After the YAML plan, emit the ralph-compatible prd.json story. If `prd.json` exists, append. If not, create.

```json
{
  "id": "feature-<slug>",
  "title": "[Feature name]",
  "description": "[Goal sentence from Phase 1]",
  "acceptance_criteria": [
    "AC-1: [verbatim from Phase 1 — objective, mechanically verifiable]",
    "AC-2: ..."
  ],
  "loop_spec": {
    "loop_id": "feature-<slug>-loop-001",
    "pattern": "solo|maker-checker|manager-helpers",
    "stop_criteria": "[objective condition]",
    "hard_cap": "N iterations | T minutes"
  },
  "tasks": [
    {
      "id": "task-1",
      "description": "[From YAML plan spec-1]",
      "component_type": "procedure|ability",
      "files": ["path/to/file.ext"],
      "estimated_time": "30m"
    }
  ],
  "passes": false,
  "validator": "grep -r \"mock\\|fake\\|stub\\|TODO\\|FIXME\" <affected-paths> && exit 1 || exit 0"
}
```

Omit `loop_spec` block if `loop_shaped: no`.
`passes: false` — ralph sets this to `true` when all ACs verified.

**Resumability requirement:** the story block must be resumable from partial completion — a ralph run that stops mid-story (context limit, stall, human interrupt) must be restartable from `passes: false` without re-deriving scope. Tasks and ACs listed here are the resume contract.

---

## Production Validator Exit Check

Before handing off to ralph, verify:

1. `grep -r "mock\|fake\|stub\|TODO\|FIXME" <affected-paths>` — must return nothing
2. Every AC is objective (no "works correctly", "looks good", "is fast" language)
3. Every file in Architecture phase is verified by Phase 2.5 scan or in "Files to create" — no phantom paths
4. Every "Files to modify" entry references a real symbol from the Phase 2.5 Impact Map
5. `prd.json` story block is valid JSON
6. If `loop_shaped: yes`: loop spec has `hard_cap` defined, stop criteria is objective, loop_id matches project-dna.md Loop Library
7. No harness added for ability or wait components
8. Ponytail debt budget recorded — if >3 items expected, cleanup task created

If any check fails → fix before handoff.

---

## Quick Mode (`/feature-init quick`)

Run Phase 0 (intake + minimalism gate + loop-shape check) + Phase 1 (Spec) + Phase 5 (Completion Criteria) only. Skip phases 2–4.

Use when:
- Feature is simple enough that architecture is obvious
- You just need ACs and a prd.json story
- Under time pressure; refinement happens during execution

Minimalism gate still runs — quick mode doesn't skip it.

---

## From-Spec Mode (`/feature-init from-spec <file>`)

Read `<file>` as Phase 1 input. Parse ACs, constraints, out-of-scope from it. Then run phases 1.5–5.

Minimalism gate still runs on the spec content — check if scope survived the ladder.

---

## Integration with Other Skills

| Skill | When to combine |
|-------|----------------|
| `/prd-builder` | Run prd-builder first for product-level spec, then feature-init for technical plan |
| `/ralph` | Run feature-init to produce prd.json, then ralph to execute |
| `/project-init` | project-init bootstraps the project; feature-init plans each subsequent feature |
| `/project-mid` | project-mid recalibrates scope; feature-init plans next feature after recalibration |
| `/playwright` | After feature-init produces ACs, playwright writes E2E tests from them |
| `/ai-ui-design` | Auto-invoked at Phase 0.5 for UI features — design system check/extend before implementation; audit mode for existing UI areas |
| `/loop-engineering` | Auto-invoked at Phase 3 when loop_shaped: yes — scaffold mode produces complete loop design |
| `/storm-research` | Run before Phase 1 when architecture approach is ambiguous and multiple approaches are viable — produces reliability-scored comparison before committing |
| `/frontend` | Auto-invoked at Phase 0.5 for UI features — sets VARIANCE/MOTION/DENSITY consistent with design system |
| `/reference-to-design-system` | Auto-invoked at Phase 0.5 when a visual reference exists and no design system yet — alternative to `ai-ui-design`'s from-scratch generation |
| `/agentic-review-loop` | Invoked at Phase 5 completion for PR-based features — AI review score gate before merge |

---

## References

Derived from ruflo's `sparc-methodology`, `agent-planner`, `agent-goal-planner`, and `agent-production-validator` skills. GOAP/OODA replanning from `agent-goal-planner`. YAML plan format from `agent-planner`. Production validator grep pattern from `agent-production-validator`. Agent Loops (Cole), Harness Over Model (Matt Pocock), Ponytail woven in throughout.
