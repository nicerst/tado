---
name: git-worktree-isolation
description: >
  When running more than a few agents in parallel on the same repo, isolate each in its own git
  worktree instead of one shared checkout, so they stop fighting over the same files. Covers where
  to place worktrees, what to copy over, and lifecycle tracking. Trigger: "run these agents in
  parallel on the same repo", "set up a git worktree for this agent", "isolate this agent's work",
  "multiple agents editing the same repo".
---

# Git Worktree Isolation

Isolate parallel agents on the same repo with git worktrees instead of a shared checkout.

## When to use / when NOT to use

Use once more than roughly 5 agents are working the same repository at the same time — below that threshold, a shared checkout is often fine, and worktree overhead isn't worth it yet.

Not needed for a single agent, or for a handful of agents making small, non-overlapping edits where file conflicts aren't actually happening.

## Procedure

1. Once the parallel-agent count on one repo passes the threshold where file conflicts start happening, stop running them all in the same checkout.
2. For each agent that needs isolation, create a git worktree — a separate copy of the repo, in its own directory, on its own branch — so its changes can't collide with any other agent's.
3. Place worktrees at the root level of the filesystem (or a dedicated worktrees directory), organized by repo — not nested inside a general-purpose folder like Documents. Root-level/organized-by-repo is the good practice; burying it in a general folder is the anti-pattern to avoid.
4. Copy over whatever the primary checkout has that the worktree needs to function identically to it — at minimum, environment files (`.env` etc.). Without this, the agent in the worktree can't do what it could do in the primary checkout.
5. Track the worktree's lifecycle: mark it as completed once its agent's task is done, and remove it rather than letting completed worktrees accumulate.
6. To use: when kicking off a new agent for a task, explicitly instruct it to do the work in a new git worktree. It should detect its current location and follow this setup pattern once instructed — you don't need to script the detection/creation steps by hand each time.

## Rules / heuristics

- This is a threshold decision, not a blanket rule — small numbers of parallel agents on a repo often don't need worktrees at all.
- Worktree placement matters as much as creating one: root-level and repo-organized is correct; nested inside a general documents folder is the specific mistake to avoid.
- A worktree without the copied env files isn't actually isolated in practice — the agent will hit avoidable failures trying to do things the primary checkout could do.

---
Source: "8 favorite skills from my agentic skills repo" — David Andre
