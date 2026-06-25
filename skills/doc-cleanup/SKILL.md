---
name: doc-cleanup
description: "Scan project for accumulated .md files — classify each as keep/review/delete, surface decisions to user, execute approved deletions. Runs the cleanup crew pass that code review never does. Use before harness audit on existing projects, or standalone anytime."
trigger: /doc-cleanup
version: 1.0.0
---

# /doc-cleanup

Cleanup crew pass for documentation graveyard. Generation is cheap — curation is the skill.

**Rule:** Never delete without explicit user confirmation. Classify, surface, wait.

---

## When to Use

- `/project-init existing` — Step 3.6, before harness audit
- Any session where repo feels cluttered with stale plans/summaries/notes
- After a long feature sprint that produced many generated docs

---

## Step 1 — Scan

Find all `.md` files in project, excluding:

```bash
find . -name "*.md" \
  -not -path "./.git/*" \
  -not -path "./node_modules/*" \
  -not -path "./.Codex/*" \
  -not -path "./wiki/*" \
  -not -path "./raw/*" \
  | sort
```

Also get last-modified and size for each:
```bash
find . -name "*.md" \
  -not -path "./.git/*" \
  -not -path "./node_modules/*" \
  -not -path "./.Codex/*" \
  -not -path "./wiki/*" \
  -not -path "./raw/*" \
  -exec stat -f "%Sm %z %N" -t "%Y-%m-%d" {} \; 2>/dev/null \
  || find . -name "*.md" \
  -not -path "./.git/*" \
  -not -path "./node_modules/*" \
  -not -path "./.Codex/*" \
  -not -path "./wiki/*" \
  -not -path "./raw/*" \
  -printf "%TY-%Tm-%Td %s %p\n" 2>/dev/null | sort
```

---

## Step 2 — Classify

Assign each file to exactly one category using these rules in order. First match wins.

### PROTECTED — never touch

| Pattern | Rule |
|---------|------|
| `README*.md` | Core project docs |
| `CHANGELOG*.md` | Version history |
| `AGENTS.md`, `AGENTS.md`, `MEMORY.md` | Harness files |
| `LICENSE*.md` | Legal |
| `CONTRIBUTING*.md` | Community docs |
| `docs/**/*.md` | Versioned documentation |
| `SPEC.md`, `PRD.md`, `ADR-*.md` | Active specifications |
| Any file referenced in `AGENTS.md` or `AGENTS.md` | In active use |

### DELETE candidates — ephemeral, no ongoing value

| Pattern | Reason |
|---------|--------|
| `HANDOFF*.md` older than 14 days | Session continuity doc, session is gone |
| `temp-*.md`, `scratch-*.md`, `draft-*.md` | Disposable by name |
| File size < 150 bytes | Near-empty stub |
| Contains first line: `# Generated` or `# Auto-generated` | Tool output, not authored |
| Duplicate title with different date suffix (SUMMARY-v1, SUMMARY-v2) | Superseded |

### REVIEW — user decides

Everything else that is not PROTECTED or DELETE:
- `HANDOFF*.md` < 14 days old (might still be active)
- `PLAN*.md`, `*-plan.md`, `*-planning.md` — generated plans, may be superseded
- `SUMMARY*.md`, `*-summary.md` — session/sprint summaries
- `PROGRESS*.md`, `*-progress.md` — progress reports
- `RETROSPECTIVE*.md`, `*-retro.md` — retrospectives
- `ARCHITECTURE*.md` outside `docs/` — may be draft or superseded by code
- Any `.md` in root dir that doesn't match PROTECTED patterns
- Files > 30 days old with no inbound references

### KEEP — confirmed active value

- Any file the user explicitly says to keep during REVIEW
- PROTECTED files already classified above

---

## Step 3 — Output Report

```
DOC CLEANUP REPORT
═══════════════════════════════════════════
Scanned: N .md files

✅ PROTECTED (N) — not touched
   README.md
   AGENTS.md
   ...

🗑  DELETE (N) — ephemeral, safe to remove
   HANDOFF-2026-04-01.md  (61 days old, 420 bytes)
   temp-notes.md          (< 150 bytes)
   ...

❓ REVIEW (N) — needs your call
   PLAN-auth-refactor.md  (45 days old, 2.1KB) — generated plan, may be superseded
   SUMMARY-sprint-4.md    (30 days old, 800 bytes) — session summary
   ...
═══════════════════════════════════════════
```

---

## Step 4 — Get Confirmation

After report, ask:

```
DELETE candidates (N files listed above)?
  [Y] Yes — delete them all
  [R] Review each one individually first
  [S] Skip — no changes, continue

REVIEW items (N files)?
  [Y] Keep all (no action)
  [R] Review each one individually
  [D] Delete all review items (aggressive cleanup)
  [S] Skip
```

If called from `project-init` (not interactive):
- Auto-prompt: "Delete [N] DELETE candidates before harness audit? [Y/N]"
- If Y: delete, then continue to Step 4 (harness audit)
- If N or no response: skip cleanup, continue anyway — do NOT block project-init

---

## Step 5 — Execute

For confirmed deletions:
```bash
# Show exactly what will be deleted first
echo "Deleting:"
echo "  path/to/file.md"

# Then delete
rm path/to/file.md
```

Delete one file at a time. Confirm count after: "Deleted N files."

For REVIEW items the user chose to delete:
- Read first 5 lines to confirm it's actually disposable
- Then delete

---

## Step 6 — Summary

```
CLEANUP COMPLETE
═══════════════════════════════════════════
Deleted:  N files
Kept:     N files (protected + user confirmed)
Skipped:  N files (review items, no action)

Repo MD count: before → after
═══════════════════════════════════════════
```

If called from project-init: output one-liner summary then return control.

---

## Rules

- **Never delete PROTECTED files.** Even if user says "delete everything."
- **Never delete .Codex/** files. Harness files are always off-limits.
- **Read before delete** for any REVIEW item — 5-line preview before confirming.
- **Never batch-delete without showing the list first.** List → confirm → delete.
- **If uncertain about a file**: put it in REVIEW, not DELETE. Err conservative.
- **Project-init mode**: non-blocking. Cleanup failure or skip does not halt init.
