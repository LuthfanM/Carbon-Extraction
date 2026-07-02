import Link from "next/link";
import { DISPLAY_STAGES, missingStageCount, normalizeManufacturingLocation, stageValue } from "@/lib/compare";
import type { ProductRecord } from "@/lib/data";
import { StageValueCell } from "@/components/StageValueCell";
import { StatusBadge } from "@/components/StatusBadge";

export function ProductTable({ products }: { products: ProductRecord[] }) {
  if (products.length === 0) {
    return (
      <div className="border border-stone-300 bg-white p-5 text-sm text-stone-700">
        No products match the current filters. Clear the filters to compare all EPD records.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto border border-[#1f271d] bg-[#fffdf7] shadow-[10px_10px_0_#263225] lg:block">
        <table className="w-full min-w-[1360px] border-collapse text-left text-sm">
          <thead className="bg-[#182018] text-xs uppercase tracking-[0.12em] text-[#d8d1c1]">
            <tr>
              <th className="w-72 border-b border-[#526042] px-4 py-4 font-semibold">Product</th>
              <th className="border-b border-[#526042] px-4 py-4 font-semibold">Manufacturer</th>
              <th className="border-b border-[#526042] px-4 py-4 font-semibold">Location</th>
              <th className="border-b border-[#526042] px-4 py-4 font-semibold">Strength</th>
              <th className="border-b border-[#526042] px-4 py-4 font-semibold">Unit</th>
              {DISPLAY_STAGES.map((stage) => (
                <th key={stage} className="border-b border-[#526042] px-3 py-4 font-mono font-semibold text-[#b8c4a4]">
                  {stage}
                </th>
              ))}
              <th className="border-b border-[#526042] px-4 py-4 font-semibold">Data status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d2c6b2] bg-[#fffdf7]">
            {products.map((product) => (
              <tr key={product.id} className="transition hover:bg-[#f2eadb]">
                <td className="px-4 py-4 align-top">
                  <Link href={`/products/${product.id}`} className="text-base font-semibold leading-snug text-[#172016] underline-offset-4 hover:underline">
                    {product.product.name}
                  </Link>
                </td>
                <td className="px-4 py-4 align-top font-medium text-[#4c5147]">{product.product.manufacturer}</td>
                <td className="max-w-56 px-4 py-4 align-top text-stone-700">
                  {normalizeManufacturingLocation(product.product.manufacturing_location)}
                </td>
                <td className="px-4 py-4 align-top font-mono text-[#172016]">{product.product.compressive_strength_mpa ?? "Unknown"} MPa</td>
                <td className="px-4 py-4 align-top text-stone-700">{product.product.declared_unit}</td>
                {DISPLAY_STAGES.map((stage) => (
                  <td key={stage} className="px-3 py-4 align-top">
                    <StageValueCell stage={stageValue(product, stage)} />
                  </td>
                ))}
                <td className="px-4 py-4 align-top">
                  {missingStageCount(product) === 0 ? (
                    <StatusBadge status="declared" />
                  ) : (
                    <span className="border border-[#a79c86] bg-[#f2eadb] px-2 py-1 text-xs font-semibold text-[#665d4d]">{missingStageCount(product)} stages missing/review</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 lg:hidden">
        {products.map((product) => {
          const a1a3 = stageValue(product, "A1-A3");
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
                  <dd className="mt-1 text-stone-800">{product.product.compressive_strength_mpa ?? "Unknown"} MPa</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-stone-500">A1-A3</dt>
                  <dd className="mt-1">
                    <StageValueCell stage={a1a3} />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-stone-500">Missing data</dt>
                  <dd className="mt-1 text-stone-800">{missingStageCount(product)} stages</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </>
  );
}
