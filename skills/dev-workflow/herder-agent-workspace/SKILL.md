---
name: herder-agent-workspace
description: Organize, monitor, and persist multiple coding-agent terminal sessions (Claude Code, Codex, OpenCode, etc.) using Herder's space/tab/pane hierarchy, including having agents spawn their own panes to make headless agent-to-agent exchanges visible. Use when running 2+ coding agents across different harnesses simultaneously, when terminals become hard to track manually, or when a headless multi-agent workflow (e.g. a plan-critique loop) needs to be made observable.
---

# Herder Agent Workspace

Run and monitor multiple coding-agent terminals from one persistent, agent-aware multiplexer instead of scattered terminal windows.

## When to use / when NOT to use

Use when juggling multiple coding agents/terminals (e.g. two Claude Code sessions, OpenCode, Codex) at once and losing track of which needs attention, or when an agent-to-agent workflow normally runs headless and you want to see it happen in real time.

Do NOT use for a single agent in a single terminal — the organizing hierarchy (spaces/tabs/panes) adds no value there.

## Procedure

1. Install Herder: get the one-line install command from herder.dev or the Herder GitHub README (copy the exact command shown there — not reproduced here).
2. Launch by typing `herder` in a terminal. Three panels appear: Spaces, Agents, and the terminal pane.
3. Treat each **Space** as a project. Create/rename a Space per project (e.g. "web design").
4. Inside a Space, open **Tabs** as sub-task buckets (e.g. one tab for research, another for the dev server).
5. Inside a Tab, split into **Panes** (right-click → Split) to run multiple agents side by side (e.g. Claude Code + Codex in the same tab).
6. Watch the **Agents** panel on the left across all spaces/tabs to see which agents are actively working, done, or stuck — without every pane needing to be visible.
7. For a headless agent-to-agent exchange (e.g. one agent driving another through a review/critique skill), install the Herder skill so agents can spawn their own pane inside Herder and make that exchange visible instead of running silently.
8. To persist: closing the terminal window does not stop running agents — Herder runs as a server. Reopen a terminal and type `herder` again to reattach; agents are still working. Remote reattachment (phone/SSH) is also supported.
9. To stop: right-click a pane → Close pane; right-click a space → Close, to shut the whole space down.
10. For keyboard control: keybinds follow a tmux-style prefix pattern — press the prefix (Ctrl+B by default) then a command key (e.g. prefix then `v` splits vertical). Full list under Menu → Keybinds. Most actions are also available via right-click/mouse — keybinds are optional, not required.

## Rules / heuristics

- Hierarchy is the core model: **Space = project, Tab = sub-task within the project, Pane = one agent's terminal within that sub-task.**
- Reach for Herder once plain terminal tabs stop being trackable by eye (the speaker's own trigger case: 6-8 concurrent terminals across agents) — below that, a multiplexer adds overhead without payoff.
- Prefer Herder over tmux specifically when cross-agent status (which agent needs input vs. is done vs. stuck) matters more than raw pane multiplexing — tmux doesn't surface that out of the box.
- Prefer Herder over Zellij specifically when session persistence after closing the terminal, and native Windows support, matter.
- When orchestrating an agent-to-agent loop that would otherwise run headless (e.g. a plan → critique → revise cycle between two agents), spawn a dedicated Herder pane for it via the Herder skill so the exchange is observable instead of invisible.
- A plugin marketplace exists for Herder add-ons — check it before building custom tooling on top of Herder.
- Settings (Menu → Settings) cover theme, sounds, toast notifications, labels, integrations, and experiments — check there before assuming a feature is missing.

## Examples

Transcript's own example: an agent (Claude Code) creates a plan, sends it to a second agent (Codex) via a review/critique skill, Codex returns issues, the plan gets revised, and the loop repeats until the verdict is no longer "revised." Instead of this running headless, the Herder skill was used to open a dedicated pane so the entire back-and-forth (plan → critique → revised plan) was visible in real time.

---
Source: video transcript pasted by user (title/channel/URL not provided in source)
