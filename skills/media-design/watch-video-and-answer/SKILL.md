---
name: watch-video-and-answer
description: Use when the user asks to watch, summarize, inspect, or answer questions about a video URL or local video/screen recording using bradautomates/claude-video style transcript + frame extraction.
source: https://github.com/bradautomates/claude-video
source_commit: 83da59fa78c3eee9e20f515fe75c438bb5166efd
license: MIT
---

# Watch Video And Answer

Use a video extractor before answering. Ground answers in transcript, frames, and timestamps.

## Setup

Preferred install:

```bash
npx skills add bradautomates/claude-video -g
```

Claude plugin path:

```text
/plugin marketplace add bradautomates/claude-video
/plugin install watch@claude-video
```

First-run checks:

```bash
python3 "${SKILL_DIR}/scripts/setup.py" --json
python3 "${SKILL_DIR}/scripts/setup.py" --check
```

On Windows use `python` if `python3` is absent.

Requires `ffmpeg`, `ffprobe`, and `yt-dlp`. Optional Whisper providers use `GROQ_API_KEY` or `OPENAI_API_KEY` in `~/.config/watch/.env`.

## Workflow

1. Parse source: URL or local file.
2. Choose cheapest detail that can answer:
   - `transcript`: captions/audio are enough.
   - `efficient`: quick visual pass, capped frames.
   - `balanced`: default scene-aware pass.
   - `token-burner`: only for visual-forensics or tiny details.
3. Use `--start` and `--end` for named ranges. Do not scan whole long videos when the user names a moment.
4. Run extraction.
5. Answer with timestamps. Separate transcript evidence from visual evidence when relevant.
6. Cleanup temp output after follow-ups are done.

## Commands

```bash
python3 "${SKILL_DIR}/scripts/watch.py" "<source>" --detail balanced
python3 "${SKILL_DIR}/scripts/watch.py" "<source>" --start 2:15 --end 2:45
python3 "${SKILL_DIR}/scripts/watch.py" "<source>" --timestamps 4:32,7:10
python3 "${SKILL_DIR}/scripts/watch.py" "<source>" --detail transcript --no-whisper
```

Useful knobs:

```text
--max-frames N
--resolution 1024
--fps F
--whisper groq|openai
--no-whisper
--no-dedup
--out-dir DIR
```

## Rules

- Quote URLs containing `?` or `&`.
- For long videos over 10 minutes, do a focused rerun instead of a broad high-detail scan.
- For presenter cues like "look here", run transcript first, then force visual frames with `--timestamps`.
- Raise `--resolution` only when on-screen text needs reading.
- Missing Whisper key is not fatal; captions or frames may be enough.
- Login-required or region-locked URLs failing through `yt-dlp` are not worth repeated retries.
- Whisper sends extracted audio to provider, not full video. Mention this if privacy matters.

## Avoid

- Do not invent visual details not present in frames.
- Do not use `token-burner` by default.
- Do not store full downloaded videos longer than needed.
