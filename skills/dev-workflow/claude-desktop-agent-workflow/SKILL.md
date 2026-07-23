---
name: claude-desktop-agent-workflow
description: Turn Claude Desktop's code workspace into a repeatable agent — a persistent CLAUDE.md for context, a written workflow file per task type, and a mandatory plan-approval gate before execution. Use when setting up a new Claude Desktop project for recurring tasks (research reports, content repurposing, any multi-step deliverable), when output quality is inconsistent session to session, or when the user says "turn this into a workflow I can reuse" / "build an agent for this in Claude Desktop, no code."
---

# Claude Desktop Agent Workflow

No-code pattern for making Claude Desktop's code workspace behave like a repeatable agent instead of a one-off chat: persistent context (CLAUDE.md) + a written procedure (workflow file) + a hard gate (plan approval) before any multi-step task executes.

## When to use / when NOT to use

Use when the user runs the same *kind* of multi-step task repeatedly (research report, script repurposing, document drafting) and wants consistent quality without re-explaining preferences each session.

Do NOT use for a single one-off question or a task with no repeatable shape — that's plain chat, not a workflow worth encoding.

## Procedure

1. **Create the project folder.** One folder per workspace; it holds every file the agent creates or references.
2. **Write CLAUDE.md first, before anything else gets built.** It must cover:
   - *Project context* — 2-3 sentences on what this workspace is for and who consumes the output.
   - *About me* — who the user is, their audience, preferred tone (e.g. "concise, direct, not corporate/academic").
   - *Rules* — encode standing preferences so they apply every session without re-stating them: require clarifying questions before complex tasks, require a written plan before execution, respect length limits, file-naming conventions (lowercase-hyphenated), etc.
   - *Folder structure* — e.g. `workflows/` for procedure files, `output/` for finished work, `resources/` for reference material.
3. **Design the workflow before running the task.** Don't hand the agent a topic straight away — first describe the *system*: what questions it should always ask, what phases the task breaks into, what the output format is. Ask Claude to propose the workflow structure, review it, then have it write the actual `workflows/<name>.md` procedure file.
4. **Run the workflow on a real input in a new session.** The agent should, in order: ask clarifying questions (scope, audience, depth, tone, length) → answer them specifically, never "just make it good" → produce a written plan → **wait for explicit approval** → only then execute phase by phase (research/draft → synthesize → format → save to `output/`).
5. **Verify output against the approved plan before calling it done.** Approval of a plan is not proof the output matches it — check the delivered file against the plan's stated scope/sections/format, not just that a file appeared in `output/`.
6. **Iterate in place, not from scratch.** Because the workspace is persistent, refinements reference the existing file directly ("trim the executive summary to 3 points", "add a comparison section at the end") instead of restarting the whole task.
7. **Expand one workflow at a time.** Progression: simple single-shot tasks (clear input → clear output, e.g. a research report) → iterative multi-round tasks (draft + refine, e.g. script editing) → chained multi-workflow pipelines (one workflow's output feeds the next, e.g. research report → content-ideas generator). Don't build multiple new workflows in the same week — get one reliable first.
8. **Revise a stale workflow file, don't just keep re-running it.** If the same `workflows/<name>.md` produces off-target output twice in a row, edit the procedure file itself (missing question, wrong phase order, wrong output format) — the failure is in the SOP, not the input.

## Rules / heuristics

- **CLAUDE.md before any workflow file.** Skipping it is the #1 failure mode: no persistent context means every session restarts from zero and quality is inconsistent.
- **Vague goal → generic output.** A goal must specify audience, focus, format, and constraints, not just a topic — specificity of the goal determines quality of a multi-step run more than in single-shot chat, because the agent compounds it across every phase.
- **Never let the agent execute a multi-step task without a reviewed plan.** Anecdotal ratio, but directionally real: a couple minutes reviewing a plan is cheaper than cleaning up a half-finished, wrongly-assumed multi-stage output. Encode this as a standing CLAUDE.md rule ("always present a written plan and wait for approval before beginning any multi-step task") so it applies by default, not by remembering to ask each time.
- **A plan gate only works if the review is real.** Skimming and approving isn't the gate — check the plan actually names the right audience, scope, sections, and format before saying yes. A rubber-stamped plan gate gives none of the benefit.
- **Workflow file must force clarifying questions.** If it doesn't explicitly say to ask before starting, the agent will assume — and assumptions (wrong audience/format/scope/tone) are the source of most mediocre output.
- **The workflow file is the leverage point, not the tool access.** A well-designed procedure using only built-in file read/write/organize capabilities outperforms a sloppy procedure with sophisticated integrations. Don't reach for external tools/APIs before the plain-language procedure is solid.
- **One workflow at a time.** Building several new workflows simultaneously produces several half-trusted, unused systems instead of one reliable one.
- **Keep CLAUDE.md and workflow files short.** They compete with the live conversation for context budget on every turn — a bloated file gets skimmed or deprioritized same as a bloated prompt. Trim to what changes agent behavior, not a full style guide.
- **"No-code" means no scripting, not no effort.** Writing a CLAUDE.md and workflow file that actually constrains output well is still a prompt-engineering skill — expect to iterate on the wording, not just fill in a template once.

## Examples

Research workflow prompt that produces a reusable `workflows/research-agent.md`:
> "I want to design a research workflow. When I give you a topic, first ask clarifying questions about scope, audience, and desired depth. Then form a written plan. Once I approve the plan, research the topic thoroughly, organize findings into clear sections, and save a structured report to the output folder. Before we build this, show me your plan for the workflow itself."

Repurposing workflow spec (script → shorts + social pack):
> Role: content repurposing specialist. Input: one long-form script in `input/`. Steps: read the script → identify 3 standalone moments that work as 60-second shorts, each with its own hook and payoff → draft platform-specific social posts (X thread, LinkedIn post, IG caption) matching the source voice. Output: 4 files, saved to `output/`.

---
Source: YouTube video on building no-code Claude agent workflows (channel/title not given in transcript)
