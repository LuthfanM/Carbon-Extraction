import Link from "next/link";
import { DISPLAY_STAGES, formatStrength, getDataQualitySummary, normalizeManufacturingLocation, stageValue } from "@/lib/compare";
import type { ProductRecord } from "@/lib/types";
import { DataQualityBadge } from "@/components/DataQualityBadge";
import type { ProductSortMode } from "@/components/ProductFilters";
import { StageValueCell } from "@/components/StageValueCell";

type ProductTableProps = {
  products: ProductRecord[];
  sortMode?: ProductSortMode;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  onSortModeChange?: (value: ProductSortMode) => void;
};

export function ProductTable({
  products,
  sortMode,
  hasActiveFilters = false,
  onClearFilters,
  onSortModeChange,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <section className="border border-[#1f271d] bg-[#fffdf7] p-6 shadow-[8px_8px_0_#d8c9aa]">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#526042]">No matching products</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.01em] text-[#172016]">
            No EPD records match the current view.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#5f6258]">
            Broaden the filters to compare all extracted records. Missing product metadata is shown as Unknown when the source data does not declare it.
          </p>
          {hasActiveFilters && onClearFilters ? (
            <button
              type="button"
              onClick={onClearFilters}
              className="mt-5 border border-[#263225] bg-[#263225] px-4 py-2 text-sm font-semibold text-[#f4f0e7] transition hover:bg-[#172016]"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="hidden max-h-[72vh] overflow-auto border border-[#1f271d] bg-[#fffdf7] shadow-[10px_10px_0_#263225] lg:block">
        <table className="w-full min-w-[1520px] border-separate border-spacing-0 text-left text-sm">
          <thead className="sticky top-0 z-20 bg-[#182018] text-xs uppercase tracking-[0.12em] text-[#d8d1c1] shadow-[0_1px_0_#526042]">
            <tr>
              <th className="sticky left-0 z-30 w-80 border-b border-r border-[#526042] bg-[#182018] px-4 py-4 font-semibold">
                <button
                  type="button"
                  onClick={() => onSortModeChange?.(sortMode === "name_asc" ? "name_desc" : "name_asc")}
                  className="inline-flex items-center gap-2 text-left uppercase tracking-[0.12em] text-[#d8d1c1] underline-offset-4 hover:underline"
                  aria-label="Sort products by product name"
                >
                  Product
                  <span className="font-mono text-[10px] text-[#b8c4a4]">
                    {sortMode === "name_asc" ? "A-Z" : sortMode === "name_desc" ? "Z-A" : "SORT"}
                  </span>
                </button>
              </th>
              <th className="w-44 border-b border-[#526042] px-4 py-4 font-semibold">Manufacturer</th>
              <th className="w-56 border-b border-[#526042] px-4 py-4 font-semibold">Location</th>
              <th className="w-28 border-b border-[#526042] px-4 py-4 text-right font-semibold">Strength</th>
              <th className="w-28 border-b border-[#526042] px-4 py-4 font-semibold">Unit</th>
              {DISPLAY_STAGES.map((stage) => (
                <th key={stage} className="w-40 border-b border-[#526042] px-3 py-4 text-right font-mono font-semibold text-[#b8c4a4]">
                  {stage}
                </th>
              ))}
              <th className="w-44 border-b border-[#526042] px-4 py-4 font-semibold">Data status</th>
            </tr>
          </thead>
          <tbody className="bg-[#fffdf7]">
            {products.map((product) => (
              <tr key={product.id} className="group transition hover:bg-[#f2eadb]">
                <td className="sticky left-0 z-10 border-b border-r border-[#d2c6b2] bg-[#fffdf7] px-4 py-5 align-top transition group-hover:bg-[#f2eadb]">
                  <Link href={`/products/${product.id}`} className="text-base font-semibold leading-snug text-[#172016] underline-offset-4 hover:underline">
                    {product.product.name}
                  </Link>
                </td>
                <td className="border-b border-[#d2c6b2] px-4 py-5 align-top font-medium text-[#4c5147]">{product.product.manufacturer}</td>
                <td className="border-b border-[#d2c6b2] px-4 py-5 align-top text-stone-700">
                  {normalizeManufacturingLocation(product.product.manufacturing_location)}
                </td>
                <td className="border-b border-[#d2c6b2] px-4 py-5 text-right align-top font-mono tabular-nums text-[#172016]">{formatStrength(product.product.compressive_strength_mpa)}</td>
                <td className="border-b border-[#d2c6b2] px-4 py-5 align-top text-stone-700">{product.product.declared_unit}</td>
                {DISPLAY_STAGES.map((stage) => (
                  <td key={stage} className="border-b border-[#d2c6b2] px-3 py-5 align-top">
                    <StageValueCell stage={stageValue(product, stage)} align="end" />
                  </td>
                ))}
                <td className="border-b border-[#d2c6b2] px-4 py-5 align-top">
                  <DataQualityBadge product={product} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 lg:hidden">
        {products.map((product) => {
          const a1a3 = stageValue(product, "A1-A3");
          const quality = getDataQualitySummary(product);
          return (
            <article key={product.id} className="border border-[#1f271d] bg-[#fffdf7] p-4 shadow-[5px_5px_0_#263225]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-[#172016]">{product.product.name}</h2>
                  <p className="mt-1 text-sm text-[#5f6258]">{product.product.manufacturer}</p>
                </div>
                <Link href={`/products/${product.id}`} className="border border-[#263225] bg-[#263225] px-3 py-1.5 text-xs font-semibold text-[#f4f0e7]">
                  Details
                </Link>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-stone-500">Location</dt>
                  <dd className="mt-1 text-stone-800">{normalizeManufacturingLocation(product.product.manufacturing_location)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-stone-500">Strength</dt>
                  <dd className="mt-1 text-stone-800">{formatStrength(product.product.compressive_strength_mpa)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-stone-500">A1-A3</dt>
                  <dd className="mt-1">
                    <StageValueCell stage={a1a3} />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-stone-500">Data quality</dt>
                  <dd className="mt-1">
                    <DataQualityBadge product={product} compact />
                    <span className="mt-1 block text-xs text-[#5f6258]">{quality.description}</span>
                  </dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </>
  );
}
