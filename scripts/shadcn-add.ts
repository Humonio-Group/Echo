// scripts/shadcn-add.js
import { execSync } from "child_process";

const args = process.argv.slice(2).join(" ");

try {
  execSync(`npx shadcn-vue@latest add ${args}`, { stdio: "inherit" });
  execSync("eslint . --fix", { stdio: "inherit" });
}
catch {
  process.exit(1);
}
