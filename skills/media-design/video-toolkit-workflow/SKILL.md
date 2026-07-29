---
name: video-toolkit-workflow
description: Use when the user wants an AI-generated explainer, product demo, launch, sprint review, or scripted video using Remotion and digitalsamba/claude-code-video-toolkit style workflows.
source: https://github.com/digitalsamba/claude-code-video-toolkit
source_commit: 9826feb491cffe18367e85f6f759bffcfb93d3da
license: MIT
---

# Video Toolkit Workflow

Create videos through a real production loop: brief, script, assets, timing, preview, render.

## Setup

```bash
git clone https://github.com/digitalsamba/claude-code-video-toolkit.git
cd claude-code-video-toolkit
claude
/setup
/video
```

Codex migration:

```bash
python3 scripts/migrate_to_codex.py --force
```

Requirements: Node.js 18+, Python 3.9+, optional FFmpeg, optional Modal/RunPod for GPU tools.

## Workflow

1. Capture brief: audience, goal, length, aspect ratio, style, must-show facts.
2. Choose a template. Use the closest existing template before making a new one.
3. Write scene list and narration.
4. Generate one voiceover MP3 per scene.
5. Generate image/video/music assets only where needed.
6. Sync each scene duration to `ceil(audio_duration + 2)`.
7. Render stills or preview. Review composition and text legibility.
8. Run design pass.
9. Render MP4.
10. Publish/export only if requested.

## Commands

Manual project:

```bash
cp -r templates/product-demo projects/PROJECT_NAME
cd projects/PROJECT_NAME
npm install
npm run studio
npm run render
```

Asset tools run from toolkit root:

```bash
python tools/voiceover.py --provider qwen3 --speaker Ryan --scene-dir public/audio/scenes --json
python tools/music_gen.py --preset corporate-bg --duration 120 --output music.mp3
python tools/flux2.py --preset title-bg --brand digital-samba --cloud modal --progress json
python tools/ltx2.py --prompt "A cinematic product shot" --cloud modal --progress json
```

## Rules

- Run Python asset tools from repo root.
- Run Remotion render commands from project dir.
- Use `--progress json` for cloud/GPU jobs.
- Keep long jobs observable; poll progress instead of detaching and forgetting.
- Prefer scene-level assets over one giant media file.
- For LTX/video clips, keep clips short, dimensions divisible by 64, and prompts specific.
- Validate with still-frame screenshots before final render.

## Avoid

- Do not generate every possible asset. Only generate what the storyboard needs.
- Do not make one long voiceover track unless the renderer requires it.
- Do not skip preview/still review; video bugs are expensive at render time.
- Do not add cloud GPU tools unless local/static assets fail the brief.
