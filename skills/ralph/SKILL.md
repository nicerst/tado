---
name: ralph
description: >
  Autonomous agent loop for story-by-story execution. Uses `prd.json` as the
  source of truth, spawns a fresh agent each iteration, commits one story at a
  time, and stops only when all stories pass or the loop limit is hit.
trigger: /ralph
---

# /ralph

Ralph is the execution engine after planning is done.

## When to use

- multi-story implementation that exceeds one session
- unattended or semi-attended build loops
- after `/feature-init`
- after `/project-mid` recalibrates the remaining scope

## Core model

`prd.json` + `progress.txt` + git commits are the memory.

Per iteration:
1. fresh agent starts cold
2. reads `prd.json`, `AGENTS.md`, `progress.txt`
3. picks next highest-priority `passes: false` story
4. implements that story only
5. runs the project quality gate
6. commits
7. flips the story to `passes: true`
8. appends a short note to `progress.txt`
9. emits `<promise>COMPLETE</promise>` only when no failing stories remain

## Story rules

- one story = one context window
- one story = one commit
- acceptance criteria must be pass/fail, not taste-based
- dependent stories must be ordered so every commit compiles standalone

## Expected `prd.json` shape

Minimum shape:

```json
{
  "project": "ProjectName",
  "branchName": "feature/short-name",
  "description": "Short project summary",
  "userStories": [
    {
      "id": "US-001",
      "title": "Story title",
      "description": "Single execution unit",
      "acceptanceCriteria": [
        "Mechanical AC 1",
        "Mechanical AC 2"
      ],
      "priority": 1,
      "passes": false,
      "notes": ""
    }
  ]
}
```

Ralph should treat `userStories` as the source list. Do not invent alternate schemas mid-run.

## Setup

Minimum files:
- `ralph.sh`
- `prd.json`
- `AGENTS.md`

Useful supporting files:
- `progress.txt`
- `.Codex/project-dna.md`
- `HANDOFF.md`

## Running

Examples:

```bash
./ralph.sh --tool Codex 10
./ralph.sh --tool amp 15
```

The number is max iterations, not story count.

## Relationship to `/project-mid`

`/project-mid` is real, not planned. Its job is to:
1. audit shipped vs drifted vs outstanding work
2. rebuild a clean `prd.json`
3. print the manual `ralph` launch command if the user wants autonomous execution

## Rules

- Never auto-launch from a skill. Print the command; user runs it.
- Never edit `prd.json` mid-run from another session.
- Never mark a story passed without the gate succeeding.
- Keep the loop simple. No daemon, no extra state store, no scheduler unless the current shell loop is proven insufficient.
