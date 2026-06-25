---
name: feature-init
description: >
  Plan a non-trivial feature before implementation. Produces a codebase-grounded
  feature read, acceptance criteria, impact map, risk plan, YAML execution plan,
  and a ralph-ready `prd.json` story block.
trigger: /feature-init
---

# /feature-init

Use before building a feature that is too large, too cross-cutting, or too ambiguous to code in one shot.

Skip for:
- simple bug fixes
- tiny single-file edits
- docs-only changes
- pure config changes

## Modes

- `/feature-init`
- `/feature-init quick`
- `/feature-init from-spec <file>`

## Phase 0 — Feature Read

Start with one line:

```text
[Feature kind] for [system/domain] — [primary goal] with [key constraint]
```

If you cannot write that line, ask one clarifying question.

## Phase 0.5 — UI dial check

If UI is involved:
1. invoke `frontend`
2. set design dials
3. audit existing UI in that feature area for slop to avoid

Skip for backend-only work.

## Phase 1 — Specification

Write:
- goal
- inputs
- outputs
- falsifiable acceptance criteria
- constraints
- out of scope

Do not allow vague criteria like "works correctly".

## Phase 2 — Logic sketch

Write short pseudocode:
- entry point
- key helpers
- critical data flow

Surface unknown dependencies here.

## Phase 2.5 — Codebase scan

Ground the feature in the real repo before locking architecture.

Produce an Impact Map:
- verified files to modify
- new files to create
- real symbol anchors with file paths
- scan gaps that need user review

If a non-trivial scan gap remains, surface it before proceeding.

## Phase 3 — Architecture

Use only verified paths/symbols from the scan.

List:
- files to create
- files to modify
- integration points
- schema changes
- dependency additions

## Phase 4 — Risks and validation

List:
- top risks + mitigation
- edge cases
- validation plan: unit / integration / manual smoke

## Phase 5 — Story decomposition

Break the feature into execution stories.

Story rules:
- one story = one context window
- one story = one commit
- mechanical acceptance criteria
- strict dependency order
- no decorative "nice to have" stories in the critical path

## Output

Emit both:
1. a structured YAML plan
2. a `prd.json` payload ready for `ralph`

Minimum `prd.json` shape:

```json
{
  "project": "ProjectName",
  "branchName": "feature/short-name",
  "description": "One-line feature summary",
  "userStories": [
    {
      "id": "US-001",
      "title": "Short story title",
      "description": "One-story scope only",
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

If `prd.json` already exists, append new stories into `userStories` and preserve the existing top-level shape.

## Quick mode

For `/feature-init quick`, do only:
- Feature Read
- Specification
- Story decomposition
- Output

## From-spec mode

For `/feature-init from-spec <file>`, treat the file as Phase 1 input and continue from the scan onward.
