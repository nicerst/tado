---
name: personal-assistant-buildout
description: Turn Claude Code into a personal/executive assistant by identifying low-decision drudgery, converting it into skills/automations across productivity-sales, research, and content buckets, then organizing outputs in an Obsidian-style vault. Use when user wants to "automate my workflow", "build a personal assistant with Claude", "set up daily briefs/email triage", or "organize my second brain for Claude".
---

# Personal Assistant Buildout

Systematically offload low-decision, high-frequency grunt work to Claude Code, organized so it compounds instead of sprawling.

## When to use / when NOT to use

Use when someone wants a repeatable personal/business automation system (email triage, daily research briefs, content repurposing) rather than a one-off script.

NOT for: single ad-hoc tasks, creative work requiring taste/voice (only use for the *mechanical* repurposing step, not final creative judgment).

## Procedure

1. **Identify the buckets.** Ask what recurring, low-decision work eats hours weekly. Typically falls into: productivity/sales (inbound comms, proposals), research (staying current on a niche), content (repurposing/packaging). Not everyone has all three — skip what doesn't apply.

2. **Build the productivity/sales skill first** — it gives fastest ROI:
   - Trigger: scheduled (e.g. daily 8am) pull of inbox via connector.
   - Classify each item into fixed buckets (e.g. leads, urgent, warm, sponsors, meetings, noise).
   - Per-bucket action rules: sponsors → boilerplate reply draft; leads → validate against a real intake form (budget/timeline/fit), web-search the sender's company, produce a recommendation (go/no-go), draft reply + scheduling link only if approved by human; urgent → draft reply; everything else → just log.
   - Always end with human-in-the-loop: draft, never auto-send.
   - Output a single markdown summary report to the vault so the human can skim instead of reading every email.
   - Follow-up variant: post-meeting recap (e.g. from a call-recording tool) → generate a structured proposal doc (scope, timeline, pricing, signature block) → save/share link, draft outreach email. Human reviews before send.

3. **Build the research skill**:
   - Identify the 2-3 canonical sources for the niche (e.g. GitHub trending, X/Twitter, YouTube, general web).
   - For each source, define concrete cuts: e.g. GitHub — top-10 trending this week, top-5 trending among repos <30 days old, fastest-growing last 24h/30d. YouTube — trending videos with view/subscriber counts (flag high views relative to low subs as a signal). 
   - Combine with the email-triage skill into one scheduled "morning automation" if both run on the same cadence.
   - On-demand companions: a deep-research workflow (multi-agent adversarial web research for high-stakes questions — expensive, use sparingly) and a "topic dive" pipeline (search sources for a topic → hand transcripts/links to an external synthesis tool to avoid burning tokens on long-form summarization → return synthesis: consensus, disagreements, why it matters).
   - Optional passive layer: a lightweight always-on watcher (e.g. small hosted app) pushing high-signal alerts (e.g. via chat/notification) for real-time spikes, separate from the daily batch brief.

4. **Build the content skill** (only if content creation is part of the workload):
   - Hooks/outlines: brainstorming aid trained on a reference style, not a final-script generator — keep human as final author if that's the person's preference.
   - Titles/packaging: same pattern — skill proposes using proven psychological patterns, human still picks/edits.
   - Repurposing cascade: on schedule or on new-content-detected trigger, fetch transcript → rewrite into each target format (blog, LinkedIn, tweet, etc.) in the user's voice.
   - **Voice-matching is never one-shot.** Build it by iterative rejection:
     a. Give Claude several real writing samples from the person.
     b. Ask it to derive a skill/style guide from them.
     c. Have it generate a new example using that skill.
     d. Human critiques it harshly — specific line-by-line corrections.
     e. Feed corrections back, regenerate the skill, regenerate the example.
     f. Repeat ~10 rounds before trusting it live, and keep correcting during live use.
     Never accept a "self-improving one-shot" claim for voice/style work — it requires sustained human-in-the-loop calibration.

5. **Organize the vault (Karpathy method)** once multiple skills produce output:
   - Top-level vault folder, with subfolders: `raw/` (unstructured dumps — research not yet synthesized), `wiki/` (synthesized reports), `output/` (final deliverables like decks/proposals).
   - Every folder — and every subfolder — gets an `index.md` acting as a table of contents for that folder, so Claude never has to guess where something lives.
   - Rationale: without this, token cost rises and retrieval accuracy degrades as the vault grows — the index is what keeps lookups cheap and correct at scale.

6. **Optional: build an observability dashboard** once several automations exist:
   - Not the terminal — a small custom web app or Obsidian dashboard view.
   - Should surface: automation run buttons, token/cost burn, and a browsable view into the same reports/documents stored in the vault.
   - This step is purely observability — it doesn't change what Claude does, only how the human monitors it. Do this last, after the actual automations exist and prove valuable.

## Rules / heuristics

- Always keep a human-approval gate on anything that sends/publishes externally (emails, proposals, posts) — draft-only by default.
- Prioritize by ROI: build the highest-frequency, most time-consuming bucket first (usually inbox triage).
- Combine same-cadence automations into one scheduled routine rather than running them separately.
- Use external tools for heavy synthesis work (e.g. transcript summarization) when possible, to avoid burning agent tokens on tasks a cheaper dedicated tool already does well.
- Reserve expensive multi-agent "deep research" workflows for genuinely high-stakes/ambiguous questions, not routine briefs.
- Don't offload final creative judgment (titles, hooks, thumbnails) entirely to AI — use it as a back-and-forth idea generator, keep human taste as the filter.
- Build the vault structure only once multiple skills are producing enough output to need it — don't over-organize a single skill's output.

---
Source: (untitled personal-assistant setup video) — transcript provided by user
