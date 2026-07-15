---
name: agentic-review-loop
description: "Agentic feature-development loop: plan → build → manual test → minimal stacked PRs to staging → AI code-review score gate → automated fix-review loop until top score, then merge. Use when building a feature with an agent end-to-end, when a PR gets a low review score, or when deciding how to split a large PR for AI review."
---

# Agentic Review Loop

Ship agent-built features through an automated review-score gate instead of merging on vibes.

**Orchestrated workflow:** spawn `Agent(subagent_type="arl-feature-researcher")` for feature research, `Agent(subagent_type="arl-pr-splitter")` for PR splitting, `Agent(subagent_type="arl-review-fixer")` for each fix-review turn, and `Agent(subagent_type="arl-cleanup-refactorer")` for the post-merge pass — instead of running any of those inline. Use inline only for quick interactive/`/slash` use (e.g. a one-off question about the loop's rules).

This orchestrator owns: the loop state machine, plan-mode planning, local build + manual-test coordination, the PR size check, reading the review score, the merge gate, the turn cap, stall detection, and stacked-PR merge order. It delegates research, PR splitting, fix rounds, and post-merge cleanup to the subagents above.

## When to use / when NOT to use

- Use: building a feature with a coding agent that will land via PR; a review bot (Greptile or similar) scores the PR below threshold; a PR is too large for any reviewer to hold.
- Don't use: throwaway scripts, prototypes with no PR flow, repos without an AI reviewer wired up.

## Procedure (orchestrator-owned state machine)

1. **Research first — delegate.** Before planning, spawn `arl-feature-researcher` with the feature description/reference to web-research and explain what's being cloned/built. Present the returned product-shape brief to the user and confirm it's right before any code is written.

2. **Plan in plan mode — inline.** Prompt pattern: review the entire codebase first; do not build this feature at the cost of breaking another. The plan is mostly for the user — they work on multiple features and need the record of what was decided. This step stays in the orchestrator/main thread since it's directly interactive with the user.

3. **Build locally, test by hand — inline coordination.** Actually click through the feature. Take screenshots of what's wrong and paste them back with the fix request. Queue follow-up fixes while the agent works. This is interactive coordination, not a delegatable phase.

4. **PR size check — orchestrator gate.** Target a few hundred lines, 1,000 max; 2,000+ is too big for any review agent to capture everything.
   - If the diff/PR is within size: proceed to step 5.
   - If oversized: spawn `arl-pr-splitter` on the diff/PR. It returns a stacked-PR split proposal (not independent branches — later pieces depend on earlier ones), each PR with ONE review surface (e.g. parser contract / persistence / preview / UI integration). Present the proposal to the user, then execute the split.

5. **PR to staging, never straight to main.** Local → staging branch (live testing ground) → main only after it soaks. Orchestrator-owned; no delegation needed.

6. **Read the review score — orchestrator gate.** AI reviewer returns a confidence score out of 5.
   - **Merge gate: ≥4/5 → merge.**
   - **< 4/5 → step 7.**

7. **Fire the review loop — delegate per turn.** For each turn (Greptile's `/greptile-loop` or equivalent), spawn `arl-review-fixer` with: the PR id, current score, the specific review comments, and the turn number. It reads the AI-review comments on that PR, applies fixes + matching test updates, pushes (which triggers re-review), and reports the score delta.
   - Loop this step until score hits 5/5 (or clears the ≥4/5 gate) OR ~5 turns is reached, whichever first.
   - **On stacked PRs: loop and merge bottom-up, one PR at a time** — do not advance to the next PR in the stack until the current one clears the gate and merges.

8. **Detect the stall — orchestrator watches across turns.** If the score is stuck (e.g. cycling at 4/5) or degrading turn-over-turn: stop the loop, take over manually (review the diff yourself), and merge yourself if warranted. Do not let the agent keep editing — endless agent edits end in hallucinated fixes.

9. **After merge, delegate cleanup.** Spawn `arl-cleanup-refactorer` on the merged PR(s) to relocate the feature into clean service-layer abstractions the user and agent can both find later. Report what moved.

## Rules / heuristics (orchestrator enforces these)

- Smaller, focused PRs make life better for humans AND review agents — same rule.
- **Merge gate: ≥4/5. Loop cap: ~5 turns. Stuck loop → human takes over.**
- Every review-loop fix must update/extend the tests the agent wrote, not just the code (enforced inside `arl-review-fixer`, verified by orchestrator before merge).
- Use speech-to-text (e.g. Whisperflow) for prompting — richer prompts steer better than typed ones.
- Route by cost: frontier model (GPT-5.5-class, extra-high reasoning) for the engineering agent; a cheaper model is fine for the product's runtime LLM.
- Compose the product from service-layer abstractions — one service per external tool — so agent and human can find code fast.
- Prompts that work: "short, simple, concise, to the point, not too long."
- While the agent cooks, go do something else. Blocking on it wastes the whole point.

## Examples

- Plan prompt: "You know exactly the type of feature I want. Create a plan. Review the entire codebase, understand how things work — I don't want to build this feature at the cost of breaking another one."
- PR-split prompt: "The PR got 3/5 but feels too big for the review agent to capture everything. What do you think about splitting it into smaller chunks so it can be reviewed and merged safely?"
- Loop on specific stacked PR: `/greptile-loop PR87` — fix bottom of the stack first, merge, move up.

---
Source: "My agentic engineering workflow has changed" (Pluto artifacts feature build) — Ross Mike (URL not provided)
