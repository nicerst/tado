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
| `/ai-ui-design audit` | Run AI smell check on an existing UI — returns diagnosis + punch list |
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

### Step 1 — Collect Inspiration

Gather references **before** asking AI to design anything.

**Sources:**
- **X / Twitter** — bookmark landing pages, dashboards, hero sections, card designs, animation references
- **Mobbin** — mobile apps, SaaS dashboards, onboarding flows, empty states, pricing pages
- **Reference sites** — Linear, Vercel, Stripe, Arc Browser, Notion, Raycast (study structure, not pixels)

**Goal:** Know what visual territory you want to occupy before generating. Inspiration → direction → constraints.

Do not copy. Extract the DNA: macrostructure, type rhythm, color mood, density.

---

### Step 2 — Generate Design System

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

### Step 3 — Generate Components

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

### Step 4 — Refine

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

**Finalize the Design System before development begins.** Decisions made here propagate everywhere.

---

### Step 5 — Export to Claude Code

Export the finalized design system from Claude Design.

**What to transfer:**
- CSS custom properties (design tokens)
- Typography definitions
- Spacing scale
- Component HTML/CSS/JSX as reference
- Design guidelines (do / don't rules)

**In Claude Code, set context:**
```
Import the attached design system into this project.

Strictly follow the design tokens, components, spacing, typography, and interaction patterns.
Do not invent new styles. If a needed component doesn't exist in the design system, 
flag it and ask before inventing styles.
```

---

### Step 6 — Build Application Pages

**Tool:** Claude Code

**Prompt to use:**
```
Using the imported design system, build the following pages:

- [Page 1: e.g., Landing page]
- [Page 2: e.g., Dashboard]
- [Page 3: e.g., Settings]

Rules:
- Use design tokens for every color, spacing, radius, and shadow value
- Reuse existing components — do not create new component variants without flagging
- Match the visual density and rhythm of the design system
- Every page should feel like it belongs to the same application
```

---

### Step 7 — Enhance with UI Libraries

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

## Audit Mode

When user invokes `audit` or describes an existing UI, run this checklist:

**AI Smell Scan:**
```
❌ FAILING / ✅ PASSING / ⚠ BORDERLINE

[ ] Consistent border radius across all components
[ ] Consistent spacing rhythm (evidence of spacing scale)
[ ] Single cohesive color palette (no random hex values)
[ ] Typography hierarchy (clear display / heading / body distinction)
[ ] Dashboard matches landing page visual language
[ ] All buttons same visual style (primary/secondary/ghost system)
[ ] No gradient text on headings
[ ] No glassmorphism as default treatment
[ ] No identical card grids for non-list content
[ ] No eyebrow text on every section
[ ] Hover / focus states defined for interactive elements
[ ] Empty states designed (not just blank space)
```

Output:
1. AI Smell Score: [X/12 checks passing]
2. Critical failures (fix first)
3. Secondary issues
4. Root cause: missing design system / missing tokens / component drift

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
