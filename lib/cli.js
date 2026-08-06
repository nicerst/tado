import path from "node:path";
import { HELP_TEXT, PACKAGE_NAME, PLUGIN_NAME, SKILL_NAMES, TOOLCHAINS } from "./constants.js";
import { installBundle } from "./install.js";
import { scaffoldCodexPlugin } from "./plugin.js";
import { checkToolchains } from "./chain.js";

function parseArgs(argv) {
  const [command = "help", subcommandOrFlag, ...rest] = argv;
  const args = [];
  let subcommand = null;

  if ((command === "plugin" || command === "chain") && subcommandOrFlag && !subcommandOrFlag.startsWith("-")) {
    subcommand = subcommandOrFlag;
    args.push(...rest);
  } else {
    if (subcommandOrFlag) {
      args.push(subcommandOrFlag, ...rest);
    } else {
      args.push(...rest);
    }
  }

  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];
    if (!current.startsWith("--")) {
      continue;
    }
    const key = current.slice(2);
    const next = args[index + 1];
    if (!next || next.startsWith("--")) {
      options[key] = true;
      continue;
    }
    options[key] = next;
    index += 1;
  }

  return { command, subcommand, options };
}

function printInstallResult(results) {
  console.log("Installed skill bundle:");
  for (const result of results) {
    console.log(`- ${result.target}: ${result.skillRoot}`);
    if (result.agentDestination) {
      console.log(`  agent companion: ${result.agentDestination}`);
    }
  }
}

export async function runCli(argv) {
  const { command, subcommand, options } = parseArgs(argv);

  switch (command) {
    case "install": {
      const results = await installBundle({
        targetArg: options.target,
        mode: options.mode || "copy",
        rootOverride: options.root
      });
      printInstallResult(results);
      return;
    }
    case "plugin": {
      if (subcommand !== "scaffold") {
        throw new Error(`Unknown plugin subcommand. Try: tado plugin scaffold`);
      }
      const result = await scaffoldCodexPlugin({
        marketplacePath: options["marketplace-path"],
        pluginRoot: options["plugin-root"],
        mode: options.mode || "copy"
      });
      console.log(`Plugin scaffolded at: ${result.pluginRoot}`);
      console.log(`Marketplace: ${result.marketplacePath}`);
      console.log(`Next: ${result.installCommand}`);
      return;
    }
    case "list": {
      console.log(SKILL_NAMES.map((name) => path.basename(name)).join("\n"));
      return;
    }
    case "chain": {
      if (subcommand === "check") {
        const errors = checkToolchains();
        if (errors.length > 0) {
          console.error(errors.join("\n"));
          process.exitCode = 1;
          return;
        }
        console.log(`All ${TOOLCHAINS.length} toolchains reference valid skills.`);
        return;
      }
      if (subcommand === "list" || !subcommand) {
        for (const toolchain of TOOLCHAINS) {
          console.log(`${toolchain.name}: ${toolchain.steps.map((s) => path.basename(s)).join(" -> ")}`);
          console.log(`  ${toolchain.rationale}`);
        }
        return;
      }
      throw new Error(`Unknown chain subcommand. Try: tado chain list | tado chain check`);
    }
    case "help":
    case "--help":
    case "-h":
      console.log(HELP_TEXT);
      console.log(`Package: ${PACKAGE_NAME}`);
      console.log(`Plugin: ${PLUGIN_NAME}`);
      return;
    default:
      throw new Error(`Unknown command: ${command}\n\n${HELP_TEXT}`);
  }
}
