---
name: no-mistakes-review-pipeline
description: Adversarial pre-merge review pipeline that validates AI-written code against the original intent (pulled from the agent session that produced it), reviewed by a different model, isolated in its own branch/worktree. Use when you can't review every line of AI-generated code yourself and need a gate before merging, especially for production code. Distinct from agentic-review-loop (which gates on an external PR-review bot's score) — this gates on cross-model adversarial review grounded in the originating session's intent, not the diff alone.
---

# No Mistakes Review Pipeline

Send every non-trivial AI-written change through an adversarial reviewer before you ever look at the diff yourself.

## When to use / when NOT to use

Use for production code, anything affecting real users, or any change you can't afford to review line-by-line. Skip for throwaway demos, weekend prototypes, or a fix simple enough you're already confident it won't break anything — send those straight to merge.

## Procedure

1. Get all current working-directory changes onto a branch: create the branch and a commit carrying enough context for the pipeline to run against.
2. Push the branch into an isolated environment (a local git proxy / isolated worktree) — validation never runs against the live working copy.
3. **Extract intent first, before reviewing code.** Read the agent session that produced the change (the original prompt/conversation), not just the diff. The stated intent is the true requirement the review must check against — a diff alone doesn't tell you what was actually asked for.
4. Rebase onto the latest remote main/origin before validating, so you're not validating against a branch that's about to conflict.
5. Run adversarial review with a different model than the one that wrote the code — never let the generator grade its own work.
6. Per issue the reviewer finds:
   - Obvious, low-risk bug → autofix directly.
   - Fix has product implications (the correct fix would change product behavior, not just patch a bug) → escalate to the human instead of auto-fixing.
7. After review passes, run tests and require visible evidence of correctness — not just "tests pass," but output proving the intended behavior actually works.
8. Check documentation and lint for staleness (e.g. a README describing behavior that no longer matches the change) — flag and fix.
9. Push for PR and babysit the CI pipeline until it's green.
10. Only then surface it to the human as ready to look at — don't make the human watch the pipeline run.

## Rules / heuristics

- Treat pipeline cost as the price of quality: skipping review makes merging faster short-term, but defers the cost to production incidents later — the cost doesn't disappear, it moves.
- Not every change needs the full pipeline — a change you're already confident about can go straight to merge; reserve the pipeline for changes where you're not certain.
- Track outcomes over time (changes sent through it, % with a mistake caught, which step caught the most issues) — use that data to keep tuning the pipeline rather than assuming it stays calibrated forever.
- In practice, the adversarial-review step and the documentation/lint step were the two biggest sources of caught issues — don't skip either even when the pipeline feels slow.
- On a codebase maintained long-term without this kind of gate, quality problems compound — the absence of the pipeline doesn't show up immediately, it shows up as accumulated incidents later.

## Examples

Real numbers from practice: ~1,000 changes sent through the pipeline across 59 repos; 63% had at least one mistake caught and fixed before reaching the human. The adversarial-review step and the documentation-staleness check were the two most effective catches.

Command pattern used: a short alias (e.g. `nm` or `nm -y`) meaning "take everything currently in the working directory, branch it, and send it through the pipeline" — one command to kick off the whole flow.

---
Source: interview transcript (Kun/Coon interviewed by David) — channel/title/URL not given in source
