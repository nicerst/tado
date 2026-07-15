---
name: phased-app-build-system
description: Use when going from a raw app idea to a shipped, live product using AI coding agents (Claude Code, Cursor, Codex) — structures the work into ideate → plan (PRD + roadmap) → design (design.md) → build (loop) → launch phases so an agent can build most of the app unattended. Triggers: "help me build and launch this app", "turn this idea into a PRD and roadmap", "build my whole app in one go", "give me a launch checklist".
---

# Phased App Build System

Turn an app idea into a live product by chaining fixed AI-agent phases instead of ad-hoc prompting: ideate → plan → design → build → launch. Jump in at whichever phase you already have inputs for.

## When to use / when NOT to use

Use for: greenfield apps built primarily by an AI coding agent, where you want a repeatable structure instead of freeform prompting, and want the agent to build large chunks of the app unattended (30 min–4 hr runs).

Do NOT use for: a single small script/feature with no product surface, an app you're building mostly by hand, or mid-build feature work with no PRD/roadmap already in place — for that, use a lighter build-and-verify loop directly (skip straight to phase 4's loop mechanics).

## Procedure

**Phase 1 — Ideate (skip if you already have a validated idea)**
1. Idea generation: interview yourself — what do you know deeply, what problems do you personally hit day-to-day, who else has this problem, what's the smallest MVP that solves it. Output: idea + target customer + MVP scope.
2. Idea validation: take that idea and research it against market signals — search Reddit communities, blogs, forums for evidence the problem is painful and the customer is real. Don't over-invest here; this is a smoke test, not a moat. Output: go/pivot/no-go verdict with reasoning.

**Phase 2 — Plan (skip if you already have a PRD + roadmap)**
3. Generate a PRD (product requirements document) in AI-friendly form — not human-readable prose, but structured for a coding agent: objective, product summary, the "magic moment" (the point a user realizes the value / would pay), success criteria, technical architecture, proven tech stack choice, repository structure.
4. Generate a product roadmap from that PRD: phases (Phase 0, 1, 2...), each broken into checkbox tasks, each task referencing specific files/sections in the PRD. This roadmap is what you hand to the coding agent to execute end-to-end.

**Phase 3 — Design (skip if you already have a design.md)**
5. Build a rough design system, not a deep one — just enough for 70-80% visual consistency you can refine later. Give the agent an image reference (e.g. a Dribbble shot you like) or a set of them.
6. Have the agent analyze the reference(s), ask you clarifying questions, then output `design.md` (the open design-system-documentation format) covering: brand/style direction, color, typography, layout/spacing, elevation/depth, shapes, components, do's and don'ts.

**Phase 4 — Build (skip if the app is already built)**
7. Run a build loop, not a single prompt. Instruct the agent: "Go through the product roadmap one task at a time. For each task: build it → code review it and fix issues found → test it in-browser → tick the checkbox → move to the next task. Repeat until the roadmap is fully checked off."
8. Expect 30 min–4 hr depending on complexity. If interrupted or you hit a usage limit, resume later with the same instruction — the agent re-reads the roadmap's checkbox state and continues from wherever it stopped.
9. For post-MVP feature work or improvements, reuse the same loop shape on a single feature: build it → code review → fix issues → test in browser → report back done. Don't hand-hold each step.

**Phase 5 — Launch**
10. Run a launch-checklist pass: have the agent review the current codebase and current state, then produce a step-by-step checklist to get the app live — security review, environment variables setup, production database setup, deployment target (URL host or app store). Work through it step-by-step, asking the agent to execute each task and answering its questions as you go.

## Rules / heuristics

- Each phase's skill can be entered independently — if you already have the artifact a phase produces (idea, PRD+roadmap, design.md, built app), skip straight past that phase.
- PRDs and roadmaps written for AI agents look different from human PRDs — strip narrative filler, keep everything structured and referenceable, and link every roadmap task back to a specific PRD section/file.
- Don't over-invest in idea validation — it's a smoke test against market signals, not exhaustive research; long validation phases become procrastination.
- The build phase works because it's a loop with a hard stopping criterion (roadmap fully checked off), not a single giant prompt — this is what lets it run unattended for hours and resume cleanly after interruption.
- design.md is deliberately rough (70-80% quality) — it's a consistency baseline to iterate on during build/improve, not a finished spec.
- The build loop's code-review-then-test-in-browser step before ticking a task is what keeps quality acceptable across a long unattended run — don't skip straight from "built" to "next task."

## Examples

- Build-loop instruction pattern: "Build every task from the product roadmap one at a time and tick them off as you go. After each task, do a code review and fix issues found. Then test in browser to confirm it works. Only then move to the next task."
- Feature-improvement loop pattern: "Build [feature], do a code review and fix any issues, verify with a test in browser, then report back once it's done and working."
- Resuming an interrupted build: re-invoke the same build-loop instruction — the agent reads the roadmap's checkbox state to know where it left off.

---
Source: BuilderOS walkthrough transcript (YouTube, Chris — channel not specified in transcript)
