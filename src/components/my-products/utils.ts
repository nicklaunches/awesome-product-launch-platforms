import { marked, type Tokens } from "marked";

export interface Product {
  name: string;
  href: string;
  icon: string;
  desc: string;
}

export async function getProducts(): Promise<Product[]> {
  const products: Product[] = [];

  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/meetqy/meetqy/refs/heads/main/README.md?t=${Date.now()}`,
      { next: { revalidate: 3600 } },
    );
    const content = await res.text();
    const tokens = marked.lexer(content);

    // Find table token
    const tableToken = tokens.find((t) => t.type === "table") as
      | Tokens.Table
      | undefined;

    if (tableToken) {
      for (const row of tableToken.rows) {
        const iconCell = row[0];
        const nameCell = row[1];
        const descCell = row[2];

        if (!iconCell || !nameCell || !descCell) continue;

        // Extract icon from img tag in the first cell
        const iconMatch = iconCell.text.match(/src="([^"]+)"/);
        const icon = iconMatch ? iconMatch[1] : "";

        // The cell content might be wrapped in a paragraph by the lexer
        const cellTokens = marked.lexer(nameCell.text);

        // Helper to find link token recursively in case it's nested
        const findLink = (tks: any[]): Tokens.Link | undefined => {
          for (const t of tks) {
            if (t.type === "link") return t;
            if (t.tokens) {
              const found = findLink(t.tokens);
              if (found) return found;
            }
          }
          return undefined;
        };

        const linkToken = findLink(cellTokens);

        if (linkToken) {
          const strongToken = linkToken.tokens.find(
            (t) => t.type === "strong",
          ) as Tokens.Strong | undefined;

          products.push({
            name: strongToken?.text ?? linkToken.text,
            href: linkToken.href,
            icon: icon ?? "",
            desc: descCell.text,
          });
        }
      }
    } else {
      // Fallback to old list format if table not found
      const listToken = tokens.find((t) => t.type === "list") as
        | Tokens.List
        | undefined;
      if (listToken) {
        for (const item of listToken.items) {
          const cellTokens = marked.lexer(item.text);
          const linkToken = cellTokens.find((t) => t.type === "link") as
            | Tokens.Link
            | undefined;
          if (linkToken) {
            const imgToken = linkToken.tokens.find((t) => t.type === "image") as
              | Tokens.Image
              | undefined;
            const textParts = linkToken.text.split(":");
            const name =
              textParts[0]
                ?.replace(/\[!\[.*\]\(.*\)\s*\*\*/, "")
                .replace(/\*\*$/, "")
                .trim() ?? "";
            const desc = textParts[1]?.trim() ?? "";

            products.push({
              name: name,
              href: linkToken.href,
              icon: imgToken?.href ?? "",
              desc: desc,
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }

  return products;
}
