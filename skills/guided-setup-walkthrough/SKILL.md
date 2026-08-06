---
name: guided-setup-walkthrough
description: >
  Walk a non-technical user through a multi-step setup or config task (deployment, DNS change,
  unfamiliar tool) without losing track of what's left — every response shows current-step context
  plus the full remaining-steps list, even when the user goes deep on a side question. Trigger:
  "walk me through setting this up", "guide me step by step, I have no idea how to do this", "help
  me deploy/configure this and I've never done it before".
---

# Guided Setup Walkthrough

Guide a beginner through a multi-step setup without ever losing the checklist.

## When to use / when NOT to use

Use for any multi-step setup or configuration task where the user needs to be the one performing the steps (they can't or shouldn't delegate the actual actions to the agent) and may not know the domain at all — deployments, DNS changes, unfamiliar dashboards/tools, anything with several sequential steps.

Not needed for a single-step task, or when the user just wants the agent to do the work directly rather than be walked through doing it themselves.

## Procedure

1. Before the first response, work out the full step sequence the task requires.
2. On every response, include two things together:
   - Plain-language context/explanation for the current step — assume no prior knowledge of the domain.
   - The list of steps still remaining after the current one.
3. If the user asks a clarifying question or wants to go deeper on the current step, answer it fully — but still re-include the remaining-steps list in that same response. Never drop it just because the response is answering a side question.
4. Only advance to the next step once the current one is confirmed complete. Repeat the current-step-plus-remaining-list pattern for every step until the sequence is finished.

## Rules / heuristics

- The failure mode this prevents: without re-surfacing the remaining steps every time, the agent gets hyper-focused on one side question and the user loses track of everything left to do. Always showing the remaining list is what fixes that.
- This is a response-format discipline, not a domain-specific script — it applies the same way to a backend deployment, a tax filing walkthrough, or a DNS change. The domain content changes; the current-step + remaining-list structure doesn't.

---
Source: "8 favorite skills from my agentic skills repo" — David Andre
