import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PACKAGE_ROOT = path.resolve(__dirname, "..");
export const PACKAGE_NAME = "@nicerst/tado";
export const PLUGIN_NAME = "tado";
export const SKILL_NAMES = [
  "agentic-engineering",
  "apcp",
  "context7",
  "doc-cleanup",
  "feature-init",
  "frontend",
  "grill-with-docs",
  "harness-engineer",
  "memory-writer",
  "prd-builder",
  "project-init",
  "project-mid",
  "ralph",
  "vapt-init"
];

export const PRESET_ROOTS = {
  codex: path.join(os.homedir(), ".codex"),
  agents: path.join(os.homedir(), ".agents"),
  claude: path.join(os.homedir(), ".claude"),
  cursor: path.join(os.homedir(), ".cursor")
};

export const TARGET_LAYOUTS = {
  codex: {
    skillDirName: "skills",
    agentDirName: "agents",
    agentFileName: "harness-engineer.toml"
  },
  agents: {
    skillDirName: "skills"
  },
  claude: {
    skillDirName: "skills",
    agentDirName: "agents",
    agentFileName: "harness-engineer.md"
  },
  cursor: {
    skillDirName: "skills"
  }
};

export const HELP_TEXT = `tado

Usage:
  tado install [--target codex,agents] [--mode copy|symlink] [--root /path] [--force]
  tado plugin scaffold [--marketplace-path /path/to/marketplace.json] [--plugin-root /path/to/plugins/tado] [--mode copy|symlink] [--force]
  tado list
  tado help

Examples:
  npx ${PACKAGE_NAME} install --target codex,agents
  npx ${PACKAGE_NAME} install --target claude --mode symlink
  npm install -g ${PACKAGE_NAME}
  tado install --target cursor
  tado plugin scaffold
  codex plugin add ${PLUGIN_NAME}@personal
`;

export function skillsSourceDir() {
  return path.join(PACKAGE_ROOT, "skills");
}

export function codexAgentSourceFile() {
  return path.join(PACKAGE_ROOT, "agents", "codex", "harness-engineer.toml");
}

export function claudeAgentSourceFile() {
  return path.join(PACKAGE_ROOT, "agents", "claude", "harness-engineer.md");
}

export function pluginTemplateEntries() {
  return [".codex-plugin", "skills", "agents", "README.md", "LICENSE"];
}
