import { spawn } from "node:child_process";
import { join } from "node:path";

const isDryRun = process.argv.includes("--dry-run");
const extraArgs = process.argv.slice(2);

function runNodeScript(scriptName, args = []) {
  return new Promise((resolve, reject) => {
    const scriptPath = join(process.cwd(), "scripts", scriptName);
    const child = spawn("node", [scriptPath, ...args], {
      stdio: "inherit",
      shell: false,
    });

    child.on("error", (error) => reject(error));
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${scriptName} failed with exit code ${code ?? "unknown"}`));
    });
  });
}

async function main() {
  console.log(`[clean-links] Start ${isDryRun ? "(dry-run)" : ""}`);

  // 1) 去重
  await runNodeScript("dedupe-links-data.mjs", extraArgs);

  // 2) 清理不可解析域名（Unknown host）
  await runNodeScript("prune-dead-links.mjs", extraArgs);

  // 3) 非 dry-run 模式才刷新 README
  if (!isDryRun) {
    await runNodeScript("generate-readme-links.mjs");
  }

  console.log("[clean-links] Done");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
