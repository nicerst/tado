---
name: osint-recon-frameworks
description: Use when choosing or driving an OSINT reconnaissance framework — recon-ng manual module workflow, spiderfoot automated sweep, bbot recursive scanning, "passive recon", "subdomain enumeration", "attack surface scanning".
---

# OSINT Recon Frameworks

Decision + safe-invocation guide for three OSINT recon frameworks: recon-ng (manual/granular), spiderfoot (automated single-sweep), bbot (recursive/scope-aware). Pick one based on the task, then run it passively by default unless the user explicitly asks for active/invasive recon.

## When to use / when NOT to use

Use when the task is reconnaissance/attack-surface discovery on a target (domain, org, person) and you need to pick and drive one of these three frameworks.

Do NOT use for exploitation, privilege escalation, or post-exploitation — recon-ng's own README explicitly scopes itself out of that ("If you want to exploit, use Metasploit... If you want to conduct reconnaissance, use Recon-ng"); none of these three tools attack, only gather.

## Decision table

| Need | Tool | Why |
|---|---|---|
| Granular, one-module-at-a-time control; explicit data flow between steps; scripted/CI pipeline | **recon-ng** | Console framework — nothing runs until you explicitly load a module and `run` it. Data passes via an explicit SQLite workspace DB (`source` option can SQL-query prior module output). |
| One command, broad automatic sweep across 200+ modules, fastest breadth | **spiderfoot** | Publish/subscribe event model — one target + one use-case flag cascades the whole dependent module graph automatically. |
| Recursive, scope-aware scanning with newest/most actively maintained module ecosystem; subdomain enum depth | **bbot** | Recursive graph engine + composable YAML presets + three-way scope model (target/seed/blacklist) with scope-distance decay. Claims 20-50% more subdomain results than spiderfoot in its own benchmark (unverified by us). |

If unsure and the ask is just "do passive recon on X, one shot" → default to **spiderfoot** (`-u passive`) for breadth with least setup. If the ask needs precise control over exactly which checks run and in what order → **recon-ng**. If the ask needs deep recursive subdomain/asset discovery → **bbot** with explicit passive flag.

## Setup

- recon-ng (v5.1.2): `pip install -r REQUIREMENTS` then `./recon-ng`
- spiderfoot (v4.0): `pip3 install -r requirements.txt` then `python3 ./sf.py -l 127.0.0.1:5001` (web UI) or run headless with CLI flags (no `-l`)
- bbot: `pipx install bbot` (Linux only; use Docker on other platforms)

## Core usage

### recon-ng — manual, one module at a time
```
workspaces create <name>
marketplace search <term>
marketplace info <path>
marketplace install <path>
modules load <path>
options set NAME value
run
```
- API keys persist per-framework: `keys add/list/remove`; modules declare `required_keys` and only warn (not block) if unset.
- Non-interactive: `recon-cli -w workspace -m module -o name=value -x` (or a resource script).
- `--stealth` flag disables all outbound network calls not tied to the chosen module (version check, analytics, marketplace) — use when zero incidental network noise is required.
- Nothing runs by default — this is inherently passive-safe by design; the only exposure is whichever module you explicitly `run`.

### spiderfoot — one command, automated sweep
```
sf.py -s TARGET -u passive -o json
```
- `-u {all,footprint,investigate,passive}` — use-case flag auto-selects the module set; this is the "one command, many modules" mechanism.
- **Always use `-u passive` when the ask is passive-only recon — never omit it.** Modules are tagged with `meta['flags']` (may include `invasive`, `slow`, `apikey`, `tor`, `tool`); invasive-flagged modules are excluded from the `Passive` use-case tag. There is no separate boolean — `-u passive` is the operative passive gate.
- `-m mod1,mod2` = explicit module list; `-t type1,type2` = auto-resolve by desired output event types; `-x` = strict mode (only modules directly consuming the target type).
- `-C scanID` runs the correlation engine (YAML rules in `/correlations/`) — post-collection analysis only, does not touch the target, safe to run anytime after a scan.
- `sfcli.py` is a REST client for a running `sf.py -l` server, not a standalone scanner.

### bbot — recursive, scope-aware, preset-driven
```
bbot -t evilcorp.com -p subdomain-enum -rf passive
```
- Presets stack additively: `-p email-enum subdomain-enum spider`; can be custom YAML with `include`/`config`/`modules` blocks.
- Scope model: target (in-scope) vs seed (`-s`, passive discovery start point) vs blacklist (`-b`, always wins, supports `RE:` regex), plus scope-distance recursion decay (distance 0 = in-scope; most active modules only touch distance 0).
- **CRITICAL: no preset is passive by default — not even innocuous-sounding ones like `subdomain-enum`, `web`, or `kitchen-sink`.** Modules carry `active`/`passive`/`loud`/`invasive`/`safe` flags independent of preset choice. To guarantee non-active execution you MUST add `-rf passive` (require-flag passive — strictest, 68 modules that "never connect to target systems") or the looser `-ef loud -ef invasive` (exclude-flag). `safe` (100 modules, "non-intrusive and non-destructive") is broader than `passive` — do not conflate the two when the ask specifically says "passive."
- `--fast-mode` / `fast` preset disables recursive discovery extras for speed only — it is not a safety flag.
- Before any scan, bbot blocks on an interactive `Press enter to execute <scan_name>` confirmation showing active/loud/invasive module warnings, unless `-y`/`--yes` is passed.

## Rules / gotchas

- **Never pass `-y`/`--yes` to bbot without explicit human confirmation** that active/loud/invasive modules are intended — this silently bypasses bbot's own built-in safety gate.
- **Never omit `-u passive` on spiderfoot** when the ask is passive-only — omitting it lets invasive modules run.
- **A bbot preset name alone never implies passive behavior** — always pair it with `-rf passive` (or `-ef loud -ef invasive`) when passive-only is required. This is the single most important gotcha across all three tools.
- recon-ng's module marketplace lives in a separate repo (`recon-ng-modules`) and is fetched over the network — use `--stealth` if any outbound call beyond the chosen module's own traffic is unacceptable.
- Don't conflate bbot's `safe` flag (broader, "non-destructive") with `passive` (narrower, "never connects to target") — they are different guarantees.
- None of these three tools perform exploitation — if the task requires it, stop and say so; it's out of scope for all three.

---
Source: github.com/lanmaster53/recon-ng @ c08acee0f84645ecf521ec616ac2dde94cbc1d63 (v5.1.2); github.com/smicallef/spiderfoot @ 0f815a203afebf05c98b605dba5cf0475a0ee5fd (v4.0); github.com/blacklanternsecurity/bbot @ 5355bd1f968b73f06f9d99ada2be5c095e6c5dbe
