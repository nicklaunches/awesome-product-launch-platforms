import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

const DATA_PATH = join(process.cwd(), "src", "links", "data.json");
const argv = new Set(process.argv.slice(2));
const isDryRun = argv.has("--dry-run");
const execFileAsync = promisify(execFile);

const LIMIT_ARG = process.argv.find((arg) => arg.startsWith("--limit="));
const CONCURRENCY_ARG = process.argv.find((arg) =>
  arg.startsWith("--concurrency="),
);
const TIMEOUT_ARG = process.argv.find((arg) => arg.startsWith("--timeout="));

const limit = LIMIT_ARG ? Number(LIMIT_ARG.split("=")[1]) : undefined;
const concurrency = CONCURRENCY_ARG
  ? Number(CONCURRENCY_ARG.split("=")[1])
  : 12;
const timeoutMs = TIMEOUT_ARG ? Number(TIMEOUT_ARG.split("=")[1]) : 3000;

function getOrigin(rawUrl) {
  try {
    return new URL(rawUrl).origin;
  } catch {
    return "";
  }
}

function isUnknownHost(output) {
  return /unknown host|cannot resolve|name or service not known|temporary failure in name resolution|nodename nor servname provided, or not known/i.test(
    output,
  );
}

async function checkHostname(hostname, timeout) {
  try {
    await execFileAsync("ping", ["-c", "1", "-W", String(timeout), hostname], {
      timeout: timeout + 1000,
    });
    return { alive: true, reason: "ping_ok" };
  } catch (error) {
    const stdout = String(error?.stdout ?? "");
    const stderr = String(error?.stderr ?? "");
    const combined = `${stdout}\n${stderr}`;

    // 仅把 DNS 无法解析（Unknown host）判定为关闭
    if (isUnknownHost(combined)) {
      return { alive: false, reason: "unknown_host" };
    }

    // 其他情况（超时、被防火墙拦截等）默认保留，避免误删
    return { alive: true, reason: "ping_blocked_or_timeout" };
  }
}

async function runWithConcurrency(items, worker, size) {
  const results = new Array(items.length);
  let index = 0;

  const runners = Array.from({ length: Math.max(1, size) }, async () => {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await worker(items[current], current);
    }
  });

  await Promise.all(runners);
  return results;
}

async function main() {
  const raw = await readFile(DATA_PATH, "utf8");
  const records = JSON.parse(raw);

  if (!Array.isArray(records)) {
    throw new Error("src/links/data.json 必须是数组。");
  }

  const input = Number.isFinite(limit) ? records.slice(0, limit) : records;
  const hostMap = new Map();
  for (const item of input) {
    const origin = getOrigin(item?.href);
    if (origin) {
      const hostname = new URL(origin).hostname;
      hostMap.set(hostname, null);
    }
  }

  const hosts = [...hostMap.keys()];
  const checks = await runWithConcurrency(
    hosts,
    async (hostname) => checkHostname(hostname, timeoutMs),
    concurrency,
  );

  for (let i = 0; i < hosts.length; i += 1) {
    hostMap.set(hosts[i], checks[i]);
  }

  const kept = [];
  const removed = [];

  for (const item of records) {
    const origin = getOrigin(item?.href);
    const hostname = origin ? new URL(origin).hostname : "";
    const info = hostname ? hostMap.get(hostname) : null;

    if (!origin) {
      removed.push({
        name: item?.name ?? "",
        href: item?.href ?? "",
        reason: "invalid_url",
      });
      continue;
    }

    if (Number.isFinite(limit) && !hostMap.has(hostname)) {
      kept.push(item);
      continue;
    }

    if (!info?.alive) {
      removed.push({
        name: item?.name ?? "",
        href: item?.href ?? "",
        reason: info?.reason ?? "unreachable",
      });
      continue;
    }

    kept.push(item);
  }

  if (!isDryRun) {
    await writeFile(DATA_PATH, `${JSON.stringify(kept, null, 2)}\n`, "utf8");
  }

  console.log(
    `${isDryRun ? "[dry-run] " : ""}checked_hosts=${hosts.length}, before=${records.length}, after=${kept.length}, removed=${removed.length}`,
  );

  if (removed.length) {
    console.log("Removed items:");
    for (const item of removed) {
      console.log(`- ${item.name} | ${item.reason} | ${item.href}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
