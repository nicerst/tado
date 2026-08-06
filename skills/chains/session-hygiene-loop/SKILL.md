---
name: session-hygiene-loop
description: >
  Runs the session-hygiene-loop chain end to end: doc-cleanup -> project-mid -> memory-writer.
  Clear cruft -> recalibrate drift -> persist what's worth keeping.
  Trigger: "/session-hygiene-loop", "clean up and recalibrate this project session", "run the session hygiene chain".
---

# Session-Hygiene-Loop Chain

Runs 3 skills in sequence. Invoke each via the Skill tool, one at a time, waiting for it to finish before starting the next. Do not skip a step unless its precondition is already satisfied in this repo (say which step and why before skipping).

1. **doc-cleanup** — clear stale/cruft documentation before recalibrating.
2. **project-mid** — day-30+ checkpoint: recalibrate scope drift, surface piled-up stories.
3. **memory-writer** — persist the real decisions from this session — the WHY, not what the code already shows.

**Rationale:** clear cruft → recalibrate drift → persist what's worth keeping.
