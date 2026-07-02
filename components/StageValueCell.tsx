"use client";

import type { DisplayStageValue } from "@/lib/compare";
import { SourceBadge } from "@/components/SourceBadge";
import { StatusBadge } from "@/components/StatusBadge";

export function StageValueCell({ stage, align = "start" }: { stage: DisplayStageValue; align?: "start" | "end" }) {
  const alignment = align === "end" ? "items-end text-right" : "items-start text-left";

  if (stage.status !== "declared" && stage.status !== "partially_declared") {
    return (
      <div className={`flex min-w-36 flex-col gap-1 ${alignment}`}>
        <StatusBadge status={stage.status} />
        <SourceBadge module={stage} />
      </div>
    );
  }

  return (
    <div className={`flex min-w-36 flex-col gap-1 ${alignment}`}>
      <span className="whitespace-nowrap font-mono text-[13px] font-semibold tabular-nums text-[#172016]">
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
