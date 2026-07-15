---
name: repo-to-skill
description: Use when the user gives a GitHub URL or owner/repo and wants it turned into a Claude Code skill — "/repo-to-skill", "convert this repo into a skill", "skillify this repository", "make a skill from github.com/...".
---

# Repo-to-Skill

Turn one GitHub repository into one installable skill. Methodology in, skill out — never a code dump.

## Input

Accept a GitHub URL (`https://github.com/owner/repo`, with or without `/tree/...` path) or bare `owner/repo`. Anything else: ask for one.

## Fetch (bounded — never full clone)

1. `git clone --depth 1 https://github.com/owner/repo <scratchpad>/repo-to-skill/<repo>` into the scratchpad dir. If git clone fails or is unavailable, fall back to GitHub API: `gh api repos/owner/repo/readme`, `gh api repos/owner/repo/contents/docs`.
2. Read ONLY, in this order, stopping when you have enough to distill:
   - README (root)
   - docs/ or documentation/ (top-level pages, skip generated API dumps)
   - examples/ or samples/ (top-level files)
   - Public API surface if needed: main entry file, CLI help, package manifest (package.json / pyproject.toml / Cargo.toml)
3. Never read: node_modules, vendor/, dist/, build/, lockfiles, binaries, test fixtures, .git internals.
4. Delete the clone from scratchpad after distillation.

## Extraction rubric

Skill-worthy = what a user/agent DOES with this project, executable without reading the repo:
- Install + setup sequence, required config
- Core usage patterns: commands, API calls, idiomatic snippets from README/examples
- Decision rules ("use X mode when...", version/compat constraints)
- Gotchas, anti-patterns, common errors documented in README/issues templates/FAQ

NOT skill-worthy (drop it):
- Internal implementation details, contributor/dev-setup docs, CI config
- Wholesale code copied from src/ — quote only short idiomatic snippets shown in docs/examples
- Badges, star counts, license boilerplate, changelogs

If repo is pure data/content/template with no reusable workflow (awesome-lists, datasets, wallpaper packs), say so and stop — do not force a skill out of a description.

## Procedure

1. Parse input to owner/repo. Fetch per rules above.
2. Identify the ONE core capability. Monorepo / multiple unrelated tools → ask user which, or pick the dominant one and say so. Ask for name/scope only if genuinely ambiguous.
3. Derive kebab-case skill name from the capability (not necessarily the repo name — `sharp` repo → `sharp-image-processing`).
4. Check `~/.claude/skills/<name>/` doesn't exist; if it does, propose updating instead of overwriting.
5. Write `~/.claude/skills/<name>/SKILL.md` using the template below.
6. Verify: frontmatter parses (name + description present, description has ≥2 concrete trigger phrases), body under ~150 lines.
7. Report: skill name, path written, one-line summary, trigger phrases, what was dropped.

Do NOT edit CLAUDE.md or register the skill anywhere else unless the user asks.

## Output template

```markdown
---
name: <kebab-case-name>
description: Use when <task the repo solves> — <2-3 concrete trigger phrases, library/tool name included>.
---

# <Title>

<One-line purpose.>

## When to use / when NOT to use

## Setup
<Install command, required config. Pin the major version you read docs for.>

## Core usage
<The 3-7 patterns that cover 90% of use. Real commands/snippets from README/examples — never invented.>

## Rules / gotchas
<Version constraints, documented pitfalls, decision rules.>

---
Source: github.com/<owner>/<repo> @ <commit sha or version tag read>
```

Rules for the generated skill:
- Instructions to the agent, second person, imperative. Not repo notes.
- Every snippet traceable to README/docs/examples at the pinned sha. No invented APIs.
- Under ~150 lines. One skill = one capability.
