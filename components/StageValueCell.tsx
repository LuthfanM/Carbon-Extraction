"use client";

import type { DisplayStageValue } from "@/lib/compare";
import { SourceBadge } from "@/components/SourceBadge";
import { StatusBadge } from "@/components/StatusBadge";

export function StageValueCell({ stage }: { stage: DisplayStageValue }) {
  if (stage.status !== "declared" && stage.status !== "partially_declared") {
    return (
      <div className="flex min-w-32 flex-col gap-1">
        <StatusBadge status={stage.status} />
        <SourceBadge module={stage} />
      </div>
    );
  }

  return (
    <div className="flex min-w-32 flex-col gap-1">
      <span className="whitespace-nowrap font-mono text-[13px] font-semibold text-[#172016]">
        {formatCarbon(stage.value)}
      </span>
      {stage.status === "partially_declared" ? (
        <span className="font-mono text-[11px] text-stone-500">partial</span>
      ) : (
        <SourceBadge module={stage} />
      )}
    </div>
  );
}

function formatCarbon(value: number | null) {
  if (value === null) {
    return "Not declared";
  }
  return `${Number.isInteger(value) ? value : value.toFixed(2)} kg CO2e`;
}
