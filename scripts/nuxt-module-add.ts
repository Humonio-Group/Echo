// scripts/shadcn-add.js
import { execSync } from "child_process";

const args = process.argv.slice(2).join(" ");

try {
  execSync(`npx nuxi@latest module add ${args}`, { stdio: "inherit" });
  execSync("eslint . --fix", { stdio: "inherit" });
}
catch {
  process.exit(1);
}
