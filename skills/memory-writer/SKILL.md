---
name: memory-writer
description: Captures non-obvious decisions, patterns, and preferences from the current session into persistent memory files. Run at end of any session where meaningful choices were made. Prevents knowledge evaporation between sessions.
---

# /memory-writer

Writes persistent memory files from current session context. Run at end of any session where decisions, patterns, or user preferences were established.

## When to Use

- End of `/project-init` (Step 9)
- After any session with architectural decisions
- After user corrects your approach — ratchet it into memory
- User says `/memory-writer`

## What to Capture

**Write only non-obvious things.** Skip anything derivable from reading the code.

Capture:
- WHY a choice was made (not WHAT was chosen — code shows that)
- Trade-offs accepted and the reason
- Patterns the user validated ("yes exactly, do it that way")
- Patterns the user rejected ("no, don't do that")
- Stack constraints not visible in code

**High-signal session outputs (always capture if produced this session):**
- Storm research findings with reliability score ≥ 7 → `memory/decisions.md` (reliable findings that informed a decision)
- Loop designs from `/loop-engineering scaffold` → `memory/decisions.md` (hard cap, pattern, rationale — these decay from memory fast)
- Design system decisions from `/ai-ui-design` → `memory/patterns.md` (tokens chosen, reference sites used, why — future agents need this to stay consistent)

Skip:
- File structure (read the repo)
- Recent commits (git log)
- "We added X feature" (code shows it)
- Anything already in CLAUDE.md

---

## Steps

### 1 — Scan session for memory-worthy items

From current conversation, identify:

**Decisions** — architectural, technology, approach choices where alternatives existed. Each needs: what was chosen, what was rejected, why.

**Patterns** — code or workflow patterns the user validated as correct for this project.

**Preferences** — user corrections or confirmations that reveal how they want you to work.

If nothing non-obvious was established this session: say so and stop. Don't write empty files.

### 2 — Write or update memory files

Target directory: `memory/` relative to project root (or `~/.claude/projects/<project>/memory/` for global).

**`memory/decisions.md`**
```markdown
---
name: decisions
description: Architectural and technology decisions with rationale
metadata:
  type: project
---

# Decisions

## [Decision Title] — YYYY-MM-DD
**Chose:** X
**Rejected:** Y, Z
**Why:** [reason — the non-obvious constraint, trade-off, or incident]
```

**`memory/patterns.md`**
```markdown
---
name: patterns
description: Validated code and workflow patterns for this project
metadata:
  type: project
---

# Patterns

## [Pattern Name]
[What it is and where it applies]
**Why:** [Why this specific pattern, not alternatives]
```

**`memory/user_prefs.md`**
```markdown
---
name: user-prefs
description: User workflow and style preferences observed across sessions
metadata:
  type: feedback
---

# User Preferences

## [Preference]
[What the user wants]
**Why:** [Reason given, or observed from correction/confirmation]
**How to apply:** [When this kicks in]
```

### 3 — Update MEMORY.md index

Add or update pointer lines in `memory/MEMORY.md`:
```
- [Decisions](decisions.md) — architectural choices with rationale
- [Patterns](patterns.md) — validated code patterns for this project
- [User Preferences](user_prefs.md) — workflow and style preferences
```

### 4 — Output summary

```
MEMORY WRITTEN
══════════════
decisions.md    — N items added/updated
patterns.md     — N items added/updated
user_prefs.md   — N items added/updated

Key captures:
  → [one-line summary of most important item]
  → [one-line summary of second most important]
```

---

## Rules

- Never write derivable facts (file paths, recent commits, feature lists)
- Never write "we discussed X" — write the conclusion, not the discussion
- One memory item = one non-obvious insight. No padding.
- If uncertain whether something is worth capturing: ask "would a fresh session benefit from knowing this?" If no, skip.
- Prefer updating existing memory files over creating new entries for same topic
