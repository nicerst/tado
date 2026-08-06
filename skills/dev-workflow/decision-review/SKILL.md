---
name: decision-review
description: >
  After a large agent-driven change, don't review the code line by line — ask the agent which
  decisions it made that it's NOT confident about (only the unsure ones), then review those.
  Optionally walk unresolved decisions one at a time with alternatives + a recommendation.
  Trigger: "review the decisions in this change", "what are you not confident about", "/decisions",
  "walk me through the uncertain choices one at a time".
---

# Decision Review

Review judgment calls, not lines of code, after a large agent-driven change.

## When to use / when NOT to use

Use after any large feature, big bug fix, or large refactor — dozens of files changed, hundreds to thousands of lines, or the agent ran for 10+ minutes on it.

Skip for small, easily-diffable changes — this replaces line-by-line review specifically because that doesn't scale for large changes; it's overkill for a small one.

## Procedure

1. After the large change lands, don't start reading the diff. Ask the agent this exact question instead:

   > While working on this, which important decisions or choices did you make that you are not confident about? Think about this deeply. Reason about all the important decisions made and think whether these decisions have any other great alternatives that we have not considered. Do not list out the choices or decisions where we already have the best possible solution. Only list out decisions that we are unsure about. Answer in short in plain English, be concise.

2. Review only what comes back. Skip re-verifying anything the agent already says it's confident is the best solution — the point of the question is to filter to what actually needs a human judgment call.
3. If multiple uncertain decisions come back and reviewing them all at once feels overwhelming, switch to one-at-a-time mode: for each uncertain decision, have the agent present up to 4 alternative choices plus its own recommendation. Give your verdict — approve the recommendation, pick a different option, or reject all and redirect — before moving to the next decision.

## Rules / heuristics

- Never ask for "list all" decisions — that makes the agent overthink and surface pointless items. Asking specifically for what it's NOT confident about is what filters the noise out.
- This replaces code review for large changes, it doesn't augment it — reviewing thousands of lines doesn't scale, but reviewing a handful of judgment calls does.
- Reserve this for consequential changes (production-adjacent, dozens of files) — not every small commit needs it.

## Examples

The exact review prompt (use verbatim, don't paraphrase — the "only list out decisions we are unsure about" line is what prevents overthinking):

```
While working on this, which important decisions or choices did you make that you are not confident about? Think about this deeply. Reason about all the important decisions made and think whether these decisions have any other great alternatives that we have not considered. Do not list out the choices or decisions where we already have the best possible solution. Only list out decisions that we are unsure about. Answer in short in plain English, be concise.
```

---
Source: "8 favorite skills from my agentic skills repo" — David Andre (credits the review-prompt concept to Victor Talan)
