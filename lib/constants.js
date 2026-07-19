import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PACKAGE_ROOT = path.resolve(__dirname, "..");
export const PACKAGE_NAME = "@nicerst/tado";
export const PLUGIN_NAME = "tado";
export const SKILL_NAMES = [
  "agentic-engineering",
  "ai-news",
  "ai-ui-design",
  "apcp",
  "caveman",
  "context7",
  "craft-prompt",
  "doc-cleanup",
  "feature-init",
  "frontend",
  "grill-with-docs",
  "harness-engineer",
  "loop-engineering",
  "memory-writer",
  "opensrc",
  "playwright",
  "prd-builder",
  "project-init",
  "project-mid",
  "ralph",
  "storm-research",
  "the-council",
  "vapt-init",
  "dev-workflow/agentic-review-loop",
  "dev-workflow/agentic-system-design",
  "dev-workflow/claude-code-idea-to-build-loop",
  "dev-workflow/claude-code-website-hacks",
  "dev-workflow/claude-design-workflow",
  "dev-workflow/cloud-agent-build-verify-loop",
  "dev-workflow/fable-mode",
  "dev-workflow/goal-file-orchestration-prompt",
  "dev-workflow/herder-agent-workspace",
  "dev-workflow/in-house-ai-consultant-roadmap",
  "dev-workflow/no-mistakes-review-pipeline",
  "dev-workflow/phased-app-build-system",
  "dev-workflow/repo-to-skill",
  "dev-workflow/yt-to-skill",
  "design/reference-to-design-system",
  "writing/humanize-proofreader",
  "personal-ops/personal-assistant-buildout",
  "personal-ops/llm-wiki-builder",
  "trading/order-flow-trading",
  "trading/price-action-market-structure",
  "trading/trading-fundamentals",
  "trading/trend-pullback-trading"
];

export const SKILL_GROUPS = {
  lifecycle:   ["apcp", "project-init", "project-mid", "feature-init", "ralph", "memory-writer"],
  engineering: ["harness-engineer", "agentic-engineering", "loop-engineering", "vapt-init", "playwright"],
  design:      ["frontend", "ai-ui-design", "reference-to-design-system"],
  research:    ["storm-research", "prd-builder", "grill-with-docs", "context7", "opensrc", "craft-prompt"],
  deliberation:["the-council"],
  utilities:   ["caveman", "ai-news", "doc-cleanup"],
  "dev-workflow": [
    "agentic-review-loop", "agentic-system-design", "claude-code-idea-to-build-loop",
    "claude-code-website-hacks", "claude-design-workflow", "cloud-agent-build-verify-loop", "fable-mode",
    "goal-file-orchestration-prompt", "herder-agent-workspace", "in-house-ai-consultant-roadmap",
    "no-mistakes-review-pipeline", "phased-app-build-system", "repo-to-skill", "yt-to-skill"
  ],
  writing:     ["humanize-proofreader"],
  "personal-ops": ["personal-assistant-buildout", "llm-wiki-builder"],
  trading:     ["order-flow-trading", "price-action-market-structure", "trading-fundamentals", "trend-pullback-trading"]
};

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
