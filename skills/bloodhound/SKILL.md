---
name: bloodhound
description: Use when installing, configuring, or operating BloodHound Community Edition (the AD/Azure attack-path analysis and visualization server) — trigger phrases include "bloodhound", "Active Directory attack path analysis", "AD security assessment visualization", "install BloodHound CE".
---

# BloodHound Community Edition

Deploy and operate the BloodHound CE server (Go API + React/Sigma.js UI, backed by PostgreSQL + Neo4j) that ingests and visualizes attack-path graphs.

## When to use / when NOT to use

- Use when the task is: installing BloodHound CE, standing up its Docker Compose stack, configuring `bloodhound.config.json` / env vars, resetting its databases, or troubleshooting its ports/sessions/config precedence.
- BloodHound CE is **analysis and visualization only**. It does not connect to a live Active Directory domain or Azure tenant and does not collect data itself — it only ingests data already gathered by external collectors, per the repo's own README: "It is deployed with a PostgreSQL application database and a Neo4j graph database, and is fed by the SharpHound and AzureHound data collectors."
- Do NOT use this skill for anything involving actually scanning/enumerating a live AD domain or Azure tenant — that is the job of **SharpHound** (AD) and **AzureHound** (Azure), which live in separate GitHub repos entirely outside this skill's scope. Because BloodHound CE itself cannot touch a live environment, installing/running/querying it in isolation does not require a live-collection authorization gate. If a future skill wraps SharpHound or AzureHound, that skill must carry its own explicit authorization gate (network/tenant scanning) — do not fold that gating into this skill or imply BloodHound performs collection.

## Setup

Two install paths, at pinned commit `0639be087ea9ac804acb9add30cab31779e5fae3` (rolling `main`, no version tag):

1. **Primary/recommended**: `bloodhound-cli`, following the official Quickstart Guide. This repo's in-repo docs are just a redirect stub to the separate `SpecterOps/bloodHound-docs` repo — use the external Quickstart, don't expect setup detail in-repo.
2. **Docker Compose** (fully documented in-repo under `examples/docker-compose/`, validated against Neo4j 4.4.42 and Postgres 18):
   ```bash
   # copy from examples/docker-compose/: docker-compose.yml
   # optionally: .env.example -> .env, bloodhound.config.json
   docker compose up          # or: docker compose up -d
   ```
   Wait for `Server started successfully` in the logs, then find:
   ```
   # Initial Password Set To:    <password-here>    #
   ```
   Browse to `http://localhost:8080/ui/login`, log in as `admin:<random-password>`, set a new password.

Default ports: `8080` (web UI), `7474` (Neo4j browser), `7687` (Neo4j bolt). DB ports are commented out/disabled by default and bound only to `127.0.0.1`, not `0.0.0.0`.

Image tags: `latest`, `X`, `X.X`, `X.X.X` (stable), `X.X.X-rcX` (release candidate), `edge` (bleeding-edge `main`, not guaranteed stable).

## Core usage

- Follow logs: `docker compose logs -f`
- Stop the stack: `docker compose down`
- Full reset (wipe both DBs): `docker compose down --volumes`
- Partial reset (graph DB only, keep app state):
  ```bash
  docker volume rm $(docker volume ls -q | grep neo4j-data)          # bash
  docker volume rm (docker volume ls -q | Select-String neo4j-data)  # PowerShell
  ```
- Custom `bloodhound.config.json`: uncomment the volume mount in `docker-compose.yml`:
  ```yaml
  volumes:
    - ./bloodhound.config.json:/bloodhound.config.json:ro
  ```
  Without this, a baked-in copy inside the image is used and your local file is silently ignored.
- Env-var config via `.env`, e.g.: `bhe_disable_cypher_complexity_limit`, `bhe_enable_cypher_mutations`, `bhe_graph_query_memory_limit`, `bhe_recreate_default_admin` — all default to safe/false values.
- Expose beyond localhost: set `BLOODHOUND_HOST=0.0.0.0` (or a specific bind IP) in `.env`. Default is `127.0.0.1` specifically to prevent accidental network exposure.
- Neo4j tuning: any `NEO4J_*`-prefixed env var under the `graph-db` service's `environment:` block.
- Sessions invalidate on every restart by default (a random 256-bit JWT signing key regenerates each restart); configure a stable base64-encoded signing key to persist sessions across restarts.

No in-repo Cypher query examples or built-in analysis-query walkthrough exist — that content lives entirely on the external docs site / GitHub wiki. Do not invent Cypher queries or query walkthroughs.

## Rules / gotchas

- **Config-mount gotcha**: "my config changes are being ignored" almost always means the `bloodhound.config.json` volume-mount line is still commented out. Uncomment it AND run `docker compose down && docker compose up` — the app does not merge configs; the mounted file only wins after both steps.
- **Session-reset gotcha**: re-login is required after every restart by design (random JWT key), unless a fixed signing key is configured.
- **Port-exposure gotcha**: DB ports are disabled by default; if you enable them beyond localhost, change default credentials to something secure — explicitly recommended in the repo's own docs. `BLOODHOUND_HOST` defaults to `127.0.0.1` intentionally to prevent accidental exposure — only widen it deliberately.
- **No single-command partial reset**: Compose has no native single-volume-reset command; you must find the Neo4j volume name manually (`docker volume ls`) and `docker volume rm` it, or nuke both DBs with `--volumes`.
- **Scope correction**: BloodHound CE itself never touches a live domain/tenant. SharpHound and AzureHound are the actual collectors, live in separate repos, and are out of scope for this skill — treat any request to "scan/collect from a live AD domain or Azure tenant" as outside this skill's boundary, not as a BloodHound CE operation.

---
Source: github.com/specterops/bloodhound @ 0639be087ea9ac804acb9add30cab31779e5fae3
