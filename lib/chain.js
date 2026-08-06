import { SKILL_NAMES, TOOLCHAINS } from "./constants.js";

export function checkToolchains() {
  const known = new Set(SKILL_NAMES);
  const errors = [];

  for (const chain of TOOLCHAINS) {
    for (const step of chain.steps) {
      if (!known.has(step)) {
        errors.push(`chain "${chain.name}" references unknown skill "${step}"`);
      }
    }
  }

  return errors;
}
