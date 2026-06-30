---
name: playwright
description: "E2E testing with Playwright: write tests, run them, debug failures, set up MCP browser control for AI agents. Use for any web testing task or when wiring AI agents to live browser automation."
trigger: /playwright
version: 1.0.0
---

# /playwright

E2E test writing, running, debugging, and MCP browser control for AI agents. Covers Chromium, Firefox, WebKit with a single API.

---

## Modes

| Mode | Best for | Install |
|------|---------|---------|
| **Playwright Test** | E2E testing | `npm init playwright@latest` |
| **Playwright CLI** | Coding agents (Claude Code, Copilot) | `npm i -g @playwright/cli@latest` |
| **Playwright MCP** | AI agents + LLM-driven automation | `npx @playwright/mcp@latest` |
| **Playwright Library** | Raw browser automation scripts | `npm i playwright` |

---

## Quick Start

### New project

```bash
npm init playwright@latest
npx playwright install
```

### Add to existing project

```bash
npm i -D @playwright/test
npx playwright install
```

---

## Writing Tests

```typescript
import { test, expect } from '@playwright/test';

test('page title', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

test('login flow', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL('/dashboard');
});
```

### Locators (prefer these — resilient to refactors)

```typescript
page.getByRole('button', { name: 'Submit' })
page.getByLabel('Email')
page.getByPlaceholder('Search...')
page.getByTestId('login-form')
page.getByText('Welcome')
```

Avoid: CSS selectors (`page.$('.btn')`), XPath — break on refactor.

### Auth state reuse

```typescript
// Save after login (run once)
await page.context().storageState({ path: 'auth.json' });

// Reuse in all tests — skip login
test.use({ storageState: 'auth.json' });
```

---

## Running Tests

```bash
npx playwright test                        # all tests, headless, all browsers
npx playwright test --ui                   # interactive UI mode
npx playwright test --project=chromium     # single browser
npx playwright test tests/login.spec.ts    # single file
npx playwright test --debug                # debug mode, step through actions
npx playwright test --headed               # visible browser
```

---

## Configuration

`playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## MCP Browser Control (AI Agents)

Set up Playwright MCP so Claude Code (or any AI agent) can control a browser directly — via accessibility snapshots, not screenshots. Low token cost.

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

Agent can then: navigate, click, fill forms, read page state, assert content — all through MCP tools.

### Key MCP tools

| Tool | Action |
|------|--------|
| `browser_navigate` | Go to URL |
| `browser_click` | Click element by accessibility label |
| `browser_fill` | Fill input field |
| `browser_snapshot` | Get page accessibility tree (main perception tool) |
| `browser_evaluate` | Run arbitrary JS in page |
| `browser_screenshot` | Capture screenshot (fallback when snapshot insufficient) |

**Snapshot vs screenshot:** `browser_snapshot` returns the accessibility tree as text — zero visual tokens. Use for most assertions. Fall back to `browser_screenshot` only when visual layout matters.

---

## Debugging Failures

```bash
npx playwright show-trace trace.zip     # inspect trace in browser UI
npx playwright test --debug             # pause on each action
PWDEBUG=1 npx playwright test           # inspector mode
```

Trace contains: DOM snapshots at each action, network calls, console logs, screenshots on failure.

---

## Project Init Integration

At Step 10c, detect Playwright and run test suite:

```bash
# Detect
cat package.json 2>/dev/null | grep -E '"@playwright/test"|"playwright"'

# Run
npx playwright test
```

If `@playwright/test` in `package.json` and tests fail → surface failures, do not silently pass.  
If no `playwright.config.ts` found → warn "No E2E tests found — add Playwright tests before shipping."

---

## Anti-Patterns

- `page.waitForTimeout(3000)` — Playwright auto-waits; hard timeouts mask real flakiness
- CSS/XPath locators — break on refactor; use role/label/testid instead
- Shared browser state between tests — each test must get a fresh browser context
- Running headed tests in CI — always headless in CI; use `--project=chromium`
- Installing all browsers when only Chromium needed — `npx playwright install chromium` saves ~500MB
