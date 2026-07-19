---
name: sherlock
description: Use when you need username enumeration OSINT — checking if a username exists across 400+ sites, e.g. "sherlock", "find accounts by username", "OSINT username search", "check if username exists across sites".
---

# Sherlock

Passive OSINT CLI that checks whether a given username exists across 400+ websites by inspecting public profile-page responses.

## When to use / when NOT to use

- Use for reconnaissance: mapping a username's footprint across many platforms from a single command (investigations, OSINT, checking your own exposure).
- Use when you need a quick single-site check (`--site`) or bulk multi-username sweep, optionally exported to CSV/XLSX.
- Do NOT use expecting certainty — results are heuristic (string/status-code matching against scraped HTML), not an authoritative API. False positives/negatives are expected and routine.
- Do NOT use for anything beyond a single passive GET/HEAD/POST per site — Sherlock does not authenticate, log in, brute-force credentials, or scrape behind auth walls. It only reads what any anonymous visitor would see.
- Do NOT suggest Tor flags (`--tor`/`--unique-tor`) — they are documented in the stale PyPI README but do not exist in the current CLI; Tor support was removed.

## Setup

Requires Python ^3.9.

```bash
pipx install sherlock-project     # recommended
# or: pip install sherlock-project / uv tool install sherlock-project
docker run -it --rm sherlock/sherlock   # containerized, no local Python needed
dnf install sherlock-project      # Fedora
```

Warning: third-party ParrotOS and Ubuntu 24.04 packages are known BROKEN — use pipx/uv/pip/Docker instead.

## Core usage

```bash
sherlock user123                          # single username
sherlock user1 user2 user3                # multiple usernames
sherlock --site github.com username       # restrict to specific site(s), repeatable
sherlock user{?}name                      # fuzzy expansion: tries user_name, user-name, user.name
sherlock --csv username                   # export to CSV (also --xlsx, --txt)
sherlock -o result.txt username           # single-file output (only valid with exactly ONE username)
sherlock -fo results/ user1 user2         # per-username folder output (mutually exclusive with -o)
sherlock --proxy socks5://127.0.0.1:1080 username   # or -p
sherlock --dump-response --site github.com username # debug a site's detection logic
sherlock --nsfw username                  # include NSFW sites (excluded by default)
sherlock --browse username                # open found profiles in default browser
sherlock --timeout 30 username            # per-request timeout, default 60s
```

## Rules / gotchas

- Detection logic per site definition: `"message"` (errorMsg string in body), `"status_code"` (HTTP status compare), or `"response_url"` (redirects disabled, inspect original status). An optional `regexCheck` skips a site entirely (status ILLEGAL) if the username doesn't match its required format — no request is sent.
- A hardcoded list of WAF/anti-bot fingerprints (Cloudflare, AWS WAF, PerimeterX) is checked first; a match forces status WAF ("blocked by bot detection, proxy may help").
- Final per-site statuses: CLAIMED (found), AVAILABLE (not found), UNKNOWN (request error), ILLEGAL (bad username format), WAF (blocked). Request errors (HTTPError, ProxyError, ConnectionError, Timeout) are always caught and surfaced as UNKNOWN — the run never crashes on them.
- An upstream false-positive exclusion list is fetched and applied by default (fails open with a warning if unreachable). Use `--ignore-exclusions` only when you deliberately want the noisier, less-curated result set — its own help text warns it "may return more false positives."
- `--local`/`-l` forces the bundled site-definitions file instead of fetching the remote exclusion list.
- `--json`/`-j` accepts a JSON file path/URL OR a bare integer, interpreted as a GitHub PR number and resolved to that PR's data.json — useful for testing unmerged site definitions.
- Combining `--nsfw` with `--ignore-exclusions` maximizes both coverage AND noise/false-positive risk simultaneously — there is no built-in warning correlating the two; be deliberate if you use both.
- No built-in backoff/retry/rate-limiting beyond the per-request `--timeout`. Concurrency uses up to 20 worker threads via a custom futures session — this can itself trip target-site rate limits/WAFs/ToS even though each individual request is passive.
- STALE DOCS WARNING: the PyPI README still documents `--tor`/`--unique-tor` flags. These are non-functional in the current CLI — do not suggest them.
- Legacy invocation `python3 sherlock/sherlock.py` triggers a deprecation message pointing to the install docs; use the installed `sherlock` entry point instead.
- Authorization note: this is passive/read-only OSINT — a single GET/HEAD/POST per site inferring existence from status/redirect/text-fingerprint only. No login attempts, no credential stuffing, no auth-walled scraping, no exploitation. That said, enumerating one username across 400+ sites at once is itself a form of automated public-profile aggregation/correlation — a privacy consideration at the aggregate level even though each individual request is low-risk and passive.

## Examples

```bash
sherlock --csv --nsfw johndoe123
sherlock --site github.com --site twitter.com johndoe123
sherlock john{?}doe --xlsx
```

---
Source: github.com/sherlock-project/sherlock @ 206068dc7842665130c87e16e1535572d3d1a907 (v0.16.1)
