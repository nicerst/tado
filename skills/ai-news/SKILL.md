---
name: ai-news
description: Search for latest AI news, save articles to raw/website/, and auto-ingest into the LLM wiki. Use when user types /ai-news.
trigger: /ai-news
---

# /ai-news

Fetch latest AI news, save to `raw/website/`, and run the full wiki ingest workflow automatically.

## Usage

```
/ai-news                          # fetch top ~8 AI news articles from last 48 hours
/ai-news fintech                  # filter to AI + fintech / payments topic
/ai-news agents                   # filter to AI agents / agentic systems
/ai-news <any topic>              # filter by topic
/ai-news --count 5                # limit to N articles (default: 8)
```

## What You Must Do When Invoked

Execute all steps in order. Do not skip any step.

### Step 1 — Parse arguments

- Extract optional topic filter from args (e.g. "fintech", "agents", "LLM")
- Extract optional `--count N` (default: 8)
- If no topic given, search broadly for top AI news

### Step 2 — Build search queries

Construct 2–3 targeted search queries. Examples:

- No topic: `"AI news today 2026"`, `"artificial intelligence latest developments"`
- Topic "fintech": `"AI fintech payments 2026"`, `"AI banking fraud detection news"`
- Topic "agents": `"AI agents 2026 news"`, `"agentic AI systems latest"`

Always anchor to recent dates. Add "2026" or "latest" to bias toward current results.

### Step 3 — Search and collect candidate articles

Use WebSearch for each query. Collect all result URLs and titles. Deduplicate by URL.

**Skip these URL patterns — they are nav pages, not articles:**
- URLs that end in `/` with no slug
- `site:reddit.com` listing pages
- Wikipedia, YouTube, LinkedIn feed pages
- Any URL already present as a file in `raw/website/`

Check existing files to avoid re-ingesting:
```
List files in: /Users/melbertmaano/Documents/demo vault/raw/website/
```
Extract slugs from existing filenames. Skip any article whose URL slug matches an existing file.

### Step 4 — Select top N articles

From candidates, select the top N (default 8) by:
1. Recency (prefer last 48 hours)
2. Relevance to AI / topic filter
3. Source quality (prefer: TechCrunch, Wired, MIT News, VentureBeat, Bloomberg, Reuters, PYMNTS, The Verge, Ars Technica, Nature, arXiv)
4. Avoid duplicates from the same source on the same story

### Step 5 — Fetch and save each article

For each selected article:

**5a. Fetch content**
Use WebFetch to get the article. Extract:
- Title
- Author (if available)
- Publication date (if available)
- Full article text (strip nav, ads, footer boilerplate)

**5b. Generate slug**
Create a filename slug: lowercase, hyphens only, max 80 chars, descriptive.
Example: `openai-releases-gpt5-reasoning-model.md`

**5c. Check for collision**
If the slug already exists in `raw/website/`, skip this article.

**5d. Write to raw/website/**
Save as markdown with this frontmatter:

```markdown
---
title: "<article title>"
source_url: "<full URL>"
author: "<author or site name>"
captured_at: "<YYYY-MM-DD>"
---

<full article body as markdown>
```

Save path: `/Users/melbertmaano/Documents/demo vault/raw/website/<slug>.md`

**5e. Confirm save**
Print: `Saved: raw/website/<slug>.md — <title>`

### Step 6 — Ingest each saved article

After saving ALL articles, run the wiki ingest workflow from CLAUDE.md for each new file.

For each file:
1. Read the source file completely
2. Identify key entities, concepts, decisions, people, projects
3. Write `wiki/<slug>-source.md` (type: source)
4. For each identified entity/concept/person/project:
   - If page exists: update with new info, update `updated` date, add source to `sources`
   - If page doesn't exist: create stub or draft page
5. Check for contradictions with existing wiki pages
6. Update `index.md`: add new pages, update counts
7. Append to `log.md`

**Important:** Process articles one at a time through the ingest workflow. Do not batch-skip the ingest.

### Step 7 — Final summary

After all articles are ingested, print:

```
/ai-news complete
─────────────────────────────────────
Articles fetched:  N
Wiki pages created: N
Wiki pages updated: N
─────────────────────────────────────
New files in raw/website/:
  - slug-1.md — Title 1
  - slug-2.md — Title 2
  ...

New wiki pages:
  - wiki/source-slug-1.md
  - wiki/entity-foo.md
  ...
```

Then output the attention summary (from CLAUDE.md ingest format):
- Any contradictions found
- Any decisions updated
- Any gaps identified

## Error handling

- If WebFetch fails for an article: print a warning, skip that article, continue
- If fewer than 3 articles are fetchable: warn the user and proceed with what was saved
- Never abort the entire run because one article failed

## Constraints

- Never modify files in `raw/` — ONLY create new files in `raw/website/`
- Always update `index.md` and `log.md` after ingest
- Use `ingest_count` from the last `log.md` entry to increment correctly
- Never write `TBD` or `TODO` in wiki pages
