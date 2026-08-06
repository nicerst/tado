---
name: ai-automation-delivery-loop
description: >
  End-to-end loop for delivering an AI automation/agent to a real stakeholder (client or employer):
  find the actual business constraint before building, set one Northstar metric, plan with adversarial
  AI review, scope tool permissions (not just prompts), route models by task cost, self-verify before
  calling it done, eval against a golden dataset before production, document the outcome as a receipt.
  Trigger: "build an AI automation for this business", "deliver this agent to a client/stakeholder",
  "how do I know this AI project actually worked", "set up evals for this agent".
---

# AI Automation Delivery Loop

Deliver an AI automation/agent so the outcome is provable, not just built.

## When to use / when NOT to use

Use when building or delivering an AI automation/agent for a real stakeholder (a client, or your employer) where the result has to be justified with an outcome, not just a demo.

Skip for a one-off personal prompt or a throwaway experiment with no stakeholder and no production stakes — this loop is overhead for that.

## Procedure

1. **Find the actual constraint, not the stated request.** A stakeholder's request ("I need a chatbot") is rarely the real bottleneck. Walk their process like a pipe: find the clog (where work backs up) or the leak (where money/time escapes) they didn't name themselves. Ask directly: "Where are you losing the most time or money?"
2. **Set one Northstar metric before building anything.** Get explicit agreement up front: "If we move [metric] from X to Y by [date], is that a success?" That number is the finish line — build toward it, measure against it, ship with it as proof.
3. **Plan by having the AI ask you questions, not by dictating a spec.** Hand it the problem, let it propose the approach, and make it keep asking clarifying questions until it's sure what you actually want — before it writes anything.
4. **Force adversarial review of the plan before building.** A single "is this good?" pass gets a sycophantic yes. Run the plan through multiple AI personas that attack it from different angles — a skeptical customer, a competitor, the engineer who has to maintain it later — because each angle catches a hole the others miss.
5. **Scope tools and permissions, not just prompt instructions.** "Only draft, never send" in a prompt is a suggestion a non-deterministic model can ignore. A scoped API key that physically cannot send is a restriction. Before shipping, list every tool/database/key/file the agent can touch and assume it will eventually use all of it — fix access, not just the prompt, for anything that would be bad if used.
6. **Route each step to the cheapest model that can do it, not one model for the whole pipeline.** Grunt-work steps (bulk summarization, extraction) go to a cheap/fast model; reserve the expensive model for the step that needs real strategic reasoning. Same output quality, materially lower cost.
7. **Build in self-verification before calling anything done.** Ask "how would a human reviewer check this?" and give the agent that same check — screenshot/click-through loops for UI, output analysis, running the actual flow — so it doesn't stop at 60-70% and hand you the rest to fix by hand.
8. **Eval against a golden dataset before anything touches production.** Collect real known-good examples (even ~20 to start), score every version of the agent against them — code-graded if the answer is objective, LLM-as-judge if it needs reasoning — and use that score, not gut feel, to decide whether a change actually helped.
9. **Document the outcome as a receipt, not just a build log.** For every deliverable, record the concrete before/after number (hours saved, leads caught, response time, etc.) plus a short walkthrough. A receipt with a real number beats a portfolio of screenshots.

## Rules / heuristics

- **Negative-prompt everything.** Write down what the agent should NOT do, not just what it should — your own past failures are the most valuable input here, since they're exactly what a beginner has no way of knowing to add. This is standard in Anthropic's own Claude prompting docs (e.g. "don't add features beyond what was asked," "don't add error handling for scenarios that can't happen").
- Non-determinism means one successful run proves nothing about the success rate across 100 real runs — that's why step 8 (evals) isn't optional for anything going to production.
- "Can AI do this?" is never a yes/no question — score it as the percentage of the task it takes off your plate; 25% is still a win over doing it fully manually.
- A rule enforced only in the prompt is not a restriction; a rule enforced by tool/key scope is. Treat any tool access the agent has as something it will eventually use, intentionally or not.
- Model swap or version change can change how the same instructions get interpreted — re-run evals after swapping models, don't assume parity.

---
Source: "12 Lessons from 5,000+ Hours Building with AI" (creator not named in transcript)
