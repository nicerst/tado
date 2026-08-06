---
name: research-to-prompt
description: >
  Runs the research-to-prompt chain end to end: storm-research -> the-council -> craft-prompt.
  Research the facts -> decide what to do -> phrase it as an agent prompt.
  Trigger: "/research-to-prompt", "research this then turn it into a prompt", "run the research to prompt chain".
---

# Research-to-Prompt Chain

Runs 3 skills in sequence. Invoke each via the Skill tool, one at a time, waiting for it to finish before starting the next. Do not skip a step unless its precondition is already satisfied in this repo (say which step and why before skipping).

1. **storm-research** — multi-perspective research (5-lens analysis) to build a high-confidence factual base.
2. **the-council** — deliberate on what to do with those facts; surface genuine tradeoffs.
3. **craft-prompt** — phrase the decided course of action as a well-structured agent prompt.

**Rationale:** research the facts → decide what to do → phrase it as an agent prompt.
