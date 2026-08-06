---
name: prompt-cache-cost-management
description: >
  Manage Claude Code token cost by understanding prompt-cache pricing and picking the right recovery
  action (/clear, /compact, or a disk handoff doc) before sending a message into a stale or reset
  cache. Cache reads are far cheaper than cache writes/misses — losing the cache silently multiplies
  the cost of your next message. Trigger: "why is claude code so expensive", "should I clear or
  compact this conversation", "reduce my claude code token cost", "manage prompt cache".
---

# Prompt-Cache-Aware Session Management

Don't let a stale or reset prompt cache silently multiply your next message's cost — know the mechanics, then choose the right recovery action.

## When to use / when NOT to use

Use before sending a follow-up message into a long or idle Claude Code conversation, or right after anything that resets the cache (see below). Also use when deciding how to think about Claude Code cost in general.

Not needed for short, active back-and-forth sessions where the cache is still warm — there's nothing to decide yet.

## Procedure

1. **Understand the two prompt-cache rates before anything else.** Every follow-up message re-sends the entire prior conversation as input, but at a cached rate instead of full price — as long as the cache is still warm. A **cache write** (first time a turn gets cached) costs roughly double the base input rate. A **cache read** (reusing an already-cached turn on a later message) costs roughly 1/20th of the cache-write rate — a ~20x difference between a warm cache and a cold/reset one. Output tokens are priced separately and don't benefit from caching either way.
2. **Know what resets the cache** (any of these forces the next message back to full/cache-write pricing for the entire prior history):
   - 1 hour of inactivity (this is a rolling window — every message resets the clock, it isn't "1 hour from session start").
   - Switching the model.
   - Changing effort level.
   - Toggling fast mode.
   - Connecting or disconnecting an MCP server.
   - A plugin denying a tool call.
   - Compacting the conversation.
   - Upgrading Claude Code itself.
3. **Before sending a message into a conversation that's idle, huge, or about to hit a reset trigger, decide explicitly instead of just typing.** Don't default to "just send it" — a reset cache means the next message pays full price for the *entire* prior history, not just the new text.
4. **Pick the recovery action based on where the state actually lives:**
   - If the codebase/project files already capture what happened → `/clear`. Start fresh; Claude Code re-derives context from the repo itself.
   - If there's important context not captured in the files, but a chat-only summary is enough → `/compact`. Native summary, injected into the new conversation's message history, no file created.
   - If you want a persistent, editable, disk-based summary a future session can be pointed at directly → write a handoff document (a markdown file with the summary) instead of relying on `/compact`.
5. **Don't wait for auto-compact or the token ceiling.** Context rot sets in well before 600-800k tokens on even the largest-context models — proactively `/compact` or `/clear` rather than letting a session run that long by default.

## Rules / heuristics

- The cache-write vs cache-read gap (~20x) dominates every other Claude Code cost-saving trick combined — output-token tricks like a terse `CLAUDE.md` instruction ("be brief") only affect output tokens, which are a smaller piece of total cost than a repeatedly-reset cache.
- A reset cache isn't obvious from the UI in the moment — treat any of the trigger events in step 2, or a gap longer than an hour, as a signal to check before sending, not after seeing the bill.
- Rates above are illustrative of the *shape* of the pricing (cache read « cache write « no-cache), not a permanent number — check current Anthropic pricing docs for exact figures.

---
Source: "5 tips to manage Claude Code tokens" — creator not named in transcript
