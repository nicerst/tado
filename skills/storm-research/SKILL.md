---
name: storm-research
description: "Multi-perspective AI research methodology inspired by Stanford STORM. Conducts a full 5-lens analysis (Practitioner, Academic, Skeptic, Economist, Historian), maps contradictions, synthesizes findings, runs adversarial peer review, verifies citations, scores reliability. Use when the user needs high-confidence research on any complex topic — strategic decisions, technology comparisons, market analysis, risk assessment."
trigger: /storm-research
version: 1.0.0
---

# Storm Research Framework

Structured debate over single-path reasoning. Builds research confidence through multiple expert perspectives, contradiction mapping, and adversarial verification.

> Core rule: Research quality comes from structured disagreement, not agreement.

---

## Relationship to Other Skills

- **Storm** = research + evidence synthesis (this skill)
- **[[the-council]]** = high-stakes decisions via 5 strategic advisors
- **[[loop-engineering]]** = Generator vs Evaluator principle applied to AI system design
- Pattern shared: never let the creator validate its own work.

---

## Invocation

| Invocation | What it does |
|---|---|
| `/storm-research <topic>` | Run full Storm pipeline on topic (default lenses) |
| `/storm-research <topic> --lenses <list>` | Replace default 5 lenses with custom personas |
| `/storm-research audit` | Re-run adversarial peer review on an existing report |

If no topic provided, ask: *"What topic should I research using the Storm framework?"*

---

## Default Five Expert Lenses

| Lens | Core Question | Focus |
|------|--------------|-------|
| Practitioner | "How does this work in practice?" | Real-world implementation, operational experience, best practices |
| Academic | "What does the evidence say?" | Research papers, scientific evidence, theoretical foundations |
| Skeptic | "Why might this be wrong?" | Weak assumptions, risks, biases, failure cases, counterarguments |
| Economist | "Is it economically worthwhile?" | ROI, cost, productivity, adoption, business impact |
| Historian | "Has something similar happened before?" | Historical trends, prior technologies, market evolution |

Each lens has blind spots. Together they produce a balanced view.

---

## Execution Pipeline

Execute these phases in order. Do not skip phases.

### Phase 1 — Scope Clarification

Before researching, confirm:
- What is the exact research question?
- Who is the audience?
- What format is required? (chat summary / full briefing / table / decision brief)
- Are custom lenses needed? (default 5 cover most cases)

For a clear, focused request: proceed immediately. For ambiguous requests: ask one clarifying question.

---

### Phase 2 — Five Independent Analyses

Research the topic from each lens **independently**, as if each expert has no knowledge of the others' findings.

For each lens produce:
- 3–5 key findings
- Supporting evidence or reasoning
- Explicit assumptions made
- Confidence in findings: High / Medium / Low

Structure each as:

```
## [Lens Name] Perspective

Findings:
1. [finding] — [confidence: H/M/L]
2. ...

Key assumptions: [list]
Evidence quality: [strong / moderate / weak]
```

---

### Phase 3 — Contradiction Mapping

Compare all five perspectives. Identify:
- Where do they **agree**? (reinforces confidence)
- Where do they **disagree**? (highest-value analysis zone)
- Which claims **lack evidence**?
- Which **assumptions conflict**?

Format:
```
## Contradictions

| Claim | Lens A says | Lens B says | Resolution |
|-------|------------|------------|-----------|
| ...   | ...        | ...        | Unresolved / Lens A stronger / Lens B stronger |
```

Contradictions are signal, not noise. Preserve them.

---

### Phase 4 — Evidence Synthesis

Merge all findings into one coherent report.

Rules:
- Combine complementary insights
- **Preserve important disagreements** — do not average opinions
- Highlight uncertainties explicitly
- Weight evidence by source quality

Output: unified narrative, not five concatenated summaries.

---

### Phase 5 — Adversarial Peer Review

The synthesized report undergoes a second validation pass.

Ask not: *"Is this correct?"*
Ask: *"Find everything that is wrong."*

Check:
- Do conclusions follow from evidence?
- Are any claims unsupported?
- Are citations verifiable?
- What is the strongest counterargument to the main thesis?
- What would a hostile reviewer object to?

Document findings. Update synthesis if needed.

---

### Phase 6 — Citation Verification

Classify every major claim:

| Status | Meaning |
|--------|---------|
| **Confirmed** | Evidence fully supports the claim |
| **Corrected** | Claim is partially correct, requires revision |
| **Demoted** | Claim lacks sufficient evidence or is overstated |

Remove or flag Demoted claims in the final report.

---

### Phase 7 — Reliability Scoring

Score each major finding:

| Score | Meaning |
|-------|---------|
| 9–10 | Strong evidence, high confidence — act on this |
| 7–8 | Good evidence, moderate confidence — verify before acting |
| 5–6 | Limited evidence — interpret cautiously |
| < 5 | Weak evidence — do not rely on this |

---

### Phase 8 — Missing Lens Analysis

After the default five, ask: *"Who is missing?"*

Consider whether the topic needs:
- Customer / end user
- Regulator / legal
- Frontline operator
- Security engineer
- Investor
- Domain specialist

If a missing lens would materially change conclusions: flag it. Optionally run a 6th analysis.

---

### Phase 9 — Final Report

Produce the structured output:

```
# Storm Research Report: [Topic]

## Executive Summary
[2–3 sentences: main finding + confidence level]

## 60-Second Briefing
[4–6 bullets: what the reader needs to know]

## Key Findings
[Numbered list with reliability scores]

## Perspective Summaries
[One paragraph per lens]

## Contradictions
[Table from Phase 3]

## Risks & Assumptions
[What could make this analysis wrong]

## Missing Perspectives
[Who was not consulted — flag if material]

## Practical Recommendations
[Actionable steps, prioritized]

## Citation Verification Log
[Confirmed / Corrected / Demoted list]
```

---

## Customizing Lenses

Replace or add lenses for domain-specific research:

**Business:** CEO, Consultant, Product Manager, Investor
**Technology:** Software Architect, Security Engineer, DevOps Engineer, AI Researcher
**Finance:** Risk Analyst, Accountant, Economist
**Payments/FinTech:** Regulator, Merchant, Fraud Analyst, Payment Network
**Healthcare:** Physician, Nurse, Regulator

Syntax: `/storm-research <topic> --lenses "Regulator, Fraud Analyst, Merchant, Economist, Historian"`

---

## When to Use Storm

**Good fit:**
- Strategic decisions where single-perspective bias is a real risk
- Technology comparisons (framework / architecture / vendor)
- Market analysis, competitive research
- Risk assessment, fraud analysis (Skeptic lens especially valuable)
- Executive briefings requiring explicit confidence levels

**Not needed:**
- Quick factual lookups
- Simple implementation tasks
- Well-documented, low-ambiguity topics

---

## Engineering Principles

- Independent perspectives outperform single-path reasoning
- Contradictions improve understanding — they are not failures
- Verification is more valuable than additional generation
- Preserve uncertainty instead of collapsing it to a single answer
- Every report ends with actionable recommendations, not just information
- Confidence should always be communicated explicitly
