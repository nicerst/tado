import fs from "node:fs/promises";
import path from "node:path";

export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function pathExists(targetPath) {
  try {
    await fs.lstat(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function replacePath(targetPath) {
  await fs.rm(targetPath, { force: true, recursive: true });
}

export async function copyOrSymlink({ source, destination, mode }) {
  await replacePath(destination);
  if (mode === "symlink") {
    const stat = await fs.lstat(source);
    const linkType = stat.isDirectory() ? "dir" : "file";
    await fs.symlink(source, destination, linkType);
    return;
  }

  await fs.cp(source, destination, { recursive: true });
}

export async function writeJson(filePath, value) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}
