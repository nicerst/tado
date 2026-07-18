---
name: yt-to-skill
description: Turn a YouTube transcript into a reusable Claude Code skill. Extracts the teachable methodology (not a summary) and writes SKILL.md to the project's `.claude/skills/<name>/` or the global `~/.claude/skills/<name>/`, whichever fits context. Use when user pastes a transcript, gives a transcript file, or says "/yt-to-skill", "turn this video into a skill", "skillify this transcript".
---

# YT-to-Skill

Turn one video transcript into one installable skill. Methodology in, skill out.

## Input

Accept, in order of preference:
1. Pasted transcript text in the conversation.
2. File path to a transcript (.txt/.md/.srt/.vtt — strip timestamps/cue numbers first, but keep a timestamp-to-section map if present).

No URL fetching. If user gives only a YouTube URL, ask for the transcript
(YouTube → "Show transcript" → copy) or suggest `yt-dlp --write-auto-sub`.

## Context gathering (before extraction)

3. If target is this repo (tado) or any repo with `lib/constants.js` `SKILL_NAMES`: grep it for name collisions before naming the skill.
4. Read the project's skill-groups table (CLAUDE.md) to pick the correct category for the new skill.

## Extraction rubric

Skill-worthy = repeatable procedure someone could execute without watching the video:
- Named workflows, step sequences, checklists
- Decision rules ("if X, do Y"), thresholds, heuristics
- Anti-patterns the speaker warns against
- Specific commands, prompts, configs, templates shown
- Unstated tools/assumptions/warnings the speaker relies on but never says outright

NOT skill-worthy (drop it):
- Speaker bio, sponsor reads, channel plugs, filler stories
- Opinions with no actionable rule attached
- News/announcements (facts that expire, not procedures)

If transcript has no extractable procedure (pure news/opinion/entertainment),
say so and stop — do not force a skill out of a summary.

## Procedure

1. Read transcript. Identify the ONE core methodology. Multiple unrelated
   topics → ask user which one, or pick the dominant one and say so.
2. Derive kebab-case skill name from the methodology (not the video title).
3. Pick the target directory: if working inside a project that has its own
   `.claude/skills/`, or the methodology is project-specific, write there;
   otherwise default to the global `~/.claude/skills/`. If it's ambiguous,
   ask the user rather than assuming.
4. Check `<target-dir>/<name>/` doesn't already exist; if it does, propose
   updating it instead of overwriting.
5. Write `<target-dir>/<name>/SKILL.md` using the template below (draft).
6. **Evaluator pass**: re-read the draft against the source transcript.
   Flag any invented content (not traceable to transcript) or dropped
   content (explicit steps/rules present in transcript but missing from
   draft). Revise draft to fix. Do not skip this even for short transcripts.
7. If target repo has `lib/constants.js` `SKILL_NAMES`/`SKILL_GROUPS`
   (e.g. tado): append the new skill name to both, in the correct category.
   Skip silently if the file doesn't exist — this is tado-specific, not a
   general requirement.
8. Append one line to `<target-dir>/.yt-to-skill-log.md` (create if absent):
   `- <date> | <skill-name> | <video title/source>`. Local audit trail,
   not a memory-system write.
9. Report: skill name, target path, one-line summary, trigger phrase, what
   was dropped as non-skill-worthy, and evaluator-pass findings (if any).

## Output template

```markdown
---
name: <kebab-case-name>
description: <what it does + when to use, with 2-3 trigger phrases. This line decides recall — make it concrete.>
---

# <Title>

<One-line purpose.>

## When to use / when NOT to use

## Procedure
<Numbered steps. Imperative voice. Concrete enough to execute blind.>

## Rules / heuristics
<Decision rules, thresholds, anti-patterns from the video.>

## Examples
<Only if transcript contained concrete examples/commands/prompts — never invent them.>

---
Source: <video title> — <channel> (<URL if known>)[, <timestamp> if traceable]
```

Rules for the generated skill:
- Instructions to the agent, second person, imperative. Not video notes.
- Everything traceable to the transcript. No padding, no invented steps.
- Under ~150 lines. One skill = one methodology.

## Other platforms

Generated SKILL.md is plain markdown, so it drops into ChatGPT custom GPT instructions or Codex `AGENTS.md` as-is — no transform step needed.
