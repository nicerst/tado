---
name: vapt-init
description: >
  Security baseline bootstrap for a project. Runs a scoped vulnerability
  assessment, adds DX≈AX and ponytail-debt signals, applies maker-checker for
  serious findings, produces a STRIDE snapshot, and writes `VAPT-BASELINE.md`.
trigger: /vapt-init
---

# /vapt-init

This is the whole-project baseline. It is not a casual file review.

Default posture:
- VA runs
- PT does not

PT/recon is opt-in, non-prod only, and requires explicit authorization.

## Step 0 — Scope gate

State:
- target
- environment
- authorization

Hard rules:
- production → no active testing/recon
- unclear authorization → stop

## Step 1 — Detect stack

Find the real stack and choose audit/test commands accordingly.

If no manifest is found, skip dependency scanning but say so in the report.

## Step 2 — Preparation pass

Run a cheap OWASP-aligned spot check for:
- hardcoded secrets
- obvious injection patterns
- missing auth on sensitive routes
- unsafe deserialization / eval-style patterns
- `.env` ignore hygiene
- weak crypto markers

This is a prep pass, not the full verdict.

## Step 2b — DX≈AX security signal

Score whether the codebase is easy for both humans and agents to navigate safely:
- strict types / schemas
- predictable boundaries
- obvious auth/data flow
- no hidden config traps

Poor DX is a security smell. Record it explicitly.

## Step 2c — Ponytail complexity audit

Count avoidable complexity that increases security review cost:
- duplicate auth logic
- parallel validation layers with different rules
- dead config and unused permissions
- bespoke wrappers around standard secure primitives

Call this **ponytail debt** in the report.

## Step 3 — Scan

Run:
- dependency audit
- SAST/security skill if installed
- stack-specific scanners if installed

Merge findings into one table:
- id
- severity
- finding
- location
- evidence
- recommended fix
- status
- source

## Step 4 — Maker-checker

Any CRITICAL/HIGH finding needs a second-pass verification before it lands in the baseline as final.

Finder != verifier.

If a finding cannot be checker-confirmed:
- downgrade confidence
- say why

## Step 5 — Procedure / ability / wait

Classify each remediation:
- **procedure** → deterministic fix/harness change
- **ability** → requires expert judgment
- **wait** → blocked on environment, access, or owner decision

This determines what the agent should fix now vs escalate.

## Step 6 — Threat model snapshot

Write a lightweight STRIDE table for 2–3 important components, preferring ones touched by serious findings.

## Step 7 — Harness gaps

List harness/security workflow improvements that would prevent recurrence:
- missing guard hooks
- weak quality gate
- absent secret scanning
- stale docs/rules

If the gap is big, recommend `harness-engineer`.

## Step 8 — Write `VAPT-BASELINE.md`

Minimum sections:
- scope
- stack detected
- risk score
- findings
- DX≈AX signal
- ponytail debt
- STRIDE snapshot
- harness gaps
- next steps
- recurring audit loop

The recurring audit loop should say when to rerun:
- after major auth changes
- before release
- during `/project-mid`

## Rules

- Never auto-fix auth/access-control/security-critical code without explicit user approval.
- Never run PT/recon on production.
- Never hide uncertainty; mark confidence and checker status.
- Do not confuse "no scanner installed" with "no risk found".
