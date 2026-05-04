import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DATA_PATH = join(process.cwd(), "src", "links", "data.json");
const isDryRun = process.argv.includes("--dry-run");

function normalizeText(value) {
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeHref(href) {
  const value = String(href ?? "").trim();
  if (!value) return "";

  try {
    const url = new URL(value);
    const pathname = url.pathname.replace(/\/+$/, "") || "/";
    return `${url.protocol}//${url.host.toLowerCase()}${pathname}${url.search}`;
  } catch {
    return normalizeText(value).replace(/\/+$/, "");
  }
}

async function main() {
  const raw = await readFile(DATA_PATH, "utf8");
  const records = JSON.parse(raw);

  if (!Array.isArray(records)) {
    throw new Error("src/links/data.json 必须是数组。");
  }

  const seenHref = new Set();
  const seenName = new Set();
  const deduped = [];
  let removed = 0;

  for (const item of records) {
    const hrefKey = normalizeHref(item?.href);
    const nameKey = normalizeText(item?.name);
    const hasHref = hrefKey && seenHref.has(hrefKey);
    const hasName = nameKey && seenName.has(nameKey);

    if (hasHref || hasName) {
      removed += 1;
      continue;
    }

    if (hrefKey) seenHref.add(hrefKey);
    if (nameKey) seenName.add(nameKey);
    deduped.push(item);
  }

  if (!isDryRun) {
    await writeFile(DATA_PATH, `${JSON.stringify(deduped, null, 2)}\n`, "utf8");
  }

  console.log(
    `${isDryRun ? "[dry-run] " : ""}Done. before=${records.length}, after=${deduped.length}, removed=${removed}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
