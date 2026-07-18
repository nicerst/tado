---
name: craft-prompt
description: Use when the user wants to write a well-structured prompt for ChatGPT, Claude, Gemini, or a coding agent, is choosing between prompt-engineering frameworks (RISEN, CRISPE, RACE, RTF, CLEAR, ROSES, SCOPE, etc.), or asks "how should I prompt this" / "make this prompt better" / "/craft-prompt". Single unified framework synthesized from 12 popular frameworks — 5 core slots plus 2 optional technique flags, scales from one-line requests to complex agentic tasks.
---

# CRAFT

Synthesis of 12 prompt-engineering frameworks (RISEN, CRISPE, RACE, RTF, TCRI, APE,
ROSES, CLEAR, CoT, Few-Shot, STAR, SCOPE) down to what they actually force a user to
specify. Most of the 12 duplicate each other under different names — Role ≈ Persona ≈
Capacity, Context ≈ Scenario ≈ Insight, Constraints ≈ Narrowing ≈ Expectation. CRAFT
keeps the non-redundant slots and drops the rest.

> Built via [[the-council]] deliberation. Verdict: 5 slots (2 mandatory, 3 conditional)
> + 2 technique flags beats both a flat 12-framework merge and a rigid fixed template —
> one framework that scales itself, not a family of frameworks to choose between.

## The 5 slots

| Letter | Slot | Mandatory? | What it answers |
|---|---|---|---|
| **C** | Context | Conditional | Background the model doesn't already have — situation, prior attempts, constraints of the world it's operating in |
| **R** | Role | Conditional | Persona/expertise the model should answer as — skip for simple factual asks |
| **A** | Ask | **Always** | The actual task, as a direct instruction, not a question |
| **F** | Format | **Always** | Structure of the output — length, shape, medium, what "done" looks like |
| **T** | Thresholds | Conditional | Constraints, success criteria, what to avoid — the boundary of acceptable output |

**Rule:** Ask + Format are never optional — a prompt without them is a request without
a deliverable. Add Context, Role, Thresholds only when their absence would make the
output wrong, not just less polished. A one-line factual question needs none of them.

## The 2 technique flags

Not slots — append these to the Ask when the task calls for it, they don't need their
own paragraph:

- **+Think** — chain-of-thought. Append "think step by step" / "show your reasoning" for logic, math, multi-step, or ambiguous-tradeoff tasks.
- **+Examples** — few-shot. Give 2-3 input→output pairs before the real request when output *format* is hard to describe but easy to demonstrate.

## Worked examples

**General use (quick, mostly mandatory-only):**
> Ask: Summarize this article. Format: 3 bullet points, under 40 words total.

**General use (complex, full slots):**
> Role: career counsellor. Context: I have 2 years in marketing, want to move into data analysis, 2 hrs/day available. Ask: build a 30-day learning plan — assess my skills, find gaps, then a daily schedule. Format: week-by-week table. Thresholds: free resources only.

**Coding/agentic task:**
> Context: this repo uses Express + Postgres, see `src/db/` for existing query patterns. Ask: add a rate-limiter middleware to the `/api/*` routes. Format: one new file + one-line wiring diff, no new dependencies. Thresholds: must not break existing tests, in-memory store is fine for now. +Think for the concurrency edge case.

**Business/content:**
> Role: brand copywriter, confident but not salesy tone. Context: B2B SaaS, audience is engineering managers. Ask: write a launch email for a new integrations feature. Format: under 150 words, one CTA. +Examples: [2 prior launch emails pasted here] to match voice.

## When to reach past CRAFT

CRAFT covers single-turn prompt construction. It does not replace:
- **[[the-council]]** — for deciding *what* to build/do, not how to phrase asking for it.
- **[[storm-research]]** — for research requiring multiple independent perspectives and evidence verification, not prompt phrasing.
- Multi-turn agent orchestration, tool-use loops, or system-prompt design for a persistent agent — CRAFT is for one prompt, not an agent's entire operating instructions.
