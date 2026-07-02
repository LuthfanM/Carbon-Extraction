"use client";

import { useMemo, useState } from "react";
import { getA1A3Value, normalizeManufacturingLocation } from "@/lib/compare";
import type { ProductRecord } from "@/lib/types";
import { ProductFilters, type ProductSortMode } from "@/components/ProductFilters";
import { ProductTable } from "@/components/ProductTable";

export function ProductExplorer({ products }: { products: ProductRecord[] }) {
  const [strength, setStrength] = useState("all");
  const [location, setLocation] = useState("all");
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<ProductSortMode>("a1a3_asc");

  const strengths = useMemo(
    () => unique(products.map((product) => product.product.compressive_strength_mpa).filter((value): value is number => value !== null)).sort((a, b) => a - b),
    [products],
  );

  const locations = useMemo(
    () => unique(products.map((product) => normalizeManufacturingLocation(product.product.manufacturing_location))).sort(),
    [products],
  );

  const visibleProducts = useMemo(() => {
    return products
      .filter((product) => strength === "all" || product.product.compressive_strength_mpa === Number(strength))
      .filter((product) => location === "all" || normalizeManufacturingLocation(product.product.manufacturing_location) === location)
      .filter((product) => {
        const text = `${product.product.name} ${product.product.manufacturer}`.toLowerCase();
        return text.includes(query.toLowerCase().trim());
      })
      .sort(compareProducts(sortMode));
  }, [location, products, query, sortMode, strength]);

  return (
    <section className="mx-auto flex w-full max-w-[1500px] flex-col gap-7 px-4 py-8 md:px-6 md:py-10">
      <ProductFilters
        query={query}
        strength={strength}
        location={location}
        sortMode={sortMode}
        strengths={strengths}
        locations={locations}
        onQueryChange={setQuery}
        onStrengthChange={setStrength}
        onLocationChange={setLocation}
        onSortModeChange={setSortMode}
      />
      <ProductTable products={visibleProducts} />
    </section>
  );
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function compareProducts(sortMode: ProductSortMode) {
  return (a: ProductRecord, b: ProductRecord) => {
    if (sortMode === "name") {
      return a.product.name.localeCompare(b.product.name);
    }

    if (sortMode === "strength") {
      return strengthSortValue(a) - strengthSortValue(b);
    }

    const aValue = getA1A3Value(a);
    const bValue = getA1A3Value(b);

    if (aValue === null && bValue === null) {
      return 0;
    }
    if (aValue === null) {
      return 1;
    }
    if (bValue === null) {
      return -1;
    }

    return sortMode === "a1a3_desc" ? bValue - aValue : aValue - bValue;
  };
}

function strengthSortValue(product: ProductRecord) {
  return product.product.compressive_strength_mpa ?? Number.POSITIVE_INFINITY;
}
