import { SourceBadge } from "@/components/SourceBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { LIFE_CYCLE_MODULES, type LifeCycleModule, type ProductEpd } from "@/lib/types";

const STAGE_MEANINGS: Record<LifeCycleModule, string> = {
  A1: "Raw materials",
  A2: "Transport to factory",
  A3: "Manufacturing",
  "A1-A3": "Product stage",
  A4: "Transport to site",
  A5: "Construction or installation",
  B1: "Use",
  B2: "Maintenance",
  B3: "Repair",
  B4: "Replacement",
  B5: "Refurbishment",
  B6: "Operational energy",
  B7: "Operational water",
  C1: "Demolition",
  C2: "Transport after demolition",
  C3: "Waste processing",
  C4: "Disposal",
  D: "Beyond-system benefits or loads",
};

export function CarbonBreakdownTable({ product }: { product: ProductEpd }) {
  return (
    <section className="overflow-x-auto border border-[#1f271d] bg-[#fffdf7] shadow-[8px_8px_0_#263225]">
      <table className="w-full min-w-[900px] border-collapse text-left text-sm">
        <thead className="bg-[#182018] text-xs uppercase tracking-[0.12em] text-[#d8d1c1]">
          <tr>
            <th className="border-b border-[#526042] px-4 py-3">Stage</th>
            <th className="border-b border-[#526042] px-4 py-3">Meaning</th>
            <th className="border-b border-[#526042] px-4 py-3">Value</th>
            <th className="border-b border-[#526042] px-4 py-3">Status</th>
            <th className="border-b border-[#526042] px-4 py-3">Source</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#d2c6b2]">
          {LIFE_CYCLE_MODULES.map((stage) => {
            const module = product.carbon.modules[stage];
            return (
              <tr key={stage}>
                <td className="px-4 py-3 align-top">
                  <span className="border border-[#526042] bg-[#eef3df] px-2 py-1 font-mono text-xs font-semibold text-[#263225]">{stage}</span>
                </td>
                <td className="px-4 py-3 align-top text-[#5f6258]">{STAGE_MEANINGS[stage]}</td>
                <td className="px-4 py-3 align-top font-mono font-semibold text-[#172016]">
                  {module.value === null ? "Not available" : `${module.value} kg CO2e`}
                </td>
                <td className="px-4 py-3 align-top">
                  <StatusBadge status={module.status} />
                </td>
                <td className="max-w-sm px-4 py-3 align-top text-xs leading-5 text-[#5f6258]">
                  <SourceBadge module={module} />
                  <div className="mt-1 font-mono">{module.source_pdf}</div>
                  <div>{module.source_table ?? "No source table"}</div>
                  <div>{product.carbon.indicator} | {product.carbon.unit}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
