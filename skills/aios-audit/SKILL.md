---
name: aios-audit
description: Read-only audit for an AI operating system, second brain, or agent workspace. Use for "/aios-audit", "audit my AIOS", "check routing truth", or when context/routing/wiki/memory answers feel stale or unreliable.
---

# AIOS Audit

Audit whether an agent workspace still matches reality before trusting it.

## When to use / when NOT to use

Use when:
- A repo, AIOS, second brain, wiki, memory system, or agent workspace has grown over time.
- Routing docs, indexes, client folders, wikis, or memory files may be stale.
- The agent recently missed known data, cited stale data, searched too broadly, or contradicted itself.
- You are at `/project-mid`, onboarding an existing repo with `/project-init existing`, or planning a feature that touches context/routing/memory/knowledge.

Do not use when:
- The task is a normal code review, security audit, or test failure. Use the relevant engineering skill.
- The user asked you to reorganize files immediately. This audit is read-only first.
- There is no workspace, routing file, wiki, index, memory, or persistent context to inspect.

## Procedure

1. Announce read-only mode.
   - Do not rename, delete, move, rewrite, or "clean up" files.
   - You may create an `audits/` directory and write the audit report there.
   - Fixes go into an approval list, not direct edits.

2. Load prior audit state.
   - Look for `audits/` at the workspace root; create it if missing.
   - Read recent audit reports if present.
   - Note repeated issues, unresolved recommendations, and any claimed "current through" dates.

3. Map the routing surface.
   - Read router-like files: `CLAUDE.md`, `AGENTS.md`, `.claude/*`, `.agents/*`, `.codex/*`, `README.md`, indexes, memory docs, wiki indexes, project maps, and routing tables that exist.
   - Extract every path, folder, wiki, feed, client/project pointer, and "go here for X" rule.
   - Verify each referenced path exists.

4. Check routing integrity.
   - Forward check: every router/index claim points to a real file or folder.
   - Reverse check: important files/folders on disk are represented by routing docs or intentionally excluded.
   - Mark orphaned, misrouted, duplicated, ambiguous, or overbroad routes.

5. Check index truth.
   - Compare claimed counts and named entries against disk reality.
   - Flag index rows that point nowhere, missing rows for real folders, stale counts, and duplicate names.
   - If exact enumeration is too large, sample deterministically and state the sampling rule.

6. Check freshness.
   - For each data source, classify it as `fresh`, `drifting`, `frozen`, `retired`, or `on-demand`.
   - Compare timestamps/current-through dates to expected cadence.
   - Flag data that looks always-loaded but should be live lookup, and live data that has no update routine.

7. Diagnose context failure modes.
   - Poisoning: false facts present in context.
   - Bloat: too much irrelevant context loaded by default.
   - Confusion: missing or irrelevant facts likely cause the agent to fill gaps.
   - Clash: old and new sources disagree without trust or freshness rules.

8. Separate expertise vs situational context.
   - Expertise context: stable rulebook, policies, goals, identity, durable operating rules, routing maps.
   - Situational context: tickets, customer-specific records, meeting transcripts, recent feeds, project snapshots, temporary research.
   - Flag situational data that lives in always-loaded files.
   - Flag expertise rules buried inside transient notes.

9. Backtrack known failures if the user gave one.
   - Reconstruct where an agent would search first.
   - Identify why the expected data was not found quickly.
   - Recommend routing/index changes that would make the correct lookup obvious next time.

10. Write the report.
    - Filename: `audits/aios-audit-YYYY-MM-DD.md`.
    - Include status, evidence, wrong-answer risks, and fix list.
    - Use concrete file paths and line references where possible.

11. Stop for approval.
    - Print the report path and top risks.
    - Ask which fixes to apply.
    - Do not apply fixes unless the user explicitly approves.

## Rules / heuristics

- Treat router files as claims, not truth. Verify against disk.
- Prefer narrow just-in-time lookup over loading whole wikis by default.
- Stale context is more dangerous when it is phrased as policy or current state.
- Segment growing knowledge by domain and cadence: meetings, videos, clients, projects, policies, decisions.
- Keep internal client context separate from external deliverable repos; link them clearly.
- If a workspace has 100+ folders, fan out one exploration subagent per major check, then merge findings.
- Automate recurring data catch-up when the same source should be refreshed on a known cadence.
- A good audit answers: "What would this system answer wrong today?"

## Report template

```markdown
# AIOS Audit - YYYY-MM-DD

Status: Green / Yellow / Red
Workspace:
Knowledge current-through:

## Executive Summary
- Routing integrity:
- Index truth:
- Freshness:
- Context placement:
- Wrong-answer risk:

## Findings
| Severity | Area | Evidence | Risk | Proposed fix |
|---|---|---|---|---|

## Context Failure Modes
- Poisoning:
- Bloat:
- Confusion:
- Clash:

## Expertise vs Situational Placement
- Should stay always-loaded:
- Should move to just-in-time lookup:
- Missing lookup/update path:

## What Would Answer Wrong Today
- Question:
- Likely wrong answer:
- Why:
- Correct source/fix:

## Fix List - Awaiting Approval
1. Finish inflight cleanup:
2. Routing + index truth:
3. Data catch-up:
4. Durability / recurring update:
```

---
Source: AIOS organization / OS audit transcript pasted by user (title/channel/URL not provided)
