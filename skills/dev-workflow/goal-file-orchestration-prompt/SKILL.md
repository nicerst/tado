---
name: goal-file-orchestration-prompt
description: Pattern for running one long, autonomous, multi-agent build from a single prompt by putting the full instruction set in a file (bypassing prompt/goal character limits) and telling the orchestrator to plan, delegate, and verify without checking back in. Use when user wants to "build something end-to-end autonomously", "run a long unattended agent task", "spin up sub-agents to build a business/product", or hits a character limit on a goal/task prompt.
---

# Goal-File Orchestration Prompt

> **Orchestrated workflow:** spawn `Agent(subagent_type="gfo-goal-file-author")` to draft the actual instruction file instead of writing it inline; use inline only for quick interactive checks (e.g. spot-checking one section's wording with the user before the full draft).

Get an orchestrator-capable model to autonomously plan, delegate to sub-agents, and self-verify a large multi-phase build from one instruction, without needing to fit everything into a short prompt box or answer mid-run questions.

## When to use / when NOT to use

Use for large, ambiguous, multi-deliverable builds (e.g. "build me a business/product package") where you want the model to make its own calls end-to-end and report only at completion.

Don't use for tightly-scoped tasks with a known, short spec — the overhead of guardrails/phases/definition-of-done is wasted on small work; just prompt directly.

This pattern trades run cost (can consume a large share of a usage budget/context window in one go) for unattended scope — expect a multi-hour, resource-heavy run, and budget for it before starting.

## Procedure

1. **Interview the user for the five sections.** Before drafting anything, walk the user through each section and lock down concrete answers:
   - **Mission** — the ambiguous, high-level goal in plain language (e.g. "find a real painful underserved problem people are complaining about right now and build a business around it").
   - **Guardrails** — hard constraints the model must never cross (e.g. no new spending, only use what's already available/in-project, publish nothing / keep everything local, invent nothing — every fact/stat must be researched and verified, stay inside this project, never ask the user anything).
   - **Orchestration definition** — what "orchestrate" means for this run: fan out parallel sub-agents across different sources/angles, run tournaments where independent agents propose competing options and a judge panel scores them, adversarially verify important claims with dedicated skeptic/critic agents whose only job is to attack them, run a completeness critic before marking any phase done. Tell the user (and later the file) that these patterns are a **floor, not a ceiling** — the model should design whatever orchestration shape the work actually calls for.
   - **Phase arc** — a numbered sequence of phases from raw input to final packaged deliverable (e.g. hunt for the problem → pick the winner → design the solution → build the brand → build the thing → produce a demo/launch asset → red-team it → package everything).
   - **Definition of done** — a subjective but checkable bar, phrased as what a stranger should be able to do with the final deliverable (e.g. "a stranger should be able to open the recap and understand the business, watch the video, run the site, demo it").

   Front-load stress-testing of the core idea/premise before locking the phase arc — an ambiguous goal with a weak underlying idea wastes the most expensive part of the run on a bad target. Tighten the pain-hunt/idea-validation phase rather than the build phases when interviewing.

2. **Never-ask rule.** Explicitly confirm with the user, and carry into the file, that the model must make every call itself, write down why it made each call, and keep moving within the guardrails — no mid-run questions back to the user. This is what allows a long unattended run.

3. **Delegate the drafting.** Spawn `Agent(subagent_type="gfo-goal-file-author")`, passing it the five locked-down answers plus the never-ask rule and the floor-not-ceiling framing. It returns the complete instruction file content (or writes it directly) — do not draft the file yourself.

4. **Write the file, not the prompt box**, when the content would exceed the interface's prompt/goal character limit — this is exactly why the drafting is delegated to a file-writing subagent rather than composed inline.

5. **Hand back the finished file with a one-line kickoff prompt.** Give the user the file path and this exact kickoff line to paste into the orchestrator-capable model:

   > "Read this file and execute everything below the divider line as your goal. Follow it exactly, including the never-ask rule. Do not report back until the definition of done is met. Start now."

6. **Review the single end-of-run recap artifact** once the run reports back. The model should produce one HTML/markdown recap linking every deliverable (site, videos, research, brand assets, business plan). Check this recap against the definition of done from step 1 in one pass, rather than digging through the file tree — this is the orchestrator-skill's own final review gate, done inline, not delegated.

## Rules / heuristics

- The floor-not-ceiling framing on both orchestration and phase arc matters: it tells the model the listed patterns are a minimum bar, not the full extent of allowed creativity — don't cap the model's design of its own sub-agent structure.
- A subjective definition-of-done, phrased from a stranger's-eye-view checklist, is easier for both model and human to verify than a vague "make it good."
- Let the orchestrator delegate rather than build directly during the actual run: plan → delegate → review → tell workers to redo if not good enough, not implementation work itself. Each delegated worker can run on a cheaper capable model; only the orchestrator needs the more expensive/frontier tier.

---
Source: "Fable 5 Just Built Me a Business With One Prompt" — Nate Herk | AI Automation
