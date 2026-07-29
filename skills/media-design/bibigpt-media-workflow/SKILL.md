---
name: bibigpt-media-workflow
description: Use when the user wants BibiGPT to summarize, transcribe, chapterize, batch-analyze, rewrite, or manage video/audio URL and media library workflows.
source: https://github.com/JimmyLv/bibigpt-skill
source_commit: 5fc4cf8e06d2f94e25ffb3ff23bb35a1e0a8c25c
license: MIT
---

# BibiGPT Media Workflow

Use BibiGPT for media understanding when the user gives video/audio URLs, local media files, or library/feed/channel tasks.

## Setup

Skill/plugin install:

```bash
npx skills add JimmyLv/bibigpt-skill
codex plugin marketplace add JimmyLv/bibigpt-skill
codex plugin add bibi@bibigpt
```

CLI install examples:

```bash
winget install BibiGPT --source winget
curl -fsSL https://bibigpt.co/install.sh | bash
bibi auth login
bibi auth check
```

API mode needs `BIBI_API_TOKEN`. MCP endpoint: `https://bibigpt.co/api/mcp`.

## Routing

1. Prefer local `bibi` CLI when installed.
2. Use API token for URL-only automation.
3. Use MCP if connected by host.
4. For local files, prefer CLI; API mode is URL-first.
5. For media over 30 minutes, use async and poll.
6. For machine-readable output, use `--json`.

## Commands

```bash
bibi summarize "<URL>"
bibi summarize "/path/to/video.mp4"
bibi summarize "<INPUT>" --async
bibi summarize "<INPUT>" --chapter
bibi summarize "<INPUT>" --subtitle
bibi summarize "<INPUT>" --json
bibi library list --json
bibi library search --keyword "AI agents"
bibi channels list --json
bibi feed --json
bibi collections list --scope all --json
bibi notes update --contentId <id> --text "..." --json
```

## Supported Work

- URL or local media summary.
- Transcript/subtitle extraction.
- Chapter summaries.
- Multi-URL batch synthesis.
- Rewrite into article, notes, thread, or brief.
- Library/feed/channel/collection search.
- Optional short-form MV/social repackaging.

Common platforms include YouTube, Bilibili, Apple Podcasts, Spotify episodes, TikTok/Douyin, Twitter/X video posts, Xiaohongshu, and direct audio/video URLs.

## Gotchas

- Quote URLs containing `?` or `&`.
- CLI progress goes to stderr; content goes to stdout.
- API requires `Authorization: Bearer $BIBI_API_TOKEN` and `x-client-type: bibi-cli`.
- HTTP 402 means payment/quota, not generic failure.
- Live OpenAPI docs beat stale copied examples.
- Do not upload local files through API unless current docs explicitly support it.

## Avoid

- Do not pretend summaries are primary-source verification.
- Do not use BibiGPT when user needs frame-level visual inspection; use `watch-video-and-answer`.
- Do not expose tokens in prompts, logs, or pasted commands.
