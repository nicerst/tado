---
name: frontend
description: "Production-quality frontend implementation: brief inference, dial calibration, animation framework (Emil Kowalski), anti-slop enforcement (Impeccable + Taste Skill), GSAP skeletons. Use when building, animating, polishing, or auditing any frontend UI. Complements hallmark (design system) — this skill handles implementation quality."
version: 1.0.0
---

# Frontend Skill

Production frontend implementation. No slop, no lazy animations, no default aesthetics.

Synthesized from three sources:
- **Emil Kowalski** — animation decision framework, easing curves, GPU rules, Framer Motion patterns
- **Impeccable** — 23-command design system, anti-slop rules, absolute bans
- **Taste Skill** — brief inference, three dials, GSAP skeletons, redesign audit protocol

**Relationship to hallmark:** hallmark generates design systems (themes, macrostructures, tokens). This skill enforces implementation quality on top of any design system — animation correctness, anti-slop at code level, brief-specific decisions.

---

## Commands

| Command | What it does |
|---------|-------------|
| `/frontend` | Default: run brief inference → set dials → implement |
| `/frontend animate <target>` | Add proper animation to element or component |
| `/frontend craft <target>` | Polish pass: spacing, type, micro-interactions |
| `/frontend audit <target>` | Slop audit + animation quality check → ranked punch list |
| `/frontend polish <target>` | Remove slop, add craft to existing code |
| `/frontend check` | Quick slop test + animation check, no edits |

If no command given, run default (brief inference → implement).

---

## Step 0 — Brief Inference (always first, never skip)

Before touching code, output one **Design Read** line:

```
[Page kind] for [audience] — [primary vibe] with [key constraint if any]
```

Examples:
- `SaaS landing for B2B procurement — credible/serious with WCAG AA required`
- `Portfolio for senior product designers — editorial/premium with subtle motion`
- `Agency landing for fintech startup — modern/confident with minimal copy density`

If you cannot write this line, you don't know enough about the brief. Ask one question.

**Six signal types to extract:**

| Signal | What to extract |
|--------|-----------------|
| Page kind | landing / portfolio / redesign / editorial / dashboard |
| Vibe words | minimalist, Linear-style, Awwwards, brutalist, premium consumer, Apple-y, atmospheric |
| Reference signals | URLs, screenshots, brand names |
| Audience | B2B procurement / design-conscious consumer / developer / recruiter |
| Brand assets | Existing logo, palette, typefaces — do NOT override |
| Quiet constraints | Accessibility, regulated industry, trust-first — these OVERRIDE aesthetic preference |

**Category reflex check after writing the Design Read:**
> "Does this aesthetic feel like the first training-data answer for this domain?"

If yes → rework the color and scene strategy before writing code.

---

## Step 1 — Dial Calibration

Set three dials (1–10 each) before generating. State them out loud.

| Dial | 1–3 | 4–6 | 7–10 |
|------|-----|-----|------|
| **DESIGN_VARIANCE** | Centered, symmetric, safe | Moderate with intentional breaks | Asymmetric, experimental, overlapping |
| **MOTION_INTENSITY** | Hover transitions only | Scroll reveals, element transitions | Magnetic hover, parallax, GSAP sequences |
| **VISUAL_DENSITY** | Spacious, single focal point | Standard content blocks | Dense, multi-column, dashboard |

**Inference table:**

| Brief signal | VARIANCE | MOTION | DENSITY |
|---|---|---|---|
| "Apple-y", "premium consumer" | 4 | 6 | 2 |
| "Linear-style", "minimalist B2B" | 3 | 3 | 4 |
| "Awwwards", "agency" | 8 | 8 | 3 |
| "Brutalist", "editorial" | 9 | 4 | 6 |
| "Dashboard", "SaaS app" | 2 | 2 | 8 |
| "Calm", "portfolio" | 3 | 5 | 3 |

**Hard constraints:**
- MOTION ≥ 7 → always include `@media (prefers-reduced-motion: reduce)`
- VARIANCE ≥ 8 → verify quiet constraints aren't violated (accessibility, regulated industry)
- DENSITY ≥ 8 → requires clear typographic hierarchy or it becomes unusable

---

## Animation Decision Framework

### Gate every animation before writing it

1. **Purpose gate** — does this motion serve a function? (guide attention, show state change, communicate relationship) If no function → don't animate.
2. **Frequency gate** — triggered 100+ times/day → never animate. Triggered < 5 times/day → can animate.
3. **Duration gate** — UI elements: 150–200ms. Modals/overlays: 200–250ms. Page transitions: 300–400ms. Never > 500ms on UI.

### Easing — use these exact values

```css
--ease-out:     cubic-bezier(0.23, 1, 0.32, 1);     /* entrances, reveals */
--ease-in-out:  cubic-bezier(0.77, 0, 0.175, 1);    /* exits, state changes */
--ease-drawer:  cubic-bezier(0.32, 0.72, 0, 1);     /* drawers, sheets, panels */
```

Never use CSS default `ease`. Never bounce/overshoot on content UI animations.

### GPU-only rule

**Animate only `transform` and `opacity`.** Never animate `width`, `height`, `top`, `left`, `margin`, `padding` — these trigger layout reflow and cause jank.

**Framer Motion gotcha — `x`/`y` shorthand is NOT hardware accelerated:**

```jsx
// Wrong — triggers layout
animate={{ x: 100 }}

// Correct — GPU accelerated
animate={{ transform: "translateX(100px)" }}
```

### Component patterns

**Hover lift:**
```css
.card { transition: transform 200ms var(--ease-out, cubic-bezier(0.23, 1, 0.32, 1)); }
.card:hover { transform: translateY(-4px); }
```

**Presence (Framer Motion):**
```jsx
<AnimatePresence>
  <motion.div
    initial={{ opacity: 0, transform: "translateY(8px)" }}
    animate={{ opacity: 1, transform: "translateY(0)" }}
    exit={{ opacity: 0, transform: "translateY(-8px)" }}
    transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
  />
</AnimatePresence>
```

**Spring — drag and gesture only (bounce 0.1–0.3):**
```jsx
transition={{ type: "spring", bounce: 0.2 }}
```

**CSS entry without JS (`@starting-style`):**
```css
.toast {
  transition: opacity 0.2s, transform 0.2s cubic-bezier(0.23, 1, 0.32, 1);
}
@starting-style {
  .toast { opacity: 0; transform: translateY(8px); }
}
```

**WAAPI — programmatic, CSS performance:**
```js
el.animate(
  [
    { opacity: 0, transform: "translateY(8px)" },
    { opacity: 1, transform: "translateY(0)" }
  ],
  { duration: 150, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" }
);
```

**clip-path reveals:**
```css
/* Text reveal */
.word { clip-path: inset(0 100% 0 0); transition: clip-path 0.4s cubic-bezier(0.23, 1, 0.32, 1); }
.word.visible { clip-path: inset(0 0% 0 0); }

/* Hold-to-delete progress bar */
.btn-delete::after {
  clip-path: inset(0 calc(100% - var(--progress, 0%) * 1%) 0 0 round 4px);
}
```

### GSAP skeletons by MOTION dial

**Low (1–4): CSS hover only**
```css
.card:hover { transform: translateY(-4px); transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1); }
```

**Medium (5–7): scroll-triggered reveal**
```js
gsap.from(".hero-text", {
  scrollTrigger: { trigger: ".hero", start: "top 80%" },
  y: 40, opacity: 0, duration: 0.8, ease: "power3.out"
});
```

**High (8–10): stagger + magnetic hover**
```js
// Staggered list reveal
gsap.from(".card", {
  y: 24, opacity: 0, duration: 0.6, ease: "power2.out", stagger: 0.08
});

// Magnetic hover — elastic.out is OK here (decorative interaction, not content UI)
el.addEventListener("mousemove", (e) => {
  const { left, top, width, height } = el.getBoundingClientRect();
  gsap.to(el, {
    x: (e.clientX - left - width / 2) * 0.3,
    y: (e.clientY - top - height / 2) * 0.3,
    duration: 0.4, ease: "power2.out"
  });
});
el.addEventListener("mouseleave", () =>
  gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" })
);
```

---

## Anti-Slop Rules

### The AI slop test

> If someone could look at this and say "AI made that" without doubt — it failed.

**First-order:** Can they guess theme + palette from category alone? (SaaS → cream background + Inter + purple gradient) → rework.

**Second-order:** Can they guess aesthetic family from category + anti-references? → rework until neither answer is obvious.

### Classic slop stack — 4+ present = fail

- Cream/warm-neutral background
- Inter font + blue-to-purple gradient text
- Icon-grid: heading + description repeated 3–6×
- Soft `box-shadow` on every card
- Section fade-in on every scroll trigger
- Eyebrow caps above every section heading
- 3 metric cards at top of page

### Absolute bans

| Ban | Instead |
|-----|---------|
| `border-left` accent stripe (> 1px as decoration) | Full borders, bg tints, leading numbers/icons |
| Gradient text (`background-clip: text` + gradient) | Solid color; emphasis via weight or size |
| Glassmorphism as default | Rare and purposeful only |
| Hero-metric template (big number + label + stats + gradient) | Earn contextually |
| Identical card grid as default structure | Vary structure; cards only when best affordance |
| Eyebrow on every section | One named kicker as deliberate brand system |
| Numbered section markers as default ("01 · About") | Only when content IS a real sequence |
| Text overflow (large heading + narrow grid) | Test at every breakpoint |

### Codex bans

| Ban | Rule |
|-----|------|
| Ghost-card | `border: 1px solid X` + `box-shadow blur ≥ 16px` on same element — pick one |
| Over-rounding | `border-radius ≥ 32px` on cards/sections/inputs — cards top at 12–16px |
| Sketchy SVG | `feTurbulence` / `feDisplacementMap` / crude hand-drawn scenes |
| Stripe backgrounds | `repeating-linear-gradient()` = pure decoration |
| "X theater" copy | "productivity theater", "engagement theater" — instant AI tell |

### Anti-cream rule (OKLCH)

OKLCH L 0.84–0.97, C < 0.06, hue 40–100 = cream/sand/paper regardless of token name.

**Don't default to warm-tinted background.** Brand warmth = accent + type + imagery, NOT body background.

---

## Typography Rules

- Body line length: **65–75ch** — wider is uncomfortable
- Font-family cap: **≤ 3**
- Hero display: **≤ 6rem** (use `clamp`)
- Letter-spacing on display: **≤ -0.04em** (negative tightening, not loose tracking)
- `text-wrap: balance` on **h1–h3**
- No default Inter without brief justification
- No purple-to-blue gradient text

---

## Copy Rules

**Ban these words:** streamline / empower / supercharge / leverage / unleash / transform / seamless / world-class / enterprise-grade / next-generation / cutting-edge / game-changer

**Ban these patterns:**
- Em dashes — use commas, colons, semicolons, or periods
- Aphoristic cadence: "X matters. We get that." — pattern slop
- Button labels that don't say what they do: "OK" vs "Save changes"
- Link text without standalone meaning: "Click here" vs "View pricing plans"

---

## Redesign Audit Protocol

6-step sequence for auditing existing UI:

1. **Capture** — screenshot or read current code; document section-by-section what exists
2. **Slop** — run AI slop test; mark every fail with rule reference
3. **Brand anchors** — identify what is locked (logo, brand color, typeface) vs. free to change
4. **Score** — rate each section: pass / minor slop / major slop
5. **Queue** — list changes in order of visual impact: typography → color → layout → motion
6. **Increment** — apply one section at a time; re-score after each change

---

## Pre-flight Checklist

**Before generating any code:**
- [ ] Design Read written
- [ ] Category reflex checked (is this the obvious training-data answer?)
- [ ] Dials set (VARIANCE / MOTION / DENSITY)
- [ ] Existing brand assets identified — do not override
- [ ] Quiet constraints checked (accessibility, compliance, audience)
- [ ] Framework/stack confirmed (React, Vue, vanilla, Tailwind, GSAP, etc.)

**Before shipping any code:**
- [ ] Slop test passed — no 4+ classic slop stack items
- [ ] Absolute bans clear — no gradient text, no ghost-card, no eyebrow-every-section
- [ ] Animations: only `transform` + `opacity`, proper easing, duration ≤ 500ms on UI
- [ ] `prefers-reduced-motion` handled (required if MOTION ≥ 4)
- [ ] Typography: body 65–75ch, hero ≤ 6rem, ≤ 3 font families
- [ ] No cream background unless brief demands warmth AND slop test still passes

---

## Accessibility Non-negotiables

- `prefers-reduced-motion: reduce` → collapse all spatial motion to ≤ 150ms opacity fade
- `:focus-visible` ring: ≥ 3:1 contrast, **instant** (never transition the ring's appearance)
- Touch targets: ≥ 44px × 44px
- Body text contrast: ≥ 4.5:1 (WCAG AA)
- No animation on hover-only states without keyboard equivalent

---

## Wiki Reference

Core concepts documented in the vault:
- `wiki/concept-animation-framework.md` — full animation decision tree + component patterns
- `wiki/concept-frontend-anti-slop.md` — complete slop rules, bans, anti-cream
- `wiki/concept-brief-inference.md` — Design Read format, six signals, quiet constraints
- `wiki/concept-design-dials.md` — three dials, GSAP skeletons by motion level
