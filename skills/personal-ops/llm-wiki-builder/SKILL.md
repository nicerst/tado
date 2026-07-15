---
name: llm-wiki-builder
description: Set up and maintain a Karpathy-style LLM wiki (personal knowledge base) — Obsidian vault as frontend, Claude Code as ingest agent, raw/ → wiki/ pipeline with index, log, and backlinks. Use when user says "set up an LLM wiki", "build a second brain from my transcripts/docs", or "ingest this into my wiki".
---

# LLM Wiki Builder

Turn any document pile (transcripts, PDFs, URLs, meeting notes) into a self-maintaining, cross-linked markdown wiki that agents can route through.

## When to use / when NOT to use

- Use: user wants a persistent, browsable knowledge base built and maintained by an agent from ongoing data sources.
- Don't use: one-off summarization of a single document — a summary needs no wiki. Don't force wiki structure onto data nobody will re-query.

## Procedure

### First-time setup

1. Create (or have user create) an Obsidian vault — obsidian.md, new vault, pick a location. Vault can live inside a larger AI-workspace project so other agents can see it.
2. Open the vault directory in Claude Code.
3. Establish the schema in CLAUDE.md: folder conventions, ingest rules, and the standing rule that every interaction follows the schema. Base structure:
   - `raw/` — drop zone. User puts source files (PDFs, transcripts, pasted articles) here; agent never writes finished pages here.
   - `wiki/` — the knowledge base. All pages are markdown with `[[backlinks]]`.
   - `index.md` — table of contents; every page gets a line here.
   - `log.md` — append-only record of every ingest (what, when, how many pages).
4. Do one first ingest immediately to validate the loop before batch-loading.

### Ingest (every subsequent interaction)

1. Accept source as: file dropped in `raw/`, a URL to read, or pasted text.
2. Split the source into as many wiki pages as it naturally contains — one concept/entity/technique per page, not one page per source. A large source may become 10+ pages.
3. Cross-link aggressively with `[[backlinks]]`. The value over separate summaries is the connections — when two sources reference the same concept, that shared page is where non-obvious links surface (e.g., two vendors benchmarking against different baselines).
4. Update `index.md` and append to `log.md` every time. The agent relies on index + log + backlinks to crawl efficiently without wasting tokens.

## Rules / heuristics

- Structure emerges from data — don't pre-build folders. Let subfolders (concepts/, entities/, sources/, techniques/, tools/) appear when a corpus earns them. Homogeneous data (e.g., meeting recordings) often stays flat — flat is easier for agents to search.
- One wiki per topic domain (e.g., video transcripts vs. meeting notes), each with its own ingest rules tuned to its data type.
- After batch ingests, review: click through pages and backlinks; if organization doesn't make sense to YOU, update the ingest rules in CLAUDE.md. Wiki must make sense to human and AI.
- CLAUDE.md acts as a router: routing rules tell agents where to look for what, across one or many wikis.
- Everything is plain markdown — deliberately portable. Any agent (Claude Code, Codex, others) can consume the same wiki.
- Use a cheaper model for routine ingests; save the frontier model for synthesis/queries over the assembled data.
- Visual layer (Obsidian graph view) is free — comes from the backlinks, no extra work.

## Examples

Setup prompt from the video (paired with Karpathy's LLM wiki gist pasted in):

> You are now my LLM wiki agent. Implement this exact idea file as my complete second brain. Guide me step by step. Create the CLAUDE.md schema with my full rules, set up the index, the log, define folder conventions, and show me the first ingest example. From now on, every interaction follows the schema.

Ingest prompt pattern:

> Read this article <URL> and ingest it into our wiki. I also dropped a PDF in raw/ called <name> — ingest that too.

---
Source: YouTube video on building an LLM wiki second brain with Claude Code + Obsidian (based on Andrej Karpathy's LLM knowledge-base gist) — channel/URL not provided.
