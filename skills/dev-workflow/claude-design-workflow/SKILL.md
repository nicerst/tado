---
name: claude-design-workflow
description: Use when working in Claude Design (Anthropic's Opus-4.7-backed design surface) to build brand assets, websites, decks, app prototypes, or launch videos — and need to avoid burning through its separate weekly session limit. Triggers: "build this in Claude Design", "set up a design system", "I'm running out of Claude Design usage", "make a pitch deck/landing page/app prototype/launch video with Claude".
---

# Claude Design Workflow

Token-efficient procedure for taking a brand from zero to shipped assets (deck, site, app prototype, video) inside Claude Design without blowing the separate design-session quota.

**Orchestrated workflow:** spawn `Agent(subagent_type="cdw-brand-brief-writer")` for the pre-Claude-Design brand brief, `Agent(subagent_type="cdw-deliverable-outliner")` (once per deliverable) for structural/copy outlines, and `Agent(subagent_type="cdw-site-shipper")` for the export → repo → Vercel deploy pass — instead of running any of those inline. Use inline only for quick interactive/`/slash` use, and for the steps below that are human actions performed directly inside Claude Design.

This orchestrator owns: quota-awareness rules, the in-Claude-Design procedure steps (3, 5-10 — human actions in another tool, kept inline as guidance), model-switching advice, and the thread-reset rule. It delegates the three chat/local-workspace work products (brand brief, deliverable outlines, site shipping) to the subagents above.

## When to use / when NOT to use

Use for: brand creation, design systems, pitch decks, landing pages, mobile app prototypes, launch/promo videos, anything needing consistent visual identity across multiple deliverables.

Do NOT use Claude Design for: brainstorming/ideation (do it in regular Claude chat — same output, doesn't touch the design quota), a single static asset with no branding need, or a project where you're already fighting Claude on one small stuck element (fix it manually in Canva/Figma/PowerPoint instead — faster and free).

## Procedure

1. **Brainstorm — delegate, never in Claude Design.** Spawn `cdw-brand-brief-writer` to nail the brand concept, mission, audience, visual identity direction, color palette, and typography direction, exported as a markdown doc. This never touches the Claude Design quota.

2. **Build ONE design system before anything else — inline, human action in Claude Design.** In Claude Design → Design Systems → Create. Feed it: company name/blurb, existing logo/assets/GitHub repo/website if available, or the brand brief markdown from step 1 if starting fresh. Add a short notes field describing any missing feel (e.g. button style) you want it to infer.

3. **Review every generated element and give explicit feedback — inline, human action in Claude Design.** Logo often gets mangled by Claude Design — call this out specifically: "keep the logo pixel-exact, do not alter it." Approve/reject each component (buttons, cards, badges, type, color) before publishing.

4. **For each deliverable (deck, landing page, app, video) — delegate the outline.** Spawn `cdw-deliverable-outliner` once per deliverable to do the structural/copy planning (e.g. "give me a markdown outline for a pitch deck, don't build it yet"). Then paste that outline + the design system into a new Claude Design project.

5. **Before prompting a complex layout, draw a rough sketch — inline, human action.** Use Claude Design's sketch tool to show section placement (e.g. hero video left, text right, navbar). Attach it — cuts iteration cycles dramatically.

6. **Reference, don't describe — inline, human action in Claude Design.** Circle/highlight the exact element needing a change (draw tool) or click-select and edit it directly, rather than describing it in prose. Direct edits and the "tweaks" panel (auto-generated sliders/toggles for palette, texture, layout variants) cost far less than back-and-forth chat prompts.

7. **One visual change per prompt — inline, human action.** Bundling multiple big asks ("change X, Y, and Z") in one message means only 1-2 actually land well.

8. **Always state negatives up front — inline, human action.** ("no em dashes," "not that font," "don't recolor the logo") instead of correcting after the fact.

9. **Switch models by stage — inline advice.** Use Opus 4.7 for initial planning/first-pass generation and any real structural change (best vision, most expensive). Switch to Sonnet for minor iterations/tweaks once the direction is locked — it handles refinement fine at lower cost.

10. **When a project thread gets long, export and start fresh — inline rule.** Rather than continuing to iterate in the same thread — long threads risk context rot and token re-processing. Export as zip/HTML, open a new project, continue from there.

11. **To ship a static site — delegate.** Once a design is exported as a zip, spawn `cdw-site-shipper` to take it through extract → repo → Vercel deploy. Any further edits: iterate locally in Claude Code, push to GitHub, Vercel auto-redeploys.

12. **Check mobile responsiveness separately — handled by `cdw-site-shipper`.** Claude Design does not auto-optimize for mobile; the site-shipper subagent checks this explicitly and fixes broken mobile layout as part of its pass.

13. **Move off Claude Design once the visual system is locked — inline rule.** Take the exported design system/spec into Claude Code (or Figma/Canva/PowerPoint) for further iteration — this doesn't touch the Claude Design quota at all.

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
