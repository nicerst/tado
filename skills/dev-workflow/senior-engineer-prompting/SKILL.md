---
name: senior-engineer-prompting
description: Prompt and delegate to coding agents the way a senior engineer briefs another senior engineer, not the way you'd file a ticket. Covers the two-source information model, how to structure a prompt, matching effort level to problem difficulty, spawning agents optimistically instead of backlogging, and verifying by spot-check/proof instead of re-running a local dev loop. Use when writing a prompt for Claude/Codex/other coding agents, deciding whether to wait or delegate a bug/task now, choosing an effort/thinking level, or deciding how much to manually verify an agent's work.
---

# Senior Engineer Prompting

Treat the agent as a highly capable senior engineer who has amnesia between
tasks and only two sources of information: its training data and whatever is
in the context window right now. Prompt and delegate accordingly.

## When to use / when NOT to use

Use when:
- Writing a non-trivial prompt for a coding agent (feature, port, fix).
- Deciding whether to park a reported bug or spawn an agent on it immediately.
- Choosing an effort/thinking level (low/medium/high/ultra or equivalent).
- Deciding how to verify agent output (manual re-run vs. spot-check).

Don't use for trivial one-line fixes — the overhead of research/design steps
isn't worth it for a typo fix.

## Procedure

1. **Model the agent correctly.** It is a senior engineer who's seen every
   language and OS, but was just given a hood, driven somewhere, and had the
   hood pulled off in front of a desk with only a codebase, a browser, a
   terminal, and an editor. It does not walk around discovering things on its
   own. It will not make syntax/expression mistakes, but it only knows what's
   in the codebase, the internet, and the prompt you hand it.

2. **Front-load information into the prompt, don't file a shorthand ticket.**
   A prompt like "port Puck to the CLI" is a shitty prompt. Instead:
   - Point it at a reference implementation to use as the standard
     ("look at how it's implemented in web UI, that's the standard").
   - State the specific behavior you already have in your head, don't make
     the agent guess it (list the commands/behaviors you want, e.g. "we
     should have a puck open command that shows up in the sidebar").
   - Write it the way you'd message a fellow senior engineer on Slack, not
     the way you'd talk to a non-technical person.

3. **Ask it to research and think before implementing on non-trivial work.**
   Have it read the relevant docs/news posts/code, compile what it learned,
   propose a design, then implement (optionally via sub-agents for the
   cheaper/mechanical part), then present results for review.

4. **Match effort level to problem difficulty, not habit.** Ask "is this a
   gnarly problem, or the little-brother version of it?" and pick
   low/medium/high/ultra (or equivalent model/thinking-level dial)
   accordingly. Don't burn the expensive model/level on routine work, and
   don't under-provision a hard problem out of habit.

5. **Spawn agents optimistically instead of backlogging.** When a bug is
   reported, don't park it until someone has time to look — spawn an agent
   on it right away, let it park its result, and review the fix later async.
   You don't need to pre-estimate whether it's worth doing if the work
   happens in the background anyway.

6. **Verify by spot-check and proof, not by re-running everything locally.**
   The agent already runs tests in its own isolated sandbox — don't push to
   a separate CI system just to re-run the same tests. Ask it for a
   screenshot, a URL, or an end-to-end test summary as proof, do a spot
   check against the design/architecture choices you actually care about,
   and skip re-deriving the whole diff locally.

## Rules / heuristics

- Two information sources only: training data + context window. If the
  prompt, the codebase, or the agent's instructions file doesn't contain a
  fact, the agent doesn't have it — it can't discover it by exploring.
- Don't micromanage a single agent turn-by-turn ("don't touch this file").
  That close-supervision style has diminishing returns once the model is
  good enough; trust it more than that.
- If you catch yourself fussing over style nits (camelCase, etc.) instead of
  reviewing architecture/design choices, you're supervising at the wrong
  altitude — step back.
- One separate agent/session per independent change avoids two threads
  clobbering the same uncommitted state.
- Isolated/sandboxed execution per task is what makes optimistic spawning
  and background parking safe — without isolation, don't skip review gates.

## Examples

Prompt structure example (paraphrased from source):
> Look at how [feature] is implemented in [reference surface] — that's the
> standard. I want to port this to [target surface]. I think we should have
> [specific command/behavior], and [specific command/behavior] ... Research
> how it's implemented and how we communicate, document what you learn, come
> up with a design for the port, use sub-agents for implementation, then
> present me the results.

Effort-level example: routine task → default/medium effort; reviewer/design
pass on a hard problem → route to the highest-effort model as a sub-agent
reviewer, not as the default for everything.

---
Source: David Ondrej podcast interview with Torsten Ball (founding engineer, AMP / Sourcegraph, author of the Go books)
