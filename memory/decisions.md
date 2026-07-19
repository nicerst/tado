---
name: decisions
description: Architectural and technology decisions with rationale
metadata:
  type: project
---

# Decisions

## Keep npm Package Under @nicerst Scope - 2026-07-20
**Chose:** Keep package name `@nicerst/tado`.
**Rejected:** Renaming to the currently logged-in user scope, such as `@takashi-ai-bot/tado`.
**Why:** The npm package should match the GitHub/repo brand. If publish auth uses another npm user, create or grant access to the `nicerst` npm org instead of changing package identity.

## Use Interactive npm Publish Until Trusted Publishing Exists - 2026-07-20
**Chose:** Manual `npm publish --access public` with browser/passkey approval for now.
**Rejected:** Long-lived bypass-2FA publish tokens as the default automation path.
**Why:** npm/GitHub are deprecating direct publish via 2FA-bypass granular access tokens. Future automation should use npm Trusted Publishing through GitHub Actions OIDC.
