---
name: in-house-ai-consultant-roadmap
description: 4-step career roadmap for building an "in-house AI consultant" role inside a company you already work for — audit your own job for automatable tasks, prove ROI, make it visible, then attack business constraints and formalize the role. Use when user wants to "build an AI career at my job", "become the AI person at my company", "create an internal AI consultant role", or "prove AI ROI to my manager".
---

# In-House AI Consultant Roadmap

Turn AI skills into an internal career position by starting small, proving value with numbers, then scaling from personal annoyances to business-critical bottlenecks.

**Orchestrated workflow**: spawn `Agent(subagent_type="aic-task-audit-analyst")` for scoring/ranking the task-audit lists in steps 1 and 4, and `Agent(subagent_type="aic-roi-reporter")` for compiling before/after numbers into business-language artifacts in steps 3 and 5 — instead of running those inline. Use inline only for quick interactive/`/slash` use where the human just wants coaching/talk-through, not an actual scored list or a compiled report.

This orchestrator owns: the coaching conversation itself, stage gating (don't let the user jump to constraint-hunting before stacked wins exist), the regulated-environment guardrail, and the steps 3-4 framing advice. It delegates the actual scoring/ranking work and the actual report compilation.

## When to use / when NOT to use

Use when someone wants to build internal credibility/career around AI skills at their current employer, not when pitching an external AI agency/consultancy service to outside clients.

## Step 1 — Audit your own job (delegate the scoring)

Coach the user (inline) to list everything they do day-to-day and week-to-week. Then spawn `Agent(subagent_type="aic-task-audit-analyst")`, passing it that task list, to score and rank it. Do not start with "whatever annoys me most" — annoyance and automatability are different things. Do not try to fix the whole company yet; start with the user's own work only.

## Step 2 — Automate and measure (inline coaching, orchestrator-owned)

Automate the top tasks on the ranked list one at a time, and measure the before/after. Record concrete numbers (e.g. "this report took 2 hours/week, now takes 10 minutes"). This measured time-savings is the proof — build it before trying to convince anyone else. Move to the next task on the list once the first is proven.

## Step 3 — Make the proof visible (delegate the reporting)

Coach the user (inline) to demo wins in team meetings, offer to fix a coworker's most annoying task too, and document everything as they go. Then spawn `Agent(subagent_type="aic-roi-reporter")` to compile the win demos and package the best prompts/workflows into a reusable internal doc. Framing advice (orchestrator-owned, always relay before delegating): frame everything in business terms, not tool terms — say "this saved us 8 hours before the quarterly report," not "I used ChatGPT for this." Packaging prompts into a shareable internal doc attaches the user's name to something the team depends on.

## Stage gate before step 4 (orchestrator-owned — do not skip)

Constraint-hunting (step 4) is qualitatively different from annoyance-automation (step 1) — don't skip straight to it before the user has proof from smaller wins (i.e. before step 2/3 have produced real, demoed, measured wins). Equally, don't let the user stay stuck automating only annoyances once that proof exists, since annoyance-automation alone doesn't grow a business. Explicitly check with the user: "have you stacked wins and are people starting to come to you?" before proceeding.

## Step 4 — Attack constraints (delegate the scoring, orchestrator frames it)

Once the stage gate is passed, re-run the same audit as step 1, but on the whole business instead of the user's own job. Framing advice (orchestrator-owned): the question changes from "what eats my hours" to "what's actually holding the business back" — e.g. "if we doubled our customers tomorrow, what breaks first?" That bottleneck is the next project. Removing a business constraint (not just saving the user's own team hours) is what turns this into a role the company will pay for. Spawn `Agent(subagent_type="aic-task-audit-analyst")` again, this time passing the whole-business constraint list instead of a personal task list, for scoring/ranking.

## Regulated-environment guardrail (orchestrator-owned, always check before delegating any automation)

In regulated/sensitive-data environments: don't automate without permission or throw AI at sensitive data. The user can still build credibility by experimenting on side projects using dummy data that mirrors their real work. Surface this guardrail explicitly whenever the user's tasks/constraints involve regulated or sensitive data, before any automation work proceeds.

## Step 5 — Formalize the position (delegate the reporting)

Spawn `Agent(subagent_type="aic-roi-reporter")` to total up the hours/money saved across all automations into one number (e.g. "these five automations equal a full-time hire's worth of output per year") and draft the final role proposal. Framing advice (orchestrator-owned): bring that number to the manager not as a request for a favor, but as a proposal for an actual role/title — the user has already built the job, they're just asking the company to name it.

## Rules / heuristics (orchestrator-owned, apply throughout)

- Task-selection filter for step 1 and step 4: real hours saved AND low blast-radius if AI errs. Skip tasks that fail either check.
- Always translate technical actions into business-outcome language when reporting upward (hours saved, cost avoided) — the tool used is not what the boss remembers.

## Final assembly

After subagents return, the orchestrator presents the coaching narrative plus the concrete artifacts (ranked task list, ROI report, role proposal) in one place, and flags what stage the user is at next.
