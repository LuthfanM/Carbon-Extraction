import { promises as fs } from "node:fs";
import path from "node:path";
import type { ProductEpd, ProductRecord } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");

export async function readProductsFromJson(): Promise<ProductRecord[]> {
  const entries = await fs.readdir(DATA_DIR, { withFileTypes: true });
  const jsonFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort();

  const products = await Promise.all(
    jsonFiles.map(async (fileName) => {
      const filePath = path.join(DATA_DIR, fileName);
      const raw = await fs.readFile(filePath, "utf-8");
      try {
        return {
          ...(JSON.parse(raw) as ProductEpd),
          id: fileName.replace(/\.json$/, ""),
        };
      } catch (error) {
        console.error(`Invalid EPD JSON skipped: ${fileName}`, error);
        return null;
      }
    }),
  );

  return products.filter((product): product is ProductRecord => product !== null);
}

export async function readProductFromJson(id: string): Promise<ProductRecord | null> {
  const products = await readProductsFromJson();
  return products.find((product) => product.id === id) ?? null;
}
