---
name: phased-app-build-system
description: Use when going from a raw app idea to a shipped, live product using AI coding agents (Claude Code, Cursor, Codex) — structures the work into ideate → plan (PRD + roadmap) → design (design.md) → build (loop) → launch phases so an agent can build most of the app unattended. Triggers: "help me build and launch this app", "turn this idea into a PRD and roadmap", "build my whole app in one go", "give me a launch checklist".
---

# Phased App Build System

Turn an app idea into a live product by chaining fixed AI-agent phases instead of ad-hoc prompting: ideate → plan → design → build → launch. Jump in at whichever phase you already have inputs for.

**Orchestrated workflow:** spawn `Agent(subagent_type="pabs-idea-validator")` for Phase 1 validation, `Agent(subagent_type="pabs-prd-roadmapper")` for Phase 2, `Agent(subagent_type="pabs-design-doc-writer")` for Phase 3, `Agent(subagent_type="pabs-build-executor")` for the Phase 4 build loop, and `Agent(subagent_type="pabs-launch-checker")` for Phase 5 — instead of running any of those inline. Use inline only for quick interactive/`/slash` use.

This orchestrator owns: phase detection and skip logic ("already have a PRD? skip Phase 2"), user checkpoints between phases, and resume-after-interruption logic (re-read roadmap checkbox state before re-delegating to `pabs-build-executor`). It delegates all five phase work products to the subagents above.

## When to use / when NOT to use

Use for: greenfield apps built primarily by an AI coding agent, where you want a repeatable structure instead of freeform prompting, and want the agent to build large chunks of the app unattended (30 min–4 hr runs).

Do NOT use for: a single small script/feature with no product surface, an app you're building mostly by hand, or mid-build feature work with no PRD/roadmap already in place — for that, use a lighter build-and-verify loop directly (skip straight to phase 4's loop mechanics, delegating directly to `pabs-build-executor` with a single-feature scope).

## Procedure (orchestrator owns phase routing and checkpoints)

**Phase 1 — Ideate (skip if the user already has a validated idea)**
1. Idea generation — inline, interactive: interview the user — what do they know deeply, what problems do they personally hit day-to-day, who else has this problem, what's the smallest MVP that solves it. Output: idea + target customer + MVP scope.
2. Idea validation — delegate. Spawn `pabs-idea-validator` with the idea, target customer, and MVP scope. It returns a go/pivot/no-go verdict with reasoning from market-signal research. Checkpoint with the user on the verdict before proceeding — don't auto-continue on a pivot/no-go.

**Phase 2 — Plan (skip if the user already has a PRD + roadmap)**
3-4. Delegate. Spawn `pabs-prd-roadmapper` with the validated idea/customer/scope (or user-supplied idea directly if Phase 1 was skipped). It writes the AI-friendly PRD (objective, product summary, magic moment, success criteria, technical architecture, tech stack, repo structure) and generates the checkbox roadmap from it, with every task referencing a PRD section. Checkpoint: present the PRD + roadmap to the user before Phase 3.

**Phase 3 — Design (skip if the user already has a design.md)**
5-6. Delegate. Spawn `pabs-design-doc-writer` with the reference image(s). It analyzes them, returns clarifying questions (relay these to the user and get answers), then produces `design.md` at the deliberately rough 70-80% consistency baseline covering brand/style, color, typography, layout/spacing, elevation, shapes, components, do's/don'ts.

**Phase 4 — Build (skip if the app is already built)**
7-9. Delegate. Spawn `pabs-build-executor` with the roadmap and PRD paths. It runs the build loop: per task, build → code review + fix → browser test → tick checkbox → next task, until the roadmap is fully checked off. Expect 30 min–4 hr depending on complexity.
   - **Resume-after-interruption (orchestrator-owned):** if the user returns mid-build or after hitting a usage limit, do not restart from task 1 — re-spawn `pabs-build-executor` with an explicit instruction to re-read the roadmap's checkbox state first and continue from wherever it stopped.
   - For post-MVP feature work or improvements, spawn `pabs-build-executor` again with a single-feature scope instead of the full roadmap: build it → code review → fix issues → test in browser → report back done.

**Phase 5 — Launch**
10. Delegate. Spawn `pabs-launch-checker` with the codebase path. It reviews the codebase and current state, produces a go-live checklist (security review, environment variables setup, production database setup, deployment target), and executes only the items the orchestrator/user has approved. Work through it step-by-step: relay each unresolved question to the user, get an answer, re-invoke for the next batch of approved items.

## Rules / heuristics

- Each phase's skill can be entered independently — if the user already has the artifact a phase produces (idea, PRD+roadmap, design.md, built app), skip straight past that phase without spawning its subagent.
- PRDs and roadmaps written for AI agents look different from human PRDs — strip narrative filler, keep everything structured and referenceable, and link every roadmap task back to a specific PRD section/file (enforced inside `pabs-prd-roadmapper`).
- Don't over-invest in idea validation — it's a smoke test against market signals, not exhaustive research; long validation phases become procrastination.
- The build phase works because it's a loop with a hard stopping criterion (roadmap fully checked off), not a single giant prompt — this is what lets it run unattended for hours and resume cleanly after interruption.
- design.md is deliberately rough (70-80% quality) — it's a consistency baseline to iterate on during build/improve, not a finished spec.
- The build loop's code-review-then-test-in-browser step before ticking a task is what keeps quality acceptable across a long unattended run — don't skip straight from "built" to "next task" (enforced inside `pabs-build-executor`).

## Examples

- Build-loop instruction pattern (passed to `pabs-build-executor`): "Build every task from the product roadmap one at a time and tick them off as you go. After each task, do a code review and fix issues found. Then test in browser to confirm it works. Only then move to the next task."
- Feature-improvement loop pattern (passed to `pabs-build-executor` with single-feature scope): "Build [feature], do a code review and fix any issues, verify with a test in browser, then report back once it's done and working."
- Resuming an interrupted build: re-invoke `pabs-build-executor` with the same build-loop instruction plus "re-read the roadmap's checkbox state first" — it continues from where it left off.

---
Source: BuilderOS walkthrough transcript (YouTube, Chris — channel not specified in transcript)
