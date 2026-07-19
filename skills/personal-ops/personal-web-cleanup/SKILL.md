---
name: personal-web-cleanup
description: Find where your own name/username/email shows up publicly (search engines, data-broker/people-search sites, social platforms via sherlock), then produce a draft-only removal checklist — one row per site with what was found, how to opt out, and a draft request. Never submits anything on your behalf. Use when user says "clean up my online presence", "remove my info from data broker sites", "find where my name shows up online", "opt out of people-search sites".
---

# Personal Web Cleanup

Discovery + draft-only removal checklist for your own public digital footprint. Never sends or submits anything — you action every item yourself.

## When to use / when NOT to use

- Use for auditing and removing **your own** personal info from public data-broker/people-search sites and general web presence.
- Do NOT use to look up or take action regarding someone else's information — this skill requires the target identity to be the user's own. Refuse and stop if asked to run this against a named third party.
- Do NOT use for automated form submission — this skill only drafts requests; it never submits them.

## Step 0 — Identity & scope gate (blocking)

Confirm before proceeding:
- Full name (and known aliases/nicknames/maiden name), cities/states lived in (disambiguates from same-name people on broker sites), any usernames/emails to also check.
- Explicit confirmation this is the user's own identity. If unclear, or it's someone else's identity, stop and ask — do not proceed on an assumption.

## Step 1 — Discovery

1. General web search for the name plus disambiguating details (city, employer, etc.) — note any public profile, mention, or old account surfaced.
2. Check known data-broker/people-search sites for a matching profile — Spokeo, BeenVerified, Whitepages, MyLife, Intelius, PeopleFinders, TruePeopleSearch, Radaris, USPhoneBook, FastPeopleSearch, CheckPeople, Nuwber.
3. If usernames are known: invoke `sherlock` for cross-platform account footprint.
4. If a broader professional/company footprint matters: optionally invoke `osint-recon-frameworks` (passive mode only — same rule as that skill's own default).

## Step 2 — Aggregate findings

Table: `site | what was found (be specific: name/age/address/relatives/phone) | opt-out method | direct opt-out URL (if known) | status`. `status` starts as `not yet actioned` for every row — this skill never advances it.

## Step 3 — Draft-only removal checklist

For each site with a match, produce:
- Direct opt-out link, if publicly documented.
- Method required: self-service web form / email / postal mail. Flag explicitly if a site requires an ID upload to process removal — that's a real privacy tradeoff (handing a data broker a copy of your ID to get removed from a data broker) the user should weigh themselves, don't default to recommending it.
- A draft, ready-to-copy request text, e.g.: *"I am requesting removal of my personal information from your site under [applicable opt-out policy]. My listing: [profile URL]. Please confirm removal."*

## Rules

- Never submit any form, email, or request on the user's behalf, ever — draft only. State explicitly, every time: "Nothing was sent — you action each item yourself."
- Never run this workflow against a third party's identity.
- Some sites require ID verification for removal — flag as a tradeoff, don't push toward it.
- Recommend a periodic re-scan (e.g. every few months) — data brokers routinely re-scrape and reappear; this isn't a one-time fix, note it as a recurring task.

## Output

Write a markdown report (e.g. `personal-web-cleanup-<date>.md`) containing the findings table + full checklist, handed directly to the user. Nothing is emailed, submitted, or sent anywhere else.

---
Source: original tado skill (not derived from repo-to-skill/yt-to-skill)
