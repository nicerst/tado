---
name: repo-to-skill
description: Use when the user gives a GitHub URL or owner/repo and wants it turned into a Claude Code skill — "/repo-to-skill", "convert this repo into a skill", "skillify this repository", "make a skill from github.com/...".
---

# Repo-to-Skill

Turn one GitHub repository into one installable skill. Methodology in, skill out — never a code dump.

**Orchestrated workflow**: spawn `Agent(subagent_type="rts-repo-scout")` for the bounded fetch + read phase, and `Agent(subagent_type="rts-skill-writer")` for applying the extraction rubric and writing the SKILL.md — instead of running either inline. Use inline only for quick interactive/`/slash` use where the human just wants to talk through whether a repo is skill-worthy before committing to a full build.

This orchestrator owns: input parsing, the ONE-capability decision + ambiguity question, the existing-skill collision check, the pure-data-repo stop rule, and the final report. It never clones, reads repo source, or writes the SKILL.md itself — that's delegated.

## Input (orchestrator-owned)

Accept a GitHub URL (`https://github.com/owner/repo`, with or without `/tree/...` path) or bare `owner/repo`. Anything else: ask for one.

## Delegation: fetch and distill

Spawn `Agent(subagent_type="rts-repo-scout")`, passing it the parsed owner/repo (and subpath if given). It returns distilled raw material (setup, usage patterns, decision rules, gotchas) — never a full source dump, never internal implementation details.

## Pure-data-repo stop rule (orchestrator-owned — check before proceeding to capability decision)

If the scout's returned material indicates the repo is pure data/content/template with no reusable workflow (awesome-lists, datasets, wallpaper packs), say so and stop — do not force a skill out of a description, and do not spawn the skill-writer.

## ONE-capability decision + ambiguity question (orchestrator-owned)

From the scout's distilled material, identify the ONE core capability. Monorepo / multiple unrelated tools → ask the user which, or pick the dominant one and say so. Ask the user for name/scope only if genuinely ambiguous — don't ask reflexively when the dominant capability is clear.

Derive a kebab-case skill name from the capability (not necessarily the repo name — e.g. `sharp` repo → `sharp-image-processing`).

## Existing-skill collision check (orchestrator-owned)

Check `~/.claude/skills/<name>/` doesn't already exist. If it does, propose updating instead of overwriting — do not silently overwrite, and do not delegate this decision to the skill-writer.

## Delegation: write the skill

Spawn `Agent(subagent_type="rts-skill-writer")`, passing it: the scout's distilled material, the chosen kebab-case name, the target path (new or update), and the pinned commit sha/version the scout read. It applies the extraction rubric, writes `~/.claude/skills/<name>/SKILL.md` from the template, and verifies frontmatter/line-count/trigger-phrase requirements before returning.

Do NOT edit CLAUDE.md or register the skill anywhere else unless the user asks.

## Final report (orchestrator-owned)

After the skill-writer returns, report to the user: skill name, path written, one-line summary, trigger phrases, and what was dropped (per the extraction rubric's NOT-skill-worthy list, as relayed by the scout/writer).
