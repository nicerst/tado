---
name: nuclei
description: Use when running vulnerability scanning with nuclei, doing a CVE template scan, or asked to "run nuclei templates" against a target — YAML-template-based scanner from ProjectDiscovery for HTTP/DNS/TCP/SSL/headless checks.
---

# Nuclei

Fast, template-driven vulnerability scanner. Detection logic lives in YAML templates from the companion `nuclei-templates` repo, auto-downloaded/updated at runtime — nuclei itself is just the execution engine.

## When to use / when NOT to use

- Use for authorized vulnerability/misconfiguration scanning, CVE detection, bug-bounty recon triage, and CI security gates where template-based checks fit.
- Do NOT use against any target without explicit authorization to scan — nuclei has no built-in authorization/consent gate; that responsibility is entirely on the operator. Apply the same Step-0 authorization gate used in `vapt-init` before invoking any scan.
- Do NOT run nuclei as a long-lived service — the project is built as a standalone CLI tool; running it as a service is an explicitly documented security risk.
- Not a replacement for manual pentesting; it's a template-matching engine, not a general exploit framework.

## Setup

Requires Go >= 1.24.2.

```bash
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest
```

No config file required. Templates are auto-managed:

```bash
nuclei -ut          # -update-templates
nuclei -ud <dir>    # use a custom template directory
```

Optional `-config` for persistent CLI settings. Optional `-auth` / `-pd` (`-dashboard`) to opt in to ProjectDiscovery Cloud — free, not required for local scanning.

## Core usage

```bash
# Single target
nuclei -target https://example.com

# Bulk targets from file
nuclei -list urls.txt

# Subnet scan
nuclei -target 192.168.1.0/24

# Specific template dirs/categories
nuclei -target example.com -t http/cves/ -t ssl

# Custom/one-off template
nuclei -u https://example.com -t /path/to/your-template.yaml

# JSON export for downstream tooling
nuclei -target example.com -json-export output.json
```

A Go SDK also exists for embedding (`nuclei.NewNucleiEngineCtx`, `WithTemplateFilters`, `LoadTargets`, `ExecuteWithCallback`) if scripting scans programmatically instead of shelling out.

## Filtering flags (narrow scope, don't just widen it)

| Flag | Purpose |
|---|---|
| `-s/-severity`, `-es/-exclude-severity` | filter by `{info,low,medium,high,critical,unknown}` |
| `-tags`, `-etags/-exclude-tags`, `-itags/-include-tags` | tag filtering; nuclei is opinionated — some tags are excluded by default and must be force-included |
| `-id/-template-id` (wildcards), `-eid/-exclude-id` | filter by CVE/template ID |
| `-pt/-type` | protocol: `dns,file,http,headless,tcp,workflow,ssl,websocket,whois,code,javascript` |
| `-nt/-new-templates` | only newly-added templates from the latest release — fast n-day/CVE turnaround |
| `-as/-automatic-scan` | auto-map Wappalyzer tech detection to relevant tags |
| `-passive` | passive HTTP response processing only, no extra active requests — closest thing to a "safer" mode |

## Rules / gotchas

**Defaults are conservative even though there's no named "safe mode":**
- `-rl/-rate-limit` defaults to 150 req/sec (not unbounded)
- `-bs/-bulk-size` defaults to 25 hosts in parallel per template
- `-c/-concurrency` defaults to 25 templates in parallel
- `-hbs/-headless-bulk-size` (10) and `-headc/-headless-concurrency` (10) are throttled lower than HTTP defaults
- `-timeout` defaults to 10s, `-retries` to 1
- `-mhe/-max-host-error` defaults to 30 — nuclei auto-skips a host after 30 errors as a built-in circuit breaker; `-nmhe/-no-mhe` disables this safety behavior (avoid disabling without reason)

**Scope-expanding capabilities are opt-in, never default** — treat enabling any of these as a deliberate scope decision:
- `-uc/-uncover` (+ `-ur/-uncover-ratelimit`, default 60/min): pulls in targets from Shodan/Censys/Fofa — expands scope beyond what was explicitly given
- `-sa/-scan-all-ips`: default resolves only one IP version (`-iv/-ip-version` default 4)
- `-fa/-fuzz-aggression`: `{low,medium,high}`, defaults to low
- `-lfa/-allow-local-file-access`: widens risk, explicitly opt-in
- Headless mode itself (`-pt headless`)

**Scope-restricting/circuit-breaker controls to prefer:**
- `-eh/-exclude-hosts` to exclude ip/cidr/hostname from an input list
- `-lna/-restrict-local-network-access` to block local/private network targets
- `-spm/-stop-at-first-match`: documented gotcha — "may break template/workflow logic," use cautiously
- `-hpd/-honeypot-detect` (+ `-hpt/-honeypot-threshold` default 15, `-shp/-suppress-honeypot`): flags honeypots by match concentration
- Interactsh (OOB detection) defaults to public shared servers unless `-iserver` is set; `-ni/-no-interactsh` disables OAST templates entirely if that's undesirable

**Deprecated flag traps** — check these before trusting old scripts/docs:
- `-irr/-include-rr` deprecated for `-or/-omit-raw` — **inverted semantics**, a naming trap, don't swap blindly
- `-ztls` deprecated — ztls fallback is now automatic
- `-fuzz` deprecated for `-dast`
- `-cup/-cloud-upload` deprecated for `-dashboard`
- `-rlm/-rate-limit-minute` deprecated for `-rl`/`-rld`

**Version discipline**: this project is in active development and expects breaking changes between releases — review the release changelog before updating nuclei or nuclei-templates.

**Authorization**: nuclei enforces no consent/authorization gate on targets. Before scanning, confirm explicit written authorization for the target scope, exactly as required by `vapt-init`'s Step 0 gate. Never expand scope (uncover, scan-all-ips, subnet scans) beyond what was explicitly authorized.

---
Source: github.com/projectdiscovery/nuclei @ 0888e6244d1769d562a1f6910e61ff58e68efddf
