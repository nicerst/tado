---
name: ingest-to-skill-authoring
description: >
  Runs the ingest-to-skill-authoring chain end to end: opensrc -> context7 -> repo-to-skill.
  Fetch real source/docs first so the written skill isn't hallucinated API surface.
  Trigger: "/ingest-to-skill-authoring", "turn this repo/docs into a skill without guessing the API", "run the ingest to skill authoring chain".
---

# Ingest-to-Skill-Authoring Chain

Runs 3 skills in sequence. Invoke each via the Skill tool, one at a time, waiting for it to finish before starting the next. Do not skip a step unless its precondition is already satisfied in this repo (say which step and why before skipping).

1. **opensrc** — fetch and prepare the real open-source project for open-sourcing/inspection.
2. **context7** — pull up-to-date library/framework documentation for the target API surface.
3. **repo-to-skill** — write the SKILL.md from a pinned-sha scout of the real repo, not memory.

**Rationale:** fetch real source/docs first so the written skill isn't hallucinated API surface.
