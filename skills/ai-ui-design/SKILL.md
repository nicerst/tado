---
name: ai-ui-design
description: "7-step workflow for AI-generated UIs: design system first, pages second. Guides through inspiration → Claude Design → components → refine → export → Claude Code → UI libraries. Includes AI smell audit mode for existing UIs. Use when building a new UI with AI, adding new pages to an existing app, or auditing why a UI looks AI-generated."
trigger: /ai-ui-design
version: 1.0.0
---

# AI UI Design Workflow

AI is good at implementing designs. It is inconsistent at inventing them.

The fix is not better prompting. The fix is a Design System built first, then all pages generated from it.

> Don't ask AI to design pages. Ask AI to design a design system, then build pages from it.

**Orchestrated workflow:** spawn `Agent(subagent_type="uiux-smell-auditor")` for audit mode, `Agent(subagent_type="uiux-token-importer")` for step 5's design-system import, and `Agent(subagent_type="uiux-page-builder")` (one call per page) for step 6's page builds — instead of running any of those inline. Use inline only for quick interactive/`/slash` use, and for steps 1-4 and 7, which happen in Claude Design/guidance form with the human directly.

This orchestrator owns: invocation routing (`/ai-ui-design`, `audit`, `step <N>`), the opening context question, steps 1-4 (which happen in Claude Design with the human — the orchestrator supplies the exact prompts below), and step 7 library guidance. It delegates steps 5, 6 (codebase-touching work), and audit mode to the subagents above.

---

## Relationship to Other Skills

- **AI UI Design** = upstream process: design system creation (this skill)
- **[[hallmark]]** = visual quality, anti-slop enforcement, structural variety, theme selection
- **[[frontend]]** = implementation quality: GPU animations, easing, Framer Motion, component patterns
- Sequence: ai-ui-design (process) → hallmark (design quality check) → frontend (implementation quality)

---

## Invocation

| Invocation | What it does |
|---|---|
| `/ai-ui-design` | Guide through 7-step workflow (new build or missing design system) |
| `/ai-ui-design audit` | Spawn `uiux-smell-auditor` on the existing UI — returns diagnosis + punch list |
| `/ai-ui-design step <N>` | Jump to a specific step (e.g., `step 6` to get the build-application prompt) |

If no context provided, ask: *"Are you building a new UI, adding pages to an existing app, or auditing an existing UI for AI smell?"*

---

## Why Design System First

Without it, AI invents styles per prompt:

| Problem | Cause |
|---------|-------|
| Different border radius everywhere | No `radius` token |
| Random padding values | No spacing scale |
| Inconsistent typography | No type system |
| Dashboard ≠ homepage | No shared component library |
| Multiple button styles | No button spec |

With a Design System, changing `color-primary` updates buttons, cards, badges, inputs, links, and icons automatically. One change, whole system.

---

## The 7-Step Workflow

### Step 1 — Collect Inspiration (inline — human's own research)

Gather references **before** asking AI to design anything.

**Sources:**
- **X / Twitter** — bookmark landing pages, dashboards, hero sections, card designs, animation references
- **Mobbin** — mobile apps, SaaS dashboards, onboarding flows, empty states, pricing pages
- **Reference sites** — Linear, Vercel, Stripe, Arc Browser, Notion, Raycast (study structure, not pixels)

**Goal:** Know what visual territory you want to occupy before generating. Inspiration → direction → constraints.

Do not copy. Extract the DNA: macrostructure, type rhythm, color mood, density.

**No inspiration?** Use a published design.md as the foundation layer (e.g., `vercel.com/design.md`, light or dark variant) — paste it into Claude Design with "build me a design system using the attached design.md" — then tweak until it's yours. A foundation to build on, not to copy.

---

### Step 2 — Generate Design System (inline — happens in Claude Design)

**Tool:** Claude Design (claude.ai/design)

**Input:** Attach the best reference screenshot or describe the aesthetic direction.

**Prompt to use:**
```
Create a complete design system using the attached screenshot as inspiration.

Include:
- Color palette (primary, secondary, surface, text, destructive, success, warning)
- Typography scale (display, heading, body, caption — font family, weights, sizes, line-height)
- Spacing scale (4px base — xs, sm, md, lg, xl, 2xl)
- Border radius scale (none, sm, md, lg, full)
- Elevation system (shadow levels 1–4)
- Design tokens (CSS custom properties)
- Semantic colors (background, foreground, border, muted, accent)
- Core components: buttons (primary, secondary, ghost, destructive), inputs, badges, cards

Display everything on a single page.

The goal is not to copy the reference exactly but to capture its visual language
while producing a reusable, production-ready design system.
```

---

### Step 3 — Generate Components (inline — happens in Claude Design)

**Tool:** Claude Design (continuing the conversation)

**Prompt to use:**
```
Using the existing design system, generate all missing production UI components.

Include:
- Forms (text input, select, checkbox, radio, textarea, file upload)
- Navigation (topnav, sidebar, tabs, breadcrumbs, pagination)
- Feedback (alerts, toasts, progress, empty states, error states, loading skeletons)
- Overlay (modals, drawers, dropdowns, tooltips, popovers)
- Data display (tables, lists, stat cards, charts placeholder)

Maintain complete visual consistency with the design system.
Include accessibility considerations and reusable size variants (sm / md / lg).
```

**Goal:** Complete the entire UI vocabulary before writing a single line of code.

---

### Step 4 — Refine (inline — happens in Claude Design)

**Do NOT accept the first AI output.** This step is mandatory.

**Refinement prompt:**
```
Review the design system critically.

Identify and fix:
- Inconsistencies between components
- Weak typography hierarchy
- Poor spacing rhythm
- Unbalanced color usage
- Misaligned components
- AI-looking patterns (gradient text, identical card grids, eyebrow on every section)
- Missing states (hover, focus, disabled, error)

Suggest specific improvements and update the design system accordingly.
```

**AI smell checklist — reject if any apply:**
- [ ] Different border radius across components
- [ ] Gradient text on headings
- [ ] Blue-to-purple color scheme without brief justification
- [ ] Eyebrow text above every section heading
- [ ] Identical card grid used for non-list content
- [ ] All sections use same fade-in animation
- [ ] Dashboard doesn't visually match the landing page

**Refinement technique — markup:** in Claude Design, use the markup tool to draw directly on the offending elements, then instruct ("remove this from the design system", "fix the alignment of the text in this badge"). Pointing beats describing.

Expect no 1:1 match with the reference screenshot — AI can't do pixel-faithful capture. It gives you a canvas to tweak; that's the point.

**Finalize the Design System before development begins.** Decisions made here propagate everywhere. Once ported to Claude Code, never tweak the design system downstream — change it in Claude Design, re-export, so one fix propagates everywhere.

---

### Step 5 — Export to Claude Code (delegate)

Export the finalized design system from Claude Design.

**Fastest path:** Claude Design → Share → "Send to Claude Code" — copies a prompt that makes Claude Code pull the project via the Claude Design MCP (design system, tokens, components, metadata) directly. Manual transfer below as fallback.

**What to transfer:**
- CSS custom properties (design tokens)
- Typography definitions
- Spacing scale
- Component HTML/CSS/JSX as reference
- Design guidelines (do / don't rules)

Spawn `uiux-token-importer` with the exported design system and the target project path. It imports tokens/typography/components without inventing styles, and flags any missing component instead of improvising — review its reported gaps with the user before proceeding to step 6.

---

### Step 6 — Build Application Pages (delegate, one call per page)

For each page in the target list, spawn `uiux-page-builder` with: the page name, the imported design system location (from step 5's output), and any page-specific content. Rules it enforces:

- Use design tokens for every color, spacing, radius, and shadow value
- Reuse existing components — do not create new component variants without flagging
- Match the visual density and rhythm of the design system
- Every page should feel like it belongs to the same application

Collect and present any token/component gaps each page build reports back to the user before moving to the next page.

---

### Step 7 — Enhance with UI Libraries (inline guidance)

After the foundation is consistent, add interaction polish.

**Libraries:**
| Library | Best for |
|---------|----------|
| shadcn/ui | Base components (accessible, unstyled, composable) |
| Motion Primitives | Declarative animations, Framer Motion wrappers |
| Magic UI | Animated marketing components |
| Aceternity UI | Complex animated sections |
| Origin UI | Form-heavy applications |

**Important:** Style all library components to match your design system tokens. Never let a library override your token layer.

---

## Audit Mode (delegate)

When user invokes `audit` or describes an existing UI, spawn `uiux-smell-auditor` with the codebase path(s). It runs the 12-check AI Smell Scan and returns:

1. AI Smell Score: [X/12 checks passing]
2. Critical failures (fix first)
3. Secondary issues
4. Root cause: missing design system / missing tokens / component drift

Present this diagnosis to the user as the punch list; do not re-derive it inline.

---

## Engineering Principles

- Design systems scale; individual pages do not
- Tokens are the contract between design and implementation
- Consistency is more valuable than originality
- Build foundations before features
- Treat the Design System as code — version it, don't reinvent it per prompt
- AI should consume a Design System, not invent one per prompt
- Refine once, benefit everywhere
- Inspiration accelerates quality; copy nothing, extract everything
