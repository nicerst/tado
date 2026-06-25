---
name: agentic-engineering
description: >
  Agentic engineering doctrine: eval-first execution, harness-first thinking,
  small verifiable work units, cost discipline, and explicit separation between
  deterministic procedure and model judgment.
---

# Agentic Engineering

Use this skill to choose the working style, not the product behavior.

## Core doctrine

1. Define done before execution.
2. Break work into agent-sized units.
3. Put deterministic work in the harness, not in prose.
4. Use the cheapest model/tool that can do the job.
5. Re-run the evaluation or gate after every meaningful change.

## Procedure vs judgment

Classify each task:

- **Procedure**
  - fixed command sequence
  - schema transform
  - static validation
  - known checklist
  - repeatable repo hygiene

For procedure: build or use the harness.

- **Judgment**
  - architecture tradeoffs
  - root-cause analysis
  - ambiguous product choices
  - prioritization under uncertainty

For judgment: use the model, but keep the decision explicit.

## Work unit rules

- one unit should fit one focused context window
- one unit should have one dominant risk
- one unit should end with one clear validation step

If a unit cannot be validated, it is still too vague.

## Harness-first rule

When a failure repeats, ratchet it into the harness:
- convention confusion → `AGENTS.md`
- destructive action risk → guard hook / permissions
- false "done" → stop gate
- repeated re-briefing → handoff / project DNA

Do not encode temporary model weakness into permanent product code unless the product itself needs it.

## Cost discipline

Track per task:
- model/tool used
- retries
- elapsed time
- validation result

Escalate cost only after a lower-cost path fails for a concrete reason.

## Review focus

Prioritize:
- invariants
- edge cases
- trust boundaries
- rollout risk
- hidden coupling

Do not spend the main review budget on style if lint/format already owns it.

## Ponytail rule

Delete speculative layers. Reuse local helpers. Prefer the smallest solution that survives validation.
