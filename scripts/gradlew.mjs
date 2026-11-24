import { spawnSync } from "node:child_process";
import path from "node:path";

const gradlew = process.platform === "win32" ? "gradlew.bat" : "./gradlew";
const result = spawnSync(gradlew, process.argv.slice(2), {
  cwd: path.resolve("android"),
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
