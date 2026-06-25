---
name: memory-writer
description: >
  Capture non-obvious decisions, validated patterns, and user preferences into
  persistent project memory. Use at the end of meaningful sessions or as part
  of project-init/project-mid handoff.
trigger: /memory-writer
---

# /memory-writer

Write only what a fresh session could not reconstruct from code and git alone.

## Target files

- `memory/decisions.md`
- `memory/patterns.md`
- `memory/user_prefs.md`
- `memory/MEMORY.md`

## Capture rules

Keep:
- why a choice was made
- tradeoffs accepted
- patterns the user explicitly validated
- patterns the user explicitly rejected
- workflow/style preferences that change future execution
- deliberate simplifications and why they are acceptable now

Skip:
- file listings
- feature summaries the code already proves
- recent commit summaries
- obvious implementation details

## Process

1. Scan the session for memory-worthy items.
2. If nothing non-obvious happened, say so and stop.
3. Append or update:
   - `decisions.md` for architecture/scope/tooling choices
   - `patterns.md` for reusable code/workflow patterns
   - `user_prefs.md` for enduring user preferences
4. Update `memory/MEMORY.md` with pointers if missing.

## Secret scan

Before finalizing, scan memory content for secrets or credentials.

If a candidate secret appears:
- remove or redact it
- warn the user that a secret-like value was excluded

Never persist raw secrets to memory files.

## Output

```text
MEMORY WRITTEN
decisions.md  — N updates
patterns.md   — N updates
user_prefs.md — N updates
```

## Rules

- Append; do not overwrite history.
- One memory item = one durable insight.
- Prefer fewer, sharper entries over padded notes.
