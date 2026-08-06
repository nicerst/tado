---
name: idea-to-shipped-app
description: >
  Runs the idea-to-shipped-app chain end to end: claude-code-idea-to-build-loop -> prd-builder -> phased-app-build-system -> agentic-review-loop.
  Idea validated -> PRD drafted -> phased build -> PR-score gate before ship.
  Trigger: "/idea-to-shipped-app", "take this idea to a shipped app", "run the idea to shipped app chain".
---

# Idea-to-Shipped-App Chain

Runs 4 skills in sequence. Invoke each via the Skill tool, one at a time, waiting for it to finish before starting the next. Do not skip a step unless its precondition is already satisfied in this repo (say which step and why before skipping).

1. **claude-code-idea-to-build-loop** — validate the raw idea before spending build effort on it.
2. **prd-builder** — turn the validated idea into a structured PRD.
3. **phased-app-build-system** — run the PRD through the 5-phase build system (idea validation → PRD/roadmap → design → build loop → launch checklist).
4. **agentic-review-loop** — AI code-review score gate before merge/ship.

**Rationale:** idea validated → PRD drafted → phased build → PR-score gate before ship.
