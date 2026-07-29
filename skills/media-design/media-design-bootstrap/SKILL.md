---
name: media-design-bootstrap
description: Use when the user wants to route or bootstrap video/media/design work across watch-video-and-answer, bibigpt-media-workflow, video-toolkit-workflow, and open-design-plugin-authoring.
---

# Media Design Bootstrap

Router skill. Pick the smallest underlying skill that matches the job.

## Decision Tree

1. User gives a video/audio URL and asks what it says:
   use `bibigpt-media-workflow`.
2. User asks what happens visually, names a timestamp, or gives a screen recording:
   use `watch-video-and-answer`.
3. User wants to create a finished video:
   use `video-toolkit-workflow`.
4. User wants to create a design/plugin/template/prototype/deck/artifact system:
   use `open-design-plugin-authoring`.
5. User wants both video and design:
   use `open-design-plugin-authoring` for the design contract, then `video-toolkit-workflow` for video production.

## Defaults

- Summarize media: BibiGPT first.
- Inspect frames: watch-video first.
- Generate video: video toolkit first.
- Author reusable design workflow: Open Design first.

## Composition

Video from existing source:

```text
bibigpt-media-workflow -> script/summary
watch-video-and-answer -> timestamped visual evidence
video-toolkit-workflow -> new edited/rendered output
```

Design-led video:

```text
open-design-plugin-authoring -> DESIGN.md/SKILL.md/artifact direction
video-toolkit-workflow -> storyboard/render
watch-video-and-answer -> QA rendered video
```

## Rules

- Do not use all four by default.
- Do not create new design/plugin scaffolding unless the user needs reuse.
- Do not generate a new video when a summary answers the request.
- Do not inspect frames when transcript-level summary is enough.
- When privacy matters, avoid external services unless user approves.
