---
name: new-project-bootstrap
description: >
  Runs the full new-project chain end to end: project-init -> feature-init -> senior-engineer-prompting -> ralph -> no-mistakes-review-pipeline.
  Harness scaffolded -> feature scoped -> delegation prompt framed -> autonomous build loop -> merge gate.
  Trigger: "/new-project-bootstrap", "bootstrap this project end to end", "run the new project chain".
---

# New Project Bootstrap Chain

Runs 5 skills in sequence. Invoke each via the Skill tool, one at a time, waiting for it to finish before starting the next. Do not skip a step unless its precondition is already satisfied in this repo (say which step and why before skipping).

1. **project-init** — scaffold harness from zero (PRD → grill → scaffold → harness → memory), or onboard an existing project with no `.claude/`.
2. **feature-init** — turn the first real feature into a scoped plan + ralph-ready story.
3. **senior-engineer-prompting** — frame the delegation prompt for the build loop.
4. **ralph** — autonomous build loop: feed it the prd.json, one story per iteration until all pass.
5. **no-mistakes-review-pipeline** — merge gate before anything ships.

**Rationale:** harness scaffolded → feature scoped → delegation prompt framed → autonomous build loop → merge gate.
