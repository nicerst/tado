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
  "aios-audit",
  "apcp",
  "bloodhound",
  "caveman",
  "cloudfox",
  "context7",
  "craft-prompt",
  "cyberchef",
  "doc-cleanup",
  "feature-init",
  "frontend",
  "grill-with-docs",
  "harness-engineer",
  "loop-engineering",
  "memory-writer",
  "nuclei",
  "opensrc",
  "osint-recon-frameworks",
  "playwright",
  "prd-builder",
  "project-init",
  "project-mid",
  "ralph",
  "sherlock",
  "storm-research",
  "the-council",
  "vapt-init",
  "wayfinder",
  "dev-workflow/agent-observability",
  "dev-workflow/agentic-review-loop",
  "dev-workflow/agentic-system-design",
  "dev-workflow/claude-code-idea-to-build-loop",
  "dev-workflow/claude-code-website-hacks",
  "dev-workflow/claude-desktop-agent-workflow",
  "dev-workflow/claude-design-workflow",
  "dev-workflow/cloud-agent-build-verify-loop",
  "dev-workflow/fable-mode",
  "dev-workflow/goal-file-orchestration-prompt",
  "dev-workflow/herder-agent-workspace",
  "dev-workflow/in-house-ai-consultant-roadmap",
  "dev-workflow/no-mistakes-review-pipeline",
  "dev-workflow/phased-app-build-system",
  "dev-workflow/repo-to-skill",
  "dev-workflow/senior-engineer-prompting",
  "dev-workflow/yt-to-skill",
  "design/reference-to-design-system",
  "media-design/bibigpt-media-workflow",
  "media-design/media-design-bootstrap",
  "media-design/open-design-plugin-authoring",
  "media-design/video-toolkit-workflow",
  "media-design/watch-video-and-answer",
  "writing/humanize-proofreader",
  "personal-ops/personal-assistant-buildout",
  "personal-ops/llm-wiki-builder",
  "personal-ops/personal-web-cleanup",
  "trading/kronos-candlestick-forecasting",
  "scrollworld",
  "trading/order-flow-trading",
  "trading/price-action-market-structure",
  "trading/trading-fundamentals",
  "trading/trend-pullback-trading",
  "chains/new-project-bootstrap",
  "chains/idea-to-shipped-app",
  "chains/research-to-prompt",
  "chains/loop-design-to-runtime-ops",
  "chains/design-system-to-implementation",
  "chains/security-baseline-to-recon",
  "chains/ingest-to-skill-authoring",
  "chains/session-hygiene-loop"
];

export const TOOLCHAINS = [
  {
    name: "new-project-bootstrap",
    steps: ["project-init", "feature-init", "dev-workflow/senior-engineer-prompting", "ralph", "dev-workflow/no-mistakes-review-pipeline"],
    rationale: "harness scaffolded -> feature scoped -> delegation prompt framed -> autonomous build loop -> merge gate"
  },
  {
    name: "idea-to-shipped-app",
    steps: ["dev-workflow/claude-code-idea-to-build-loop", "prd-builder", "dev-workflow/phased-app-build-system", "dev-workflow/agentic-review-loop"],
    rationale: "idea validated -> PRD drafted -> phased build -> PR-score gate before ship"
  },
  {
    name: "research-to-prompt",
    steps: ["storm-research", "the-council", "craft-prompt"],
    rationale: "research the facts -> decide what to do -> phrase it as an agent prompt"
  },
  {
    name: "loop-design-to-runtime-ops",
    steps: ["loop-engineering", "dev-workflow/agent-observability", "dev-workflow/no-mistakes-review-pipeline"],
    rationale: "design the autonomous loop -> instrument it once running -> gate future changes to it"
  },
  {
    name: "design-system-to-implementation",
    steps: ["design/reference-to-design-system", "frontend"],
    rationale: "tokens/design system exported -> frontend implements against them"
  },
  {
    name: "security-baseline-to-recon",
    steps: ["vapt-init", "osint-recon-frameworks", "sherlock", "cloudfox", "nuclei", "bloodhound"],
    rationale: "vapt-init orchestrates each scanner against confirmed-authorized scope"
  },
  {
    name: "ingest-to-skill-authoring",
    steps: ["opensrc", "context7", "dev-workflow/repo-to-skill"],
    rationale: "fetch real source/docs first so the written skill isn't hallucinated API surface"
  },
  {
    name: "session-hygiene-loop",
    steps: ["doc-cleanup", "project-mid", "memory-writer"],
    rationale: "clear cruft -> recalibrate drift -> persist what's worth keeping"
  }
];

export const SKILL_GROUPS = {
  lifecycle:   ["apcp", "aios-audit", "wayfinder", "project-init", "project-mid", "feature-init", "ralph", "memory-writer"],
  engineering: ["harness-engineer", "agentic-engineering", "loop-engineering", "vapt-init", "playwright", "osint-recon-frameworks", "cloudfox", "cyberchef", "nuclei", "sherlock", "bloodhound"],
  design:      ["frontend", "ai-ui-design", "reference-to-design-system"],
  "media-design": ["bibigpt-media-workflow", "media-design-bootstrap", "open-design-plugin-authoring", "video-toolkit-workflow", "watch-video-and-answer"],
  research:    ["storm-research", "prd-builder", "grill-with-docs", "context7", "opensrc", "craft-prompt"],
  deliberation:["the-council"],
  utilities:   ["caveman", "ai-news", "doc-cleanup"],
  "dev-workflow": [
    "agent-observability", "agentic-review-loop", "agentic-system-design", "claude-code-idea-to-build-loop",
    "claude-code-website-hacks", "claude-desktop-agent-workflow", "claude-design-workflow", "cloud-agent-build-verify-loop", "fable-mode",
    "goal-file-orchestration-prompt", "herder-agent-workspace", "in-house-ai-consultant-roadmap",
    "no-mistakes-review-pipeline", "phased-app-build-system", "repo-to-skill", "senior-engineer-prompting", "yt-to-skill"
  ],
  scrollworld: ["scrollworld"],
  writing:     ["humanize-proofreader"],
  "personal-ops": ["personal-assistant-buildout", "llm-wiki-builder", "personal-web-cleanup"],
  trading:     ["kronos-candlestick-forecasting", "order-flow-trading", "price-action-market-structure", "trading-fundamentals", "trend-pullback-trading"],
  chains:      ["new-project-bootstrap", "idea-to-shipped-app", "research-to-prompt", "loop-design-to-runtime-ops", "design-system-to-implementation", "security-baseline-to-recon", "ingest-to-skill-authoring", "session-hygiene-loop"]
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
  tado install [--target codex,agents] [--mode copy|symlink] [--root /path]
  tado plugin scaffold [--marketplace-path /path/to/marketplace.json] [--plugin-root /path/to/plugins/tado] [--mode copy|symlink]
  tado chain list
  tado chain check
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
