import type { CarbonModuleValue } from "@/lib/types";

type Status = CarbonModuleValue["status"] | "partially_declared";

const LABELS: Record<Status, string> = {
  declared: "Declared",
  not_declared: "Not declared",
  not_extracted: "Not extracted",
  needs_review: "Needs review",
  partially_declared: "Partially declared",
};

const CLASSES: Record<Status, string> = {
  declared: "border-[#687158] bg-[#eef3df] text-[#263225]",
  not_declared: "border-[#a79c86] bg-[#e7decf] text-[#665d4d]",
  not_extracted: "border-[#a46c2a] bg-[#f2d7a3] text-[#5c3513]",
  needs_review: "border-[#5c3513] bg-[#b85f2d] text-[#fff8e8]",
  partially_declared: "border-[#a46c2a] bg-[#f2d7a3] text-[#5c3513]",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex whitespace-nowrap border px-2 py-0.5 text-[11px] font-semibold ${CLASSES[status]}`}>
      {LABELS[status]}
    </span>
  );
}
