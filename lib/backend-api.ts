import { headers } from "next/headers";
import type { ProductRecord } from "@/lib/types";

type ProductsResponse = {
  products: ProductRecord[];
  count: number;
};

type ProductResponse = {
  product: ProductRecord;
};

export async function fetchProductsFromBackend() {
  const response = await fetch(`${await getBaseUrl()}/api/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  const data = (await response.json()) as ProductsResponse;
  return data.products;
}

export async function fetchProductFromBackend(id: string) {
  const response = await fetch(`${await getBaseUrl()}/api/products/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.status}`);
  }

  const data = (await response.json()) as ProductResponse;
  return data.product;
}

async function getBaseUrl() {
  const headerStore = await headers();
  const host = headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";

  if (!host) {
    throw new Error("Cannot resolve host for backend API fetch.");
  }

  return `${protocol}://${host}`;
}
