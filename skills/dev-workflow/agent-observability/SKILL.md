---
name: agent-observability
description: Instrumentation and eval checklist for AI-agent systems — LLM call tracing, cost/token tracking, decision tracing, guardrails, human-in-the-loop gates, multi-agent coordination, prompt versioning, RAG/memory instrumentation, session tracking, and production eval strategy. Use when building or auditing an agent/LLM pipeline that needs to be debuggable and measurable in production, not just working in a demo. For Claude-target installs, pairs with the full `agent-observability` plugin (commands + subagents); this skill carries the same checklist to Codex/agents/Cursor targets that have no plugin system.
---

# Agent Observability

Checklist-driven instrumentation guide for agent/LLM systems. Ported from the `agent-observability` Claude Code plugin (nexus-labs-automation) so the same checklist is available on every tado target, not just Claude.

## When to use

Building or reviewing any system that calls an LLM in a loop, chains multiple agent calls, or runs tools autonomously. Skip for a single one-shot prompt call with no retry/chain logic — instrumentation overhead isn't worth it there.

## Checklist

Work through whichever sections apply to the system being built or audited:

1. **LLM call tracing** — every model call logged with prompt, response, model, latency, token counts. No black-box calls.
2. **Token / cost tracking** — per-call and per-session cost attribution. Know which feature/user is expensive before the bill tells you.
3. **Decision tracing** — for any branch/tool-choice the agent makes, log *why* (which condition fired), not just *what* it chose.
4. **Tool-call tracking** — every tool invocation logged with args and result, separate from the LLM call that requested it.
5. **Error / retry tracking** — retries, backoff, and terminal failures logged distinctly from successful calls; don't let a retried success look identical to a first-try success in the metrics.
6. **Guardrails / safety** — input/output filtering checkpoints are themselves instrumented (what was blocked, why), not just silently enforced.
7. **Human-in-the-loop** — approval/escalation points logged with who approved, when, and what they saw.
8. **Multi-agent coordination** — handoffs between agents/subagents logged with the context passed at each boundary.
9. **Prompt versioning** — prompts are versioned artifacts; know which prompt version produced which output.
10. **Memory / RAG instrumentation** — retrieval calls logged with query, retrieved chunks, and relevance scores, so bad retrieval is diagnosable separately from bad generation.
11. **Session / conversation tracking** — multi-turn state changes logged, not just final output.
12. **Evaluation quality** — eval runs distinguish "did it run" from "was it correct"; log both.
13. **Production eval strategy** — a live sampling/eval plan exists for after launch, not just a pre-launch test suite.

## Output

For an audit: report each section as Instrumented / Partial / Missing, with the concrete gap named per Missing item — not a generic "needs more logging."

For new build work: instrument as you build each piece, not as a retrofit pass at the end — retrofitted tracing misses the decision points that already got hardcoded past.

## Relationship to other skills

Distinct from [[no-mistakes-review-pipeline]] (code-change review gate) and [[loop-engineering]] (loop architecture/failure-mode audit) — this is runtime instrumentation of an agent system already in production or headed there, not pre-merge review or loop design.

---
Source: `agent-observability` plugin, nexus-labs-automation (installed at `~/.claude/skills/agent-observability` for Claude — that copy carries the full commands/subagents; this file is the portable checklist core).
