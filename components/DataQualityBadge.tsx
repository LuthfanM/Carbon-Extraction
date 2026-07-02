import { getDataQualitySummary } from "@/lib/compare";
import { LIFE_CYCLE_MODULES, type ProductEpd } from "@/lib/types";

const CLASSES = {
  complete_declared: "border-[#687158] bg-[#eef3df] text-[#263225]",
  has_not_declared: "border-[#a79c86] bg-[#e7decf] text-[#665d4d]",
  has_not_extracted: "border-[#a46c2a] bg-[#f2d7a3] text-[#5c3513]",
  needs_review: "border-[#5c3513] bg-[#b85f2d] text-[#fff8e8]",
} as const;

export function DataQualityBadge({ product, compact = false }: { product: ProductEpd; compact?: boolean }) {
  const quality = getDataQualitySummary(product);
  const issueCount = quality.counts.not_declared + quality.counts.not_extracted + quality.counts.needs_review;

  return (
    <div className="flex max-w-48 flex-col gap-1">
      <span className={`inline-flex w-fit whitespace-nowrap border px-2 py-0.5 text-[11px] font-semibold ${CLASSES[quality.status]}`}>
        {quality.label}
      </span>
      {!compact && (
        <span className="text-xs leading-5 text-[#5f6258]">
          {quality.status === "complete_declared" ? `${quality.counts.declared}/${LIFE_CYCLE_MODULES.length} stages declared` : `${issueCount} stages limited`}
        </span>
      )}
    </div>
  );
}
