---
name: global-agent-guardrails
description: >
  Set up a pre-tool-call hook that blocks destructive shell commands before running coding agents
  with auto-approve/YOLO/dangerously-skip-permissions mode. Enforcement lives in the hook, not the
  prompt — a prompt rule is a suggestion, a hook can actually deny the tool call. Trigger: "set up
  agent guardrails", "run this agent in yolo mode safely", "block dangerous commands before
  dangerously-skip-permissions", "prevent the agent from wiping my disk".
---

# Global Agent Guardrails

Block destructive commands at the tool-call level before running any agent with auto-approve on.

## When to use / when NOT to use

Set this up before running any coding agent with auto-approve / "YOLO mode" / dangerously-skip-permissions. Do this first, before any other agent-orchestration setup — everything else (parallel agents, worktrees, unattended loops) assumes it's already safe to let the agent run unattended.

Not a substitute for reviewing what the agent actually did — it only stops the specific class of catastrophic, hard-to-reverse commands from executing at all.

## Procedure

1. Before enabling auto-approve/YOLO mode for any agent, install a pre-tool-call hook — a hook that runs before every tool call the agent makes, not a rule written into the system prompt or agent instructions.
2. The hook must pattern-match the proposed command against a deny-list and block execution if it matches, rather than just warning after the fact.
3. Deny-list, at minimum, these categories of destructive command:
   - Recursive delete targeting root or the whole home directory (`rm -rf /`, `rm -rf ~`, and equivalents).
   - Whole-disk-destructive operations.
   - Deletes run with elevated/admin privileges.
   - Fork bombs.
   - Piping arbitrary internet content straight into a shell (`curl ... | sh` style patterns).
   - Rewriting or force-pushing remote git history.
   - Deleting remote git branches or tags.
   - Recursively changing ownership/permissions across the whole system.
   - Deleting the git reflog (this removes the undo/safety-net for git operations).
   - Unsafe/destructive GitHub CLI operations.
4. Allow-list common safe-looking operations explicitly, so the hook doesn't over-block routine work — e.g. recursive delete of `node_modules` (or other regenerable dependency directories) should stay allowed.
5. Treat model choice as risk-reduction, not risk-elimination — a more careful/powerful model lowers the chance of a destructive command being proposed, but the hook is the actual safety boundary, not the model.

## Rules / heuristics

- Enforcement belongs in a hook that can deny the tool call before it runs — a rule stated only in the prompt/instructions is a suggestion an agent can still act against.
- Set this up first. Every other multi-agent or auto-approve workflow is unsafe to build on top of until this exists.
- A working guardrail hook should let harmless "looks dangerous but isn't" operations through (e.g. `node_modules` cleanup) — an overly broad deny-list that blocks routine work will just get disabled.

---
Source: "8 favorite skills from my agentic skills repo" — David Andre
