import { readFile, writeFile } from "node:fs/promises";

const DATA_PATH = new URL("../src/links/data.json", import.meta.url);
const README_PATH = new URL("../README.md", import.meta.url);
const SECTION_MARKER = "## Links\n\nBrowse platforms and choose where to launch your product:\n";

function escapeMarkdown(text) {
  return String(text ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, " ")
    .trim();
}

function buildTable(items) {
  const lines = ["| Link | Description |", "| --- | --- |"];

  for (const item of items) {
    const name = escapeMarkdown(item.name);
    const href = escapeMarkdown(item.href);
    const description = escapeMarkdown(item.description);
    lines.push(`| [${name}](${href}) | ${description} |`);
  }

  return lines.join("\n");
}

function buildContent(items) {
  const freeItems = items.filter((item) => item.tag !== "Paid");
  const paidItems = items.filter((item) => item.tag === "Paid");

  const sections = [];
  sections.push("### Free");
  sections.push("");
  sections.push(buildTable(freeItems));
  sections.push("");
  sections.push("### Paid");
  sections.push("");
  sections.push(buildTable(paidItems));

  return sections.join("\n");
}

async function main() {
  const [dataRaw, readmeRaw] = await Promise.all([readFile(DATA_PATH, "utf8"), readFile(README_PATH, "utf8")]);

  const data = JSON.parse(dataRaw);
  if (!Array.isArray(data)) {
    throw new Error("src/links/data.json must be an array.");
  }

  const markerIndex = readmeRaw.indexOf(SECTION_MARKER);
  if (markerIndex === -1) {
    throw new Error("Cannot find the Links section marker in README.md");
  }

  const before = readmeRaw.slice(0, markerIndex + SECTION_MARKER.length);
  const content = buildContent(data);
  const nextReadme = `${before}\n${content}\n`;

  await writeFile(README_PATH, nextReadme, "utf8");
  console.log(`README updated with ${data.length} links.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
