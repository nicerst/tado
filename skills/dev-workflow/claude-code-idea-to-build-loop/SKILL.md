---
name: claude-code-idea-to-build-loop
description: Non-technical workflow for turning one real task/idea into a working build with Claude Code — roast the idea with a council before building, build in the smallest working slice, then force verification before accepting "done". Use when a user (especially non-coder) wants to build something from an idea, validate a business/feature idea before committing, or is unsure how to structure a build session. Trigger "roast this idea", "validate this before I build", "build this the right way", "run the council on this".
---

# Claude Code: Idea → Roast → Build → Verify Loop

> **Orchestrated workflow:** spawn `Agent(subagent_type="itb-idea-roaster")` to run the three-perspective roast council instead of running it inline; use inline only for quick interactive checks (e.g. clarifying a detail of the idea with the user before sending it to the roaster). All other steps — task selection, description elicitation, the build itself, verification, and the feedback loop — stay inline by design; this is an interactive, non-technical session.

Describing a task clearly and thinking critically about the output is the whole skill now — no coding background required. This is the loop: pick one task, stress-test it before building, build in the smallest working slice, and never accept "done" without proof.

## When to use / when NOT to use

Use when: starting a new build from an idea, validating whether an idea is worth building, or structuring any Claude Code session end-to-end.

Don't use for trivial single-step asks where there's nothing to validate or verify (e.g. "rename this variable").

## Procedure

1. **Pick one task, not ten.** Choose something repetitive, something you keep putting off, or something you'd normally pay a freelancer to do. One task = one project. Don't start a build with multiple unrelated goals bundled together.

2. **Describe it fully before building anything.** Elicit from the user: what the task is, how they do it today, and what a win looks like. Do this before letting Claude write or build anything.

3. **Roast it — don't let it get built untested.** Models default to agreeable/sycophantic: an excited pitch gets an excited "let's build it" even with holes in the idea. Counter this explicitly by delegating to the council rather than building right away:
   - Spawn `Agent(subagent_type="itb-idea-roaster")` with the full task description from step 2 (and any existing memory/context — what's already working, past failures — if available, so the critique isn't generic).
   - It returns one clean verdict: **Go** / **Reshape** / **Kill**, with the three perspectives' evidence-backed reasoning.
   - Only proceed to building if the verdict is Go or Reshape (reshape first if so). On Kill, stop and revisit the task with the user rather than building it anyway.
   - The roast/council step is not optional flavor — it's the counter to model sycophancy; skipping it means building on an unstressed idea.

4. **Build in the smallest working slice.** Don't ask for the whole thing at once. Break a big project into pieces, start with the smallest version that actually works, then grow it from there step by step. This stays inline — it's the interactive core of the session, not a delegated phase.

5. **Never accept "done" on the model's word — make it prove the work.** Ask: if a human handed you this work, what would you check to confirm it's actually done and good? Then have Claude perform those same checks itself (run the code on a real example, control a browser to check output, etc.) and show the result, not just claim success. Verification must produce observable proof (a run, an output, a screenshot-equivalent) — a claim of "done" alone is not verification.

6. **Treat a rough first pass as feedback, not failure.** A first version landing around 60-70% correct is normal. Tell it plainly what was right and wrong, let it fix its own work, and repeat. Each round should get better because context/memory compounds across sessions.

7. **When one task loop closes, start the next one.** Don't scale up scope mid-loop — finish one task's loop (describe → roast → build → verify) before picking the next task.

## Rules / heuristics

- If you don't understand something Claude did, ask it to explain — don't just accept or reject blindly.
- A council/roast step is not optional flavor — it's the counter to model sycophancy; skipping it means building on an unstressed idea.
- Verification must produce observable proof (a run, an output, a screenshot-equivalent) — a claim of "done" alone is not verification.

---
Source: YouTube video on non-technical founders building businesses with Claude Code (Vulcan case study; "the roast" council pattern) — channel/URL not provided in transcript.
