---
name: loop-engineering
description: "Loop Engineering doctrine and tooling: the 4th layer of AI engineering (Prompt → Context → Harness → Loop). Audit an existing AI loop for the 5 failure modes, or scaffold a new autonomous loop with all 6 required components. Use when designing, reviewing, or improving an autonomous AI system."
trigger: /loop-engineering
version: 1.0.0
---

# Loop Engineering

Building systems that prompt AI instead of prompting AI yourself.

> The goal is not better prompts. The goal is fewer prompts.

---

## Relationship to Other Skills

- **Loop Engineering** = design doctrine for autonomous AI systems (this skill)
- **[[ralph]]** = autonomous executor that IS a loop (ralph is a loop, loop-engineering is how to build or audit one)
- **[[storm-research]]** + **[[the-council]]** = Generator vs Evaluator principle applied to research and decisions
- **[[harness-engineer]]** = Layer 3 (single execution); loop-engineering = Layer 4 (continuous autonomous execution)

---

## Invocation

| Invocation | What it does |
|---|---|
| `/loop-engineering audit` | Audit an existing loop — describe it and receive a failure mode scorecard |
| `/loop-engineering scaffold` | Scaffold a new loop — answer questions, receive a complete 6-component design |
| `/loop-engineering` (default) | Detect from context: existing loop described → audit; building something new → scaffold |

---

## The Four Layers

| Layer | Focus | Question |
|-------|-------|----------|
| Prompt Engineering | Prompt quality | What should I tell the AI? |
| Context Engineering | Context management | What information should the AI receive? |
| Harness Engineering | Single execution | How should one AI agent run? |
| **Loop Engineering** | Continuous autonomous execution | How do I build a system that keeps running without me? |

---

## The Five Operations of Every Loop

Every loop executes these five operations in sequence:

1. **Discovery** — Find what work should be done (read GitHub Issues, CI failures, Slack, monitoring alerts, databases)
2. **Handoff** — Assign each task to an isolated worker (separate worktree, branch, or agent)
3. **Verification** — Never allow the generator to approve its own work (see Generator vs Evaluator below)
4. **Persistence** — Store state outside the AI context window (Markdown, DB, Git, CRM)
5. **Scheduling** — Run automatically (cron, GitHub Actions, Cloud Scheduler) — without scheduling, it is automation, not a loop

---

## The Six Components

Every well-designed loop has all six:

| Component | Purpose | Examples |
|-----------|---------|---------|
| **Automation** | Starts the loop | cron, GitHub Actions, Cloud Scheduler |
| **Worktrees** | Agents work independently | git worktrees, separate branches |
| **Skills** | Permanent project knowledge | SKILL.md, AGENTS.md, CLAUDE.md |
| **Connectors** | AI ↔ external systems | MCP, GitHub, Slack, Jira, DB, APIs |
| **Subagents** | Split responsibilities | Writer → Reviewer → Tester → Security |
| **Persistent Memory** | State survives | state.md, database, vector store, CRM |

---

## Generator vs Evaluator

The most important pattern in loop engineering.

**Never let the generator evaluate itself.**

```
Generator creates
      ↓
Evaluator doubts
      ↓
Human decides
```

AI naturally overestimates its own quality. An independent evaluator is dramatically more critical. This is the same principle as Storm's adversarial peer review and The Council's Contrarian.

---

## The Five Failure Modes

| Mode | Problem | Fix |
|------|---------|-----|
| **Nodding Loop** | Generator approves itself | Add separate evaluator |
| **Amnesiac Loop** | No persistent memory; loop repeats yesterday | Add persistent state file |
| **Manual Loop** | Human manually starts every run | Add scheduling |
| **Blind Loop** | Human still decides every task | Add automated discovery |
| **Tangled Loop** | Multiple agents edit same files | Add separate worktrees |

---

## The Four Hidden Costs

| Cost | Description |
|------|-------------|
| **Verification Debt** | Unchecked outputs accumulate silently |
| **Comprehension Rot** | You stop understanding your own system |
| **Cognitive Surrender** | You trust AI output without questioning |
| **Token Blowout** | Unlimited loops become extremely expensive — always set token limits, retry limits, daily budgets |

---

## Audit Mode

When user provides an existing loop description, run this audit:

### Step 1 — Map to Six Components

For each component, classify: Present / Missing / Weak

```
Automation:       [Present / Missing / Weak] — [evidence]
Worktrees:        [Present / Missing / Weak] — [evidence]
Skills:           [Present / Missing / Weak] — [evidence]
Connectors:       [Present / Missing / Weak] — [evidence]
Subagents:        [Present / Missing / Weak] — [evidence]
Persistent Memory:[Present / Missing / Weak] — [evidence]
```

### Step 2 — Check Five Failure Modes

For each mode, classify: Clear / Risk / Confirmed

```
Nodding Loop:   [Clear / Risk / Confirmed] — [evidence]
Amnesiac Loop:  [Clear / Risk / Confirmed] — [evidence]
Manual Loop:    [Clear / Risk / Confirmed] — [evidence]
Blind Loop:     [Clear / Risk / Confirmed] — [evidence]
Tangled Loop:   [Clear / Risk / Confirmed] — [evidence]
```

### Step 3 — Check Four Hidden Costs

Flag any active: Verification Debt / Comprehension Rot / Cognitive Surrender / Token Blowout

### Step 4 — Score and Recommend

```
Loop Health Score: [X/10]

Critical gaps (fix first):
- [gap] → [recommended fix]

Secondary gaps:
- [gap] → [recommended fix]

What is working well:
- [component/pattern]
```

---

## Scaffold Mode

When user wants to build a new loop, gather requirements through these questions:

**Q1 — What triggers the loop?**
(time-based cron / event-based webhook / manual kickoff / continuous poll)

**Q2 — What is the discovery source?**
(GitHub Issues / CI failures / database query / API poll / file watch / Slack / Jira)

**Q3 — What does each agent produce?**
(code change / document / database update / API call / report)

**Q4 — Who or what evaluates the output?**
(separate AI agent / deterministic test / human review gate / all three — concrete implementation: `agentic-review-loop` skill's AI review score gate ≥4/5)

**Q5 — Where is state stored?**
(state.md file / database table / Git commit / CRM record)

**Q6 — What are the budget limits?**
(max tokens per run / max retries / daily budget / cost alert threshold — pair with `fable-mode` effort calibration to match reasoning depth to loop budget instead of a fixed default)

Then produce a complete loop design:

```
# Loop Design: [Name]

## Trigger
[cron / event / description]

## Discovery
[source → what it reads → output format]

## Handoff
[how tasks are isolated — worktrees / branches / separate agent contexts]

## Generator
[agent role, SKILL.md it uses, what it produces]

## Evaluator
[agent role, evaluation criteria, pass/fail threshold]

## Human Gate
[what triggers human review, how human approves or rejects]

## Persistence
[state file path / schema / what gets written / what persists across runs]

## Scheduling
[cron expression / trigger event / runner]

## Budget Controls
[max tokens per run / retry limit / daily budget cap]

## Safe Scaling Order
1. One loop, one evaluator, one state file, one scheduler
2. → Add parallel agents only after step 1 is stable
3. → Add multiple loops only after step 2 is stable
4. → Add loop orchestration only after step 3 is stable
```

---

## Enterprise Pattern (Stripe / Large Orgs)

Do NOT delegate deterministic work to AI:

```
Deterministic Logic
        ↓
AI (judgment / creativity only)
        ↓
Deterministic Validation
        ↓
Human
```

Use AI only where judgment or creativity is actually required. Everything else: hard-code it.

---

## Safe Scaling Order

1. One loop
2. One evaluator
3. One state file
4. One scheduler
5. Parallel agents
6. Multiple loops
7. Loop orchestration

Reliability first. Scale second. Do NOT jump to step 5 before steps 1–4 are stable.

---

## Engineering Principles

- Design systems instead of prompts
- Separate generation from evaluation — always
- Store memory outside AI context window
- Schedule everything; without scheduling it is not a loop
- Use deterministic logic whenever possible, AI only where judgment is needed
- Never remove human judgment from the loop — humans judge, AI executes
- Small reliable loops outperform large fragile loops
- Judgment is the only scarce resource; protect it
