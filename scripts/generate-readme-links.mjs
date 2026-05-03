import { readFile, writeFile } from "node:fs/promises";

const DATA_PATH = new URL("../links/data.json", import.meta.url);
const README_PATH = new URL("../README.md", import.meta.url);
const SECTION_MARKER = "## Links\n\nBrowse platforms and choose where to launch your product:\n";

function escapeMarkdown(text) {
  return String(text ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, " ")
    .trim();
}

function buildTable(items) {
  const lines = ["| Link | Description | Status |", "| --- | --- | --- |"];

  for (const item of items) {
    const name = escapeMarkdown(item.name);
    const href = escapeMarkdown(item.href);
    const description = escapeMarkdown(item.description);
    const status = item.tag === "Paid" ? "Paid" : "Free";
    lines.push(`| [${name}](${href}) | ${description} | ${status} |`);
  }

  return lines.join("\n");
}

async function main() {
  const [dataRaw, readmeRaw] = await Promise.all([readFile(DATA_PATH, "utf8"), readFile(README_PATH, "utf8")]);

  const data = JSON.parse(dataRaw);
  if (!Array.isArray(data)) {
    throw new Error("links/data.json must be an array.");
  }

  const markerIndex = readmeRaw.indexOf(SECTION_MARKER);
  if (markerIndex === -1) {
    throw new Error("Cannot find the Links section marker in README.md");
  }

  const before = readmeRaw.slice(0, markerIndex + SECTION_MARKER.length);
  const table = buildTable(data);
  const nextReadme = `${before}\n${table}\n`;

  await writeFile(README_PATH, nextReadme, "utf8");
  console.log(`README updated with ${data.length} links.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
