---
name: personal-assistant-buildout
description: Turn Claude Code into a personal/executive assistant by identifying low-decision drudgery, converting it into skills/automations across productivity-sales, research, and content buckets, then organizing outputs in an Obsidian-style vault. Use when user wants to "automate my workflow", "build a personal assistant with Claude", "set up daily briefs/email triage", or "organize my second brain for Claude".
---

# Personal Assistant Buildout

Systematically offload low-decision, high-frequency grunt work to Claude Code, organized so it compounds instead of sprawling.

**Orchestrated workflow**: spawn `Agent(subagent_type="pab-triage-skill-builder")` for the inbox-triage build, `Agent(subagent_type="pab-research-skill-builder")` for the research-brief build, `Agent(subagent_type="pab-voice-calibrator")` for voice-matching calibration, and `Agent(subagent_type="pab-vault-organizer")` for vault structuring — instead of running any of those inline. Use inline only for quick interactive/`/slash` use where the human just wants the bucket-identification conversation or a quick recommendation, not a full build.

This orchestrator owns: the interview, ROI prioritization/sequencing, the human-in-the-loop gate rule, and the optional-dashboard decision. It never builds skill files itself — that's delegated.

## When to use / when NOT to use

Use when someone wants a repeatable personal/business automation system (email triage, daily research briefs, content repurposing) rather than a one-off script.

NOT for: single ad-hoc tasks, creative work requiring taste/voice (only use for the *mechanical* repurposing step, not final creative judgment).

## Step 1 — Identify the buckets (inline, orchestrator-owned)

Ask what recurring, low-decision work eats hours weekly. Typically falls into: productivity/sales (inbound comms, proposals), research (staying current on a niche), content (repurposing/packaging). Not everyone has all three — skip what doesn't apply.

## ROI prioritization (inline, orchestrator-owned)

Prioritize by ROI: build the highest-frequency, most time-consuming bucket first (usually inbox triage). Sequence is:

1. Productivity/sales skill first — fastest ROI.
2. Research skill second.
3. Content skill last, and only if content creation is actually part of the workload.
4. Vault organization only once multiple skills are producing output.
5. Dashboard last of all, and only if it's earned.

Combine same-cadence automations into one scheduled routine rather than running them separately (e.g. email triage + research brief on the same 8am cadence become one scheduled routine).

## Delegation per bucket

- **Productivity/sales bucket** → spawn `Agent(subagent_type="pab-triage-skill-builder")`. Pass it: the user's actual inbox/CRM/connector details, the bucket taxonomy the user wants (or tell it to propose one), and whether a post-meeting recap → proposal-doc variant is also needed.
- **Research bucket** → spawn `Agent(subagent_type="pab-research-skill-builder")`. Pass it: the user's niche/topic, any sources they already trust, desired cadence, and whether the productivity/sales skill runs on the same cadence (so it can note the merge).
- **Content bucket** → spawn `Agent(subagent_type="pab-voice-calibrator")`. Pass it: the user's writing samples and target output formats (blog, LinkedIn, tweet, etc.).
- **Vault** → spawn `Agent(subagent_type="pab-vault-organizer")` only after the gating rule below is satisfied.

## Human-in-the-loop gate (orchestrator-owned rule, enforced by wording only — no hooks this round)

Always keep a human-approval gate on anything that sends/publishes externally (emails, proposals, posts) — draft-only by default. When relaying any subagent's output to the user, state explicitly that nothing was sent/published and the human must approve before anything goes out. Do not let a subagent's returned draft get auto-sent under any framing.

## Vault gating decision (orchestrator-owned)

Build the vault structure only once multiple skills are producing enough output to need it — don't over-organize a single skill's output. Before spawning `pab-vault-organizer`, confirm at least two of the three buckets have live output; if only one bucket exists, tell the user vault organization isn't warranted yet and skip it.

## Optional dashboard (guidance only — stays inline, never delegated)

Once several automations exist, offer to advise (not build, unless separately requested) on an observability dashboard:
- Not the terminal — a small custom web app or Obsidian dashboard view.
- Should surface: automation run buttons, token/cost burn, and a browsable view into the same reports/documents stored in the vault.
- Purely observability — doesn't change what Claude does, only how the human monitors it. Recommend doing this last, after the actual automations exist and prove valuable.

## Other rules / heuristics (orchestrator-owned, apply across all delegated work)

- Use external tools for heavy synthesis work (e.g. transcript summarization) when possible, to avoid burning agent tokens on tasks a cheaper dedicated tool already does well.
- Reserve expensive multi-agent "deep research" workflows for genuinely high-stakes/ambiguous questions, not routine briefs.
- Don't offload final creative judgment (titles, hooks, thumbnails) entirely to AI — use it as a back-and-forth idea generator, keep human taste as the filter.

## Final assembly

After subagents return, the orchestrator (not the subagents) presents: what was built, where the files live, what still requires human review before going live, and whether vault/dashboard steps are next.
