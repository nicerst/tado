---
name: context7
description: "Fetch up-to-date library documentation for any stack. Prevents hallucinated APIs from stale training data. Use when writing code that uses external libraries, APIs, or frameworks — or when setting up a new project stack."
trigger: /context7
version: 1.0.0
---

# /context7

Fetch live, version-specific library docs straight into context. Prevents hallucinated APIs. No tab-switching.

**Rule:** Always fetch docs before generating code for a library — never rely on training-data assumptions.

---

## When to Use

- Writing code with any external library or framework
- Setting up a new project stack
- Library API looks wrong or returns errors
- Installing a dependency you haven't used before
- Onboarding to an unfamiliar codebase with many dependencies

---

## Setup

### One-command setup (recommended)

```bash
npx ctx7 setup
```

Auto-detects agent type (Claude Code, Cursor, OpenCode), installs skill + optionally configures MCP. Use `--claude` to target Claude Code explicitly.

### Claude Code MCP setup (manual)

```bash
claude mcp add context7 npx @upstash/context7-mcp@latest
```

### API key (optional, higher rate limits)

Get free key at https://context7.com/dashboard. Pass via `CONTEXT7_API_KEY` env var or MCP header:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["@upstash/context7-mcp@latest"],
      "env": { "CONTEXT7_API_KEY": "your-key" }
    }
  }
}
```

### CLAUDE.md ambient rule (add after setup)

```
# Context7
Always use Context7 when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.
```

---

## Usage Patterns

### MCP mode — add to any prompt

```
Create a Next.js middleware that checks for a valid JWT in cookies
and redirects unauthenticated users to /login. use context7
```

Target specific library with `use library /owner/repo`:

```
Show me Supabase auth API for email/password sign-up.
use library /supabase/supabase
```

Specify version in the prompt:

```
How do I set up Next.js 14 middleware? use context7
```

### CLI mode

```bash
# Search for library by name
ctx7 library supabase "authentication"

# Fetch docs for a known library ID
ctx7 docs /supabase/supabase "email password sign-up"
ctx7 docs /vercel/next.js "middleware JWT"
```

---

## MCP Tools (when MCP configured)

| Tool | Purpose |
|------|---------|
| `resolve-library-id` | Find Context7 ID from library name |
| `query-docs` | Fetch docs for a known library ID |

Workflow: `resolve-library-id` → get `/owner/repo` ID → `query-docs`.

---

## Common Library IDs

| Library | Context7 ID |
|---------|------------|
| Next.js | `/vercel/next.js` |
| Supabase | `/supabase/supabase` |
| MongoDB | `/mongodb/docs` |
| React | `/facebook/react` |
| Prisma | `/prisma/prisma` |
| Playwright | `/microsoft/playwright` |
| Stripe | `/stripe/stripe-node` |

Use `/owner/repo` pattern (from GitHub URL) for unlisted libraries.

---

## Project Init Integration

At Step 0 (stack detection), check if Context7 is configured:

```bash
# Detect stack dependencies that benefit from live docs
cat package.json 2>/dev/null | grep -E '"next"|"react"|"supabase"|"prisma"|"drizzle"|"stripe"'
```

If framework/ORM detected and Context7 not yet in `.claude/settings.json`:
- Offer to run `npx ctx7 setup`
- Add ambient rule to `CLAUDE.md`

---

## Anti-Patterns

- Generating code for a library without fetching docs — stale training data produces hallucinated APIs
- Generic names in prompts ("use supabase") instead of IDs ("use library /supabase/supabase") — extra resolution step, slower
- Skipping `ctx7 setup` on new projects — one-time setup; pays back on every session
- Assuming training knowledge is current — library APIs change; always verify with live docs
