import path from "node:path";
import {
  PRESET_ROOTS,
  SKILL_NAMES,
  TARGET_LAYOUTS,
  claudeAgentSourceFile,
  codexAgentSourceFile,
  skillsSourceDir
} from "./constants.js";
import { copyOrSymlink, ensureDir } from "./fs-utils.js";
import fs from "node:fs/promises";

const SUBAGENT_DIR_BY_TARGET = {
  claude: "claude",
  codex: "codex"
};

async function copySkillSubagents({ skillSource, target, agentRoot, mode }) {
  const subDirName = SUBAGENT_DIR_BY_TARGET[target];
  if (!subDirName || !agentRoot) {
    return;
  }
  const subagentSourceDir = path.join(skillSource, "agents", subDirName);
  let entries;
  try {
    entries = await fs.readdir(subagentSourceDir, { withFileTypes: true });
  } catch {
    return;
  }
  await ensureDir(agentRoot);
  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }
    const source = path.join(subagentSourceDir, entry.name);
    const destination = path.join(agentRoot, entry.name);
    await copyOrSymlink({ source, destination, mode });
  }
}

function parseTargets(targetArg) {
  const raw = (targetArg || "codex,agents").split(",").map((item) => item.trim()).filter(Boolean);
  if (raw.includes("all")) {
    return Object.keys(PRESET_ROOTS);
  }
  return [...new Set(raw)];
}

function targetSkillRoot(target, rootOverride) {
  const baseRoot = rootOverride || PRESET_ROOTS[target];
  const layout = TARGET_LAYOUTS[target];
  if (!baseRoot || !layout) {
    throw new Error(`Unknown target: ${target}`);
  }
  return path.join(baseRoot, layout.skillDirName);
}

function targetAgentLayout(target, rootOverride) {
  const baseRoot = rootOverride || PRESET_ROOTS[target];
  const layout = TARGET_LAYOUTS[target];
  if (!baseRoot || !layout?.agentDirName || !layout?.agentFileName) {
    return null;
  }
  let source;
  switch (target) {
    case "codex":
      source = codexAgentSourceFile();
      break;
    case "claude":
      source = claudeAgentSourceFile();
      break;
    default:
      return null;
  }

  return {
    root: path.join(baseRoot, layout.agentDirName),
    destinationName: layout.agentFileName,
    source
  };
}

export async function installBundle({
  targetArg,
  mode = "copy",
  rootOverride
}) {
  const targets = parseTargets(targetArg);
  if (rootOverride && targets.length !== 1) {
    throw new Error("--root can only be used with a single target.");
  }

  const sourceSkillsRoot = skillsSourceDir();
  const results = [];

  for (const target of targets) {
    const skillRoot = targetSkillRoot(target, rootOverride);
    await ensureDir(skillRoot);

    const agentLayout = targetAgentLayout(target, rootOverride);
    let agentRoot = null;
    let agentDestination = null;

    if (agentLayout) {
      agentRoot = agentLayout.root;
      agentDestination = path.join(agentLayout.root, agentLayout.destinationName);
      await ensureDir(agentRoot);
      await copyOrSymlink({
        source: agentLayout.source,
        destination: agentDestination,
        mode
      });
    }

    for (const skillName of SKILL_NAMES) {
      const source = path.join(sourceSkillsRoot, skillName);
      const destination = path.join(skillRoot, path.basename(skillName));
      await copyOrSymlink({ source, destination, mode });
      await copySkillSubagents({ skillSource: source, target, agentRoot, mode });
    }

    results.push({ target, skillRoot, agentRoot, agentDestination });
  }

  return results;
}
