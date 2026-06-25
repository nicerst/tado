import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { installBundle } from "../lib/install.js";
import { scaffoldCodexPlugin } from "../lib/plugin.js";

test("installBundle copies skills and codex agent companion", async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "tado-install-"));
  const codexRoot = path.join(tempRoot, ".codex");

  await installBundle({
    targetArg: "codex",
    mode: "copy",
    rootOverride: codexRoot
  });

  const featureInit = await fs.readFile(
    path.join(codexRoot, "skills", "feature-init", "SKILL.md"),
    "utf8"
  );
  const harnessAgent = await fs.readFile(
    path.join(codexRoot, "agents", "harness-engineer.toml"),
    "utf8"
  );

  assert.match(featureInit, /# \/feature-init/);
  assert.match(harnessAgent, /name = "harness-engineer"/);
});

test("installBundle copies claude skills and agent companion", async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "tado-claude-"));
  const claudeRoot = path.join(tempRoot, ".claude");

  await installBundle({
    targetArg: "claude",
    mode: "copy",
    rootOverride: claudeRoot
  });

  const projectInit = await fs.readFile(
    path.join(claudeRoot, "skills", "project-init", "SKILL.md"),
    "utf8"
  );
  const harnessAgent = await fs.readFile(
    path.join(claudeRoot, "agents", "harness-engineer.md"),
    "utf8"
  );

  assert.match(projectInit, /# \/project-init/);
  assert.match(harnessAgent, /^---/m);
  assert.match(harnessAgent, /name:\s*harness-engineer/);
});

test("installBundle supports symlink mode", async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "tado-symlink-"));
  const agentsRoot = path.join(tempRoot, ".agents");

  await installBundle({
    targetArg: "agents",
    mode: "symlink",
    rootOverride: agentsRoot
  });

  const stat = await fs.lstat(path.join(agentsRoot, "skills", "apcp"));
  assert.equal(stat.isSymbolicLink(), true);
});

test("installBundle maps cursor skills to ~/.cursor/skills", async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "tado-cursor-"));
  const cursorRoot = path.join(tempRoot, ".cursor");

  await installBundle({
    targetArg: "cursor",
    mode: "copy",
    rootOverride: cursorRoot
  });

  const skillPath = path.join(cursorRoot, "skills", "feature-init", "SKILL.md");
  const featureInit = await fs.readFile(skillPath, "utf8");

  await assert.rejects(
    fs.access(path.join(cursorRoot, "skills-cursor", "feature-init", "SKILL.md"))
  );
  assert.match(featureInit, /# \/feature-init/);
});

test("scaffoldCodexPlugin writes plugin files and marketplace entry", async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "tado-plugin-"));
  const repoRoot = path.join(tempRoot, "workspace");
  const marketplacePath = path.join(repoRoot, ".agents", "plugins", "marketplace.json");
  const pluginRoot = path.join(repoRoot, "plugins", "tado");

  const result = await scaffoldCodexPlugin({
    marketplacePath,
    pluginRoot,
    mode: "copy"
  });

  const marketplace = JSON.parse(await fs.readFile(marketplacePath, "utf8"));
  const pluginManifest = JSON.parse(
    await fs.readFile(path.join(pluginRoot, ".codex-plugin", "plugin.json"), "utf8")
  );

  assert.equal(result.marketplaceName, "personal");
  assert.equal(pluginManifest.name, "tado");
  assert.equal(marketplace.plugins[0].name, "tado");
  assert.equal(marketplace.plugins[0].source.path, "./plugins/tado");
});
