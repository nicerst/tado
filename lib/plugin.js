import path from "node:path";
import os from "node:os";
import {
  PACKAGE_ROOT,
  PLUGIN_NAME,
  pluginTemplateEntries
} from "./constants.js";
import { copyOrSymlink, ensureDir, pathExists, readJson, writeJson } from "./fs-utils.js";

function marketplaceRootFromPath(marketplacePath) {
  return path.dirname(path.dirname(path.dirname(marketplacePath)));
}

function defaultMarketplacePath() {
  return path.join(os.homedir(), ".agents", "plugins", "marketplace.json");
}

function defaultPluginRoot(marketplacePath) {
  return path.join(marketplaceRootFromPath(marketplacePath), "plugins", PLUGIN_NAME);
}

function pluginEntry() {
  return {
    name: PLUGIN_NAME,
    source: {
      source: "local",
      path: `./plugins/${PLUGIN_NAME}`
    },
    policy: {
      installation: "AVAILABLE",
      authentication: "ON_INSTALL"
    },
    category: "Productivity"
  };
}

async function scaffoldPluginFiles(pluginRoot, mode) {
  await ensureDir(pluginRoot);
  for (const entry of pluginTemplateEntries()) {
    const source = path.join(PACKAGE_ROOT, entry);
    const destination = path.join(pluginRoot, entry);
    await copyOrSymlink({ source, destination, mode });
  }
}

async function upsertMarketplace(marketplacePath) {
  let marketplace;
  if (await pathExists(marketplacePath)) {
    marketplace = await readJson(marketplacePath);
  } else {
    marketplace = {
      name: "personal",
      interface: {
        displayName: "Personal"
      },
      plugins: []
    };
  }

  marketplace.plugins ||= [];
  const nextEntry = pluginEntry();
  const existingIndex = marketplace.plugins.findIndex((item) => item.name === nextEntry.name);
  if (existingIndex >= 0) {
    marketplace.plugins[existingIndex] = nextEntry;
  } else {
    marketplace.plugins.push(nextEntry);
  }

  await writeJson(marketplacePath, marketplace);
  return marketplace.name || "personal";
}

export async function scaffoldCodexPlugin({
  marketplacePath = defaultMarketplacePath(),
  pluginRoot,
  mode = "copy"
}) {
  const resolvedPluginRoot = pluginRoot || defaultPluginRoot(marketplacePath);
  await scaffoldPluginFiles(resolvedPluginRoot, mode);
  const marketplaceName = await upsertMarketplace(marketplacePath);
  return {
    pluginRoot: resolvedPluginRoot,
    marketplacePath,
    marketplaceName,
    installCommand: `codex plugin add ${PLUGIN_NAME}@${marketplaceName}`
  };
}
