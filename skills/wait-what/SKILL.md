---
name: wait-what
description: >
  Force a rewrite when the agent's last response is verbose, jargon-heavy, or just hard to parse
  (a known Opus failure mode: weird LLM phrasing, buried meaning, over-long sentences). Rewrites in
  simplified technical English grounded in the project's own defined vocabulary, not generic
  "dumb it down" language. Trigger: "wait, what?", "wait what", "that made no sense", "say that again
  but clearly", "rewrite that so I can actually understand it".
---

# Wait, What?

Rewrite a confusing or bloated agent response so it's actually readable — without losing meaning.

## When to use / when NOT to use

Use immediately after the agent produces a response that's technically probably correct but is dense, jargon-heavy, uses unnatural LLM phrasing, or buries the actual point under padding.

Don't use to change what was decided or to re-litigate the content — only how it's said. If the response is already short and clear, there's nothing to fix.

## Procedure

1. Take the exact response that triggered this (the one the user just reacted to with "wait, what?").
2. Rewrite it in Simplified Technical English (ASD-STE 100 style): short, clear, declarative sentences. One idea per sentence. Active voice. No hedging phrases, no LLM filler ("it's important to note that", "essentially", "at its core"), no invented jargon.
3. Ground every term in the project's own defined vocabulary, not generic simple synonyms. If the project has a `context.md` (or similar doc from a grilling/discovery session, e.g. `grill-with-docs`) that defines ubiquitous language for this domain, use those exact terms — don't paraphrase around them or invent alternate wording for a concept the project already named.
4. If a term has no project-defined name yet, use the plainest correct technical term available — don't coin a new one on the spot.
5. Preserve every decision, number, and constraint from the original response exactly. This is a clarity pass, not a summary — nothing substantive gets dropped or softened.
6. Output the rewrite only. Don't restate the original for comparison unless asked.

## Rules / heuristics

- The fix for verbosity is not "use simpler words" in the abstract — it's "use the project's own words." Generic simplification still drifts into synonyms nobody agreed on; grounding in the project's ubiquitous language is what actually removes the friction.
- If the response has no project vocabulary to ground against yet, that's a signal the project may be missing a `context.md` / discovery-session output — flag that once, don't let it block the rewrite.
- Never use this to soften or bury a genuinely bad or uncertain answer — clarity, not spin.

---
Source: "Skills v1.2.0" changelog video — Matt Pocock (aihero.dev/skills)
