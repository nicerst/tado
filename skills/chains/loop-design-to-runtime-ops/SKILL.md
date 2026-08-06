---
name: loop-design-to-runtime-ops
description: >
  Runs the loop-design-to-runtime-ops chain end to end: loop-engineering -> agent-observability -> no-mistakes-review-pipeline.
  Design the autonomous loop -> instrument it once running -> gate future changes to it.
  Trigger: "/loop-design-to-runtime-ops", "design and instrument this agent loop", "run the loop design to runtime ops chain".
---

# Loop-Design-to-Runtime-Ops Chain

Runs 3 skills in sequence. Invoke each via the Skill tool, one at a time, waiting for it to finish before starting the next. Do not skip a step unless its precondition is already satisfied in this repo (say which step and why before skipping).

1. **loop-engineering** — design or audit the autonomous loop's 6 required components.
2. **agent-observability** — instrument the loop once it's running: tracing, cost/token tracking, guardrails, eval strategy.
3. **no-mistakes-review-pipeline** — gate for any future change to the loop before it merges.

**Rationale:** design the autonomous loop → instrument it once running → gate future changes to it.
