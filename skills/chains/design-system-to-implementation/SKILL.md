---
name: design-system-to-implementation
description: >
  Runs the design-system-to-implementation chain end to end: reference-to-design-system -> frontend.
  Tokens/design system exported -> frontend implements against them.
  Trigger: "/design-system-to-implementation", "turn this reference into a design system and build it", "run the design system to implementation chain".
---

# Design-System-to-Implementation Chain

Runs 2 skills in sequence. Invoke each via the Skill tool, one at a time, waiting for it to finish before starting the next. Do not skip a step unless its precondition is already satisfied in this repo (say which step and why before skipping).

1. **reference-to-design-system** — turn a visual reference (screenshot, URL, image) into a design.md + design.html token system.
2. **frontend** — implement production UI against those exported tokens.

**Rationale:** tokens/design system exported → frontend implements against them.
