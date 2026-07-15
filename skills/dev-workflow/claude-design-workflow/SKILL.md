---
name: claude-design-workflow
description: Use when working in Claude Design (Anthropic's Opus-4.7-backed design surface) to build brand assets, websites, decks, app prototypes, or launch videos — and need to avoid burning through its separate weekly session limit. Triggers: "build this in Claude Design", "set up a design system", "I'm running out of Claude Design usage", "make a pitch deck/landing page/app prototype/launch video with Claude".
---

# Claude Design Workflow

Token-efficient procedure for taking a brand from zero to shipped assets (deck, site, app prototype, video) inside Claude Design without blowing the separate design-session quota.

## When to use / when NOT to use

Use for: brand creation, design systems, pitch decks, landing pages, mobile app prototypes, launch/promo videos, anything needing consistent visual identity across multiple deliverables.

Do NOT use Claude Design for: brainstorming/ideation (do it in regular Claude chat — same output, doesn't touch the design quota), a single static asset with no branding need, or a project where you're already fighting Claude on one small stuck element (fix it manually in Canva/Figma/PowerPoint instead — faster and free).

## Procedure

1. **Brainstorm in regular Claude chat first, never in Claude Design.** Nail the brand concept, mission, audience, visual identity direction, color palette, typography direction. Export this as a markdown doc.
2. **Build ONE design system before anything else.** In Claude Design → Design Systems → Create. Feed it: company name/blurb, existing logo/assets/GitHub repo/website if you have them, or the brainstormed markdown doc if starting fresh. Add a short notes field describing any missing feel (e.g. button style) you want it to infer.
3. **Review every generated element in the design system and give explicit feedback** (logo often gets mangled by Claude Design — call this out specifically: "keep the logo pixel-exact, do not alter it"). Approve/reject each component (buttons, cards, badges, type, color) before publishing.
4. **For each deliverable (deck, landing page, app, video):** do the structural/copy planning in regular Claude chat first (e.g. "give me a markdown outline for a pitch deck, don't build it yet"), then paste that outline + the design system into a new Claude Design project.
5. **Before prompting a complex layout, draw a rough sketch** (Claude Design's sketch tool) showing section placement (e.g. hero video left, text right, navbar). Attach it — cuts iteration cycles dramatically.
6. **Reference, don't describe.** Circle/highlight the exact element needing a change (draw tool) or click-select and edit it directly, rather than describing it in prose. Direct edits and the "tweaks" panel (auto-generated sliders/toggles for palette, texture, layout variants) cost far less than back-and-forth chat prompts.
7. **One visual change per prompt.** Bundling multiple big asks ("change X, Y, and Z") in one message means only 1-2 actually land well.
8. **Always state negatives** ("no em dashes," "not that font," "don't recolor the logo") up front instead of correcting after the fact.
9. **Switch models by stage:** use Opus 4.7 for initial planning/first-pass generation and any real structural change (best vision, most expensive). Switch to Sonnet for minor iterations/tweaks once the direction is locked — it handles refinement fine at lower cost.
10. **When a project thread gets long, export and start fresh** rather than continuing to iterate in the same thread — long threads risk context rot and token re-processing. Export as zip/HTML, open a new project, continue from there.
11. **To ship a static site:** export the Claude Design project as a zip, extract into a project folder, open in Claude Code, have it push to a GitHub repo, then connect that repo to Vercel (import project → deploy). Any further edits: iterate locally in Claude Code, push to GitHub, Vercel auto-redeploys.
12. **Check mobile responsiveness separately** — Claude Design does not auto-optimize for mobile. Open dev tools mobile view locally before shipping; explicitly ask Claude Code to fix mobile layout if broken.
13. **Move off Claude Design once the visual system is locked.** Take the exported design system/spec into Claude Code (or Figma/Canva/PowerPoint) for further iteration — this doesn't touch the Claude Design quota at all.

## Rules / heuristics

- Claude Design has its OWN weekly quota, separate from regular chat/Code usage — check it before big builds.
- Design system creation is the most expensive single step; importing a GitHub repo/large codebase costs more than a markdown doc + a couple of images.
- A vague single-line note ("make buttons feel modern with a glow") is enough context if the design system already has strong bones — don't over-specify.
- The "tweaks" panel (auto-generated sliders after asking "give me a bunch of things I could tweak") is cheaper than repeated prompting and good for creative block.
- Logos are Claude Design's weakest spot — expect to correct them at least once per generated surface.
- Draw tool has been buggy in research preview (comment sometimes fails to attach) — if it doesn't work, fall back to direct element click-edit.
- No "undo" button exists yet — to revert a change, manually re-enter the prior value.
- File upload cap is roughly 30–40MB for video assets; splitting into shorter clips avoids rejection.
- For video/animation builds, use the Hyperframes skill/catalog (community-built HTML animation primitives) as a base rather than prompting motion from scratch — drop in its reference markdown once per animation project.
- For inspiration before prompting, pull from sites like motionsites.ai, Godly, Awwwards, or 21st.dev — copy their published prompts directly into Claude Design rather than describing the effect in your own words.

## Examples

- Design system creation prompt pattern: company name + blurb + optional GitHub repo/logo/assets + one note on missing feel (e.g. "buttons should have a slight glow, feel modern and polished").
- Landing page prompt pattern: attach a rough sketch + brand markdown + explicit hero layout instructions (e.g. "video background must render in the site's base color so it blends seamlessly; hero text on the left, video right").
- Launch video iteration prompt: "This is boring, make it fast-paced, tell a story, add more motion — we're announcing something big" got a materially better result than describing scenes literally.
- Deployment command sequence: Claude Code → "push this to a new private GitHub repo" → Vercel "Add New Project" → import repo → deploy → fix root/index.html path issues if 404 occurs.

---
Source: Claude Design masterclass transcript (YouTube, channel/title not specified in transcript)
