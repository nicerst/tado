---
name: agentic-review-loop
description: "Agentic feature-development loop: plan → build → manual test → minimal stacked PRs to staging → AI code-review score gate → automated fix-review loop until top score, then merge. Use when building a feature with an agent end-to-end, when a PR gets a low review score, or when deciding how to split a large PR for AI review."
---

# Agentic Review Loop

Ship agent-built features through an automated review-score gate instead of merging on vibes.

## When to use / when NOT to use

- Use: building a feature with a coding agent that will land via PR; a review bot (Greptile or similar) scores the PR below threshold; a PR is too large for any reviewer to hold.
- Don't use: throwaway scripts, prototypes with no PR flow, repos without an AI reviewer wired up.

## Procedure

1. **Research first.** Before planning, have the agent web-fetch and explain the feature you're cloning/building (e.g., "learn what Claude artifacts is and tell me about it"). Confirm it has the product shape right before any code.
2. **Plan in plan mode.** Prompt: review the entire codebase first; do not build this feature at the cost of breaking another. The plan is mostly for YOU — you work on multiple features and need the record of what you and the agent were doing.
3. **Build locally, test by hand.** Actually click through the feature. Screenshot what's wrong, paste it back with the fix request. Queue follow-up fixes while the agent works.
4. **Keep PRs minimal.** Target a few hundred lines, 1,000 max; 2,000+ is too big for any review agent to capture everything. Large cross-cutting feature → split into stacked PRs (not independent branches — later pieces depend on earlier ones), each with ONE review surface (e.g., parser contract / persistence / preview / UI integration).
5. **PR to staging, never straight to main.** Local → staging branch (live testing ground) → main only after it soaks.
6. **Read the review score.** AI reviewer returns confidence score out of 5. Gate: 4/5 or higher = good enough to merge. Below → step 7.
7. **Fire the review loop** (Greptile's `/greptile-loop` skill or equivalent): agent reads review comments from GitHub, fixes, pushes; push triggers re-review; repeat until 5/5 or ~5 turns, whichever first. On stacked PRs, loop and merge bottom-up, one PR at a time.
8. **Detect the stall.** Score stuck (e.g., cycling at 4/5) or degrading → stop the loop, review manually, merge yourself. Endless agent edits end in hallucinated fixes.
9. **After merge, run a code-structure/cleanup pass** so the feature lives in a clean service layer both you and the agent can find later.

## Rules / heuristics

- Smaller, focused PRs make life better for humans AND review agents — same rule.
- Merge gate: ≥4/5. Loop cap: ~5 turns. Stuck loop → human takes over.
- Every review-loop fix should update/extend the tests the agent wrote, not just the code.
- Use speech-to-text (e.g., Whisperflow) for prompting — you say far more than you'd type, and richer prompts steer better.
- Route by cost: frontier model (GPT-5.5-class, extra-high reasoning) for the engineering agent; cheaper model is fine for the product's runtime LLM.
- Compose the product from service-layer abstractions — one service per external tool — so agent and human can find code fast.
- Prompts that work: "short, simple, concise, to the point, not too long."
- While the agent cooks, go do something else. Blocking on it wastes the whole point.

## Examples

- Plan prompt: "You know exactly the type of feature I want. Create a plan. Review the entire codebase, understand how things work — I don't want to build this feature at the cost of breaking another one."
- PR-split prompt: "The PR got 3/5 but feels too big for the review agent to capture everything. What do you think about splitting it into smaller chunks so it can be reviewed and merged safely?"
- Loop on specific stacked PR: `/greptile-loop PR87` — fix bottom of the stack first, merge, move up.

---
Source: "My agentic engineering workflow has changed" (Pluto artifacts feature build) — Ross Mike (URL not provided)
