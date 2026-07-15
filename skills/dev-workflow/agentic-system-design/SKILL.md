---
name: agentic-system-design
description: Design a production-grade system architecture for AI-built apps — monorepo structure, agent-friendly managed infra, client/server/database boundaries, when to split out services. Use when user says "design the system for my app", "production architecture for AI-built app", or "how should I structure this app before building with agents".
---

# Agentic System Design

Architect an app so AI agents can build and extend it without the system falling over at 10 users.

## When to use / when NOT to use

- Use: planning a new app meant for production, or restructuring a vibe-coded prototype before real users arrive.
- Don't use: throwaway prototypes/demos — this rigor is wasted there.

## Procedure

1. State requirements before picking anything: what auth tier (consumer vs. business/SSO/compliance)? What billing model (subscription vs. credit top-up)? Where does long-running work execute? Score every candidate tool on four trade-offs: **scalability, reliability, performance, cost**. No tool is perfect; name what you're trading away.
2. Start with a monorepo, even for one client. All clients (web/mobile/desktop), backend, services, and shared UI library in one repo — the agent sees the whole system in one context; split repos fragment context and are hard for non-coders to manage.
3. Pick the highest abstraction layer that works: managed agent-friendly platforms over raw cloud (AWS/GCP/Azure) over own metal. Raw cloud is powerful but has bad developer/agent experience. Prefer tools that are (a) everything-as-code — agents can operate them, (b) proven at scale, (c) well-represented in training data.
4. Enforce the data path: client → server → database, never client → database directly. Client-to-DB with RLS exposes keys in the network tab. Server responsibilities: read DB, write DB, call external services — reliably and fast.
5. Prefer a combined backend+database platform (queries = read, mutations = write, actions = external calls) over separately managed server + DB. Use platform components instead of hand-building: durable workflows for processes that must survive tab close/refresh (chat agents, long jobs), workpool for queues/parallel tasks, storage/payment/email components — integrate by giving the component docs link to the agent.
6. Split a service out of the main backend only when the code: touches one surface area, does one specific thing, has little foothold in the rest of the codebase, and could plausibly own a dedicated developer later. Otherwise keep it in the main backend. Services live in the same monorepo.
7. For strict-correctness services (payments, inference ledgers): pick a stack with strong typed error handling — failures there must be loud and structured.
8. Add observability before launch: error tracking + analytics. Non-technical? Prompt: "whenever an error happens I need to know how to track it and when it happened — set up error tracking and analytics."
9. Review the finished design by naming its trade-offs explicitly (e.g., "cost unoptimized — accepted until traction").

## Rules / heuristics

- Client must NEVER talk to the database directly. Non-negotiable.
- Monorepo by default at project init — one repo, many apps/services, unified agent context.
- Choose boring, scale-proven, agent-familiar tools; scaling should mean "upgrade the plan", not "re-architect".
- Agent bad with a tool directly? Wrap it via a platform component the agent IS good with.
- Auth: business/enterprise target → enterprise-ready provider (org invites, compliance). Payments: plain subscription → standard payment processor; credits/top-up/mixed → a metering/billing layer on top.
- Long-running agent/chat work → durable workflow, never a bare request cycle.
- Agent sandboxes/computers → managed provider, don't build sandboxing yourself.
- Service extraction is experience/vibes, not formula — when unsure, ask the model to argue both sides.

## Example choices (one speaker's stack — swap for your own equivalents)

- Monorepo tool: Turborepo.
- Managed agent-friendly platforms: Vercel, Convex, PlanetScale.
- Combined backend+database platform: Convex (queries/mutations/actions).
- Strict-correctness stack: Effect TS + Postgres.
- Auth: WorkOS (org invites, compliance). Payments: Stripe (subscription), Autumn (credits/top-up).
- Agent sandboxes: Daytona.
- Full stack observed (Pluto): SvelteKit (web), Expo+React Native (mobile), Electron-wrapped web (desktop), Convex control plane + components (R2 storage, Autumn payments), Effect TS + PlanetScale Postgres services (inference/payments, iMessage), WorkOS auth, Daytona sandboxes, OpenRouter inference, Vercel deploys, Sentry + PostHog.
- Component integration pattern: find component on a components directory → copy link → give to agent → agent wires it up.

---
Source: "How to design a robust system for AI-built apps (Pluto walkthrough)" — Ross Mike (URL not provided)
