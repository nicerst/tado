---
name: yt-to-skill
description: Turn a YouTube transcript into a reusable Claude Code skill. Extracts the teachable methodology (not a summary) and writes ~/.claude/skills/<name>/SKILL.md. Use when user pastes a transcript, gives a transcript file, or says "/yt-to-skill", "turn this video into a skill", "skillify this transcript".
---

# YT-to-Skill

Turn one video transcript into one installable skill. Methodology in, skill out.

## Input

Accept, in order of preference:
1. Pasted transcript text in the conversation.
2. File path to a transcript (.txt/.md/.srt/.vtt — strip timestamps/cue numbers first).

No URL fetching. If user gives only a YouTube URL, ask for the transcript
(YouTube → "Show transcript" → copy) or suggest `yt-dlp --write-auto-sub`.

## Extraction rubric

Skill-worthy = repeatable procedure someone could execute without watching the video:
- Named workflows, step sequences, checklists
- Decision rules ("if X, do Y"), thresholds, heuristics
- Anti-patterns the speaker warns against
- Specific commands, prompts, configs, templates shown

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
3. Check `~/.claude/skills/<name>/` doesn't already exist; if it does, propose
   updating it instead of overwriting.
4. Write `~/.claude/skills/<name>/SKILL.md` using the template below.
5. Report: skill name, one-line summary, trigger phrase, what was dropped as
   non-skill-worthy.

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
Source: <video title> — <channel> (<URL if known>)
```

Rules for the generated skill:
- Instructions to the agent, second person, imperative. Not video notes.
- Everything traceable to the transcript. No padding, no invented steps.
- Under ~150 lines. One skill = one methodology.

## Other platforms

Generated SKILL.md is plain markdown — paste body into ChatGPT custom GPT
instructions or Codex `AGENTS.md` as-is. No transform step.
