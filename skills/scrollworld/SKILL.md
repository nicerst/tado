---
name: scrollworld
description: Build a premium scroll-animated website from coherent AI image/video scenes. Use when asked for "/scrollworld", "scroll animation site", "cinematic scroll website", or a Higsfield-backed video-frame scrolling landing page.
---

# Scrollworld

Create a smooth scroll-driven website by chaining AI-generated scene videos into frame-scrubbed sections.

## When to use / when NOT to use

Use this when the user wants a visual, premium, scroll-animated web experience built from multiple coherent generated scenes.

Use it for product sites, travel brands, brand stories, launch pages, and other pages where visual spectacle matters.

Do not use it for ordinary CRUD apps, dashboards, text-heavy docs, low-budget static pages, or work where generated video assets are unnecessary.

## Procedure

1. Interview the user for the site subject, audience, desired art direction, and any scene ideas they already have.
2. If the user does not know the style, ask concise creative direction questions before generating anything.
3. Pick a budget tier before asset generation:
   - Lean: 3-4 scenes.
   - Premium: 5-6 scenes.
   - Mobile-light: crop-safe desktop assets.
   - Mobile-premium: generate a separate portrait chain.
4. Propose the scroll journey as numbered scenes. For each scene, state the visual setting, motion beat, and transition intent into the next scene.
5. Estimate generation count before approval: one anchor image per scene, one video per scene, plus connector or crossfade generations where needed.
6. Generate the first anchor image before videos. Treat this as the visual source of truth for the whole chain.
7. Ask the user to approve or revise the anchor image. Do not generate the full video chain until the anchor direction is accepted.
8. Generate later scene anchors using prior approved frames as visual references so the story stays coherent.
9. Confirm Higsfield MCP or CLI is connected and authenticated before video generation.
10. Generate scene videos through Higsfield MCP or CLI. Use GPT image 2 for still images where available, and Seed Dance or the selected video model for motion.
11. If the coding agent has native image generation, use it for still images and reserve Higsfield for video.
12. Extract frames from each generated video with `ffmpeg`.
13. Map scroll position to extracted frames so scrolling scrubs through the video sequence.
14. Stitch scenes with deliberate connector videos, crossfades, zooms, push-throughs, unfolding motions, or match cuts.
15. Build the page around the scroll canvas first, then overlay normal website content such as headings, copy, calls to action, and forms.
16. Optimize mobile explicitly:
   - At minimum, crop-safe all key subjects.
   - For high-end mobile, generate portrait-specific videos.
17. Run the local site and inspect the scroll path end to end. Look for hard cuts, jank, blank frames, slow frame loading, and mobile crop failures.
18. Revise weak transitions before polishing copy. The technique succeeds or fails on scene continuity.

## Rules / heuristics

- Nail the first anchor image. If it is wrong, every downstream scene inherits the wrong art direction.
- Four scenes is usually the sweet spot for cost and quality.
- Six scenes can look premium but may be overkill and costs substantially more credits.
- Expect roughly one image and one video generation per scene, plus connector generations between scenes.
- A full six-scene build can consume hundreds of Higsfield credits; warn the user before committing.
- Do not rely on hard cuts unless the user explicitly wants an editorial cut.
- Prefer transitions where one scene visually becomes the next: objects push out, open, unfold, zoom through, blur into depth, or match shape.
- Keep text and CTAs separate from the core animation work; the scroll animation is the hard part, normal site conversion elements can be layered afterward.
- Generated scenes must reference each other. Independent scenes usually feel incoherent when stitched.
- Do not create all videos in one blind pass. Use approval gates for the anchor and, when budget allows, for key scene frames.

## Examples

Prompt pattern:

```text
/scrollworld
I'm creating a website for a boutique Japan travel brand. Use an origami-inspired art direction. Start lean: four scenes and crop-safe mobile.
```

Journey pattern:

```text
Scene 1: travelers enter an origami city.
Scene 2: subway motion carries the viewer forward.
Scene 3: a house unfolds into lodging.
Scene 4: a bird lifts into the final booking moment.
```

---
Source: unnamed Scrollworld demo transcript — unknown channel
