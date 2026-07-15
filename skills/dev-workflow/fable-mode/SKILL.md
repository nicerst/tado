---
name: fable-mode
description: Elevates any model (Opus, Sonnet, Haiku, open-source) to work with Fable 5's judgment/planning/verification discipline via five gates plus model-routing by cost. Use for hard problems, dynamic multi-agent workflows, or when you want a cheaper model to match a frontier model's output quality. Trigger "fable mode", "/fable-mode", "route this to the right model".
---

# Fable Mode

Run this discipline so a cheaper model lands close to frontier-model output quality: five gates in order, then route the right effort level and model to the task.

## When to use / when NOT to use

Use when: a hard problem needs planning + adversarial review + verification,
you're designing a dynamic multi-agent workflow, or you're deciding which
model/effort level a task deserves.

Don't use for trivial one-shot lookups or single-fact answers — the five
gates are overhead a signal-fact question doesn't need.

## The five gates

Run in order. Don't skip to execution before gate 1-2 are done.

1. **Scope before work.** Plan every step. Then separately play devil's
   advocate against your own plan — enumerate everything that could go
   wrong, every unknown, before executing. Planning steps and stress-testing
   the plan are two different passes, not one.
2. **Evidence before reasoning.** Don't reason from memory/training alone.
   Partial recognition from training ≠ current knowledge — verify it.
   A prompt implying a file/resource exists doesn't mean it does — check.
3. **Reason adversarially.** Attack your own conclusion before presenting
   it. Look for the counterexample, not just confirmation.
4. **Verify before declaring done.** Prove the output actually works —
   don't just assert it. Show the check, not just the claim.
5. **Calibrate and report.** Answer the ambiguous query first, then ask at
   most one clarifying question — don't stall on asking. If something went
   wrong, acknowledge it plainly, stay on the problem, keep working it.

## Effort calibration

Match reasoning depth to task weight, independent of model choice:
- Single signal fact → 1 pass, minimal effort.
- Medium task → 3-5 passes/considerations.
- Deep research/comparison → 5-10 passes.

Higher effort ≠ always better. Cranking effort to max on a model can cause
overthinking/second-guessing and produce a *worse* result than a lower
effort setting on the same or a smaller model. If a high-effort run feels
like it's spiraling (re-litigating settled points, growing scope), drop
effort a notch rather than letting it run longer.

## Model routing

Before delegating a task or spinning up sub-agents, score the models in your
toolkit on three axes and route by task fit rather than always picking the
smartest/most expensive one:

| Axis | Meaning |
|---|---|
| Cost | Higher score = cheaper |
| Intelligence | Reasoning depth, code review quality, how well it "gets" you |
| Taste | Creativity, UI/UX judgment, out-of-the-box thinking |

Route scouting/high-volume/low-complexity sub-tasks (search, data gathering,
mechanical execution) to the cheapest capable model. Route the orchestrator
role (the one running the five gates, designing the workflow, absorbing
sub-agent reports) to the smartest model you're willing to pay for — it's
the piece where judgment compounds.

## Rules / heuristics

- A smart orchestrator + cheap workers can match an all-frontier-model setup
  at a fraction of the cost — verify this on your own workflows before
  assuming you need the expensive model everywhere.
- If a sub-agent workflow costs 3x more for the same output quality, that 3x
  is going somewhere identifiable (redundant reasoning, over-verification) —
  find it, don't just accept the bill.
- Model intelligence isn't yours to keep (it can be taken away, gated,
  changed). The gates, the routing table, the skill files are — invest there.
- If a deliverable turns out great but the reason isn't clear: have the
  model analyze its own session — what it thought, how it got there, how it
  proved it worked — then extract that into a skill.

---
Source: YouTube transcript on Fable 5 / model routing methodology (title/channel/URL not provided in transcript)
