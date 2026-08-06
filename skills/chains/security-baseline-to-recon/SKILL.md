---
name: security-baseline-to-recon
description: >
  Runs the security-baseline-to-recon chain end to end: vapt-init -> osint-recon-frameworks -> sherlock -> cloudfox -> nuclei -> bloodhound.
  vapt-init orchestrates each scanner against confirmed-authorized scope.
  Trigger: "/security-baseline-to-recon", "run the full security baseline chain", "run vapt then all the scanners".
---

# Security-Baseline-to-Recon Chain

Runs 6 skills in sequence, all under vapt-init's authorization gate. Invoke each via the Skill tool, one at a time, waiting for it to finish before starting the next. Never run any scanner step without vapt-init's confirmed-authorized scope in hand first.

1. **vapt-init** — establish the security baseline; confirms authorization and scope before any tool runs.
2. **osint-recon-frameworks** — passive OSINT reconnaissance framework selection (recon-ng / spiderfoot / bbot).
3. **sherlock** — passive username-enumeration OSINT.
4. **cloudfox** — cloud attack-surface enumeration (AWS/Azure/GCP) using credentials already held.
5. **nuclei** — template-based vulnerability scanning, conservative defaults.
6. **bloodhound** — AD/Azure attack-path analysis and visualization.

**Rationale:** vapt-init orchestrates each scanner against confirmed-authorized scope.
