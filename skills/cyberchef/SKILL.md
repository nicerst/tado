---
name: cyberchef
description: >
  Use when you need to decode base64, deobfuscate a malicious script, decrypt
  or decode a payload, unpack a nested/layered encoding, or solve a CTF crypto
  challenge — CyberChef ("Cyber Swiss Army Knife") is a purely client-side
  recipe-based data-transformation toolkit usable at any point of an
  assessment or analysis task, not tied to one phase.
---

# CyberChef

Browser-based, purely client-side data-transformation and decoding toolkit. Build a "recipe" (ordered chain of operations) that transforms Input into Output — like visual Unix pipes.

## When to use / when NOT to use

**Use when:**
- Decoding/encoding data: Base64, hex, URL-encoding, etc.
- Deobfuscating a suspicious script or payload before reading it.
- Decrypting a payload when you know (or can extract) the key/IV.
- Identifying an unknown or layered/nested encoding.
- Any CTF-style "decode this blob" challenge.
- General utility usable during **any phase** of a security assessment or general analysis task (recon, triage, reporting) — it is not locked to a single vapt-init step.

**Do NOT use for:**
- Live-target interaction, scanning, or recon — CyberChef has no network/scanning capability; it only transforms data you already have.
- Anything requiring vetted, production-grade cryptography. Per SECURITY.md: "No guarantee is offered for the correctness or security of CyberChef. In particular, the security of cryptographic operations should not be relied upon." Use it for analysis/CTF, never as a crypto library backing real security controls.

## Setup

Nothing to install for typical use — CyberChef is entirely client-side. Confirmed from README: "none of your recipe configuration or input (either text or files) is ever sent to the CyberChef web server - all processing is carried out within your browser, on your own computer."

- **Hosted (default choice):** open `https://gchq.github.io/CyberChef` in a browser.
- **Self-hosted (Docker):**
  ```bash
  docker build --tag cyberchef --ulimit nofile=10000 .
  docker run -it -p 8080:8080 cyberchef
  # or pre-built image:
  docker run -it -p 8080:8080 ghcr.io/gchq/cyberchef:latest
  ```
  Then browse `http://localhost:8080`.
- **Offline/air-gapped:** use the in-app "download a full copy" link (top-left corner) to get a portable copy — no server needed at all.
- **Node.js (exactly Node v24, `engines: ">=24 <25"`):**
  ```bash
  npm run repl        # -> node --no-warnings src/node/repl.mjs
  ```
  Gives an interactive REPL with all operations pre-loaded as global functions. For programmatic use as a Node package, run `npm run node` first (builds `src/node/wrapper.js`, which dynamically imports `index.mjs`/`File.mjs`) — this build artifact does not exist in a bare/shallow clone, so you must build before `require`/`import`ing it. Full Node API is documented in the project wiki, not in-repo.
- Browser support: Chrome 50+, Firefox 38+.

## Core usage

Mental model: four panes — **Input** (paste/drag text or files, up to ~2GB depending on browser), **Operations** (searchable categorized list), **Recipe** (ordered pipeline, each op has its own arguments), **Output** (auto-bakes as you edit, i.e. re-runs on every keystroke — turn Auto-Bake off if this is slow on large inputs).

Representative recipes (verbatim operation names/args from README):

1. **Decode Base64:**
   `From_Base64('A-Za-z0-9+/=',true)`

2. **Hexdump then decompress:**
   `From_Hexdump()` → `Gunzip()`

3. **Decrypt shellcode then disassemble:**
   `RC4({option:'UTF8', string:'secret'}, 'Hex','Hex')` → `Disassemble_x86('64','Full x86 architecture',16,0,true,true)`

4. **Per-line transform (e.g. convert every timestamp on its own line):**
   `Fork('\n','\n',false)` → `From_UNIX_Timestamp('Seconds (s)')`
   `Fork` splits input by a delimiter and runs the rest of the recipe independently on each piece.

5. **Conditional branching per record:**
   `Fork` → `Conditional_Jump` → `To_Hex` → `Return` → `Label` → `To_Base64`
   Recipes support control flow (jump/label/return), not just linear transforms — different records can take different paths.

6. **Extract a value from input to reuse later (e.g. an embedded key):**
   `Register('key=([\da-f]*)',true,false)` captures a regex group into `$R0`, which can then be referenced in a later operation's arguments, e.g. `RC4({option:'Hex', string:'$R0'}, ...)`.

7. **AES decrypt with IV embedded in the ciphertext:**
   A manual `Register` + `Drop_bytes` approach works, but `AES_Decrypt` has a simpler built-in `'From start'` IV-extraction mode — prefer that over the manual multi-step workaround when the operation already supports it.

8. **Unknown or layered/nested encoding:**
   `Magic(3,false,false)` attempts recursive auto-detection up to the given depth argument — start here when you don't know what encoding(s) were applied.

**Deep linking / sharing:** recipe, input, and theme are all encoded directly into the URL hash, e.g. `https://gchq.github.io/CyberChef/#recipe=Operation()&input=...` (input is Base64-encoded). This is how a fully-executable, shareable recipe link works — paste one to reproduce someone else's exact transform.

## Rules / gotchas

- Try `Magic` first when the encoding is unknown or possibly nested/layered.
- Use `Fork` whenever the same recipe needs to apply independently to multiple lines/records split by a delimiter.
- Use `Register` to pull a value (key, IV, token) out of the input via regex capture and feed it into a later operation's argument — avoid hardcoding values that are actually present in the input.
- Use `Conditional_Jump` / `Label` / `Return` only when different records genuinely need different processing paths within one recipe.
- Prefer an operation's built-in mode/option (e.g. `AES_Decrypt`'s `'From start'` IV mode) over a manual multi-step workaround, when one exists.
- Never treat CyberChef's crypto operations as vetted or production-safe — SECURITY.md explicitly disclaims correctness/security guarantees.
- Large inputs (up to ~2GB via drag-and-drop/file input, browser-dependent) can make some operations very slow; disable Auto-Bake if editing becomes sluggish.
- Node package usage requires building first (`npm run node`/`grunt node`) — the entry point (`src/node/wrapper.js`) is a generated artifact, not present in a bare clone, and Node must be exactly v24.
- Report security vulnerabilities in CyberChef itself via email (`CyberChefSecurity@gchq.gov.uk`) — never as a public GitHub issue.

---
Source: github.com/gchq/CyberChef @ 4a53231a71c0ae3e618d4f22bf77ed92da60d0d9 (package version 11.2.0)
