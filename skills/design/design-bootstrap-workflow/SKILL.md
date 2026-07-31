---
name: design-bootstrap-workflow
description: Use when bootstrapping a single page, landing page, feature UI, or redesign direction from taste references into multiple design variants, refinements, manual asset prompts, tweak controls, and an anti-slop review. Triggers on "/design-bootstrap".
trigger: /design-bootstrap
---

# /design-bootstrap

Single-feature/page design bootstrap. Like project-init, but for taste-directed UI work.

Goal: stop one-shot AI slop by forcing reference intake, wide exploration, human taste gates, visual iteration, and review before production handoff.

Default posture:
- Create files when a frontend repo exists.
- Otherwise write `design-lab/DESIGN_BOOTSTRAP.md`.
- No MCP.
- No external asset generation by default.
- Manual assets only: write prompts/specs, wait for user-provided files.

## Triggers

- `/design-bootstrap`
- `/design-bootstrap agent-decide`
- `/design-bootstrap plan-only`
- `/design-bootstrap production-gate`

## Entry Guard

State:
- target page/feature
- intended audience
- conversion or user goal
- existing route/component, if any
- references provided: screenshots, URLs, 21st.dev components, brand assets

If target is unclear, ask one question:
> What exact page or feature UI are we bootstrapping?

If user gives no references, continue, but create `design-lab/references/needed.md` and ask them to add references before the refinement phase.

## Step 0 - Detect Project And Tools

Detect frontend:

```bash
git rev-parse --git-dir
test -f package.json && cat package.json
```

Frontend signals:
- Next, React, Vue, Astro, Svelte, Solid
- existing `src/`, `app/`, `pages/`, `components/`, `styles/`

Detect optional tools, but do not install without approval:

```bash
npx impeccable --help
npx skills list
```

Look for:
- Impeccable: https://github.com/pbakaus/impeccable
- Taste Skill: https://github.com/leonxlnx/taste-skill

If missing, ask before install:

```bash
npx impeccable skills install
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

If user declines, continue with this skill's built-in anti-slop audit.

## Step 1 - Create Design Lab

Create:

```text
design-lab/
  DESIGN_BOOTSTRAP.md
  references/
    screenshots/
    urls.md
    taxonomy.md
    briefs.md
  variants/
    v1/
    v2/
    v3/
    v4/
    v5/
  refinements/
    r1/
    r2/
    r3/
  selected/
  assets-needed.md
  tweak-log.md
  REVIEW.md
```

If no frontend exists, write only the Markdown files and stop before generating implementation files.

## Step 2 - Taste Intake

Read references. Produce `design-lab/references/taxonomy.md`.

For each reference, capture:
- source path or URL
- aesthetic family
- layout traits
- typography traits
- color/material traits
- motion/interaction traits
- what to borrow
- what not to copy

Use 21st.dev as reference only by default:
- buttons
- cards
- pricing
- navigation
- forms
- pagination

Do not let 21st.dev define the whole design direction.

## Step 3 - Senior Engineer Brief

Write `design-lab/DESIGN_BOOTSTRAP.md` with a complete agent brief.

Required sections:

```markdown
# Design Bootstrap

## Target
<page/feature>

## Intent
<what user should do or feel>

## Audience
<who it is for>

## References
<screenshots/URLs and what to borrow>

## Guardrails
- no generic SaaS template
- no purple/blue gradient default
- no Inter-only monoculture unless project already uses it
- no 3D blob filler
- no decorative glassmorphism by default
- no fake dashboards/charts unless product needs them

## Variant Requirements
5 first-pass aesthetic families, then 3 refinements of selected family.

## Asset Policy
Manual assets only. Write prompts and placement specs; wait for user-provided files.

## Human Gates
Stop after variant batch, refinement batch, and asset prompt batch unless `/design-bootstrap agent-decide` was used.
```

Brief agents like senior engineers:
- point at existing routes/components as the standard
- state exact behaviors and page goals
- name what must stay untouched
- ask for proof: screenshots, local URL, or generated HTML preview

## Step 4 - First-Pass Variant Loop

Loop design:

```text
Trigger: manual kickoff
Discovery: design-lab references + target page
Generator: creates 5 variant directions
Evaluator: user, or agent if `agent-decide`
Persistence: design-lab/DESIGN_BOOTSTRAP.md + variant folders
Hard cap: exactly 5 first-pass variants
```

Create 5 distinct aesthetic families. Each variant must include:
- name
- one-sentence direction
- layout sketch or implemented preview
- typography plan
- color/material plan
- hero strategy
- body section strategy
- motion/interaction notes
- why it avoids AI slop

If frontend exists, create preview files under:

```text
design-lab/variants/v1/
...
design-lab/variants/v5/
```

Stop and ask:
> Pick one variant, or say "agent decide".

If user already used `agent-decide`, pick the strongest variant and record why.

## Step 5 - Refinement Loop

From the selected first-pass variant, create exactly 3 refinements:

```text
design-lab/refinements/r1/
design-lab/refinements/r2/
design-lab/refinements/r3/
```

Each refinement changes meaningful structure, not just colors:
- body layout
- section rhythm
- navigation/index pattern
- content density
- motion weight
- component treatment

Stop and ask:
> Pick one refinement, or say "agent decide".

If `agent-decide`, pick and record the reason.

## Step 6 - Manual Asset Prompt Batch

No MCP. No paid/cloud generator assumption.

Write `design-lab/assets-needed.md`:

```markdown
# Assets Needed

## Hero Image
prompt:
placement:
aspect ratio:
resolution:
negative prompts:
fallback if asset is missing:

## Supporting Assets
...
```

If user wants ComfyUI manually, include ComfyUI-oriented settings in prose, but do not call ComfyUI or configure MCP.

Stop and ask user to provide assets, unless `agent-decide` and placeholder assets are acceptable.

## Step 7 - Tweak Bar

Required when frontend exists.

Add a design-lab-only tweak control surface. It must not ship to production.

Controls should cover:
- heading font
- body font
- heading scale
- body density
- accent color
- contrast
- hero crop/position
- section spacing
- card/border treatment
- motion weight
- reveal distance

Persist selections to:

```text
design-lab/tweak-log.md
```

If no frontend exists, document these options in `DESIGN_BOOTSTRAP.md` instead.

## Step 8 - Anti-Slop Pass

Use installed tools if available:

```text
/impeccable audit
/impeccable polish
design-taste-frontend
```

If tools are not installed or user declined install, run built-in checks:
- generic SaaS layout
- overused purple/blue gradients
- Inter monoculture
- fake 3D blobs
- empty cards
- mismatched section rhythm
- weak visual hierarchy
- text overflow
- low contrast
- mobile breakage
- motion without purpose
- decorative assets that do not support intent

Write `design-lab/REVIEW.md`:

```markdown
# Design Review

## Pass/Fail
<pass|needs work>

## Issues
- severity
- location
- evidence
- fix

## What Changed
<summary>

## Remaining Taste Decisions
<what only the human can decide>
```

## Step 9 - Production Handoff

Do not modify production UI unless user explicitly asks.

When user asks to apply selected design:
1. Copy selected direction into production files.
2. Keep the tweak bar out of production.
3. Run app checks.
4. Provide proof: screenshot, local URL, or static preview.

For production-facing code, recommend `no-mistakes-review-pipeline` before merge.

Use `ralph` only if the design becomes a multi-story unattended implementation with `prd.json` acceptance criteria. Do not invoke it for normal design exploration.

## Quality Gate

Before declaring complete:

- `design-lab/DESIGN_BOOTSTRAP.md` exists
- 5 first-pass variants exist or are documented
- selected variant recorded
- 3 refinements exist or are documented
- selected refinement recorded
- `assets-needed.md` exists
- tweak bar exists if frontend exists
- `REVIEW.md` exists
- no production files changed unless user asked

If frontend exists, also run project checks where available:

```bash
npm run lint
npm run build
npm test
```

Do not claim the design is "premium" without evidence from screenshots/previews and an anti-slop pass.

## Final Report

```text
DESIGN-BOOTSTRAP COMPLETE
Target: <page/feature>
Mode: frontend files | design brief only
First-pass variants: 5
Selected variant: <name>
Refinements: 3
Selected refinement: <name>
Assets: manual prompts written | assets provided
Tweak bar: yes | documented only
Anti-slop review: pass | needs work
Production touched: yes | no
Next: apply selected design | run production review | add assets
```

## Rules

- Never one-shot a final design.
- Never skip the 5 then 3 exploration loop.
- Never let the generator approve its own production-ready output.
- Never use MCP for assets in this workflow.
- Never install Impeccable or Taste Skill without user approval.
- Never treat 21st.dev as the whole design direction.
- Never touch production UI before user picks a direction.
- Never ship the tweak bar.
- If user says "agent decide", the agent may choose at gates and must record why.
- Keep the workflow page-scoped. Use project-init for project harness, not this skill.

