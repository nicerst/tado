---
name: vapt-init
description: >
  Use when setting up security posture for a project for the first time (any stack),
  before a release or external audit, before handing a project to another team, or
  periodically re-running to diff against an existing VAPT-BASELINE.md. Different
  layer than security-audit (which reviews one file/PR on request) — this is
  whole-project baseline + lifecycle setup.
---

# /vapt-init

VAPT = Vulnerability Assessment and Penetration Testing. 6-phase sequence (prep → scan → remediate → test → document → detect) derived from Trail of Bits, Snyk, SecSkills, OWASP, Claude Agentic Framework.

**Doctrine woven throughout:**
- **Agent Loops (Maker-Checker):** Step 3 scanning runs as Maker-Checker. Finding collector (maker) + verification pass (checker) before any finding enters the baseline. Re-run cadence is a Loop Library entry with objective stop criteria and hard cap.
- **Harness Over Model (procedure vs ability):** Step 4 classifies each finding class as procedure (automate as hook) vs ability (model handles) vs wait. Harness gap recommendations delivered at Step 7.5. DX≈AX security signal: loose types at auth boundaries are a vulnerability class, not just code quality.
- **Ponytail (complexity = attack surface):** Step 2 includes minimalism audit on dependencies + ponytail: debt in security-critical paths. High-debt auth/API code is highest-priority scan target. Complexity metrics included in VAPT-BASELINE.md.

**Note on scope per run:** VA phases (1-3, 5, 7-9) always run. Phase 6 (PT — recon/testing) is gated, opt-in, skip-by-default (Step 0). Default run = vulnerability-assessment baseline, not a penetration test.

## When to Use

- First time setting up security posture for a project (any stack)
- Before a release, external audit, or handing to another team
- Periodically (re-run — diffs against existing `VAPT-BASELINE.md`)
- After `/project-mid` flags security debt or DX regression

## When to Skip

- One specific file/PR needs review → use `security-audit` directly
- Reviewing `.claude/` hooks/MCP config for harness vulns → use `security-scan`
- Target is third-party / not yours → **never** run Phase 5 (Testing) against it

---

## Tooling Map

| Skill / Repo | Phase | What it does |
|---|---|---|
| `agamm/claude-code-owasp` | 1. Preparation | OWASP Top 10:2025, ASVS 5.0, Agentic AI patterns — secure coding reference |
| `trailofbits/skills` (Code Audit) | 2. Scanning | CodeQL/SARIF-based SAST, variant analysis |
| `snyk/studio-recipes` (Snyk Fix) | 3. Remediation | scan → analyze → fix → validate → PR |
| `trilwu/secskills`, `Eyadkelleh/awesome-claude-skills-security` | 4. Testing (gated) | recon, enumeration, exploitation, privesc, persistence, fuzzing/CTF agents |
| `dralgorhythm/claude-agentic-framework` | 5. Documentation | STRIDE threat modeling, compliance framing |
| Snyk Learning Path | 5. Documentation | targeted learning paths per detected stack |
| `trailofbits/skills` (YARA Authoring) | 6. Detection (optional) | malware/IOC signature rules |
| `trailofbits/skills` (Smart Contracts) | 2/4 (conditional) | only if Solidity/Solana/etc. detected |

If a phase's tool repo isn't installed in `.claude/`, note it in **Tooling Gaps** (Step 7) — phase still runs using built-in grep/native-tool checks.

---

## Severity Rubric (inherited from security-audit)

- 🔴 CRITICAL — exploitable now, direct path to breach/takeover
- 🟠 HIGH — significant risk under realistic conditions
- 🟡 MEDIUM — real risk requiring specific conditions
- 🟢 LOW — minor hardening, not directly exploitable
- ℹ INFO — best practice notes, architectural observations

Never inflate severity — apply FP discipline + checker pass before finalizing any 🔴/🟠 finding.

---

## Steps (execute in order)

### Step 0 — Scope & Authorization Gate (BLOCKING)

State target explicitly:

```
Target: <repo/path>
Environment: local | staging | production
Authorization: self-owned / explicit written authorization confirmed? (yes/no)
Audit type: strategic (recurring, compliance-driven) | tactical (one-time, pre-release)
```

- If environment = `production` → Phase 4 (Testing) **disabled**, no exceptions.
- If authorization = `no` or unclear → **stop**. Do not proceed past Phase 1. Hard stop — state plainly to user.

| Excuse to skip stating this explicitly | Reality |
|---|---|
| "It's obviously my own project" | State it explicitly anyway — this line is what the baseline report cites as evidence of authorization, not your assumption. |
| "We're just re-running, already authorized last time" | Environment and ownership can change between runs. Re-confirm every run, don't carry forward silently. |
| "User is clearly in a hurry" | The gate is one line to answer. Skipping it risks Phase 4 running against production undetected. |

**Strategic vs tactical:** record `audit_type`. Strategic = deliver harness recommendations + recurring loop spec. Tactical = findings + fixes only.

Step 0 header + Step 1 detected stack are passed verbatim to `security-audit` in Step 3. It does not re-ask its Step 1 (Scope First).

### Step 1 — Stack Detection

```bash
ls package.json pyproject.toml requirements.txt go.mod Cargo.toml composer.json Gemfile 2>/dev/null
find . -maxdepth 3 \( -iname "*.sol" -o -iname "Anchor.toml" -o -iname "foundry.toml" -o -iname "hardhat.config.*" -o -iname "Move.toml" -o -iname "*.cairo" \) 2>/dev/null | head -5
```

Map detected manifest → dependency-audit + test commands:

| Manifest | Audit command | Test command |
|---|---|---|
| `package.json` | `npm audit --json` (or `pnpm audit` / `yarn audit`) | `npm test` |
| `pyproject.toml` / `requirements.txt` | `pip-audit` | `pytest` |
| `go.mod` | `govulncheck ./...` | `go test ./...` |
| `Cargo.toml` | `cargo audit` | `cargo test` |
| `composer.json` | `composer audit` | `composer test` |
| `Gemfile` | `bundle audit` | `bundle exec rspec` |

If none found → skip dependency scan, note in report.

If smart-contract files found → check for matching scanner in `.claude/skills/`. If installed → use in Step 3.4. If not → note as Tooling Gap.

### Step 2 — Preparation Pass

Three parallel checks before the full scan: OWASP spot-checks, DX≈AX security signal, and Ponytail complexity audit.

**2a. OWASP Spot-Checks (lightweight, not full coverage — that's security-audit's job):**

| OWASP category | Check |
|---|---|
| Injection | `grep -rEn "(api[_-]?key\|secret\|password\|token)\s*=\s*['\"][^'\"]+['\"]"` (hardcoded secrets) |
| Injection | SQL built via string concat near `query`/`exec`/`execute` |
| Broken Access Control | Auth middleware presence on sensitive routes |
| Insecure Design | Missing input validation at route/handler boundaries |
| Security Misconfiguration | `.env` in `.gitignore` |
| Cryptographic Failures | `md5(`/`sha1(` near password/token handling |
| Software/Data Integrity Failures | `pickle.loads`/`yaml.load(` without `SafeLoader`/`eval(` on external input |
| Logging Failures | Any audit-logging mechanism present (presence check only) |

Output: check → status (pass/flag/n-a) → file:line for flags.

**2b. DX≈AX Security Signal (Harness Over Model):**

DX≈AX: loose types at auth boundaries are a vulnerability class. Strict types with exhaustive enums eliminate injection at the type layer before it reaches runtime.

```bash
# Type coverage
cat tsconfig.json 2>/dev/null | grep '"strict"'
cat pyproject.toml 2>/dev/null | grep 'mypy\|pyright'

# `any` types at security-critical boundaries
grep -r ": any" src/ --include="*.ts" 2>/dev/null | grep -i "auth\|token\|user\|role\|permission\|request\|input" | head -10

# Exhaustive enum / const union usage on role/permission types
grep -r "satisfies\|as const" src/ --include="*.ts" 2>/dev/null | grep -i "role\|permission\|scope" | wc -l
```

Output DX security signal (0–3):
- +1: `strict: true` enabled
- +1: no `any` types found at auth/input boundaries
- +1: role/permission types use exhaustive enums or const unions

Record as `dx_security_signal: N/3`. Include in VAPT-BASELINE.md. Flag to user if 0–1: "Loose types at auth boundaries — whole vulnerability classes not caught at compile time."

**2c. Ponytail Complexity Audit:**

Complexity = attack surface. High ponytail: debt in auth/API paths = highest-priority scan targets.

```bash
# Total debt count
grep -rc "ponytail:" . --include="*.ts" --include="*.py" --include="*.js" 2>/dev/null | awk -F: '{sum += $2} END {print "Total ponytail: debt:", sum}'

# Debt in security-critical paths
grep -r "ponytail:" . --include="*.ts" --include="*.py" --include="*.js" 2>/dev/null | grep -i "auth\|token\|role\|permission\|api\|route\|middleware\|session"
```

Record:
- Total ponytail: debt count
- Security-path debt items (file:line — these are highest-priority scan targets)
- Flag if security-path debt > 5: "⚠ High complexity debt in security-critical paths — manual audit required, scanner may miss subtle logic bugs."

Dependency minimalism check (from Ponytail):
```bash
# Count prod deps
cat package.json 2>/dev/null | python3 -c "import json,sys; d=json.load(sys.stdin); print('prod deps:', len(d.get('dependencies',{})))"
```

Flag if prod deps > 50 for project scope: "High dependency surface — each dep is unreviewed attack surface. Run minimalism check on dependency list."

### Step 3 — Scan (Maker-Checker)

**Audit loop — Maker-Checker pattern:**

```
GOAL: Identify all exploitable vulnerabilities within scope
MAKER PASS: Collect vulnerability candidates from dependency scan + security-audit findings
CHECKER PASS: For each candidate — verify code path, confirm exploitability, rule out FP
REPORT: Only checker-confirmed findings enter VAPT-BASELINE.md
STOP IF: All scan sources exhausted (dep-audit + security-audit Steps 1-2 + contract scanner)
HARD CAP: This step is time-boxed to current session; no open-ended enumeration
```

**3a. Dependency audit:**
Run the audit command from Step 1. Parse for high/critical CVEs. If Snyk MCP is configured (`mcp_snyk_snyk_sca_scan`), prefer it and note in Source.

**3b. SAST scan (security-audit, scoped):**
If `security-audit` is installed: invoke it scoped to Steps 1-2 only. Pre-fill its header:
```
Project: <name> | Stack: <Step 1 detection> | Scope: full | Type: strategic|tactical | Environment: <Step 0>
```
**Hard stop after its Step 2.** If its output starts a fix-batch (Step 3) or final report (Step 9) — discard that part. vapt-init owns fixing (Step 4) and the single report (Step 8).

If `security-audit` not installed: Step 2a spot-checks are the SAST-equivalent pass. Note the gap in Step 7 (Tooling Gaps).

**3c. Smart contract scan:** if Step 1 detected smart-contract stack and scanner is installed, run and merge findings.

**3d. Checker pass (false-positive discipline):**

For every 🔴 CRITICAL or 🟠 HIGH candidate from 3a-3c, run a verification pass:
- Does the attack path actually exist? Trace it in code.
- Is the user-controlled data actually reachable? Confirm it.
- Is there a mitigation already in place not caught by the scan? Check.
- Checker verdict: **CONFIRMED** or **FALSE POSITIVE — reason**.

Only CONFIRMED findings enter the findings table.

**3e. Merge findings into one table:**

`id | severity | finding | location | evidence | recommended_fix | status | source | checker`

- `id` format: `<source-prefix>:<location>:<check-tag>` (deterministic, reproducible across re-runs)
  - Prefixes: `DEP` (dep-audit), `SA` (security-audit), `S2` (Step 2 spot-check), `SC` (contract scanner)
  - Example: `S2:routes/auth.js:42:hardcoded-secret`, `DEP:package.json:lodash`
- `checker` column: `CONFIRMED` / `FP — <reason>`
- No raw `|` in cells — escape as `\|` or rephrase. Step 8.5 exporter splits on unescaped `|`.

### Step 4 — Remediation

**For dependency CVE findings only (procedure — safe to auto-fix):**

For each high/critical dep finding with available non-breaking patch:
1. Apply the bump (Snyk MCP if configured, else manifest edit)
2. Run test suite (Step 1's test command)
3. Tests pass → mark `fixed`. Tests fail → revert, mark `needs-manual-fix`, note failure.

**For code-pattern findings (never auto-fix):**
Auth/access-control/XSS/secrets code findings go to report as `needs-manual-fix` with one-line suggested remediation. Never auto-edit security-critical logic — Fix Escape Hatch on request (Step 9.5).

**Procedure vs Ability + Harness classification (strategic audits — from Harness Over Model):**

For each finding class, classify:

| Finding class | Type | Harness action |
|---|---|---|
| Secrets committed to git | Procedure | PreToolUse hook: block `git add` on `.env*`, `*secret*` |
| Missing auth check on API routes | Procedure | AGENTS.md rule: "every new route must have authz check" |
| `any` types at auth boundary | Procedure | tsconfig strict gate via PostToolUse lint hook |
| Input validation missing | Procedure | AGENTS.md rule: "server-side validation required on all inputs" |
| Logic-level auth bypass | Ability | Model judgment required — no harness, manual review |
| Race condition in session logic | Wait | Frontier models improving fast on concurrency analysis — revisit 6mo |
| Code quality → security (complex auth logic) | Wait | Ponytail debt cleanup → DX improvement → AX improvement |

Record procedure/ability/wait classification per finding class. Deliver consolidated harness recommendations at Step 7.5.

### Step 5 — Threat Model Snapshot (STRIDE)

Pick 2-3 components: prioritize any with 🔴/🟠 findings from Step 3 first, then auth + external API surface.

| Component | S | T | R | I | D | E |
|---|---|---|---|---|---|---|

S/T/R/I/D/E = Spoofing/Tampering/Repudiation/Info-disclosure/DoS/Elevation. Mark: `✓ mitigated`, `⚠ partial`, `✗ gap` per cell with one-line note.

**Add complexity risk note (Ponytail):** for any component with ponytail: debt items from Step 2c:
> ⚠ Complexity risk: [component] has N ponytail: debt items. Complex code = higher probability of subtle logic bugs not caught by scanner. Manual review recommended for this component.

### Step 6 — Testing (gated, opt-in, non-prod only)

**Skip by default.** Only run if Step 0 confirmed: authorization=yes AND environment≠production AND user explicitly says to proceed.

If proceeding — scope to recon + enumeration only (read-only):
- Port/service enumeration on local/staging targets named explicitly
- Dependency-confusion / exposed-endpoint checks
- No exploitation, no privesc, no persistence, no fuzzing against shared infra

Document as recommendations, not auto-executed actions, unless user explicitly requests a specific named check.

Confirm with user that staging/local holds no production data/secrets and isn't shared infra before running anything.

### Step 7 — Tooling Gaps

List any tool from the Tooling Map not installed in `.claude/skills/` or `.claude/plugins/` that would improve coverage for this stack.

### Step 7.5 — Harness Gap Recommendations (strategic audits only)

Consolidate procedure-type findings from Step 4's classification. For each:

```
Finding class: [e.g., secrets committed to git]
Harness type: PreToolUse hook | PostToolUse hook | AGENTS.md rule
Implementation: [what to build]
Gap type: procedure — automate to prevent recurrence
Priority: CRITICAL|HIGH|MEDIUM (inherits from finding severity)
```

Present as a list for user review. Do not auto-build — user must confirm.

Reference `harness-engineer` skill for building the recommended hooks. If Tooling Gaps from Step 7 are significant: also flag for `harness-engineer` to install missing skill repos.

### Step 8 — Write VAPT-BASELINE.md

```markdown
# VAPT Baseline — <project name>

_Generated: YYYY-MM-DD | Re-run /vapt-init to diff against this baseline_

## Scope
- Target: ...
- Environment: ...
- Authorization: ...
- Stack detected: ...
- Audit type: strategic | tactical

## Risk Score: X/10
Weighted: (🔴 × 4) + (🟠 × 2) + (🟡 × 1) + (🟢 × 0.25), capped at 10.
1-2 minimal | 3-4 hardening needed | 5-6 notable gaps | 7-8 significant | 9-10 critical

## Security Health Signals
- DX security signal: N/3 (strict: ✅/❌ | no-any at boundary: ✅/❌ | exhaustive enums: ✅/❌)
- Ponytail debt (security paths): N items [list files]
- Ponytail debt (total): N items
- Dependency surface: N prod deps

## Findings
| ID | Severity | Finding | Location | Evidence | Recommended Fix | Status | Source | Checker |
|---|---|---|---|---|---|---|---|---|

Any secret values in Finding/Evidence: masked as `[REDACTED — rotate immediately: key_name]` — never write raw values.

## Threat Model Snapshot
[Step 5 STRIDE table + complexity risk notes]

## Harness Gap Recommendations (strategic audits)
[Step 7.5 list — procedure gaps to automate]

## Recurring Audit Loop Spec (strategic audits)
```yaml
loop_id: vapt-baseline-recurring
name: VAPT Baseline Audit Loop
trigger: manual | monthly | pre-release
pattern: maker-checker
action: re-run /vapt-init, diff against VAPT-BASELINE.md
verify: all finding IDs accounted for (resolved / unchanged / new), report generated
stop_criteria: objective — diff complete, report written
hard_cap: 1 full audit per run
next_run: YYYY-MM-DD
```
Add to project's Loop Library in `project-dna.md`.

## Tooling Gaps
[Step 7 list]

## Next Steps
- [ ] Manual review items (`needs-manual-fix` findings) — Fix Escape Hatch below
- [ ] Harness gaps to build (strategic) — run `/harness-engineer` to implement
- [ ] Re-run `/vapt-init` after fixes land — target: risk score reduced by N
- [ ] Resolve DX security signal gaps (if score < 3): enable strict types, add exhaustive role enums
- [ ] Address high ponytail: debt in security-critical paths
```

**Diff logic for re-runs:** diff new findings against existing baseline by **ID first**:
- `id` in both → `unchanged` (carry over status/notes)
- `id` in old only → `resolved`
- `id` in new only → `new`

Fall back to severity+location matching only if old baseline has no `id` field (pre-this-version baseline) — assign `id` per format then diff.

### Step 8.5 — Export Checklist (optional)

Ask: "Export findings as Excel checklist (`VAPT-CHECKLIST.xlsx`)? (yes/no)"

If **yes:**
1. Check `python3 -c "import openpyxl"`. If missing, ask before installing. Never install silently.
2. If available:
   ```bash
   python3 ~/.claude/skills/vapt-init/scripts/export_checklist.py <dir>/VAPT-BASELINE.md <dir>/VAPT-CHECKLIST.xlsx
   ```
   Sheets: **Findings Checklist** (severity color-coded + Done/Owner/Due/Notes columns), **Threat Model** (STRIDE color-filled), **Scope & Meta** (target/stack/signals/gaps).
3. If python3 unavailable or user declines: write `VAPT-CHECKLIST.csv` — no dependencies.

### Step 9 — Report

Summary: Risk Score X/10, counts (critical/high/medium/low), auto-fixed (dep bumps), manual-review count, DX security signal, ponytail debt signal, threat-model gaps, tooling gaps, harness recommendations count (strategic).

Point to `VAPT-BASELINE.md` and Loop Library entry for recurring audits.

### Step 9.5 — Fix Escape Hatch (opt-in, post-report)

vapt-init never auto-edits auth/access-control/XSS/secrets findings. If user wants one fixed after reviewing `VAPT-BASELINE.md`:

1. User names the finding (by ID or location).
2. Re-invoke `security-audit`, scoped to just that finding/file, starting from its Step 3 (fix-in-named-batches) — not a full project audit.
3. Follow security-audit's batch protocol + Maker-Checker verification.
4. Update finding's `status` in `VAPT-BASELINE.md` to `fixed` (or `attempted` if failed). Refresh counts.

---

## Rules

- Step 0 gate is non-negotiable — no testing phase without explicit authorization + non-prod target
- Never auto-fix auth/security-critical code logic — flag for human review only (Fix Escape Hatch on request)
- Checker pass required for every 🔴/🟠 finding before it enters the baseline
- Always produce `VAPT-BASELINE.md`, even with zero findings
- Don't duplicate `security-audit`'s deep review — call it scoped to Steps 1-2 only
- Don't enumerate every file in Step 2 — spot-check; full coverage is `security-audit`'s job
- Step 8.5 (Excel export) is opt-in — ask first; never install packages without explicit consent
- Never build harness for ability or wait findings — procedure findings only

### Inherited from security-audit

- 🚫 Never `git commit/push/reset --hard/clean/rebase/merge`
- 🚫 Never print full secret values — mask as `[REDACTED — rotate immediately: key_name]`, always
- 🚫 Never apply DB/RLS changes directly — draft as separate SQL file with rollback notes
- Never inflate severity — FP discipline + checker pass before finalizing any 🔴/🟠
- Malicious code or backdoor found → pause immediately, surface to user, ask how to proceed
- Treat `testing`/`staging` as production-equivalent until user confirms otherwise

## Anti-patterns to avoid

- Running Phase 4/6 against production or third-party targets
- Treating this as a pentest report for a client — it's a self-service baseline
- Auto-bumping major versions (breaking changes) without flagging for review
- Skipping Step 0 because "it's obviously my own project" — state it explicitly anyway
- Skipping the Maker-Checker pass and reporting all scan candidates — FP rate will be high on auto-scans
- Building harness for ability/wait findings — you're encoding current model limitations into permanent hooks
- Ignoring DX security signal — loose types at auth boundaries are a vulnerability class that no amount of hooks will close

---

## Integration with Other Skills

| Skill | When to combine |
|---|---|
| `security-audit` | Called scoped (Steps 1-2 only) in Step 3 (Scanning); re-invoked per-finding via Fix Escape Hatch |
| `security-scan` | Separate concern — run for `.claude/` harness config, not app code |
| `harness-engineer` | After Step 7.5 — build the procedure gap hooks recommended from findings |
| `project-init` | Run `/vapt-init` after new project scaffold exists, after or during harness setup |
| `project-mid` | At day-30+ health checks, re-run `/vapt-init` to diff baseline; check loop spec in project-dna.md |

## References

- [[wiki/source-vapt-github-repositories]]
- [[wiki/concept-vapt]]
- Snyk: "Top Claude Skills for Cybersecurity, Hacking & Vulnerability Scanning"
- Agent Loops (Cole), Harness Over Model (Matt Pocock), Ponytail woven throughout
