---
name: cloud-agent-build-verify-loop
description: Loop that turns a ticket (with an explicit expected-vs-actual behavior section) into a verified fix by having a cloud agent with desktop/computer-use access build, then use its own desktop to reproduce and test the fix, looping until it produces a recorded video proving the desired state was actually achieved — not just "tests pass." Use when an AI coding agent's fixes need objective, hallucination-resistant proof before a PR gets created. Pairs with agentic-review-loop for the PR-review-score half — this skill only covers the build-and-verify half.
---

# Cloud Agent Build-Verify Loop

Loop until there's a recorded video proving the fix actually works — not until the agent says it's done.

## When to use / when NOT to use

Use when fixing a bug or building a feature with a visually-confirmable success state (streaming works, a permission applies, an onboarding flow completes) and a cloud agent with desktop/computer-use access is available (Cursor Cloud, Devin, or similar). Skip for pure backend/logic changes with no visual state to record, or if only a local-machine agent with no computer-use is available — running heavy computer-use loops locally can overload the machine.

## Procedure

1. Write the ticket with an explicit expected-vs-actual behavior section — the ticket's clarity directly determines whether the loop can objectively detect success; a vague ticket produces a loop with no clean exit.
2. Assign the ticket to a cloud agent with desktop/computer-use access (not a local-only agent) via the tracker's agent-assignment integration (e.g. MCP).
3. Let the agent build: read the ticket, plan, write the fix.
4. Have the agent use computer use on its own desktop to reproduce the original bug/feature state first, confirming it understands the actual problem before claiming a fix (if login/2FA blocks reproduction, grant the access needed to get past it).
5. Have the agent test the fix the same way — computer use driving the actual UI/interaction — and record a video of the attempt.
6. Check the recording against the ticket's expected behavior:
   - Matches → exit the loop, proceed to PR creation.
   - Doesn't match (or the agent itself marks it a fail) → send it back to rebuild, then repeat from step 5.
7. Only after a recording proves the desired state was achieved: create the PR and attach the success video for the human reviewer.
8. Hand off to a PR-review-score loop (see `agentic-review-loop`) before merge — this skill's loop covers build-and-verify only, not the review-score gate.

## Rules / heuristics

- The loop's exit condition must be objectively checkable, not "agent says it's done" — a recorded video of the agent actually using the fixed feature is what makes this loop reliable instead of burning tokens on false completions.
- Computer-use verification requires a cloud agent with real desktop access, not a local terminal-only agent.
- Build the loop manually first: walk through ticket → agent build → computer-use test → recording, by hand, for one real ticket before turning it into an automated/skill-based loop. Automating a loop you haven't run manually once risks automating the wrong exit criteria.
- When the agent's first attempt fails the recorded test, that's the loop working correctly, not a bug — the value of the loop is specifically in catching and correcting a failed first attempt before it reaches a human or a PR.
- A vague ticket (no explicit expected-vs-actual behavior) undermines the whole loop — the ticket's clarity is what gives the loop something concrete to check against.

## Examples

Real run: a "chat streaming doesn't work" bug — agent reproduced the bug via computer use first (text appeared all at once instead of streaming), proposed a fix plan, investigated a secondary issue that surfaced, applied a fix, then produced a recording showing streaming working correctly, before any PR was opened.

Another real run: a connector-permissions feature — first attempt recorded a failure (agent asked for permission instead of auto-applying an "always allow" setting), which was caught by the recording and looped back for a rebuild rather than merged as-is.

---
Source: video transcript pasted by user (title/channel not given; speaker referred to as "Ross")
