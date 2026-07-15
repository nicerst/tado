---
name: reference-to-design-system
description: Use when turning an image reference, Figma file, or website URL into a paired design.md + design.html design system for an AI coding agent to follow — and keeping that system in sync as the agent builds. Triggers: "turn this screenshot into a design system", "build a design.md from this reference", "make sure Claude Code follows my design system".
---

# Reference-to-Design-System

Turn a single visual reference into a canonical `design.md` + visual `design.html`, then wire CLAUDE.md rules so the coding agent follows it and keeps both files in sync.

## When to use / when NOT to use

Use for: starting a new product's visual identity before building it, translating a reference you like (Dribbble shot, Figma file, live site) into a system the coding agent can follow consistently.

Do NOT use for: auditing an already-built codebase's existing styles (that's a codebase-scan audit, different job) — this is for generating a NEW system from an external visual reference, ideally before the app is built. Do it before building, not after — changing an established app-wide style later means far more rework than starting with the system in place.

## Procedure

1. Pick ONE visual reference: an image, a Figma file, or a website URL. Prefer a reference that's clear about layout/menu/type — don't pick an ambiguous or busy one.
2. Feed the reference to the agent along with a request to build the design system from it (e.g. "use the design system skill with this image reference").
3. Answer the agent's clarifying questions decisively. Expect it to ask about:
   - Light/dark/both mode.
   - Color approach: pure monochrome (one neutral accent), monochrome + one bold signal color, or monochrome + a restrained accent.
   - Typeface direction — it may offer 2-3 paired options (e.g. grotesque + mono, or serif + mono). If unsure which fits, pull up each candidate font at target size/weight before deciding — a font that reads well as body copy may not work as a large display face, and vice versa.
   - Anti-patterns the design must never drift into (your explicit "don't" list — e.g. "no generic SaaS softness," "no decorative color," "no shadows unless sparing").
4. Let it generate two paired files:
   - `design.md` — canonical, Google's open-source design-system-documentation format: brand/style direction, color, typography, layout/spacing, elevation/depth, shapes, components (with states), do's and don'ts.
   - `design.html` — a visual, browsable rendering of everything in design.md (components, hover states, type scale, palette) so you can eyeball it and make manual tweaks.
5. Add a "design system" rule block to CLAUDE.md (see template below) so the coding agent: reads design.md before any front-end work, reuses documented tokens/components instead of inventing new ones or hardcoding values, and treats design.md as canonical if the two files ever disagree.
6. Whenever the agent (or you) changes one of the two files, update the other in the same commit — never let them drift apart. After any edit, verify they still describe the same system.

## Rules / heuristics

- Do this BEFORE building the product, not after — a locked-in early design system means later work is small tweaks, not a full re-skin.
- design.md is canonical; design.html is a mirror. On disagreement, trust design.md and bring design.html back in line — never the reverse.
- Decide color restraint deliberately: pure monochrome keeps the system invisible/neutral (good when users will layer their own branding on top); a signal color adds brand personality but reduces neutrality.
- Preview candidate fonts at actual target size/weight before locking a typeface decision — don't decide from the font name or a small sample alone.
- Bake your anti-pattern list into design.md explicitly as enforceable don't-rules, not just an implied style.
- Pair this with a strong general CLAUDE.md (rules for reducing agent errors/bugs) — the design-system rule block is an addition to that file, not a replacement.

## Examples

Design-system-generation prompt: "Can you use the design system skill inside this project with this image reference?" (image attached).

CLAUDE.md rule block to add:
```
## Design System

The design system is defined by two paired files that live in the codebase: design.md and design.html.
design.md is canonical and design.html mirrors it. If the two ever disagree, treat design.md as
correct but bring design.html back in line.

- Follow design.md for any front-end work. Before writing or changing any UI, read the file.
- Reuse documented tokens, components, and patterns instead of inventing new ones or hard-coding
  values that already exist.
- Review front-end changes against design.md and propose new patterns if genuinely needed.
- Keep design.md and design.html consistent — both must always describe the same design system.
  Whenever you change one, update the other in the same commit so they never drift.
- After editing, verify the two files still match.
```

Anti-pattern don't-list example (monochrome editorial style): no generic SaaS softness, no using color to decorate, no unnecessary decorative shadows/depth (sparing use only), avoid all-caps everywhere if it reads too aggressive — soften to lowercase where appropriate.

---
Source: BuilderOS Fable 5 design-system walkthrough transcript (YouTube, Chris — channel not specified in transcript)
