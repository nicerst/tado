---
name: claude-code-website-hacks
description: Five-hack workflow for building professional, on-brand websites/landing pages with Claude Code instead of generic AI-vibe-coded output — CLAUDE.md prereq, front-end design skill, screenshot iteration loop, inspiration-site cloning, component-level inspiration, then GitHub→Vercel deploy. Use when user says "build me a landing page", "make this look less AI-vibe-coded", "clone this website's design", or "deploy my Claude Code site".
---

# Claude Code Website Hacks

Turn Claude Code website output from generic "AI vibe-coded" into professional, branded, deployed sites.

## When to use / when NOT to use

Use for landing pages, marketing sites, or any front-end build where visual polish and brand match matter.

Don't use for backend-only work, or when a design system already exists and Claude Design (a separate token-first tool) is the better fit — this is the fast, Claude-Code-native path, not a design-system methodology.

## Procedure

0. **CLAUDE.md prerequisite.** Before any front-end code, put project rules in CLAUDE.md, including: "Always invoke the front-end design skill before writing any front-end code, every session, no exceptions." Keep it concise — rules, not bloat. Also note any asset folders (e.g. `brand_assets/`) Claude should check for logo/brand guidelines. Revisit and update CLAUDE.md as the project reveals more of its own process, even after starting the other hacks.

1. **Hack 1 — Front-end design skill.** Install a front-end-design skill globally so every build defaults to modern, professional styling instead of generic output. Drop brand assets (logo, brand guidelines) into a project folder (e.g. `brand_assets/`) and reference them with `@` in the prompt, or rely on CLAUDE.md pointing Claude there automatically. A one-sentence prompt ("build me a modern landing page for X") is enough once the skill + assets are in place.

2. **Hack 2 — Screenshot loop.** Set up Puppeteer (ask Claude Code to do it, referencing the CLAUDE.md screenshot-workflow section) so Claude takes its own screenshots of the built site, compares against intent/reference, and self-corrects in 2+ passes before handing back — closing the gap between "AI got you 60% there" and a finished page without manual round-trips. Tell it explicitly to skip the screenshot tool for dynamic/animated elements — animated backgrounds break screenshot comparison and can trap Claude in an over-engineering retry loop.

3. **Hack 3 — Clone a reference site.** Pick inspiration (Dribbble, Godly, Awwwards, or any site you like). Capture a full-page screenshot (Chrome DevTools → Console → Cmd/Ctrl+Shift+P → "screenshot" → full size) and copy the computed styles from Elements → Styles. Give Claude both the screenshot and the style dump, and ask it to clone the site on localhost. Once cloned, layer in your own brand assets/colors/logo/copy as a separate follow-up prompt.

4. **Hack 4 — Individual component inspiration.** For final polish, pull individual components (buttons, backgrounds, shaders, hero sections) from a component library like 21st.dev rather than cloning whole sites — copy the component's prompt/code snippet and ask Claude to work it into a specific named section (e.g. "the background behind the hero text"). Iterate with plain-language feedback (too distracting, wrong color, needs more contrast) rather than trying to over-specify up front.

5. **Deploy — GitHub → Vercel pipeline.** Create a GitHub repo (or have Claude Code create it), push the project, then create a Vercel project importing that same repo — this wires an auto-deploy: push to GitHub → Vercel picks it up → live site updates. In CLAUDE.md, state the rule explicitly: test on localhost only, never push to GitHub until told to. Add a custom domain later via Vercel project settings → Domains.

## Rules / heuristics

- Never let AI-generated sensitive info (API keys, credentials, webhooks) get pushed to a public GitHub repo — confirm what's in a commit before pushing.
- Bypass-permissions mode speeds this workflow up (no per-step confirmation) but only use it while actively watching the session, not for unattended overnight runs.
- Tell Claude Code to clean up or clearly name the `temporary_screenshots` folder if you'll need to click through and compare specific iterations yourself — by default the naming is only useful to Claude, not you.
- Give feedback in the same plain, specific language you'd give a human designer ("this feels distracting," "make that button glow") — the model doesn't need over-engineered prompts once the skill + assets are already loaded.
- Big builds (fresh site, full clone) take longer; once a working version exists, small tweaks are fast — batch your feedback accordingly.

---
Source: "Claude Code for Normal People (6 Hour Course)" — Nate Herk | AI Automation
